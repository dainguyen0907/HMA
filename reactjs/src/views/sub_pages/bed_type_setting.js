import { Delete, Edit } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import CreateBedTypeModal from "../../components/modal/bed_type_create_modal";
import UpdateBedTypeModal from "../../components/modal/bed_type_update_modal";
import { IconContext } from "react-icons";
import { FaCirclePlus } from "react-icons/fa6";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setBedTypeUpdateSuccess, setBedTypeSelection, setOpenBedTypeCreateModal, setOpenBedTypeUpdateModal } from "../../redux_features/bedTypeFeature";



export default function BedTypeSetting() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const bedTypeFeature = useSelector(state => state.bedType);
    const dispatch = useDispatch();


    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'Mã số',
            size: '10'
        },
        {
            accessorKey: 'bed_type_name',
            header: 'Tên loại giường',
            size: '20'
        },
        {
            header: 'Đơn giá mặc định',
            accessorKey: 'Price.price_name'
        }
    ], []);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + "api/bedtype/getAll", { withCredentials: true })
            .then(function (response) {
                setData(response.data.result);
                setIsLoading(false);
            }).catch(function (error) {
                if (error.response)
                    toast.error(error.response.data.error_code);
            })
    }, [bedTypeFeature.bedTypeUpdateSuccess]);




    const onDelete = (idBedType) => {
        if (window.confirm("Bạn có muốn xoá loại giường này?")) {
            axios.post(process.env.REACT_APP_BACKEND + "api/bedtype/deleteBedType", {
                id: idBedType
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setBedTypeUpdateSuccess());
                }).catch(function (error) {
                    if (error.response)
                        toast.error(error.response.data.error_code);
                })
        }
    }

    return (<div className="w-full h-full overflow-auto p-2">
        <div className="border-2 rounded-xl w-full h-full">
            <div className="border-b-2 px-3 py-1 grid grid-cols-2 h-[8%]">
                <div className="py-2">
                    <h1 className="font-bold text-blue-600">Danh sách loại giường</h1>
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
                                <Button outline gradientMonochrome="success" onClick={() => {
                                    dispatch(setOpenBedTypeCreateModal(true));
                                }}>
                                    <FaCirclePlus className="mr-2" /> Thêm loại giường mới
                                </Button>
                            </IconContext.Provider>
                        </div>
                    )}
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                            <IconButton color="primary"
                                title="Sửa thông tin"
                                onClick={() => {
                                    dispatch(setBedTypeSelection(row.original));
                                    dispatch(setOpenBedTypeUpdateModal(true));
                                }}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton color="error"
                                title="Xoá loại giường"
                                onClick={() => {
                                    onDelete(row.original.id);
                                }}>
                                <Delete />
                            </IconButton>
                        </Box>
                    )}
                />
                <CreateBedTypeModal />
                <UpdateBedTypeModal />
            </div>
        </div>
    </div>)
}