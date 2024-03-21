import { Button, FloatingLabel, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAreaUpdateSuccess, setOpenAreaModal } from "../../redux_features/areaFeature";
import { toast } from "react-toastify";
import axios from "axios";

export default function AreaModal() {

    const dispatch = useDispatch();
    const areaFeature = useSelector(state => state.area);

    const [areaName, setAreaName] = useState("");
    const [areaFloor, setAreaFloor] = useState(0);
    const [areaRoom, setAreaRoom] = useState(0);

    useEffect(()=>{
        if(areaFeature.areaSelection){
            setAreaName(areaFeature.areaSelection.area_name);
            setAreaFloor(areaFeature.areaSelection.area_floor_quantity);
            setAreaRoom(areaFeature.areaSelection.area_room_quantity);
        }else{
            setAreaName("");
            setAreaFloor(0);
            setAreaRoom(0);
        }
    },[areaFeature.areaSelection])

    const onHandleConfirm=()=>{
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
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
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
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        }
    }

    return (
        <Modal show={areaFeature.openAreaModal} onClose={() => dispatch(setOpenAreaModal(false))}>
            <Modal.Header>{areaFeature.areaSelection ? 'Cập nhật khu vực' : 'Thêm khu vực mới'}</Modal.Header>
            <Modal.Body>
                <FloatingLabel variant="outlined" type="text" label="Tên khu vực" value={areaName} onChange={(e) => setAreaName(e.target.value)} />
                {!areaFeature.areaSelection ?
                    <>
                        <FloatingLabel variant="outlined" type="number" label="Số tầng" value={areaFloor} onChange={(e) => setAreaFloor(e.target.value)} />
                        <FloatingLabel variant="outlined" type="number" label="Số phòng" value={areaRoom} onChange={(e) => setAreaRoom(e.target.value)} />
                    </> : ''}
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue" onClick={() => onHandleConfirm()}>{areaFeature.areaSelection ? 'Cập nhật' : 'Thêm'}</Button>
                <Button color="gray" onClick={() => dispatch(setOpenAreaModal(false))}>Huỷ</Button>
            </Modal.Footer>
        </Modal>)
}