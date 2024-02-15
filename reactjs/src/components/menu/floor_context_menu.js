import { Menu, MenuItem } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFloorMenuAnchor, setOpenModalChangeName, setOpenModalInsertRoom } from "../../redux_features/floorFeature";

export default function FloorContextMenu() {
    const floorFeatures=useSelector(state=>state.floor);
    const dispatch=useDispatch();
    const onHandleClose = () => {
        dispatch(setFloorMenuAnchor(null));
    }

    return (
        <Menu
            open={Boolean(floorFeatures.floorMenuAnchor)}
            anchorReference="anchorPosition"
            anchorPosition={
                floorFeatures.floorMenuAnchor !== null ?
                    { top: floorFeatures.floorMenuAnchor.mouseY, left: floorFeatures.floorMenuAnchor.mouseX } :
                    undefined
            }
            onClose={onHandleClose}
        >
            <MenuItem onClick={() => { dispatch(setOpenModalChangeName(true));onHandleClose(); }}>Đổi tên tầng</MenuItem>
            <MenuItem onClick={() => { dispatch(setOpenModalInsertRoom(true));onHandleClose(); }}>Thêm phòng mới</MenuItem>
        </Menu>

    )
}