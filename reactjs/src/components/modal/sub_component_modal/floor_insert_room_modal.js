import { Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalInsertRoom, setRoomUpdateSuccess } from "../../../redux_features/floorFeature";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, IconButton, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";



export default function InsertRoomModal() {
    const floorFeature = useSelector(state => state.floor);
    const dispatch = useDispatch();
    const [roomName, setRoomName] = useState('');
    const [bedQuantity, setBedQuantity] = useState(0);

    const regexNumber = (value) => {
        const reg = new RegExp('^[0-9]+$');
        return reg.test(value);
    }

    useEffect(() => {
        setRoomName('');
        setBedQuantity(0);
    }, [floorFeature.openModalInsertRoom])

    const onHandleConfirm = () => {
        axios.post(process.env.REACT_APP_BACKEND + 'api/room/insertRoom', {
            name: roomName,
            bed_quantity: bedQuantity,
            floor_id: floorFeature.floorID
        }, { withCredentials: true })
            .then(function (response) {
                toast.success('Thêm mới thành công');
                dispatch(setOpenModalInsertRoom(false));
                dispatch(setRoomUpdateSuccess());
            }).catch(function (error) {
                if (error.response) {
                    toast.error("Lỗi khởi tạo thông tin: " + error.response.data.error_code);
                }
            })
    }


    return (
        <Modal show={floorFeature.openModalInsertRoom} onClose={() => dispatch(setOpenModalInsertRoom(false))} className="relative">
            <Modal.Body>
                <div className="absolute top-3 right-4">
                    <IconButton onClick={() => dispatch(setOpenModalInsertRoom(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                    Thêm phòng mới
                </div>
                <div className="flex flex-col gap-2">
                    <TextField size="small" label="Tên phòng" variant="outlined" value={roomName} onChange={(e) => { setRoomName(e.target.value) }} type="text" required />
                    <TextField size="small" label="Số lượng giường" variant="outlined" value={bedQuantity} onChange={(e) => { if (regexNumber(e.target.value)) { setBedQuantity(e.target.value) } }} type="number" />
                    <Button color="primary" variant="contained" onClick={() => onHandleConfirm()}>Thêm</Button>
                </div>

            </Modal.Body>
        </Modal>
    )
}