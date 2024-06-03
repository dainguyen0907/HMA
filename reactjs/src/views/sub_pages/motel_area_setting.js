
import React, { useEffect, useState, useMemo } from "react";
import AreaModal from "../../components/modal/area_modal";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import { toast } from "react-toastify";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import { Box, IconButton } from "@mui/material";
import { AddCircleOutline, Delete, Edit } from "@mui/icons-material";
import { Button, Tooltip } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setAreaSelection, setAreaUpdateSuccess, setOpenAreaModal } from "../../redux_features/areaFeature";
import { setOpenLoadingScreen } from "../../redux_features/baseFeature";



export default function AreaSetting() {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const areaFeature = useSelector(state => state.area);

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'Mã số',
            size: '10'
        },
        {
            accessorKey: 'area_name',
            header: 'Tên khu vực',
            size: '100'
        }, {
            accessorKey: 'area_floor_quantity',
            header: 'Số tầng',
            size: '10'
        }, {
            accessorKey: 'area_room_quantity',
            header: 'Số phòng',
            size: '10'
        }
    ], [])

    useEffect(() => {
        dispatch(setOpenLoadingScreen(true));
        axios.get(process.env.REACT_APP_BACKEND + "api/area/getAll", { withCredentials: true })
            .then(function (responsive) {
                setData(responsive.data.result);
                setIsLoading(false);
                dispatch(setOpenLoadingScreen(false));
            }).catch(function (error) {
                if (error.response) {
                    toast.error("Dữ liệu bảng: "+error.response.data.error_code);
                }
                dispatch(setOpenLoadingScreen(false));
            })
    }, [areaFeature.areaUpdateSuccess, dispatch])



    const deleteAction = (idA) => {
        if (window.confirm("Bạn muốn xoá khu vực này ?")) {
            axios.post(process.env.REACT_APP_BACKEND + "api/area/deleteArea",
                { id_area: idA }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setAreaUpdateSuccess());
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        }
    }
    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-2 h-fit">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Danh sách khu vực</h1>
                    </div>
                </div>
                <div className="w-full h-full">
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
                        renderTopToolbarCustomActions={(table) => (
                            <div className="mr-auto">
                                <Button outline gradientMonochrome="success" size="sm"
                                    onClick={() => {
                                        dispatch(setAreaSelection(null));
                                        dispatch(setOpenAreaModal(true));
                                    }}>
                                    <AddCircleOutline /> Thêm khu vực
                                </Button>
                            </div>
                        )}
                        localization={MRT_Localization_VI}
                        enableRowActions
                        positionActionsColumn="last"
                        renderRowActions={({ row, table }) => (
                            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                                <Tooltip content="Sửa thông tin">
                                    <IconButton color="primary"
                                        onClick={() => {
                                            dispatch(setAreaSelection(row.original));
                                            dispatch(setOpenAreaModal(true));
                                        }}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip content="Xoá khu vực">
                                    <IconButton color="error"
                                        onClick={() => {
                                            deleteAction(row.original.id);
                                        }}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    />
                    <AreaModal />
                </div>
            </div>
        </div>
    );
}