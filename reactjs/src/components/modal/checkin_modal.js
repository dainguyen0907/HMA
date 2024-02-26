import { FloatingLabel, Modal } from "flowbite-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalCheckIn } from "../../redux_features/floorFeature";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function CheckInModal() {

    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);

    return (
        <Modal size="5xl" show={floorFeature.openModalCheckIn} onClose={() => dispatch(setOpenModalCheckIn(false))}>
            <Modal.Header />
            <Modal.Body>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <center className="font-bold text-red-500">Nhận phòng: {floorFeature.roomName}</center>
                    <div className="grid grid-cols-2">
                        <div className="grid grid-cols-1 pr-2">
                            <FloatingLabel variant="filled" label="Đơn giá" type="number" />
                            <div className="mb-2">
                                <DateTimePicker label="Ngày checkin" sx={{ width: "100%" }} />
                            </div>
                            <div className=" mb-2">
                                <DateTimePicker label="Ngày checkout" sx={{ width: "100%" }} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <FloatingLabel variant="filled" label="Trả trước" type="number" />
                            <div className="row-span-2">
                                <TextField
                                    label="Ghi chú" multiline rows={4} sx={{ width: "100%" }}
                                    variant="filled"
                                />
                            </div>
                        </div>
                    </div>
                </LocalizationProvider>
            </Modal.Body>
        </Modal>
    )
}