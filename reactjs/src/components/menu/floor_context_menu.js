import { Menu, MenuItem } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFloorMenuAnchor, setFloorUpdateSuccess, setOpenModalChangeName, setOpenModalInsertRoom } from "../../redux_features/floorFeature";
import axios from "axios";
import { toast } from "react-toastify";

export default function FloorContextMenu() {
    const floorFeatures=useSelector(state=>state.floor);
    const dispatch=useDispatch();

    const onHandleDelete=()=>{
        if(window.confirm('Bạn có muốn xoá tầng này không?')){
            axios.post(process.env.REACT_APP_BACKEND+'api/floor/deleteFloor',{
                id:floorFeatures.floorID
            },{withCredentials:true})
            .then(function(response){
                toast.success(response.data.result);
                dispatch(setFloorUpdateSuccess());
            }).catch(function(error){
                if(error.response){
                    toast.error(error.response.data.error_code);
                }
            })
        }
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
            onClose={()=>dispatch(setFloorMenuAnchor(null))}
        >
            <MenuItem onClick={() => { dispatch(setOpenModalChangeName(true));dispatch(setFloorMenuAnchor(null)); }}>Đổi tên tầng</MenuItem>
            <MenuItem onClick={() => { dispatch(setOpenModalInsertRoom(true));dispatch(setFloorMenuAnchor(null)); }}>Thêm phòng mới</MenuItem>
            <MenuItem onClick={()=>onHandleDelete()}>Xoá tầng</MenuItem>
        </Menu>

    )
}