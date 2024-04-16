import { Button, FloatingLabel, Modal } from "flowbite-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalUpdateRoom, setRoomBedQuantity, setRoomName, setRoomStatus, setRoomUpdateSuccess, setRoomNote } from "../../redux_features/floorFeature";
import axios from "axios";
import { toast } from "react-toastify";
import { FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import { Close } from "@mui/icons-material";

export default function UpdateRoomModal() {
    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);


    const regexNumber = (value) => {
        const reg = new RegExp('^[0-9]+$');
        return reg.test(value);
    }

    const onHandleConfirm = () => {
        axios.post(process.env.REACT_APP_BACKEND + 'api/room/updateRoom', {
            id: floorFeature.roomID,
            name: floorFeature.roomName,
            bed_quantity: floorFeature.roomBedQuantity,
            status: floorFeature.roomStatus,
            note: floorFeature.roomStatus ? "" : floorFeature.roomNote,
        }, { withCredentials: true })
            .then(function (response) {
                toast.success(response.data.result);
                dispatch(setRoomUpdateSuccess());
                dispatch(setOpenModalUpdateRoom(false));
            }).catch(function (error) {
                console.log(error)
                if (error.respose) {
                    toast.error("Lỗi cập nhật thông tin: " + error.response.data.error_code);
                }
            })
    }

    return (
        <Modal show={floorFeature.openModalUpdateRoom} onClose={() => dispatch(setOpenModalUpdateRoom(false))} className="relative ">
            <Modal.Body>
                <div className="absolute right-4 top-3">
                    <IconButton onClick={() => dispatch(setOpenModalUpdateRoom(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="pb-2 uppercase text-center font-bold text-blue-700">
                    cập nhật phòng
                </div>
                <FloatingLabel label="Tên phòng" variant="outlined" value={floorFeature.roomName} onChange={(e) => { dispatch(setRoomName(e.target.value)) }} type="text" required />
                <FloatingLabel label="Số lượng giường" variant="outlined" value={floorFeature.roomBedQuantity} onChange={(e) => { if (regexNumber(e.target.value)) { dispatch(setRoomBedQuantity(e.target.value)) } }} type="number" />
                <FormControl fullWidth >
                    <InputLabel id="roomStatus">Trạng thái phòng</InputLabel>
                    <Select labelId="roomStatus"
                        label="Trạng thái phòng"
                        value={floorFeature.roomStatus}
                        onChange={(e) => dispatch(setRoomStatus(e.target.value))}
                        className="mb-2"
                    >
                        <MenuItem value={true}>Đang sử dụng</MenuItem>
                        <MenuItem value={false}>Ngưng sử dụng</MenuItem>
                    </Select>
                </FormControl>
                {
                    !floorFeature.roomStatus ?
                        <FloatingLabel label="Lý do" variant="outlined" type="text" value={floorFeature.roomNote} onChange={(e) => dispatch(setRoomNote(e.target.value))} /> : null
                }
                <div className="flex flex-row-reverse gap-4">
                    <Button color="blue" onClick={() => onHandleConfirm()}>Cập nhật</Button>
                    <Button color="gray" onClick={() => dispatch(setOpenModalUpdateRoom(false))}>Huỷ</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}