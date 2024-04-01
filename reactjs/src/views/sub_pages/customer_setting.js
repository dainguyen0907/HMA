import { Button, Radio } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { IconContext } from "react-icons";
import { FaCirclePlus } from "react-icons/fa6";
import CustomerModal from "../../components/modal/customer_modal";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import { Box, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerSelection, setCustomerUpdateSuccess, setOpenCustomerModal } from "../../redux_features/customerFeature";
import { setOpenLoadingScreen } from "../../redux_features/baseFeature";



export default function CustomerSetting() {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const customerFeature = useSelector(state => state.customer);

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'Mã số',
            size: '10'
        },
        {
            accessorKey: 'customer_identification',
            header: 'Số CMND/CCCD',
            size: '12'
        },
        {
            accessorKey: 'customer_name',
            header: 'Tên khách hàng',
            size: '50'
        }, {
            header: 'Giới tính',
            Cell: ({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                    {row.original.customer_gender ? "Nam" : "Nữ"}
                </Box>
            ),
        }, {
            accessorKey: 'customer_phone',
            header: 'Số điện thoại',
            size: '12'
        }, {
            header: 'Là sinh viên',
            Cell: ({ renderedCellValue, row }) => (
                <Box className="flex items-center gap-4">
                    <Radio className="ml-10" checked={Boolean(row.original.customer_student_check)} disabled />
                </Box>
            ),
        }
    ], []);

    useEffect(() => {
        dispatch(setOpenLoadingScreen(true));
        setIsLoading(true);
        axios.get(process.env.REACT_APP_BACKEND + "api/customer/getAll", { withCredentials: true })
            .then(function (response) {
                setData(response.data.result);
                setIsLoading(false);
                dispatch(setOpenLoadingScreen(false));
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
                dispatch(setOpenLoadingScreen(false));
            })
    }, [customerFeature.customerUpdateSuccess, dispatch]);


    const onDelete = (idCustomer) => {
        if (window.confirm("Bạn muốn xoá khách hàng này?")) {
            axios.post(process.env.REACT_APP_BACKEND + "api/customer/deleteCustomer", {
                id: idCustomer
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setCustomerUpdateSuccess());
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                });
        }
    }




    return (<div className="w-full h-full overflow-auto p-2">
        <div className="border-2 rounded-xl w-full h-full">
            <div className="border-b-2 px-3 py-1 grid grid-cols-2 h-[8%]">
                <div className="py-2">
                    <h1 className="font-bold text-blue-600">Danh sách khách hàng</h1>
                </div>

            </div>
            <div className="w-full h-[92%]">
                <MaterialReactTable
                    columns={columns}
                    data={data}
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
                    localization={MRT_Localization_VI}
                    enableRowActions
                    positionActionsColumn="last"
                    renderTopToolbarCustomActions={(table) => (
                        <div className="mr-auto">
                            <IconContext.Provider value={{ size: '20px' }}>
                                <Button outline gradientMonochrome="success"
                                    onClick={() => {
                                        dispatch(setCustomerSelection(null));
                                        dispatch(setOpenCustomerModal(true));
                                    }}>
                                    <FaCirclePlus className="mr-2" /> Thêm khách hàng mới
                                </Button>
                            </IconContext.Provider>
                        </div>
                    )}
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                            <IconButton color="primary"
                                title="Sửa thông tin"
                                onClick={() => {
                                    dispatch(setCustomerSelection(row.original));
                                    dispatch(setOpenCustomerModal(true));
                                }}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton color="error"
                                title="Xoá khách hàng"
                                onClick={() => {
                                    onDelete(row.original.id)
                                }}>
                                <Delete />
                            </IconButton>
                        </Box>
                    )}
                />
                <CustomerModal />
            </div>
        </div>
    </div>)
}