import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalSelectArea } from "../../redux_features/floorFeature";
import {setAreaID} from "../../redux_features/floorFeature";
import { toast } from "react-toastify";
import axios from "axios";

export default function SelectAreaModal(){
    const dispatch=useDispatch();
    const floorFeature=useSelector(state=>state.floor);
    const [area,setArea]=useState([]);
    const success=0;

    useEffect(()=>{
        axios.get(process.env.REACT_APP_BACKEND+'api/area/getAll',{ withCredentials: true })
        .then(function(response){
            setArea(response.data);
        }).catch(function(error){
            if(error.response){
                toast.error(error.response.data.error_code);
            }
        })
    },[success]);

    const onSelect=(e)=>{
        dispatch(setAreaID(e.target.value));
        dispatch(setOpenModalSelectArea(false));
    }

    return(
        <Modal show={floorFeature.openModalSelectArea} dismissible onClose={(e)=>dispatch(setOpenModalSelectArea(false))}>
            <Modal.Body>
                <FormControl fullWidth>
                    <InputLabel id="area-label">Chọn khu vực</InputLabel>
                    <Select labelId="area-label"
                    label="Chọn khu vực"
                    onChange={onSelect}
                    >
                        {area.map((value,key)=><MenuItem value={value.id} key={key}>{value.area_name}</MenuItem>)}  
                    </Select>
                </FormControl>
            </Modal.Body>
        </Modal>
    )
}