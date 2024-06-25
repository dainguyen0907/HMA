import axios from "axios";
import { Button, Tooltip } from "flowbite-react";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import SelectBedTypeModal from "../../components/modal/price_modal/price_select_bed_type_modal";
import { Box, IconButton } from "@mui/material";
import { AddCircleOutline, Delete, Edit } from "@mui/icons-material";
import PriceModal from "../../components/modal/price_modal/price_modal";
import { useDispatch, useSelector } from "react-redux";
import { setOpenPriceModal, setOpenSelectBedTypeModal, setPriceSelection, setPriceUpdateSuccess } from "../../redux_features/priceFeature";
import { setOpenLoadingScreen } from "../../redux_features/baseFeature";


export default function PriceSetting() {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing,setIsProcessing]=useState(false);


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
            header: 'Giá nghỉ trưa',
            size: '12',
            Cell:({table,row})=>(
                <Box>
                    {Intl.NumberFormat('vn-VN',{ style:'currency',currency:'VND'}).format(row.original.price_hour)}
                </Box>
            )
        }
        ,
        {
            accessorKey: 'price_day',
            header: 'Giá theo ngày',
            size: '12',
            Cell:({table,row})=>(
                <Box>
                    {Intl.NumberFormat('vn-VN',{ style:'currency',currency:'VND'}).format(row.original.price_day)}
                </Box>
            )
        }
        
    ], [])

    useEffect(() => {
        if (priceFeature.bedTypeSelection) {
            dispatch(setOpenLoadingScreen(true));
            axios.get(process.env.REACT_APP_BACKEND + "api/price/getPriceByIDBedType?id=" + priceFeature.bedTypeSelection.id, { withCredentials: true })
                .then(function (response) {
                    setData(response.data.result);
                    setIsLoading(false);
                }).catch(function (error) {
                    if (error.code === 'ECONNABORTED') {
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    } else if (error.response) {
                        toast.error('Đơn giá: '+error.response.data.error_code);
                    } else {
                        toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                    }
                }).finally(function(){
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
        if(isProcessing)
            return;
        if (window.confirm("Bạn muốn xoá đơn giá này?")) {
            setIsProcessing(true);
            axios.post(process.env.REACT_APP_BACKEND + "api/price/deletePrice", {
                id: idPrice
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setPriceUpdateSuccess());
                }).catch(function (error) {
                    if (error.code === 'ECONNABORTED') {
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    } else if (error.response) {
                        toast.error(error.response.data.error_code);
                    } else {
                        toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                    }
                }).finally(function(){
                    setIsProcessing(false);
                })
        }
    }

    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-3 h-fit">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Danh sách đơn giá theo loại giường {priceFeature.bedTypeSelection ? priceFeature.bedTypeSelection.bed_type_name : ''}</h1>
                    </div>
                    <div className=" relative">
                        <Button className="absolute m-0 left-1/4" gradientDuoTone="cyanToBlue" outline
                            onClick={() => dispatch(setOpenSelectBedTypeModal(true))}>Chọn loại giường</Button>
                        <SelectBedTypeModal />
                    </div>
                </div>
                <div className="w-full h-full">
                    <MaterialReactTable
                        data={data}
                        columns={columns}
                        state={{ isLoading: isLoading }}
                        localization={MRT_Localization_VI}
                        renderTopToolbarCustomActions={(table) => (
                            <div className="mr-auto">
                                <Button outline size="sm" gradientMonochrome="success" onClick={() => onHandleCreateButton()}>
                                    <AddCircleOutline /> Thêm đơn giá mới
                                </Button>
                            </div>
                        )}
                        enableRowActions
                        positionActionsColumn="last"
                        renderRowActions={({ row, table }) => (
                            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                                <Tooltip content="Sửa đơn giá">
                                    <IconButton color="primary"
                                    onClick={() => {
                                        dispatch(setPriceSelection(row.original));
                                        dispatch(setOpenPriceModal(true));
                                    }}>
                                    <Edit />
                                </IconButton>
                                </Tooltip>
                                <Tooltip content="Xoá đơn giá">
                                    <IconButton color="error"
                                        onClick={() => onHandleDelete(row.original.id)}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    />
                    <PriceModal />
                </div>
            </div>
        </div>
    );

}