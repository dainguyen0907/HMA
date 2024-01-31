import { Button, Modal } from "flowbite-react";
import React from "react";
import FloatTextComponent from "../float_text_component";
import { toast } from "react-toastify";
import axios from "axios";
export default function PriceModal(props){
    const onConfirmAction=()=>{
        if(props.idPrice===-1){
            axios.post(process.env.REACT_APP_BACKEND+"api/price/insertPrice",{
                id_bed:props.selectedBedType,
                name:props.priceName,
                hour:props.hourPrice,
                day:props.datePrice,
                week:props.weekPrice,
                month:props.monthPrice
            },{withCredentials:true})
            .then(function(response){
                toast.success("Thêm đơn giá thành công");
                props.setSuccess(props.success+1);
                props.setOpenModal(false);
            }).catch(function(error){
                if(error.response){
                    toast.error(error.response.data.error_code);
                }
            })
        }else{
            axios.post(process.env.REACT_APP_BACKEND+"api/price/updatePrice",{
                id:props.idPrice,
                name:props.priceName,
                hour:props.hourPrice,
                day:props.datePrice,
                week:props.weekPrice,
                month:props.monthPrice
            },{withCredentials:true})
            .then(function(response){
                toast.success(response.data.result);
                props.setSuccess(props.success+1);
                props.setOpenModal(false);
            }).catch(function(error){
                if(error.response){
                    toast.error(error.response.data.error_code);
                }
            })
        }
    }
    return(
        <Modal show={props.openModal} onClose={()=>props.setOpenModal(false)}>
            <Modal.Header>{props.modalHeader}</Modal.Header>
            <Modal.Body>
                <FloatTextComponent readonly="true" data={props.bedTypeName} setData={props.setBedTypeName} type="text" label="Loại giường"/>
                <FloatTextComponent label="Tên đơn giá" data={props.priceName} setData={props.setPriceName} type="text"/>
                <FloatTextComponent label="Giá theo giờ" data={props.hourPrice} setData={props.setHourPrice} type="number"/>
                <FloatTextComponent label="Giá theo ngày" data={props.datePrice} setData={props.setDatePrice} type="number"/>
                <FloatTextComponent label="Giá theo tuần" data={props.weekPrice} setData={props.setWeekPrice} type="number"/>
                <FloatTextComponent label="Giá theo tháng" data={props.monthPrice} setData={props.setMonthPrice} type="number"/>
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue" onClick={()=>onConfirmAction()}>Đồng ý</Button>
                <Button color="gray" onClick={()=>props.setOpenModal(false)}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    )
}