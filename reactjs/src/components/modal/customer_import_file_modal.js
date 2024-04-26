import { Box, IconButton } from "@mui/material";
import { Button, FileInput, Modal } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerUpdateSuccess, setOpenCustomerImportFileModal } from "../../redux_features/customerFeature";
import { Close } from "@mui/icons-material";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
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
            accessorKey: 'id_company',
            header: 'Mã công ty',
        },
        {
            accessorKey: 'id_course',
            header: 'Mã khoá học',
        }
    ], [])

    useEffect(() => {
        if (customerFeature.openCustomerImportFileModal)
            setData([]);
    }, [customerFeature.openCustomerImportFileModal])

    const onHandleExportSampleFile = (e) => {
        const row = {
            customer_name: 'Khách hàng nam',
            customer_gender: 1,
            customer_phone: "0123456789",
            customer_identification: "112233445566",
            id_company: '1',
            id_course: '2'
        }
        const row2 = {
            customer_name: 'Khách hàng nữ',
            customer_gender: 0,
            customer_phone: "0987654321",
            customer_identification: "089536012584",
            id_company: '1',
            id_course: '2'
        }
        const sampleFile = [row, row2];
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
                        newlist.push({
                            customer_name: value.customer_name,
                            customer_gender: Boolean(parseInt(value.customer_gender)),
                            customer_phone: value.customer_phone,
                            customer_identification: value.customer_identification,
                            id_company: value.id_company,
                            id_course: value.id_course

                        })
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
                    <Button gradientMonochrome="success" outline onClick={onHandleExportSampleFile}>Lấy file mẫu</Button>
                    <FileInput color="success" id="file-upload" accept=".csv" onChange={onHandleChangeInput} />
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