import { Menu, MenuItem } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {setRoomMenuAnchor} from "../../redux_features/floorFeature";

export default function RoomContextMenu(){
    const dispatch=useDispatch();
    const floorFeature=useSelector(state=>state.floor);

    return (
        <Menu open={Boolean(floorFeature.roomMenuAnchor)}
        anchorReference="anchorPosition"
        anchorPosition={
            floorFeature.roomMenuAnchor!==null?
            {top:floorFeature.roomMenuAnchor.mouseY, left:floorFeature.roomMenuAnchor.mouseX}:undefined
        }
        onClose={()=>dispatch(setRoomMenuAnchor(null))}
        >
            <MenuItem>Cập nhật thông tin</MenuItem>
            <MenuItem>Xoá phòng</MenuItem>
        </Menu>
    )
}