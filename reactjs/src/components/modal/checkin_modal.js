import { Button, FloatingLabel, Modal } from "flowbite-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalCheckIn } from "../../redux_features/floorFeature";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";



export default function CheckInModal() {

    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);

    return (
        <Modal size="5xl" show={floorFeature.openModalCheckIn} onClose={() => dispatch(setOpenModalCheckIn(false))}>
            <Modal.Body>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <center className="font-bold text-blue-500">Nhận phòng: {floorFeature.roomName}</center>
                    <div className="grid grid-cols-2 border-b-2 border-gray-500">
                        <div className="grid grid-cols-1 pr-2">
                            <FloatingLabel variant="filled" label="Đơn giá" type="number" />
                            <div className="mb-3">
                                <DateTimePicker label="Ngày checkin" sx={{ width: "100%" }} />
                            </div>
                            <div className=" mb-2">
                                <DateTimePicker label="Ngày checkout" sx={{ width: "100%" }} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <FloatingLabel variant="filled" label="Trả trước" type="number" />
                            <div className="row-span-2">
                                <TextField label="Ghi chú" rows={4} multiline fullWidth />
                            </div>
                        </div>
                    </div>
                    <center className="font-bold text-blue-500">Thông tin khách hàng</center>
                    <div className="grid grid-cols-2 pt-2 border-b-2 border-gray-700">
                        <div className="p-1">
                            <TextField select size="small" fullWidth variant="filled" label="Đối tượng">
                                <MenuItem value={false}>Khách hàng</MenuItem>
                                <MenuItem value={true}>Sinh viên</MenuItem>
                            </TextField>
                        </div>
                        <div className="p-1">
                            <TextField label="Họ và tên" size="small" fullWidth variant="filled" />
                        </div>
                        <div className="p-1">
                            <TextField label="Giới tính" size="small" fullWidth variant="filled" />
                        </div>
                        <div className="p-1">
                            <TextField label="Email" size="small" fullWidth variant="filled" />
                        </div>
                        <div className="p-1">
                            <TextField label="Địa chỉ" size="small" fullWidth variant="filled" />
                        </div>
                        <div className="p-1">
                            <TextField label="Số điện thoại" size="small" fullWidth variant="filled" />
                        </div>
                        <div className="p-1">
                            <TextField label="CMND/CCCD" size="small" fullWidth variant="filled" />
                        </div>
                        <div className="p-1">
                            <Button color="green" className="float-end ml-2">Thêm</Button>
                            <Button color="blue" className="float-end ml-2">Tạo mới</Button>
                        </div>
                    </div>
                </LocalizationProvider>

                <div className="pt-3">
                    <Button color="blue" className="float-end ml-2">Nhận phòng</Button>
                    <Button color="gray" className="float-end ml-2" onClick={() => dispatch(setOpenModalCheckIn(false))}>Huỷ</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}