import { Button, Modal } from "flowbite-react";
import React from "react";
import FloatTextComponent from "../float_text_component";

export default function ServiceModal(props) {
    return (
        <Modal show={props.openModal} onClose={() => props.setOpenModal(false)}>
            <Modal.Header>{props.headerModal}</Modal.Header>
            <Modal.Body>
                <FloatTextComponent label="Tên dịch vụ" type="text" setData={props.setServiceName} data={props.serviceName} />
                <FloatTextComponent label="Đơn giá" type="number" setData={props.setServicePrice} data={props.servicePrice}
                    helper="Lưu ý: Không nhập các ký tự như ', . +' vào đơn giá " />
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue" onClick={() => props.onConfirmAction()}>Đồng ý</Button>
                <Button color="gray" onClick={() => props.setOpenModal(false)}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    );
}