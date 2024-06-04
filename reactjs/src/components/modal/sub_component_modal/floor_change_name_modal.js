import axios from "axios";
import { Modal } from "flowbite-react";
import React from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setFloorName, setFloorUpdateSuccess, setOpenModalChangeName } from "../../../redux_features/floorFeature";
import { Button, TextField } from "@mui/material";


export default function ChangeFloorNameModal(props) {
    const floorFeatures = useSelector(state => state.floor);
    const dispatch = useDispatch();
    const onHandleConfirm = () => {
        axios.post(process.env.REACT_APP_BACKEND + "api/floor/updateFloor", {
            name: floorFeatures.floorName,
            id: floorFeatures.floorID
        }, { withCredentials: true })
            .then(function (response) {
                toast.success(response.data.result);
                dispatch(setFloorUpdateSuccess());
                dispatch(setOpenModalChangeName(false));
            }).catch(function (error) {
                if (error.response) {
                    toast.error("Lỗi cập nhật thông tin: " + error.response.data.error);
                }
            })
    }
    return (
        <Modal show={floorFeatures.openModalChangeName} dismissible onClose={() => dispatch(setOpenModalChangeName(false))}>
            <Modal.Body>
                <div className="flex flex-row gap-2">
                    <TextField label="Tên tầng" size="small" sx={{width:'80%'}} variant="outlined" type="text" value={floorFeatures.floorName} onChange={(e) => dispatch(setFloorName(e.target.value))} />
                    <Button color="primary" variant="contained" className="mb-2 mx-1" onClick={() => onHandleConfirm()}>
                        &#10003;
                    </Button>
                    <Button color="error" variant="contained" className="mb-2 mx-1" onClick={() => dispatch(setOpenModalChangeName(false))}>
                        &#10060;
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}