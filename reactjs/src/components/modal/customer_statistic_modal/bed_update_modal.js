import { Close } from "@mui/icons-material";
import { Button, IconButton, MenuItem, TextField } from "@mui/material";
import { Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setCountUpdateSuccess, setOpenBedUpdateModal } from "../../../redux_features/customerStatisticFeature";
import { useEffect, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";


export default function BedUpdateModal() {

    const customerStatisticFeature = useSelector(state => state.customer_statistic);
    const dispatch = useDispatch();

    const [lunchBreak, setLunchBreak] = useState(true);
    const [idBed,setIDBed]=useState(-1);
    const [customerName,setCustomerName]=useState('');
    const [bedCheckin,setBedCheckin]=useState(null);
    const [bedCheckout,setBedCheckout]=useState(null);

    useEffect(()=>{
        if(customerStatisticFeature.bedSelection){
            const bedInformation=customerStatisticFeature.bedSelection;
            setIDBed(bedInformation.id);
            setCustomerName(bedInformation.Customer.customer_name);
            setBedCheckin(dayjs(bedInformation.bed_checkin));
            setBedCheckout(dayjs(bedInformation.bed_checkout));
            if(bedInformation.bed_lunch_break){
                setLunchBreak(true);
            }else{
                setLunchBreak(false);
            }
        }else{
            setIDBed(-1);
            setCustomerName('');
            setBedCheckin(null);
            setBedCheckout(null);
            setLunchBreak(true);
        }
    },[customerStatisticFeature.bedSelection])

    useEffect(()=>{
        if(lunchBreak&&bedCheckin&&bedCheckout){
            const date1=bedCheckin;
            const date2=bedCheckout;
            const date3= dayjs(new Date(bedCheckin).setHours(10,1,0));
            if(date1.diff(date3,'hour',true)>4 || date1<date3){
                setBedCheckin(date3);
                setBedCheckout(date3)
            }
            if(date1.diff(date2,'hour',true)>4){
                setBedCheckout(bedCheckin);
            }
        }
        if(bedCheckin&&bedCheckout){
            if(bedCheckin>bedCheckout){
                setBedCheckout(bedCheckin)
            }
        }
    },[lunchBreak, bedCheckin, bedCheckout])

    const onHandleSubmit=(e)=>{
        e.preventDefault();
        axios.post(process.env.REACT_APP_BACKEND+'api/bed/update/timeInBed',{
            id: idBed,
            bed_checkin: bedCheckin,
            bed_checkout: bedCheckout,
            bed_lunch_break: lunchBreak
        },{withCredentials:true})
        .then(function(response){
            toast.success(response.data.result);
            dispatch(setCountUpdateSuccess());
            dispatch(setOpenBedUpdateModal(false));
        }).catch(function(error){
            if(error.code=== 'ECONNABORTED'){
                toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
            }else if(error.response){
                toast.error(error.response.data.error_code);
            }else{
                toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
            }
        })
    }

    return (
        <Modal className="relative" show={customerStatisticFeature.openBedUpdateModal}>
            <Modal.Body>
                <div className="absolute top-3 right-4">
                    <IconButton onClick={() => dispatch(setOpenBedUpdateModal(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                    Điều chỉnh thời gian ở
                </div>
                <form onSubmit={onHandleSubmit}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="flex flex-col gap-2">
                            <TextField variant="outlined" label="id" disabled size="small" value={idBed}/>
                            <TextField variant="outlined" label="Tên khách hàng" disabled size="small" value={customerName}/>
                            <TextField variant="outlined" label="Phân loại" select size="small"
                                value={lunchBreak} onChange={(e) => setLunchBreak(e.target.value)}>
                                <MenuItem value={true}>Nghỉ trưa</MenuItem>
                                <MenuItem value={false}>Nghỉ đêm</MenuItem>
                            </TextField>
                            <DateTimePicker label="Thời gian checkin" format="DD/MM/YYYY hh:mm A" value={bedCheckin} onChange={(value)=>setBedCheckin(value)}
                            ampm={false} minTime={!lunchBreak?null:dayjs().set('hour',10).set('minute',0)} maxTime={!lunchBreak?null:dayjs().set('hour',14).set('minute',0)}/>
                            <DateTimePicker label="Thời gian checkout" format="DD/MM/YYYY hh:mm A" value={bedCheckout} onChange={(value)=>setBedCheckout(value)}
                            ampm={false} maxDate={!lunchBreak?null:bedCheckin} minDate={!lunchBreak?null:bedCheckin} minTime={!lunchBreak?null:dayjs().set('hour',10).set('minute',0)} maxTime={!lunchBreak?null:dayjs().set('hour',14).set('minute',0)}
                            />
                            <Button variant="contained" type="submit">Cập nhật</Button>
                        </div>
                    </LocalizationProvider>
                </form>
            </Modal.Body>
        </Modal>
    )
}