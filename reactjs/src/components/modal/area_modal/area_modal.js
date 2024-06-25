import { Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAreaUpdateSuccess, setOpenAreaModal } from "../../../redux_features/areaFeature";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, IconButton, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";

export default function AreaModal() {

    const dispatch = useDispatch();
    const areaFeature = useSelector(state => state.area);

    const [areaName, setAreaName] = useState("");
    const [areaFloor, setAreaFloor] = useState(0);
    const [areaRoom, setAreaRoom] = useState(0);
    const [isProcessing,setIsProcessing]=useState(false);

    useEffect(() => {
        if (areaFeature.areaSelection) {
            setAreaName(areaFeature.areaSelection.area_name);
            setAreaFloor(areaFeature.areaSelection.area_floor_quantity);
            setAreaRoom(areaFeature.areaSelection.area_room_quantity);
        } else {
            setAreaName("");
            setAreaFloor(0);
            setAreaRoom(0);
        }
    }, [areaFeature.areaSelection])

    const onHandleConfirm = (e) => {
        e.preventDefault();
        if(isProcessing)
            return;

        setIsProcessing(true);
        if (areaFeature.areaSelection) {
            axios.post(process.env.REACT_APP_BACKEND + "api/area/updateArea", {
                id_area: areaFeature.areaSelection.id,
                area_name: areaName,
                area_floor: areaFloor,
                area_room: areaRoom,
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setAreaUpdateSuccess());
                    dispatch(setOpenAreaModal(false));
                }).catch(function (error) {
                    if(error.code=== 'ECONNABORTED'){
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    }else if(error.response){
                        toast.error(error.response.data.error_code);
                    }else{
                        toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                    }
                }).finally(function(){
                    setIsProcessing(false);
                })

        } else {
            axios.post(process.env.REACT_APP_BACKEND + "api/area/insertArea",
                {
                    area_name: areaName,
                    area_floor: areaFloor,
                    area_room: areaRoom
                }, { withCredentials: true })
                .then(function (response) {
                    toast.success("Thêm thành công");
                    dispatch(setAreaUpdateSuccess());
                    dispatch(setOpenAreaModal(false));
                }).catch(function (error) {
                    if(error.code=== 'ECONNABORTED'){
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    }else if(error.response){
                        toast.error(error.response.data.error_code);
                    }else{
                        toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                    }
                }).finally(function(){
                    setIsProcessing(false);
                })
        }
    }

    return (
        <Modal show={areaFeature.openAreaModal} onClose={() => dispatch(setOpenAreaModal(false))} className="relative">
            <Modal.Body>
                <div className="absolute top-3 right-4">
                    <IconButton onClick={() => dispatch(setOpenAreaModal(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                    {areaFeature.areaSelection ? 'Cập nhật khu vực' : 'Thêm khu vực mới'}
                </div>
                <form onSubmit={onHandleConfirm}>
                    <div className="flex flex-col gap-2">
                        <TextField variant="outlined" type="text" size="small" fullWidth label="Tên khu vực" value={areaName} onChange={(e) => setAreaName(e.target.value)} required />
                        {!areaFeature.areaSelection ?
                            <>
                                <TextField variant="outlined" type="number" label="Số tầng" size="small" fullWidth required value={areaFloor} onChange={(e) => setAreaFloor(e.target.value)} />
                                <TextField variant="outlined" type="number" label="Số phòng" size="small" fullWidth required value={areaRoom} onChange={(e) => setAreaRoom(e.target.value)}/>
                            </> : ''}
                        <Button color="primary" type="submit" fullWidth variant="contained">{areaFeature.areaSelection ? 'Cập nhật' : 'Thêm'}</Button>
                    </div>

                </form>

            </Modal.Body>
        </Modal>)
}