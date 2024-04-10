import { Button, FloatingLabel, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalService, setServiceUpdateSuccess } from "../../redux_features/serviceFeature";
import axios from "axios";
import { toast } from "react-toastify";

export default function ServiceModal() {

    const dispatch = useDispatch();
    const serviceFeature = useSelector(state => state.service);

    const [serviceName, setServiceName] = useState("");
    const [servicePrice, setServicePrice] = useState(0);

    useEffect(()=>{
        if(serviceFeature.serviceSelection){
            setServiceName(serviceFeature.serviceSelection.service_name);
            setServicePrice(serviceFeature.serviceSelection.service_price);
        }else{
            
            setServiceName("");
            setServicePrice(0);
        }
    },[serviceFeature.serviceSelection])

    const onConfirmAction=()=>{
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
                        toast.error("Lỗi khởi tạo thông tin: "+error.response.data.error_code);
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
                        toast.error("Lỗi cập nhật thông tin: "+error.response.data.error_code);
                    }
                })
        }
    }

    return (
        <Modal show={serviceFeature.openModalService} onClose={() => dispatch(setOpenModalService(false))}>
            <Modal.Header>{serviceFeature.serviceSelection?'Cập nhật dịch vụ':'Thêm dịch vụ mới'}</Modal.Header>
            <Modal.Body>
                <FloatingLabel label="Tên dịch vụ" type="text" variant="outlined" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
                <FloatingLabel label="Đơn giá" type="number" variant="outlined" value={servicePrice} onChange={(e)=>setServicePrice(e.target.value)}/>
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue" onClick={() => onConfirmAction()}>{serviceFeature.serviceSelection?'Cập nhật':'Thêm'}</Button>
                <Button color="gray" onClick={() => dispatch(setOpenModalService(false))}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    );
}