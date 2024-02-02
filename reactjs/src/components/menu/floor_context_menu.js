import { Menu, MenuItem } from "@mui/material";

import React from "react";

export default function FloorContextMenu(props) {


    const onHandleClose = () => {
        props.setAnchorEl(null)
    }

    return (
        <Menu
            open={props.open}
            anchorReference="anchorPosition"
            anchorPosition={
                props.anchorEl !== null ?
                    { top: props.anchorEl.mouseY, left: props.anchorEl.mouseX } :
                    undefined
            }
            onClose={onHandleClose}
        >
            <MenuItem onClick={() => { props.setOpenFloorModal(true); onHandleClose(); }}>Đổi tên tầng</MenuItem>
            <MenuItem onClick={() => { }}>Thêm phòng mới</MenuItem>
        </Menu>

    )
}