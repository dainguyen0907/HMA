import axios from "axios";
import { Button } from "flowbite-react";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { IconContext } from "react-icons";
import { FaCirclePlus } from "react-icons/fa6";
import { toast } from "react-toastify";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import SelectBedTypeModal from "../../components/modal/price_select_bed_type_modal";
import { Box, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import PriceModal from "../../components/modal/price_modal";
import { useDispatch, useSelector } from "react-redux";
import { setOpenPriceModal, setOpenSelectBedTypeModal, setPriceSelection, setPriceUpdateSuccess } from "../../redux_features/priceFeature";
import { setOpenLoadingScreen } from "../../redux_features/baseFeature";


export default function PriceSetting() {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const dispatch = useDispatch();
    const priceFeature = useSelector(state => state.price);

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'Mã số',
            size: '10'
        },
        {
            accessorKey: 'price_name',
            header: 'Tên đơn giá',
            size: '100'
        }
        ,
        {
            accessorKey: 'price_hour',
            header: 'Giá theo giờ',
            size: '12'
        }
        ,
        {
            accessorKey: 'price_day',
            header: 'Giá theo ngày',
            size: '12'
        }
        ,
        {
            accessorKey: 'price_week',
            header: 'Giá theo tuần',
            size: '12'
        },
        {
            accessorKey: 'price_month',
            header: 'Giá theo tháng',
            size: '12'
        }
    ], [])

    useEffect(() => {
        if (priceFeature.bedTypeSelection) {
            dispatch(setOpenLoadingScreen(true));
            axios.get(process.env.REACT_APP_BACKEND + "api/price/getPriceByIDBedType?id=" + priceFeature.bedTypeSelection.id, { withCredentials: true })
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
        }

    }, [priceFeature.bedTypeSelection, priceFeature.priceUpdateSuccess, dispatch])

    const onHandleCreateButton = () => {
        if (!priceFeature.bedTypeSelection) {
            window.alert("Vui lòng chọn loại giường!");
        } else {
            dispatch(setPriceSelection(null));
            dispatch(setOpenPriceModal(true));
        }
    }

    const onHandleDelete = (idPrice) => {
        if (window.confirm("Bạn muốn xoá đơn giá này?")) {
            axios.post(process.env.REACT_APP_BACKEND + "api/price/deletePrice", {
                id: idPrice
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setPriceUpdateSuccess());
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
                <div className="border-b-2 px-3 py-1 grid grid-cols-3 h-[8%]">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Danh sách đơn giá theo loại giường {priceFeature.bedTypeSelection ? priceFeature.bedTypeSelection.bed_type_name : ''}</h1>
                    </div>
                    <div className=" relative">
                        <Button className="absolute m-0 left-1/4" gradientDuoTone="cyanToBlue" outline
                            onClick={() => dispatch(setOpenSelectBedTypeModal(true))}>Chọn loại giường</Button>
                        <SelectBedTypeModal />
                    </div>
                    <div className="ml-auto">
                        <IconContext.Provider value={{ size: '20px' }}>
                            <Button outline gradientMonochrome="success" onClick={() => onHandleCreateButton()}>
                                <FaCirclePlus className="mr-2" /> Thêm đơn giá mới
                            </Button>
                        </IconContext.Provider>
                    </div>
                </div>
                <div className="w-full h-[92%]">
                    <MaterialReactTable
                        data={data}
                        columns={columns}
                        state={{ isLoading: isLoading }}
                        localization={MRT_Localization_VI}
                        enableRowActions
                        positionActionsColumn="last"
                        renderRowActions={({ row, table }) => (
                            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                                <IconButton color="primary" title="Sửa đơn giá"
                                    onClick={() => {
                                        dispatch(setPriceSelection(row.original));
                                        dispatch(setOpenPriceModal(true));
                                    }}>
                                    <Edit />
                                </IconButton>
                                <IconButton color="error" title="Xoá đơn giá"
                                    onClick={() => onHandleDelete(row.original.id)}>
                                    <Delete />
                                </IconButton>
                            </Box>
                        )}
                    />
                    <PriceModal />

                </div>
            </div>
        </div>
    );

}