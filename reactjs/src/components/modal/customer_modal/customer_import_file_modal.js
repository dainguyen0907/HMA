import { Box, IconButton, MenuItem, TextField } from "@mui/material";
import { Button, FileInput, Modal } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerUpdateSuccess, setOpenCustomerImportFileModal } from "../../../redux_features/customerFeature";
import { Close } from "@mui/icons-material";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import Papa from "papaparse";
import axios from "axios";
import { toast } from "react-toastify";

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: 'Sample_file'
})

export default function CustomerImportFileModal() {

    const customerFeature = useSelector(state => state.customer);
    const dispatch = useDispatch();

    const [courseList, setCourseList] = useState([]);
    const [companyList,setCompanyList]=useState([]);
    const [idCourse, setIdCourse] = useState(-1);
    const [idCompany,setIdCompany]=useState(-1);

    const [data, setData] = useState([]);
    const columns = useMemo(() => [
        {
            accessorKey: 'customer_name',
            header: 'Tên khách hàng',
            size: '50'
        },
        {
            accessorKey: 'customer_gender',
            header: 'Giới tính',
            Cell: ({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                    {row.original.customer_gender ? "Nam" : "Nữ"}
                </Box>
            ),
        },
        {
            accessorKey: 'customer_phone',
            header: 'Số điện thoại',
            size: '12'
        },
        {
            accessorKey: 'customer_identification',
            header: 'CCCD',
            size: '12'
        },
        {
            accessorKey: 'company_name',
            header: 'Công ty',
        },
        {
            accessorKey: 'course_name',
            header: 'Khoá học',
        }
    ], [])

    useEffect(() => {
        if (customerFeature.openCustomerImportFileModal) {
            setData([]);
            setIdCourse(-1);
            axios.get(process.env.REACT_APP_BACKEND + 'api/course/getEnableCourse', { withCredentials: true })
            .then(function (response) {
                setCourseList(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error('Dữ liệu bảng Khoá học: ' + error.response.data.error_code);
                }
            })
            axios.get(process.env.REACT_APP_BACKEND + 'api/company/getAll', { withCredentials: true })
            .then(function (response) {
                setCompanyList(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error('Dữ liệu bảng Công ty: ' + error.response.data.error_code);
                }
            })
        }

    }, [customerFeature.openCustomerImportFileModal])

    useEffect(()=>{
        setData([]);
    },[idCourse])

    const onHandleExportSampleFile = (e) => {
        const row = {
            customer_name: 'Tên khách hàng',
            customer_gender: 'Giới tính (Nam/nữ)',
            customer_phone: "Số điện thoại",
            customer_identification: "Số căn cước",
        }
        const sampleFile = [row];
        const csv = generateCsv(csvConfig)(sampleFile);
        download(csvConfig)(csv);
    }

    const onHandleChangeInput = async (e) => {
        const file = e.target.files[0];
        if (file && file.type === "text/csv") {
            Papa.parse(file, {
                skipEmptyLines: true,
                header: true,
                complete: function (result) {
                    const newlist = [];
                    result.data.forEach((value, index) => {
                        const new_row={
                            customer_name:value.customer_name,
                            customer_gender:value.customer_gender.trim()==='Nam'?1:0,
                            customer_phone:value.customer_phone,
                            customer_identification:value.customer_identification,
                            id_course:-1,
                            course_name:'Không xác định',
                            id_company:-1,
                            company_name:'Không xác định'
                        }
                        for(let i=0;i<companyList.length;i++){
                            if(companyList[i].id===idCompany){
                                new_row.id_company=companyList[i].id;
                                new_row.company_name=companyList[i].company_name;
                                break;
                            }
                        }
                        for(let i=0;i<courseList.length;i++){
                            if(courseList[i].id===idCourse){
                                new_row.id_course=courseList[i].id;
                                new_row.course_name=courseList[i].course_name;
                                break;
                            }
                        }
                        newlist.push(new_row);
                    })
                    setData(newlist);
                }
            })
        }
    }

    const onHandleSubmit = (e) => {
        if (data.length > 0) {
            axios.post(process.env.REACT_APP_BACKEND + 'api/customer/insertCustomerList', {
                customers: data
            }, { withCredentials: true })
                .then(function (response) {
                    toast('Thêm danh sách khách hàng thành công');
                    dispatch(setCustomerUpdateSuccess());
                    dispatch(setOpenCustomerImportFileModal(false));
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.result);
                    }
                })
        }
    }


    return (
        <Modal className="relative" show={customerFeature.openCustomerImportFileModal} size="7xl">
            <Modal.Body >
                <div className="absolute top-3 right-4">
                    <IconButton onClick={() => dispatch(setOpenCustomerImportFileModal(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                    Nhập thông tin khách hàng qua file
                </div>
                <div className="flex flex-row gap-2">
                    <TextField variant="outlined" type="text" label="Khoá học" select size="small" sx={{width:'20%'}}
                        value={idCourse} onChange={(e) => setIdCourse(e.target.value)}>
                        <MenuItem value={-1} disabled>Chọn khoá học</MenuItem>
                        {
                            courseList.map((value, key) => <MenuItem value={value.id} key={key}>{value.course_name}</MenuItem>)
                        }
                    </TextField>
                    <TextField variant="outlined" type="text" label="Công ty" select size="small" sx={{width:'20%'}}
                        value={idCompany} onChange={(e) => setIdCompany(e.target.value)}>
                        <MenuItem value={-1} disabled>Chọn công ty</MenuItem>
                        {
                            companyList.map((value, key) => <MenuItem value={value.id} key={key}>{value.company_name}</MenuItem>)
                        }
                    </TextField>
                    <Button gradientMonochrome="success" outline onClick={onHandleExportSampleFile}>Lấy file mẫu</Button>
                    <FileInput color="success" id="file-upload" accept=".csv" onChange={onHandleChangeInput} disabled={idCourse === -1||idCompany===-1} />
                </div>
                <MaterialReactTable
                    columns={columns}
                    data={data}
                    localization={MRT_Localization_VI}
                />
            </Modal.Body>
            <Modal.Footer>
                <div className="flex flex-row-reverse gap-2">
                    <Button color="blue" onClick={onHandleSubmit}>Cập nhật</Button>
                    <Button color="gray" onClick={() => dispatch(setOpenCustomerImportFileModal(false))}>Huỷ</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}