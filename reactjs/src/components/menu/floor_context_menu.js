import { Menu, MenuItem } from "@mui/material";

import { Modal } from "flowbite-react";
import React from "react";


export default function FloorContextMenu(props){
    const onHandleClose=()=>{
        props.setAnchorEl(null)
    }
    return (
        <Menu 
        open={props.open}
        anchorEl={props.anchorEl}
        onClose={onHandleClose}
        >
            <MenuItem onClick={()=>{}}>Đổi tên tầng</MenuItem>
            <MenuItem onClick={()=>{}}>Thêm phòng mới</MenuItem>
        </Menu>
    )
}