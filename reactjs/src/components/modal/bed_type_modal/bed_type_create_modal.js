import { Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBedTypeUpdateSuccess, setOpenBedTypeCreateModal } from "../../../redux_features/bedTypeFeature";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, IconButton, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";

export default function CreateBedTypeModal() {

    const bedTypeFeature = useSelector(state => state.bedType);
    const dispatch = useDispatch();

    const [bedTypeName, setbedTypeName] = useState("");
    const [dayPrice, setDayPrice] = useState(0);
    const [hourPrice, setHourPrice] = useState(0);
    const [isProcessing,setIsProcessing]=useState(false);

    const onConfirmAction = (e) => {
        e.preventDefault();

        if(isProcessing)
            return;

        setIsProcessing(true);

        axios.post(process.env.REACT_APP_BACKEND + "api/bedtype/insertBedType", {
            name: bedTypeName,
            price_day: dayPrice,
            price_week: 0,
            price_hour: hourPrice,
            price_month: 0,
        }, { withCredentials: true })
            .then(function (response) {
                toast.success("Thêm loại giường mới thành công");
                dispatch(setOpenBedTypeCreateModal(false));
                dispatch(setBedTypeUpdateSuccess());
            }).catch(function (error) {
                if(error.code=== 'ECONNABORTED'){
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                }else if(error.response){
                    toast.error(error.response.data.error_code);
                }else{
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            }).finally(function(){
                setIsProcessing(false);
            })
    }

    useEffect(() => {
        setbedTypeName("");
        setHourPrice(0);
        setDayPrice(0);
    }, [bedTypeFeature.openBedTypeCreateModal])

    return (
        <Modal show={bedTypeFeature.openBedTypeCreateModal} onClose={() => dispatch(setOpenBedTypeCreateModal(false))} className="relative">
            <Modal.Body>
                <div className="absolute top-3 right-4">
                    <IconButton onClick={() => dispatch(setOpenBedTypeCreateModal(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                    Thêm loại giường mới
                </div>
                <form onSubmit={onConfirmAction}>
                    <div className="flex flex-col gap-2">
                        <TextField variant="outlined" size="small" label="Tên loại giường" required value={bedTypeName} onChange={(e) => setbedTypeName(e.target.value)} type="text" />
                        <TextField variant="outlined" size="small" label="Giá nghỉ trưa"  required value={hourPrice} onChange={(e) => setHourPrice(e.target.value)} type="number" />
                        <TextField variant="outlined" size="small" label="Giá theo ngày"  required value={dayPrice} onChange={(e) => setDayPrice(e.target.value)} type="number" />
                        <Button color="primary" type="submit" variant="contained" fullWidth>Đồng ý</Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    )
}