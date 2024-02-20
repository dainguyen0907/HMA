import { Button, FloatingLabel, Modal } from "flowbite-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalInsertRoom } from "../../redux_features/floorFeature";



export default function InsertRoomModal(){
    const floorFeature=useSelector(state=>state.floor);
    const dispatch=useDispatch();
    const [roomName,setRoomName]=useState('');
    const [bedQuantity,setBedQuantity]=useState(0);

    const regexNumber=(value)=>{
        const reg= new RegExp('^[0-9]+$');
        return reg.test(value);
    }


    return(
        <Modal show={floorFeature.openModalInsertRoom} onClose={()=>dispatch(setOpenModalInsertRoom(false))}>
            <Modal.Header>Thêm phòng mới</Modal.Header>
            <Modal.Body>
                <FloatingLabel label="Tên phòng" variant="outlined" value={roomName} onChange={(e)=>{setRoomName(e.target.value)}} type="text" required/>
                <FloatingLabel label="Số lượng giường" variant="outlined" value={bedQuantity} onChange={(e)=>{if(regexNumber(e.target.value)){setBedQuantity(e.target.value)}}} type="number"/>

            </Modal.Body>
            <Modal.Footer>
                <Button color="blue">Thêm</Button>
                <Button color="gray" onClick={()=>dispatch(setOpenModalInsertRoom(false))}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    )
}