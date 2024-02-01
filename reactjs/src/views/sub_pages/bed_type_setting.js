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



export default function BedTypeSetting() {
    const [data, setData] = useState([]);
    const [success, setSuccess] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [defaultPrice, setDefaultPrice] = useState(0);
    const [idBedType, setIdBedType] = useState(-1);
    const [isLoading, setIsLoading] = useState(true);
    const [bedTypeName, setBedTypeName] = useState("");
    const [datePrice, setDatePrice] = useState(0);
    const [weekPrice, setWeekPrice] = useState(0);
    const [monthPrice, setMonthPrice] = useState(0);
    const [hourPrice, setHourPrice] = useState(0);


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
    }, [success]);


    const initBedType = () => {
        setBedTypeName("");
        setDatePrice("");
        setHourPrice("");
        setMonthPrice("");
        setWeekPrice("");
        setIdBedType(-1);
    }
    const onConfirmAction = () => {
        if (idBedType === -1) {
            axios.post(process.env.REACT_APP_BACKEND + "api/bedtype/insertBedType", {
                name: bedTypeName,
                price_day: datePrice,
                price_week: weekPrice,
                price_hour: hourPrice,
                price_month: monthPrice,
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success("Thêm loại giường mới thành công");
                    setOpenModal(false);
                    setSuccess(success + 1);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        } else {
        }
    }

    const onDelete = (idBedType) => {
        if (window.confirm("Bạn có muốn xoá loại giường này?")) {
            axios.post(process.env.REACT_APP_BACKEND + "api/bedtype/deleteBedType", {
                id: idBedType
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    setSuccess(success + 1);
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
                <div className="ml-auto">
                    <IconContext.Provider value={{ size: '20px' }}>
                        <Button outline gradientMonochrome="success" onClick={() => {
                            setOpenModal(true);
                            initBedType();
                        }}>
                            <FaCirclePlus className="mr-2"/> Thêm loại giường mới
                        </Button>
                    </IconContext.Provider>
                    <CreateBedTypeModal openModal={openModal} setOpenModal={setOpenModal}
                        bedTypeName={bedTypeName} setBedTypeName={setBedTypeName}
                        hourPrice={hourPrice} setHourPrice={setHourPrice}
                        datePrice={datePrice} setDatePrice={setDatePrice}
                        weekPrice={weekPrice} setWeekPrice={setWeekPrice}
                        monthPrice={monthPrice} setMonthPrice={setMonthPrice}
                        onConfirmAction={onConfirmAction} />
                    <UpdateBedTypeModal idBedType={idBedType} setOpen={setOpenModalUpdate} show={openModalUpdate}
                        defaultPrice={defaultPrice} bedTypeName={bedTypeName} setBedTypeName={setBedTypeName}
                        success={success} setSuccess={setSuccess} />
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
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                            <IconButton color="primary"
                                title="Sửa thông tin"
                                onClick={() => {
                                    setIdBedType(row.original.id);
                                    setDefaultPrice(row.original.bed_type_default_price)
                                    setOpenModalUpdate(true);
                                    setBedTypeName(row.original.bed_type_name)
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
            </div>
        </div>
    </div>)
}