import { Button, Checkbox, Datepicker, Label, Modal, Radio } from "flowbite-react";
import React from "react";
import FloatTextComponent from "../float_text_component";

export default function CustomerModal(props) {
    return (
        <Modal show={props.openModal} onClose={() => { props.setOpenModal(false) }}>
            <Modal.Header>{props.modalHeader}</Modal.Header>
            <Modal.Body>
                <FloatTextComponent label="Tên khách hàng" data={props.customerName} setData={props.setCustomerName} type="text" />
                <FloatTextComponent label="CMND/CCCD" data={props.customerIdentification} setData={props.setCustomerIdentification} type="text" />
                <FloatTextComponent label="Số điện thoại" data={props.customerPhone} setData={props.setCustomerPhone} type="number" />
                <FloatTextComponent label="Địa chỉ email" data={props.customerEmail} setData={props.setCustomerEmail} type="email" />
                <FloatTextComponent label="Địa chỉ liên hệ" data={props.customerAddress} setData={props.setCustomerAddress} type="text" />
                <div className="grid grid-cols-2">
                    <fieldset>
                        <legend>Giới tính</legend>
                        <div className="float-start mr-9">
                            <Radio id="male" name="gender" className="mr-2" checked={props.customerGender} onClick={() => props.setCustomerGender(true)} />
                            <Label htmlFor="male" value="Nam" />
                        </div>
                        <div className="float-start">
                            <Radio id="female" name="gender" className="mr-2" checked={!props.customerGender} onClick={() => props.setCustomerGender(false)} />
                            <Label htmlFor="female" value="Nữ" />
                        </div>
                    </fieldset>
                    <fieldset hidden={props.idCustomer === -1 ? true : false}>
                        <legend>Trạng thái</legend>
                        <div className="float-start mr-9">
                            <Radio id="on" name="status" className="mr-2" checked={props.customerStatus} onClick={() => props.setCustomerStatus(true)} />
                            <Label htmlFor="on" value="Sử dụng" />
                        </div>
                        <div className="float-start" >
                            <Radio id="off" name="status" className="mr-2" checked={!props.customerStatus} onClick={() => props.setCustomerStatus(false)} />
                            <Label htmlFor="off" value="Khoá" />
                        </div>
                    </fieldset>

                </div>
                <div className="mt-2">
                    <Checkbox id="studentCheck" check={props.customerStudentCheck} onChange={() => props.setCustomerStudentCheck(!props.customerStudentCheck)} checked={props.customerStudentCheck} />
                    <Label htmlFor="studentCheck" value="Khách hàng này là sinh viên" className="ml-2" />
                </div>
                <div className="mt-2" hidden={!props.customerStudentCheck}>
                    <FloatTextComponent label="Mã số sinh viên" data={props.studentCode} setData={props.setStudentCode} type="text" />
                    <FloatTextComponent label="Lớp" data={props.studentClass} setData={props.setStudentClass} type="text" />
                    <Datepicker language="vi-VI" className="mb-2" title="Ngày tháng năm sinh" value={props.dobStudent} onSelectedDateChanged={(date) => { props.setDOBStudent(new Date(date).toLocaleDateString('vi-VI')) }} />
                    <FloatTextComponent label="Quê quán" data={props.pobStudent} setData={props.setPOBStudent} type="text" />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue" onClick={() => props.onConfirmAction()}>Đồng ý</Button>
                <Button color="gray" onClick={() => { props.setOpenModal(false) }}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    );
}