import { Menu, MenuItem } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCheckoutModalStatus, setOpenModalCheckIn, setOpenModalCheckOut, setOpenModalUpdateRoom, setRoomMenuAnchor, setRoomUpdateSuccess } from "../../redux_features/floorFeature";
import axios from "axios";
import { toast } from "react-toastify";

export default function RoomContextMenu() {
    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);
    const reception_role = useSelector(state => state.reception.reception_role);

    const onHandleDeleteRoom = () => {
        if (window.confirm('Bạn muốn xoá phòng này?')) {
            axios.post(process.env.REACT_APP_BACKEND + 'api/room/deleteRoom', {
                id: floorFeature.roomID
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setRoomUpdateSuccess());
                }).catch(function (error) {
                    if (error.code === 'ECONNABORTED') {
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    } else if (error.response) {
                        toast.error(error.response.data.error_code);
                    } else {
                        toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                    }
                });
        }
        dispatch(setRoomMenuAnchor(null));
    }

    return (
        <Menu open={Boolean(floorFeature.roomMenuAnchor)}
            anchorReference="anchorPosition"
            anchorPosition={
                floorFeature.roomMenuAnchor !== null ?
                    { top: floorFeature.roomMenuAnchor.mouseY, left: floorFeature.roomMenuAnchor.mouseX } : undefined
            }
            onClose={() => dispatch(setRoomMenuAnchor(null))}
        >
            {floorFeature.roomStatus ?
                <MenuItem divider onClick={() => { dispatch(setOpenModalCheckIn(true)); dispatch(setRoomMenuAnchor(null)) }}>Nhận phòng</MenuItem> : ""
            }
            {floorFeature.roomStatus && floorFeature.bedInRoomStatus !== -1 ?
                <MenuItem divider onClick={() => { dispatch(setOpenModalCheckOut(true)); dispatch(setRoomMenuAnchor(null)); dispatch(setCheckoutModalStatus(false)) }}>Chỉnh sửa phòng đặt trước</MenuItem> : ""
            }
            {floorFeature.roomStatus && floorFeature.bedInRoomStatus !== -1 ?
                <MenuItem divider onClick={() => { dispatch(setOpenModalCheckOut(true)); dispatch(setRoomMenuAnchor(null)); dispatch(setCheckoutModalStatus(true)) }}>Chỉnh sửa/Trả phòng</MenuItem> : ""
            }
            <MenuItem onClick={() => { dispatch(setOpenModalUpdateRoom(true)); dispatch(setRoomMenuAnchor(null)) }}>Cập nhật phòng</MenuItem>
            {reception_role && reception_role.indexOf(2, 0) !== -1 ?
                <MenuItem onClick={() => onHandleDeleteRoom()}>Xoá phòng</MenuItem> : null}
        </Menu>
    )
}