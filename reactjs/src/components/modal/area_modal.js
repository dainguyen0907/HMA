import { Button, Modal } from "flowbite-react";
import React from "react";
import FloatTextComponent from "../float_text_component";

export default function AreaModal(props) {
    return (
        <Modal show={props.openAddArea} onClose={() => { props.setOpenAddArea(false) }}>
            <Modal.Header>{props.headerModal}</Modal.Header>
            <Modal.Body>
                <FloatTextComponent label="Tên khu vực" data={props.areaName} setData={props.setAreaName} type="text" />
                {props.idArea === -1 ?
                    <>
                        <FloatTextComponent label="Số tầng" data={props.areaFloor} setData={props.setAreaFloor} type="number" />
                        <FloatTextComponent label="Số phòng" data={props.areaRoom} setData={props.setAreaRoom} type="number"
                            helper="Lưu ý: Số phòng phải chia hết cho số tầng" />
                    </> : ''}
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue" onClick={() => { props.confirmAction() }}>Đồng ý</Button>
                <Button color="gray" onClick={() => props.setOpenAddArea(false)}>Huỷ</Button>
            </Modal.Footer>
        </Modal>)
}