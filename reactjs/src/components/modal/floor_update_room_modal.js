import { Button, FloatingLabel, Modal } from "flowbite-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {setOpenModalUpdateRoom, setRoomBedQuantity, setRoomName, setRoomUpdateSuccess} from "../../redux_features/floorFeature";
import axios from "axios";
import { toast } from "react-toastify";

export default function UpdateRoomModal() {
    const dispatch=useDispatch();
    const floorFeature=useSelector(state=>state.floor);

    const regexNumber=(value)=>{
        const reg= new RegExp('^[0-9]+$');
        return reg.test(value);
    }

    const onHandleConfirm=()=>{
        axios.post(process.env.REACT_APP_BACKEND+'api/room/updateRoom',{
            id:floorFeature.roomID,
            name:floorFeature.roomName,
            bed_quantity:floorFeature.roomBedQuantity,
        },{withCredentials:true})
        .then(function(response){
            toast.success(response.data.result);
            dispatch(setRoomUpdateSuccess());
            dispatch(setOpenModalUpdateRoom(false));
        }).catch(function(error){
            if(error.respose){
                toast.error(error.response.data.error_code);
            }
        })
    }

    return (
        <Modal show={floorFeature.openModalUpdateRoom} onClose={()=>dispatch(setOpenModalUpdateRoom(false))}>
            <Modal.Header>Cập nhật phòng</Modal.Header>
            <Modal.Body>
                <FloatingLabel label="Tên phòng" variant="outlined" value={floorFeature.roomName} onChange={(e) => { dispatch(setRoomName(e.target.value)) }} type="text" required />
                <FloatingLabel label="Số lượng giường" variant="outlined" value={floorFeature.roomBedQuantity} onChange={(e) => { if (regexNumber(e.target.value)) { dispatch(setRoomBedQuantity(e.target.value)) } }} type="number" />
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue" onClick={()=>onHandleConfirm()}>Cập nhật</Button>
                <Button color="gray" onClick={() => dispatch(setOpenModalUpdateRoom(false))}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    )
}