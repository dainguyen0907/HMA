import { Button, FloatingLabel, Modal } from "flowbite-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalInsertRoom, setRoomName } from "../../redux_features/floorFeature";



export default function InsertRoomModal(){
    const floorFeature=useSelector(state=>state.floor);
    const dispatch=useDispatch();
    const floorFeatures=useSelector(state=>state.floor);


    return(
        <Modal show={floorFeatures.openModalInsertRoom} dismissible onClose={()=>dispatch(setOpenModalInsertRoom(false))}>
            <Modal.Header>Thêm phòng mới</Modal.Header>
            <Modal.Body>
                <FloatingLabel label="Tên phòng" type="text" value={floorFeature.roomName} onChange={(e)=>dispatch(setRoomName(e.target.value))}/>
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue">Thêm</Button>
                <Button color="gray" onClick={()=>dispatch(setOpenModalInsertRoom(false))}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    )
}