import { Button, FloatingLabel, Label, Modal, Radio } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerUpdateSuccess, setOpenCustomerModal } from "../../redux_features/customerFeature";
import axios from "axios";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

export default function CustomerModal() {

    const dispatch = useDispatch();
    const customerFeature = useSelector(state => state.customer);

    const [customerName, setCustomerName] = useState("");
    const [customerGender, setCustomerGender] = useState(true);
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerStatus, setCustomerStatus] = useState(true);
    const [customerIdentification, setCustomerIdentification] = useState("");

    const onHandleConfirm = () => {
        if (!customerFeature.customerSelection) {
            axios.post(process.env.REACT_APP_BACKEND + "api/customer/insertCustomer", {
                name: customerName,
                gender: customerGender,
                email: customerEmail,
                address: customerAddress,
                phone: customerPhone,
                identification: customerIdentification,
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success("Thêm khách hàng mới thành công");
                    dispatch(setCustomerUpdateSuccess());
                    dispatch(setOpenCustomerModal(false));
                }).catch(function (error) {
                    if (error.response) {
                        toast.error("Lỗi khởi tạo thông tin: " + error.response.data.error_code);
                    }
                });
        } else {
            axios.post(process.env.REACT_APP_BACKEND + "api/customer/updateCustomer", {
                id: customerFeature.customerSelection.id,
                name: customerName,
                gender: customerGender,
                email: customerEmail,
                address: customerAddress,
                phone: customerPhone,
                identification: customerIdentification,
                status: customerStatus,
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setCustomerUpdateSuccess());
                    dispatch(setOpenCustomerModal(false));
                }).catch(function (error) {
                    if (error.response) {
                        toast.error("Lỗi cập nhật thông tin: " + error.response.data.error_code);
                    }
                });
        }
    }

    useEffect(() => {
        if (customerFeature.customerSelection) {
            setCustomerName(customerFeature.customerSelection.customer_name);
            setCustomerGender(customerFeature.customerSelection.customer_gender);
            setCustomerEmail(customerFeature.customerSelection.customer_email);
            setCustomerAddress(customerFeature.customerSelection.customer_address);
            setCustomerPhone(customerFeature.customerSelection.customer_phone);
            setCustomerStatus(customerFeature.customerSelection.customer_status);
            setCustomerIdentification(customerFeature.customerSelection.customer_identification);

        } else {
            setCustomerName("");
            setCustomerGender(true);
            setCustomerEmail("");
            setCustomerAddress("");
            setCustomerPhone("");
            setCustomerStatus(true);
            setCustomerIdentification("");
        }
    }, [customerFeature.customerSelection])

    return (
        <Modal show={customerFeature.openCustomerModal} onClose={() => dispatch(setOpenCustomerModal(false))} className="relative">
            <Modal.Body>
                <div className="absolute top-3 right-4">
                    <IconButton onClick={() => dispatch(setOpenCustomerModal(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                    {customerFeature.customerSelection ? 'Cập nhật thông tin khách hàng' : 'Thêm khách hàng mới'}
                </div>
                <FloatingLabel label="Tên khách hàng" variant="outlined" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                <FloatingLabel label="CMND/CCCD" variant="outlined" type="text" value={customerIdentification} onChange={(e) => setCustomerIdentification(e.target.value)} />
                <FloatingLabel label="Số điện thoại" variant="outlined" type="number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                <FloatingLabel label="Địa chỉ email" variant="outlined" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                <FloatingLabel label="Địa chỉ liên hệ" variant="outlined" type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
                <div className="grid grid-cols-2">
                    <fieldset>
                        <legend>Giới tính</legend>
                        <div className="float-start mr-9">
                            <Radio id="male" name="gender" className="mr-2" checked={customerGender} onClick={() => setCustomerGender(true)} />
                            <Label htmlFor="male" value="Nam" />
                        </div>
                        <div className="float-start">
                            <Radio id="female" name="gender" className="mr-2" checked={!customerGender} onClick={() => setCustomerGender(false)} />
                            <Label htmlFor="female" value="Nữ" />
                        </div>
                    </fieldset>
                    <fieldset hidden={!customerFeature.customerSelection}>
                        <legend>Trạng thái</legend>
                        <div className="float-start mr-9">
                            <Radio id="on" name="status" className="mr-2" checked={customerStatus} onClick={() => setCustomerStatus(true)} />
                            <Label htmlFor="on" value="Sử dụng" />
                        </div>
                        <div className="float-start" >
                            <Radio id="off" name="status" className="mr-2" checked={!customerStatus} onClick={() => setCustomerStatus(false)} />
                            <Label htmlFor="off" value="Khoá" />
                        </div>
                    </fieldset>

                </div>
                <div className="pt-2 flex flex-row-reverse gap-2">
                    <Button color="blue" onClick={() => onHandleConfirm()}>Đồng ý</Button>
                    <Button color="gray" onClick={() => dispatch(setOpenCustomerModal(false))}>Huỷ</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}