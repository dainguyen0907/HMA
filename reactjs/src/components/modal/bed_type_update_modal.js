import { Button, FloatingLabel, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setBedTypeUpdateSuccess, setOpenBedTypeUpdateModal } from "../../redux_features/bedTypeFeature";

export default function UpdateBedTypeModal() {
    const [prices, setPrices] = useState([]);
    const [idSelectedPrice, setIdSelectedPrice] = useState(0);
    const [priceHour, setPriceHour] = useState(0);
    const [priceDate, setPriceDate] = useState(0);
    const [priceWeek, setPriceWeek] = useState(0);
    const [priceMonth, setPriceMonth] = useState(0);

    const [bedTypeName,setBedTypeName]=useState("");

    const bedTypeFeature = useSelector(state => state.bedType);
    const dispatch = useDispatch();

    useEffect(() => {
        if (bedTypeFeature.bedTypeSelection) {
            setBedTypeName(bedTypeFeature.bedTypeSelection.bed_type_name)
            axios.get(process.env.REACT_APP_BACKEND + "api/price/getPriceByIDBedType?id=" + bedTypeFeature.bedTypeSelection.id, { withCredentials: true })
                .then(function (response) {
                    setPrices(response.data.result);
                    setIdSelectedPrice(bedTypeFeature.bedTypeSelection.bed_type_default_price);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error("Lỗi lấy thông tin đơn giá: "+error.response.data.error_code);
                    }
                })
        }

    }, [bedTypeFeature.bedTypeSelection]);

    useEffect(() => {
        if (bedTypeFeature.bedTypeSelection) {
            for (let i = 0; i < prices.length; i++) {
                if (idSelectedPrice === prices[i].id) {
                    setPriceDate(prices[i].price_day);
                    setPriceWeek(prices[i].price_week);
                    setPriceMonth(prices[i].price_month);
                    setPriceHour(prices[i].price_hour);
                    break;
                }
            }
        }

    }, [bedTypeFeature.bedTypeSelection,idSelectedPrice, prices]);

    const onConfirm = () => {
        if (bedTypeFeature.bedTypeSelection) {
            axios.post(process.env.REACT_APP_BACKEND + "api/bedtype/updateBedType", {
                name: bedTypeName,
                id: bedTypeFeature.bedTypeSelection.id,
                default_price: idSelectedPrice,
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setBedTypeUpdateSuccess());
                    dispatch(setOpenBedTypeUpdateModal(false))
    
                }).catch(function (error) {
                    if (error.response) {
                        toast.error("Lỗi cập nhật thông tin: "+error.response.data.error_code);
                    }
                })
        }

    }

    return (
        <Modal show={bedTypeFeature.openBedTypeUpdateModal} onClose={() => dispatch(setOpenBedTypeUpdateModal(false))}>
            <Modal.Header>Cập nhật loại giường</Modal.Header>
            <Modal.Body>
                <FloatingLabel variant="outlined" label="Tên loại giường" type="text" value={bedTypeName} onChange={(e)=>setBedTypeName(e.target.value)}/>
                <div className="pb-2">
                    <FormControl fullWidth>
                        <InputLabel id="price-label">Đơn giá mặc định</InputLabel>
                        <Select labelId="price-label" label="Đơn giá mặc định" onChange={(e) => setIdSelectedPrice(e.target.value)}
                            value={idSelectedPrice}>
                            {prices.map((value, key) => <MenuItem value={value.id} key={key}>
                                {value.price_name}
                            </MenuItem>)}
                        </Select>
                    </FormControl>
                </div>

                <FloatingLabel variant="outlined" label="Giá theo giờ" type="number" value={priceHour} onChange={(e)=>setPriceHour(e.target.value)} readOnly={true} />
                <FloatingLabel variant="outlined" label="Giá theo ngày" type="number" value={priceDate} onChange={(e)=>setPriceDate(e.target.value)} readOnly={true}  />
                <FloatingLabel variant="outlined" label="Giá theo tuần" type="number" value={priceWeek} onChange={(e)=>setPriceWeek(e.target.value)} readOnly={true}  />
                <FloatingLabel variant="outlined" label="Giá theo tháng" type="number" value={priceMonth} onChange={(e)=>setPriceMonth(e.target.value)} readOnly={true}  />
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue" onClick={() => onConfirm()}>Cập nhật</Button>
                <Button color="gray" onClick={() => dispatch(setOpenBedTypeUpdateModal(false))}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    );
}