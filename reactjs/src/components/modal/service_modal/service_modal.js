import { Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalService, setServiceUpdateSuccess } from "../../../redux_features/serviceFeature";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, IconButton, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";

export default function ServiceModal() {

    const dispatch = useDispatch();
    const serviceFeature = useSelector(state => state.service);

    const [serviceName, setServiceName] = useState("");
    const [servicePrice, setServicePrice] = useState(0);

    useEffect(() => {
        if (serviceFeature.serviceSelection) {
            setServiceName(serviceFeature.serviceSelection.service_name);
            setServicePrice(serviceFeature.serviceSelection.service_price);
        } else {

            setServiceName("");
            setServicePrice(0);
        }
    }, [serviceFeature.serviceSelection])

    const onConfirmAction = (event) => {
        event.preventDefault();
        if (!serviceFeature.serviceSelection) {
            axios.post(process.env.REACT_APP_BACKEND + "api/service/insertService", {
                name: serviceName,
                price: servicePrice
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success("Thêm thành công");
                    dispatch(setServiceUpdateSuccess());
                    dispatch(setOpenModalService(false));
                }).catch(function (error) {
                    if (error.response) {
                        toast.error("Lỗi khởi tạo thông tin: " + error.response.data.error_code);
                    }
                })
        } else {
            axios.post(process.env.REACT_APP_BACKEND + "api/service/updateService", {
                name: serviceName,
                price: servicePrice,
                id: serviceFeature.serviceSelection.id
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setServiceUpdateSuccess());
                    dispatch(setOpenModalService(false));
                }).catch(function (error) {
                    if (error.response) {
                        toast.error("Lỗi cập nhật thông tin: " + error.response.data.error_code);
                    }
                })
        }
    }

    return (
        <Modal show={serviceFeature.openModalService} onClose={() => dispatch(setOpenModalService(false))} className="relative">
            <Modal.Body>
                <div className="absolute top-3 right-4">
                    <IconButton onClick={() => dispatch(setOpenModalService(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                    {serviceFeature.serviceSelection ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}
                </div>
                <form onSubmit={onConfirmAction}>
                    <div className="flex flex-col gap-2">
                        <TextField label="Tên dịch vụ" type="text" size="small" autoComplete="off" variant="outlined" required value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
                        <TextField label="Đơn giá" type="number" size="small" autoComplete="off" variant="outlined" required value={servicePrice} onChange={(e) => setServicePrice(e.target.value)} />
                        <Button color="primary" type="submit" variant="contained">{serviceFeature.serviceSelection ? 'Cập nhật' : 'Thêm'}</Button>
                    </div>
                </form>

            </Modal.Body>
        </Modal>
    );
}