import axios from "axios";
import { Modal } from "flowbite-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setFloorName, setFloorUpdateSuccess, setOpenModalChangeName } from "../../../redux_features/floorFeature";
import { Button, TextField } from "@mui/material";


export default function ChangeFloorNameModal(props) {
    const floorFeatures = useSelector(state => state.floor);
    const dispatch = useDispatch();
    const [isProcessing,setIsProcessing]=useState(false);

    const onHandleConfirm = () => {

        if(isProcessing)
            return;
        setIsProcessing(true);

        axios.post(process.env.REACT_APP_BACKEND + "api/floor/updateFloor", {
            name: floorFeatures.floorName,
            id: floorFeatures.floorID
        }, { withCredentials: true })
            .then(function (response) {
                toast.success(response.data.result);
                dispatch(setFloorUpdateSuccess());
                dispatch(setOpenModalChangeName(false));
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