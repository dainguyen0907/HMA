import { Button, FloatingLabel, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBedTypeUpdateSuccess, setOpenBedTypeCreateModal } from "../../redux_features/bedTypeFeature";
import { toast } from "react-toastify";
import axios from "axios";

export default function CreateBedTypeModal() {

    const bedTypeFeature = useSelector(state => state.bedType);
    const dispatch = useDispatch();

    const [bedTypeName, setbedTypeName] = useState("");
    const [dayPrice, setDayPrice] = useState(0);
    const [hourPrice, setHourPrice] = useState(0);
    const [weekPrice, setWeekPrice] = useState(0);
    const [monthPrice, setMonthPrice] = useState(0);

    const onConfirmAction = () => {
        axios.post(process.env.REACT_APP_BACKEND + "api/bedtype/insertBedType", {
            name: bedTypeName,
            price_day: dayPrice,
            price_week: weekPrice,
            price_hour: hourPrice,
            price_month: monthPrice,
        }, { withCredentials: true })
            .then(function (response) {
                toast.success("Thêm loại giường mới thành công");
                dispatch(setOpenBedTypeCreateModal(false));
                dispatch(setBedTypeUpdateSuccess());
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }

    useEffect(()=>{
        setbedTypeName("");
        setHourPrice(0);
        setDayPrice(0);
        setMonthPrice(0);
        setWeekPrice(0);
    },[bedTypeFeature.openBedTypeCreateModal])

    return (
        <Modal show={bedTypeFeature.openBedTypeCreateModal} onClose={() => dispatch(setOpenBedTypeCreateModal(false))}>
            <Modal.Header>Thêm loại giường mới</Modal.Header>
            <Modal.Body>
                <FloatingLabel variant="outlined" label="Tên loại giường" value={bedTypeName} onChange={(e) => setbedTypeName(e.target.value)} type="text" />
                <FloatingLabel variant="outlined" label="Giá theo giờ" value={hourPrice} onChange={(e) => setHourPrice(e.target.value)} type="number" />
                <FloatingLabel variant="outlined" label="Giá theo ngày" value={dayPrice} onChange={(e) => setDayPrice(e.target.value)} type="number" />
                <FloatingLabel variant="outlined" label="Giá theo tuần" value={weekPrice} onChange={(e) => setWeekPrice(e.target.value)} type="number" />
                <FloatingLabel variant="outlined" label="Giá theo tháng" value={monthPrice} onChange={(e) => setMonthPrice(e.target.value)} type="number"/>
                <p className="font-semibold"> Lưu ý: Giá tiền chỉ nhập số nguyên, không nhập ký tự khác.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue" onClick={() => onConfirmAction()}>Đồng ý</Button>
                <Button color="gray" onClick={() => dispatch(setOpenBedTypeCreateModal(false))}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    )
}