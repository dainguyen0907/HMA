import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, IconButton } from "@mui/material";
import { AddCircleOutline, Delete, Edit } from "@mui/icons-material";
import ServiceModal from "../../components/modal/service_modal/service_modal";
import { Button, Tooltip } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalService, setServiceSelection } from "../../redux_features/serviceFeature";
import { setOpenLoadingScreen } from "../../redux_features/baseFeature";

export default function ServiceSetting() {
    const [data, setData] = useState([]);
    const [success, setSuccess] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useDispatch();
    const serviceFeature = useSelector(state => state.service);

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'Mã số',
            size: '10'
        },
        {
            accessorKey: 'service_name',
            header: 'Tên dịch vụ',
            size: '100'
        }, {
            accessorKey: 'service_price',
            header: 'Đơn giá',
            size: '12',
            Cell:({table,row})=>(
                <Box>
                    {Intl.NumberFormat('vn-VN',{style:'currency',currency:'VND'}).format(row.original.service_price)}
                </Box>
            )
        }
    ], [])

    useEffect(() => {
        dispatch(setOpenLoadingScreen(true));
        axios.get(process.env.REACT_APP_BACKEND + "api/service/getAll", { withCredentials: true })
            .then(function (response) {
                setData(response.data.result);
                setIsLoading(false);
                dispatch(setOpenLoadingScreen(false));
            }).catch(function (error) {
                if (error.response) {
                    toast.error("Dữ liệu bảng: "+error.response.data.error_code);
                }
            })
    }, [serviceFeature.serviceUpdateSuccess, dispatch])

    const onDelete = (ids) => {
        if (window.confirm("Bạn có muốn xoá dịch vụ này?")) {
            axios.post(process.env.REACT_APP_BACKEND + "api/service/deleteService", {
                id: ids
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    setSuccess(success + 1);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        }
    }

    return (<div className="w-full h-full overflow-auto p-2">
        <div className="border-2 rounded-xl w-full h-full">
            <div className="border-b-2 px-3 py-1 grid grid-cols-2 h-fit">
                <div className="py-2">
                    <h1 className="font-bold text-blue-600">Danh sách dịch vụ</h1>
                </div>

            </div>
            <div className="w-full h-full">
                <MaterialReactTable
                    columns={columns}
                    data={data}
                    state={{ isLoading: isLoading }}
                    localization={MRT_Localization_VI}
                    muiCircularProgressProps={{
                        color: 'secondary',
                        thickness: 5,
                        size: 55
                    }}
                    muiSkeletonProps={{
                        animation: 'pulse',
                        height: 28
                    }}
                    enableRowActions
                    positionActionsColumn="last"
                    renderTopToolbarCustomActions={(table) => (
                        <div className="mr-auto">
                            <Button size="sm" outline gradientMonochrome="success"
                                onClick={() => {
                                    dispatch(setServiceSelection(null));
                                    dispatch(setOpenModalService(true));
                                }}>
                                <AddCircleOutline /> Thêm dịch vụ
                            </Button>
                        </div>
                    )}
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                            <Tooltip content="Sửa thông tin dịch vụ">
                                <IconButton color="primary"
                                    onClick={() => {
                                        dispatch(setServiceSelection(row.original));
                                        dispatch(setOpenModalService(true));
                                    }}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip content="Xoá dịch vụ">
                                <IconButton color="error"
                                    onClick={() => {
                                        onDelete(row.original.id)
                                    }}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>


                        </Box>
                    )}
                />
                <ServiceModal />
            </div>
        </div>
    </div>)
}