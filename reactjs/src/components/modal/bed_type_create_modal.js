import { Button, Modal } from "flowbite-react";
import React from "react";
import FloatTextComponent from "../float_text_component";

export default function CreateBedTypeModal(props) {
    return (
        <Modal show={props.openModal} onClose={() => props.setOpenModal(false)}>
            <Modal.Header>Thêm loại giường mới</Modal.Header>
            <Modal.Body>
                <FloatTextComponent label="Tên loại giường" setData={props.setBedTypeName} data={props.bedTypeName} type="text" />
                <FloatTextComponent label="Giá theo giờ" setData={props.setHourPrice} data={props.hourPrice} type="number" />
                <FloatTextComponent label="Giá theo ngày" setData={props.setDatePrice} data={props.datePrice} type="number" />
                <FloatTextComponent label="Giá theo tuần" setData={props.setWeekPrice} data={props.weekPrice} type="number" />
                <FloatTextComponent label="Giá theo tháng" setData={props.setMonthPrice} data={props.monthPrice} type="number"
                    helper="Lưu ý: Không nhập các ký tự khác ngoài số vào đơn giá" />
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue" onClick={() => props.onConfirmAction()}>Đồng ý</Button>
                <Button color="gray" onClick={() => props.setOpenModal(false)}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    )
}