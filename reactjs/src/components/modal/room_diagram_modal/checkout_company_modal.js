import { Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalCheckOutCompany } from "../../../redux_features/floorFeature";
import { Box, Button, IconButton, MenuItem, TextField } from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "material-react-table/locales/vi";

export default function CheckoutCompanyModal() {

    const floorFeature = useSelector(state => state.floor);
    const dispatch = useDispatch();

    const [courseList, setCourseList] = useState([]);
    const [idCourse, setIDCourse] = useState(-1);

    const [rowSelection,setRowSelection]=useState([]);
    const [dataTable, setDataTable] = useState([]);
    const columns = useMemo(() => [
        {
            accessorKey: 'company_name',
            header: 'Tên công ty',
        }, {
            header: 'Số lượng khách',
            Cell: ({ table, row }) => (
                <Box>
                    {row.original.Customers ? row.original.Customers.length : '0'}
                </Box>
            )
        }
    ], [])

    useEffect(() => {
        if (floorFeature.openModalCheckOutCompany) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/course/getEnableCourse', { withCredentials: true })
                .then(function (response) {
                    setCourseList(response.data.result);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error('Dữ liệu Khoá học: ' + error.response.data.error_code);
                    }
                })
        }
    }, [floorFeature.openModalCheckOutCompany])

    const onHandleSearch = (e) => {
        if (idCourse !== -1) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/company/getCompanyByCourse?course='+idCourse, { withCredentials: true })
                .then(function (response) {
                    setDataTable(response.data.result);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error('Dữ liệu Khoá học: ' + error.response.data.error_code);
                    }
                })
        } else
            toast.error('Vui lòng chọn khoá học!');
    }

    const onHandleConfirm = (e) => {
        e.preventDefault();
        if (idCourse !== -1) {
            let idCompanyList=[];
            Object.keys(rowSelection).forEach(value=>{
                idCompanyList.push(dataTable[value].id);
            })
            console.log(idCompanyList);
        } else {
            toast.error('Chưa chọn khoá học!')
        }
    }

    return (
        <Modal show={floorFeature.openModalCheckOutCompany} className="relative">
            <Modal.Body>
                <div className="absolute top-3 right-4">
                    <IconButton onClick={() => dispatch(setOpenModalCheckOutCompany(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                    Trả phòng theo đơn vị
                </div>
                <form onSubmit={onHandleConfirm}>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2">
                            <TextField variant="outlined" label="Khoá học" size="small" select value={idCourse} sx={{ width: '40%' }}
                                onChange={(e) => setIDCourse(e.target.value)}>
                                <MenuItem value={-1} disabled>--Không--</MenuItem>
                                {courseList.map((value, index) => <MenuItem value={value.id} key={index}>{value.course_name}</MenuItem>)}
                            </TextField>
                            <Button color="primary" variant="contained" disabled={idCourse === -1} onClick={onHandleSearch}>
                                <Search />
                            </Button>
                        </div>
                        <div className="w-full h-40 overflow-auto">
                            <MaterialReactTable
                                data={dataTable}
                                columns={columns}
                                localization={MRT_Localization_VI}
                                enableTopToolbar={false}
                                enableBottomToolbar={false}
                                enableRowSelection
                                onRowSelectionChange={setRowSelection}
                                state={{rowSelection}}
                            />
                        </div>
                        <Button type="submit" color="primary" variant="contained" disabled={idCourse===-1}>Trả phòng</Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    )
}