import { Button, Modal } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalCheckOut } from "../../redux_features/floorFeature";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import { MenuItem, TextField, styled } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const Text = styled(TextField)(({ theme }) => ({
    '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input:focus': {
        '--tw-ring-shadow': 'none'
    },
    '.css-7209ej-MuiInputBase-input-MuiFilledInput-input:focus': {
        '--tw-ring-shadow': 'none'
    }
}));

const DateTime = styled(DateTimePicker)(({ theme }) => ({
    '.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input:focus': {
        '--tw-ring-shadow': 'none'
    }
}))

export default function CheckoutModal() {
    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);
    const [data, setData] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [customerSelection, setCustomerSelection] = useState(null);
    const [bedTypeSelect, setBedTypeSelect] = useState([]);
    const [priceSelect, setPriceSelect] = useState([]);
    const unchange = 0;

    const [idBedType, setIdBedType] = useState(-1);
    const [checkinTime, setCheckinTime] = useState(null);
    const [checkoutTime, setCheckoutTime] = useState(null);
    const [idPrice, setIdPrice]=useState(-1);
    const [priceType,setPriceType]=useState(0);

    const [priceData,setPriceData]=useState([]);
    const [priceSelection,setPriceSelection]=useState(null);

    const columns = useMemo(() => [
        {
            accessorKey: 'Customer.customer_identification',
            header: 'Số CMND/CCCD',
            size: '10'
        },
        {
            accessorKey: 'Customer.customer_name',
            header: 'Tên khách hàng',
            size: '50'
        }, {
            accessorKey: 'Customer.customer_phone',
            header: 'Số điện thoại',
            size: '12'
        }
    ], []);

    const priceColumns = useMemo(() => [
        {
            accessorKey: 'label',
            header: 'Nội dung',
            size: '10'
        },
        {
            accessorKey: 'value',
            header: 'Số tiền',
            size: '10'
        },
    ], []);


    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/bed/getBedInRoom?id=' + floorFeature.roomID, { withCredentials: true })
            .then(function (response) {
                setData(response.data.result);
            }).catch(function (error) {
                console.log(error)
            })
    }, [floorFeature.roomID]);

    useEffect(()=>{
        for(let i=0;i<priceSelect.length;i++){
            if(priceSelect[i].id===idPrice)
            {
                setPriceSelection(priceSelect[i]);
            }
        }
    },[idPrice,priceSelect])

    useEffect(()=>{
        setPriceData([]);
        if(customerSelection){
            const checkin = new Date(customerSelection.bed_checkin);
            const checkout = new Date(customerSelection.bed_checkout);
            const times=(checkout.getTime()-checkin.getTime())/1000;
            switch (priceType) {
                case 1: {
                    let days=times/(60*60*24);
                    let hours=times%(60*60*24);
                    let totalMoney=0;
                    if(hours>(12*60*60)){
                        days=days+1;
                        hours=0;
                    }
                    if(days>0){
                        const content={
                            label:'Tiền phòng '+days+' ngày',
                            value:days*priceSelection.price_day
                        };
                        totalMoney+=(days*priceSelection.price_day);
                        setPriceData([...priceData,content]);
                    }else{
                        const content={
                            label:'Tiền checkin',
                            value:priceSelection.price_day
                        }
                        totalMoney+=(priceSelection.price_day);
                        setPriceData([...priceData,content]);
                    }
                    if(hours>0){
                        const content={
                            label:'Tiền phòng trễ '+hours+' giờ',
                            value:hours*priceSelection.price_hour
                        };
                        totalMoney+=(hours*priceSelection.price_hour);
                        setPriceData([...priceData,content]);
                    }
                    const content={
                        label:'Tổng tiền',
                        value:totalMoney
                    };
                    setPriceData([...priceData,content]);
                    break;
                }
                case 2:{

                }break;
                case 3:{

                }break;
                default:{

                }break;
            }
        }
        
    },[priceSelection,priceType,customerSelection])

    useEffect(() => {
        if (Object.keys(rowSelection).length > 0) {
            const nData = data[Object.keys(rowSelection)[0]];
            setCustomerSelection(nData);
            setCheckinTime(dayjs(nData.bed_checkin));
            setCheckoutTime(dayjs(nData.bed_checkout));
            setIdBedType(nData.id_bed_type);
            axios.get(process.env.REACT_APP_BACKEND + 'api/price/getPriceByIDBedType?id=' + nData.id_bed_type, { withCredentials: true })
                .then(function (response) {
                    setPriceSelect(response.data.result);
                    setIdPrice(nData.Bed_type.bed_type_default_price);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                });
        } else {
            setCustomerSelection(null)
        }
    }, [rowSelection])

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/bedtype/getAll', { withCredentials: true })
            .then(function (response) {
                setBedTypeSelect(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }, [unchange]);

    return (<Modal show={floorFeature.openModalCheckOut} onClose={() => dispatch(setOpenModalCheckOut(false))}
        size="7xl">
        <Modal.Body>
            <div className="w-full grid grid-cols-2">
                <div className="w-full px-1">
                    <div className="w-full h-40 bg-slate-200 overflow-y-scroll">
                        <MaterialReactTable
                            data={data}
                            columns={columns}
                            enableBottomToolbar={false}
                            enableTopToolbar={false}
                            enableRowSelection={true}
                            enableMultiRowSelection={false}
                            muiTableBodyRowProps={(row) => ({
                                onClick: row.row.getToggleSelectedHandler(),
                                sx: {
                                    cursor: 'pointer'
                                }
                            })}
                            onRowSelectionChange={setRowSelection}
                            state={{ rowSelection }}
                        />
                    </div>


                    <div className="pt-3 w-full">
                        <fieldset style={{ border: "2px solid #E5E7EB" }}>
                            <legend>Thông tin đặt giường</legend>
                            <div className="grid grid-cols-2">
                                <div className="pl-2">
                                    <p>Mã giường: <strong>{customerSelection ? customerSelection.id : ''}</strong> </p>
                                    <p>Khách hàng: <strong>{customerSelection ? customerSelection.Customer.customer_name : ''}</strong> </p>
                                    <p>CMND/CCCD: <strong>{customerSelection ? customerSelection.Customer.customer_identification : ''}</strong></p>
                                </div><div className="">
                                    <p>Loại giường: <strong>{customerSelection ? customerSelection.Bed_type.bed_type_name : ''}</strong></p>
                                    <p>Ngày checkin: <strong>{customerSelection ? new Date(customerSelection.bed_checkin).toLocaleString() : ''}</strong> </p>
                                    <p>Ngày checkout: <strong>{customerSelection ? new Date(customerSelection.bed_checkout).toLocaleString() : ''}</strong> </p>
                                </div>
                            </div>
                        </fieldset>
                        <div className="pt-3 w-full">
                            <Button color="blue" className="float-end ml-2 " disabled={!customerSelection}>Thanh toán</Button>
                            <Button color="success" className="float-end ml-2" disabled={!customerSelection}>Chuyển phòng</Button>
                            <Button color="gray" className="float-end ml-2" onClick={() => dispatch(setOpenModalCheckOut(false))}>Huỷ</Button>
                        </div>
                    </div>
                </div>
                <div className="w-full px-1">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <fieldset style={{ border: "2px solid #E5E7EB" }}>
                            <legend>Cập nhật thông tin đặt giường</legend>
                            <div className="grid grid-cols-3 p-2">
                                <Text label="Loại giường" sx={{ width: "95%" }} select disabled={!customerSelection}
                                    value={idBedType} onChange={(e) => setIdBedType(e.target.value)}>
                                    <MenuItem value={-1} disabled>Chọn loại giường</MenuItem>
                                    {bedTypeSelect.map((value, key) => <MenuItem value={value.id} key={key}>{value.bed_type_name}</MenuItem>)}
                                </Text>
                                <DateTime label="Ngày checkin" sx={{ width: "95%" }} value={checkinTime}
                                    onChange={(value) => setCheckinTime(value)} format="DD/MM/YYYY hh:mm A" disabled={!customerSelection} />
                                <DateTime label="Ngày checkout" sx={{ width: "95%" }} value={checkoutTime}
                                    onChange={(value) => setCheckoutTime(value)} format="DD/MM/YYYY hh:mm A" disabled={!customerSelection} />
                            </div>
                        </fieldset>
                    </LocalizationProvider>
                    <fieldset style={{ border: "2px solid #E5E7EB" }}>
                        <legend>Thông tin tiền giường</legend>
                        <div className="grid grid-cols-3">
                            <div className="text-end p-2">
                                Tính tiền theo:
                            </div>
                            <Text label="Đơn giá" select size="small" sx={{ width: '95%' }} disabled={!customerSelection}
                            value={idPrice} onChange={(e)=>{setIdPrice(e.target.value);}}>
                                <MenuItem value={-1} disabled>Chọn đơn giá</MenuItem>
                            {
                            priceSelect.map((value,key)=><MenuItem key={key} value={value.id}>{value.price_name}</MenuItem>)
                            }
                            </Text>
                            <Text label="Phân loại" select size="small" sx={{ width: '95%' }} defaultValue={0} disabled={!customerSelection}
                            value={priceType} onChange={(e)=>setPriceType(e.target.value)}>
                                <MenuItem value={0}>Theo giờ</MenuItem>
                                <MenuItem value={1}>Theo ngày</MenuItem>
                                <MenuItem value={2}>Theo tuần</MenuItem>
                                <MenuItem value={3}>Theo tháng</MenuItem>
                            </Text>
                        </div>
                        <div className="w-full h-30 overflow-y-scroll">
                        <MaterialReactTable
                            data={priceData}
                            columns={priceColumns}
                            enableBottomToolbar={false}
                            enableTopToolbar={false}
                        />
                        </div>
                    </fieldset>
                </div>
            </div>
        </Modal.Body>
    </Modal>);
}