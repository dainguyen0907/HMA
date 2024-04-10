import { Button, FloatingLabel, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setOpenPriceModal, setPriceUpdateSuccess } from "../../redux_features/priceFeature";

export default function PriceModal() {

    const dispatch = useDispatch();
    const priceFeature = useSelector(state => state.price);

    const [bedTypeName, setBedTypeName] = useState("");
    const [priceName, setPriceName] = useState("");
    const [hourPrice, setHourPrice] = useState(0);
    const [dayPrice, setDayPrice] = useState(0);
    const [weekPrice, setWeekPrice] = useState(0);
    const [monthPrice, setMonthPrice] = useState(0);

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
            setWeekPrice(priceFeature.priceSelection.price_week);
            setMonthPrice(priceFeature.priceSelection.price_month);
        } else {
            setPriceName("");
            setHourPrice(0);
            setDayPrice(0);
            setWeekPrice(0);
            setMonthPrice(0);
        }
    }, [priceFeature.priceSelection])

    const onConfirmAction = () => {
        if (priceFeature.bedTypeSelection) {
            if (!priceFeature.priceSelection) {
                axios.post(process.env.REACT_APP_BACKEND + "api/price/insertPrice", {
                    id_bed: priceFeature.bedTypeSelection.id,
                    name: priceName,
                    hour: hourPrice,
                    day: dayPrice,
                    week: weekPrice,
                    month: monthPrice
                }, { withCredentials: true })
                    .then(function (response) {
                        toast.success("Thêm đơn giá thành công");
                        dispatch(setPriceUpdateSuccess());
                        dispatch(setOpenPriceModal(false));
                    }).catch(function (error) {
                        if (error.response) {
                            toast.error("Lỗi khởi tạo thông tin: "+error.response.data.error_code);
                        }
                    })
            } else {
                axios.post(process.env.REACT_APP_BACKEND + "api/price/updatePrice", {
                    id: priceFeature.priceSelection.id,
                    name: priceName,
                    hour: hourPrice,
                    day: dayPrice,
                    week: weekPrice,
                    month: monthPrice
                }, { withCredentials: true })
                    .then(function (response) {
                        toast.success(response.data.result);
                        dispatch(setPriceUpdateSuccess());
                        dispatch(setOpenPriceModal(false));
                    }).catch(function (error) {
                        if (error.response) {
                            toast.error("Lỗi cập nhật thông tin: "+error.response.data.error_code);
                        }
                    })
            }
        }

    }
    return (
        <Modal show={priceFeature.openPriceModal} onClose={() => dispatch(setOpenPriceModal(false))}>
            <Modal.Header>{priceFeature.priceSelection ? 'Cập nhật đơn giá' : 'Thêm đơn giá mới'}</Modal.Header>
            <Modal.Body>
                <FloatingLabel variant="outlined" label="Loại giường" type="text" readOnly={true} value={bedTypeName} onChange={(e)=>setBedTypeName(e.target.value)}/>
                <FloatingLabel variant="outlined" label="Tên đơn giá" type="text" value={priceName} onChange={(e)=>setPriceName(e.target.value)}/>
                <FloatingLabel variant="outlined" label="Giá theo giờ" type="number" value={hourPrice} onChange={(e)=>setHourPrice(e.target.value)}/>
                <FloatingLabel variant="outlined" label="Giá theo ngày" type="number" value={dayPrice} onChange={(e)=>setDayPrice(e.target.value)}/>
                <FloatingLabel variant="outlined" label="Giá theo tuần" type="number" value={weekPrice} onChange={(e)=>setWeekPrice(e.target.value)}/>
                <FloatingLabel variant="outlined" label="Giá theo tháng" type="number" value={monthPrice} onChange={(e)=>setMonthPrice(e.target.value)}/>
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue" onClick={() => onConfirmAction()}>{priceFeature.priceSelection ? 'Cập nhật' : 'Thêm mới'}</Button>
                <Button color="gray" onClick={() => dispatch(setOpenPriceModal(false))}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    )
}