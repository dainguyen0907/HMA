import { Button, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import FloatTextComponent from "../float_text_component";
import axios from "axios";
import { toast } from "react-toastify";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function UpdateBedTypeModal(props) {
    const [prices, setPrices] = useState([]);
    const [idSelectedPrice, setIdSelectedPrice] = useState(0);
    const [priceHour, setPriceHour] = useState(0);
    const [priceDate, setPriceDate] = useState(0);
    const [priceWeek, setPriceWeek] = useState(0);
    const [priceMonth, setPriceMonth] = useState(0);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + "api/price/getPriceByIDBedType?id=" + props.idBedType, { withCredentials: true })
            .then(function (response) {
                setPrices(response.data.result);
                setIdSelectedPrice(props.defaultPrice);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }, [props.idBedType, props.defaultPrice]);

    useEffect(() => {
        for (let i = 0; i < prices.length; i++) {
            if (parseInt(idSelectedPrice) === parseInt(prices[i].id)) {
                setPriceDate(prices[i].price_day);
                setPriceWeek(prices[i].price_week);
                setPriceMonth(prices[i].price_month);
                setPriceHour(prices[i].price_hour);
                break;
            }
        }
    }, [idSelectedPrice, prices]);

    const onConfirm = () => {
        axios.post(process.env.REACT_APP_BACKEND + "api/bedtype/updateBedType", {
            name: props.bedTypeName,
            id: props.idBedType,
            default_price: idSelectedPrice,
        }, { withCredentials: true })
            .then(function (response) {
                toast.success(response.data.result);
                props.setOpen(false);
                props.setSuccess(props.success + 1);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }

    return (
        <Modal show={props.show} onClose={() => props.setOpen(false)}>
            <Modal.Header>Cập nhật loại giường</Modal.Header>
            <Modal.Body>
                <FloatTextComponent label="Tên loại giường" type="text" data={props.bedTypeName} setData={props.setBedTypeName} />
                <div className="pb-2">
                    <FormControl fullWidth>
                        <InputLabel id="price-label">Đơn giá mặc định</InputLabel>
                        <Select labelId="price-label" label="Đơn giá mặc định" onChange={(e)=>setIdSelectedPrice(e.target.value)}
                        value={idSelectedPrice}>
                            {prices.map((value,key) => <MenuItem value={value.id} key={key}>
                                {value.price_name}
                            </MenuItem>)}
                        </Select>
                    </FormControl>
                </div>

                <FloatTextComponent label="Giá theo giờ" type="number" data={priceHour} setData={setPriceHour} readonly="true" />
                <FloatTextComponent label="Giá theo ngày" type="number" data={priceDate} setData={setPriceDate} readonly="true" />
                <FloatTextComponent label="Giá theo tuần" type="number" data={priceWeek} setData={setPriceWeek} readonly="true" />
                <FloatTextComponent label="Giá theo tháng" type="number" data={priceMonth} setData={setPriceMonth} readonly="true" />
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue" onClick={() => onConfirm()}>Cập nhật</Button>
                <Button color="gray" onClick={() => props.setOpen(false)}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    );
}