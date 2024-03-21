import { Button, Checkbox, Datepicker, FloatingLabel, Label, Modal, Radio } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerUpdateSuccess, setOpenCustomerModal } from "../../redux_features/customerFeature";
import axios from "axios";
import { toast } from "react-toastify";

export default function CustomerModal() {

    const dispatch = useDispatch();
    const customerFeature = useSelector(state => state.customer);

    const [customerName, setCustomerName] = useState("");
    const [customerGender, setCustomerGender] = useState(true);
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerStatus, setCustomerStatus] = useState(true);
    const [customerStudentCheck, setCustomerStudentCheck] = useState(false);
    const [customerIdentification, setCustomerIdentification] = useState("");
    const [studentCode, setStudentCode] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [dobStudent, setDOBStudent] = useState(new Date().toLocaleDateString('vi-VI'));
    const [pobStudent, setPOBStudent] = useState("");

    const onHandleConfirm = () => {
        if (!customerFeature.customerSelection) {
            axios.post(process.env.REACT_APP_BACKEND + "api/customer/insertCustomer", {
                name: customerName,
                gender: customerGender,
                email: customerEmail,
                address: customerAddress,
                phone: customerPhone,
                identification: customerIdentification,
                student_check: customerStudentCheck,
                dob: dobStudent,
                student_code: studentCode,
                classroom: studentClass,
                pob: pobStudent
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success("Thêm khách hàng mới thành công");
                    dispatch(setCustomerUpdateSuccess());
                    dispatch(setOpenCustomerModal(false));
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
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
                student_check: customerStudentCheck,
                dob: dobStudent,
                student_code: studentCode,
                classroom: studentClass,
                pob: pobStudent,
                status: customerStatus,
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setCustomerUpdateSuccess());
                    dispatch(setOpenCustomerModal(false));
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                });
        }
    }

    useEffect(()=>{
        if(customerFeature.customerSelection){
            setCustomerName(customerFeature.customerSelection.customer_name);
            setCustomerGender(customerFeature.customerSelection.customer_gender);
            setCustomerEmail(customerFeature.customerSelection.customer_email);
            setCustomerAddress(customerFeature.customerSelection.customer_address);
            setCustomerPhone(customerFeature.customerSelection.customer_phone);
            setCustomerStatus(customerFeature.customerSelection.customer_status);
            setCustomerStudentCheck(customerFeature.customerSelection.customer_student_check);
            setCustomerIdentification(customerFeature.customerSelection.customer_identification);
            setStudentCode(customerFeature.customerSelection.customer_student_code);
            setStudentClass(customerFeature.customerSelection.customer_class);
            setDOBStudent(new Date(customerFeature.customerSelection.customer_dob).toLocaleDateString('vi-VI'));
            setPOBStudent(customerFeature.customerSelection.customer_pob);

        }else{
            setCustomerName("");
            setCustomerGender(true);
            setCustomerEmail("");
            setCustomerAddress("");
            setCustomerPhone("");
            setCustomerStatus(true);
            setCustomerStudentCheck(false);
            setCustomerIdentification("");
            setStudentCode("");
            setStudentClass("");
            setDOBStudent(new Date().toLocaleDateString('vi-VI'));
            setPOBStudent("");
        }
    },[customerFeature.customerSelection])

    return (
        <Modal show={customerFeature.openCustomerModal} onClose={() => dispatch(setOpenCustomerModal(false))}>
            <Modal.Header>{customerFeature.customerSelection ? 'Cập nhật thông tin khách hàng' : 'Thêm khách hàng mới'}</Modal.Header>
            <Modal.Body>
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
                <div className="mt-2">
                    <Checkbox id="studentCheck" onChange={() => setCustomerStudentCheck(!customerStudentCheck)} checked={customerStudentCheck} />
                    <Label htmlFor="studentCheck" value="Khách hàng này là sinh viên" className="ml-2" />
                </div>
                <div className="mt-2" hidden={!customerStudentCheck}>
                    <FloatingLabel label="Mã số sinh viên" variant="outlined" type="text" value={studentCode} onChange={(e) => setStudentCode(e.target.value)} />
                    <FloatingLabel label="Lớp" variant="outlined" type="text" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} />
                    <Datepicker language="vi-VI" className="mb-2" title="Ngày tháng năm sinh" value={dobStudent} onSelectedDateChanged={(date) => { setDOBStudent(new Date(date).toLocaleDateString('vi-VI')) }} />
                    <FloatingLabel label="Quê quán" variant="outlined" type="text" value={pobStudent} onChange={(e) => setPOBStudent(e.target.value)} />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue" onClick={() => onHandleConfirm()}>Đồng ý</Button>
                <Button color="gray" onClick={() => dispatch(setOpenCustomerModal(false))}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    );
}