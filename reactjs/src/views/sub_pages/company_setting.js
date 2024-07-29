import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import { Box, IconButton } from "@mui/material";
import { AddCircleOutline, Delete, Download, Edit } from "@mui/icons-material";
import { Button, Tooltip } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenLoadingScreen } from "../../redux_features/baseFeature";
import axios from "axios";
import { toast } from "react-toastify";
import { setCompanySelection, setOpenCompanyModal, setUpdateCompanySuccess } from "../../redux_features/companyFeature";
import CompanyModal from "../../components/modal/company_modal/company_modal";
import { download, generateCsv, mkConfig } from "export-to-csv";


const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: 'Comapany_list'
})

export default function CompanySetting() {

    const dispatch = useDispatch();
    const companyFeature = useSelector(state => state.company);

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const columns = useMemo(() => [
        {
            accessorKey: 'company_name',
            header: 'Tên công ty',
        },
        {
            accessorKey: 'company_phone',
            header: 'Số điện thoại',
        },
        {
            accessorKey: 'company_email',
            header: 'Email',
        },
        {
            accessorKey: 'company_address',
            header: 'Địa chỉ',
        },
    ], [])

    useEffect(() => {
        dispatch(setOpenLoadingScreen(true));
        setIsLoading(true);
        axios.get(process.env.REACT_APP_BACKEND + 'api/company/getAll', { withCredentials: true })
            .then(function (response) {
                setData(response.data.result);
                setIsLoading(false);
            }).catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error(error.response.data.error_code);
                } else {
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            }).finally(function () {
                dispatch(setOpenLoadingScreen(false));
            })
    }, [companyFeature.updateCompanySuccess, dispatch])

    const onHandleDelete = (id) => {
        if (isProcessing)
            return;
        if (window.confirm("Bạn muốn xoá công ty này?")) {
            setIsProcessing(true);
            axios.post(process.env.REACT_APP_BACKEND + 'api/company/deleteCompany', {
                id: id
            }, { withCredentials: true })
                .then(function (response) {
                    dispatch(setUpdateCompanySuccess());
                    toast.success(response.data.result);
                }).catch(function (error) {
                    if (error.code === 'ECONNABORTED') {
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    } else if (error.response) {
                        toast.error(error.response.data.error_code);
                    } else {
                        toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                    }
                }).finally(function () {
                    setIsProcessing(false);
                })
        }
    }

    const onHandleExportFile = (e) => {
        if (data.length > 0) {
            let export_data = [];
            data.forEach((value, key) => {
                export_data.push({
                    company_name: value.company_name,
                    company_phone: value.company_phone,
                    company_email: value.company_email,
                    company_address: value.company_address,
                    createdAt: new Date(value.createdAt).toLocaleString('vi-VI'),
                })
            })
            const csv = generateCsv(csvConfig)(export_data);
            download(csvConfig)(csv);
        } else {
            toast.error("Không có dữ liệu để xuất!");
        }
    }

    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-2 h-fit">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Danh sách công ty</h1>
                    </div>
                </div>
                <div className="w-full h-full">
                    <MaterialReactTable
                        data={data}
                        columns={columns}
                        localization={MRT_Localization_VI}
                        enableRowActions
                        enableRowNumbers
                        positionActionsColumn="last"
                        state={{ isLoading: isLoading }}
                        muiCircularProgressProps={{
                            color: 'secondary',
                            thickness: 5,
                            size: 55,
                        }}
                        muiSkeletonProps={{
                            animation: 'pulse',
                            height: 28,
                        }}
                        renderRowActions={({ row, table }) => (
                            <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
                                <Tooltip content="Sửa thông tin">
                                    <IconButton color="primary"
                                        onClick={() => {
                                            dispatch(setCompanySelection(row.original));
                                            dispatch(setOpenCompanyModal(true));
                                        }}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip content="Xoá công ty">
                                    <IconButton color="error"
                                        onClick={() => onHandleDelete(row.original.id)}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                        enableTopToolbar
                        renderTopToolbarCustomActions={(table) => (
                            <div className="flex gap-4">
                                <Button size="sm" outline gradientMonochrome="success"
                                    onClick={() => {
                                        dispatch(setCompanySelection(null));
                                        dispatch(setOpenCompanyModal(true));
                                    }}>
                                    <AddCircleOutline /> Thêm công ty
                                </Button>
                                <Button size="sm" outline gradientMonochrome="info"
                                    onClick={onHandleExportFile}
                                >
                                    <Download />Xuất file dữ liệu
                                </Button>
                            </div>
                        )}
                    />
                    <CompanyModal />
                </div>
            </div>
        </div>
    )
}