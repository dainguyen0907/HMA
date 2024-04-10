import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBedTypeSelection, setOpenSelectBedTypeModal } from "../../redux_features/priceFeature";
import { toast } from "react-toastify";
import axios from "axios";

export default function SelectBedTypeModal() {

    const dispatch=useDispatch();
    const priceFeature=useSelector(state=>state.price);
    const [bedTypeList,setBedTypeList]=useState([]);
    const [idbedType,setIdBedType]=useState(-1);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND+"api/bedtype/getAll",{withCredentials:true})
        .then(function(response){
            setBedTypeList(response.data.result);
        }).catch(function(error){
            if(error.response){
                toast.error("Lỗi lấy dữ liệu loại giường: "+error.response.data.error_code);
            }
        })
    }, [priceFeature.priceUpdateSuccess])

    useEffect(()=>{
        if(idbedType!==-1){
            for(let i=0; i<bedTypeList.length;i++)
                if(idbedType===bedTypeList[i].id){
                    dispatch(setBedTypeSelection(bedTypeList[i]));
                    dispatch(setOpenSelectBedTypeModal(false));
                    break;
                } 
        }
    },[idbedType,bedTypeList,dispatch])

    return (
        <Modal show={priceFeature.openSelectBedTypeModal} dismissible onClose={() => dispatch(setOpenSelectBedTypeModal(false))}>
            <Modal.Body>
                <FormControl fullWidth>
                    <InputLabel id="bed-type-label">Chọn loại giường</InputLabel>
                    <Select labelId="bed-type-label"
                        label="Chọn loại giường"
                        onChange={(e)=>setIdBedType(e.target.value)}
                        value={idbedType}
                        >
                            <MenuItem value={-1} disabled>Chọn loại giường</MenuItem>
                            {bedTypeList.map((value,key)=><MenuItem value={value.id} key={key}>{value.bed_type_name}</MenuItem>)}
                    </Select>
                </FormControl>
            </Modal.Body>
        </Modal>
    )
}