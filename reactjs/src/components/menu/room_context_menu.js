import { Menu, MenuItem } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalCheckIn, setOpenModalUpdateRoom, setRoomMenuAnchor, setRoomUpdateSuccess } from "../../redux_features/floorFeature";
import axios from "axios";
import { toast } from "react-toastify";

export default function RoomContextMenu() {
    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);

    const onHandleDeleteRoom = () => {
        if (window.confirm('Bạn muốn xoá phòng này?')) {
            axios.post(process.env.REACT_APP_BACKEND + 'api/room/deleteRoom', {
                id: floorFeature.roomID
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setRoomUpdateSuccess());
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
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
                <MenuItem divider onClick={() => { dispatch(setOpenModalCheckIn(true)); dispatch(setRoomMenuAnchor(null)) }}>Nhận phòng/CheckIn</MenuItem>
                : ""}
            {floorFeature.roomStatus && floorFeature.bedInRoomStatus !== -1 ?
                <MenuItem divider>Trả phòng/CheckOut</MenuItem> : ""
            }
            {floorFeature.roomStatus && floorFeature.bedInRoomStatus !== -1 ?
                <MenuItem divider>Chỉnh sửa CheckIn  </MenuItem> : ""
            }
            <MenuItem onClick={() => { dispatch(setOpenModalUpdateRoom(true)); dispatch(setRoomMenuAnchor(null)) }}>Cập nhật phòng</MenuItem>
            <MenuItem onClick={() => onHandleDeleteRoom()}>Xoá phòng</MenuItem>
        </Menu>
    )
}