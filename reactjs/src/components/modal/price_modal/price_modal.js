import { Button, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setOpenPriceModal, setPriceUpdateSuccess } from "../../../redux_features/priceFeature";
import { IconButton, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";

export default function PriceModal() {

    const dispatch = useDispatch();
    const priceFeature = useSelector(state => state.price);

    const [bedTypeName, setBedTypeName] = useState("");
    const [priceName, setPriceName] = useState("");
    const [hourPrice, setHourPrice] = useState(0);
    const [dayPrice, setDayPrice] = useState(0);

    useEffect(() => {
        if (priceFeature.bedTypeSelection) {
            setBedTypeName(priceFeature.bedTypeSelection.bed_type_name);
        } else {
            setBedTypeName("");
        }
    }, [priceFeature.bedTypeSelection]);

    useEffect(() => {
        if (priceFeature.priceSelection) {
            setPriceName(priceFeature.priceSelection.price_name);
            setHourPrice(priceFeature.priceSelection.price_hour);
            setDayPrice(priceFeature.priceSelection.price_day);
        } else {
            setPriceName("");
            setHourPrice(0);
            setDayPrice(0);
        }
    }, [priceFeature.priceSelection,priceFeature.openPriceModal])

    const onConfirmAction = (event) => {
        event.preventDefault();
        if (priceFeature.bedTypeSelection) {
            if (!priceFeature.priceSelection) {
                axios.post(process.env.REACT_APP_BACKEND + "api/price/insertPrice", {
                    id_bed: priceFeature.bedTypeSelection.id,
                    name: priceName,
                    hour: hourPrice,
                    day: dayPrice,
                    week: 0,
                    month: 0
                }, { withCredentials: true })
                    .then(function (response) {
                        toast.success("Thêm đơn giá thành công");
                        dispatch(setPriceUpdateSuccess());
                        dispatch(setOpenPriceModal(false));
                    }).catch(function (error) {
                        if (error.response) {
                            toast.error("Lỗi khởi tạo thông tin: " + error.response.data.error_code);
                        }
                    })
            } else {
                axios.post(process.env.REACT_APP_BACKEND + "api/price/updatePrice", {
                    id: priceFeature.priceSelection.id,
                    name: priceName,
                    hour: hourPrice,
                    day: dayPrice,
                    week: 0,
                    month: 0
                }, { withCredentials: true })
                    .then(function (response) {
                        toast.success(response.data.result);
                        dispatch(setPriceUpdateSuccess());
                        dispatch(setOpenPriceModal(false));
                    }).catch(function (error) {
                        if (error.response) {
                            toast.error("Lỗi cập nhật thông tin: " + error.response.data.error_code);
                        }
                    })
            }
        }

    }
    return (
        <Modal show={priceFeature.openPriceModal} onClose={() => dispatch(setOpenPriceModal(false))} className="relative">
            <Modal.Body>
                <div className="absolute top-3 right-4">
                    <IconButton onClick={() => dispatch(setOpenPriceModal(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                    {priceFeature.priceSelection ? 'Cập nhật đơn giá' : 'Thêm đơn giá mới'}
                </div>
                <form onSubmit={onConfirmAction}>
                    <div className="flex flex-col gap-2">
                        <TextField size="small" required variant="outlined" label="Loại giường" type="text"  value={bedTypeName} disabled />
                        <TextField size="small" required variant="outlined" label="Tên đơn giá" type="text" value={priceName} onChange={(e) => setPriceName(e.target.value)} />
                        <TextField size="small" required variant="outlined" label="Giá nghỉ trưa" type="number" value={hourPrice} onChange={(e) => setHourPrice(e.target.value)} />
                        <TextField size="small" required variant="outlined" label="Giá theo ngày" type="number" value={dayPrice} onChange={(e) => setDayPrice(e.target.value)} />
                        <Button color="blue" type="submit">{priceFeature.priceSelection ? 'Cập nhật' : 'Thêm mới'}</Button>
                    </div>

                </form>
            </Modal.Body>
        </Modal>
    )
}