import { Button, Modal } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBedID, setOpenModalChangeRoom, setOpenModalCheckOut, setOpenModalSinglePayment, setPaymentInfor, setPaymentMethod, setRoomPriceTable, setRoomUpdateSuccess, setServicePriceTable } from "../../redux_features/floorFeature";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import { Box, IconButton, MenuItem, TextField, Tooltip, styled } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { IconContext } from "react-icons";
import { FaArrowCircleDown, FaPlusCircle } from "react-icons/fa";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import { Delete } from "@mui/icons-material";

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
    const [deposit, setDeposit] = useState(0);
    const [idPrice, setIdPrice] = useState(-1);
    const [priceType, setPriceType] = useState(0);

    const [priceData, setPriceData] = useState([]);
    const [priceSelection, setPriceSelection] = useState(null);

    const [serviceData, setServiceData] = useState([]);
    const [serviceSelect, setServiceSelect] = useState([]);
    const [serviceSelection, setServiceSelection] = useState(null);
    const [idService, setIdService] = useState(-1);
    const [serviceQuantity, setServiceQuantity] = useState(0);

    const [totalPrice, setTotalPrice] = useState(0);
    const [roomPrice, setRoomPrice] = useState(0);
    const [servicePrice, setServicePrice] = useState(0);
    const [idPaymentMethod, setIdPaymentMethod] = useState(-1);
    const [paymentMethodSelection,setPaymentMethodSelection]=useState(null);
    const [paymentMethodSelect, setPaymentMethodSelect] = useState([]);

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
            header: 'Số tiền',
            size: '10',
            Cell: ({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                    {Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(row.original.value)}
                </Box>
            ),
        },
    ], []);

    const serviceColumns = useMemo(() => [
        {
            accessorKey: 'Service.service_name',
            header: 'Nội dung',
            size: '10'
        },
        {
            accessorKey: 'service_quantity',
            header: 'Số lượng',
            size: '5'
        },
        {
            header: 'Thành tiền',
            size: '10',
            Cell: ({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                    {Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(row.original.total_price)}
                </Box>
            ),
        },
    ], [])

    useEffect(() => {
        setRowSelection({});
    }, [floorFeature.openModalCheckOut]);


    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/bed/getBedInRoom?id=' + floorFeature.roomID, { withCredentials: true })
            .then(function (response) {
                setData(response.data.result);
            }).catch(function (error) {
                console.log(error)
            })
    }, [floorFeature.roomID, floorFeature.roomUpdateSuccess]);

    useEffect(() => {
        for (let i = 0; i < priceSelect.length; i++) {
            if (priceSelect[i].id === idPrice) {
                setPriceSelection(priceSelect[i]);
            }
        }
    }, [idPrice, priceSelect])

    useEffect(() => {
        let arrayPrice = [];
        if (customerSelection && priceSelection) {
            const checkin = new Date(customerSelection.bed_checkin);
            const checkout = new Date(customerSelection.bed_checkout);
            const times = (checkout.getTime() - checkin.getTime()) / 1000;
            switch (priceType) {
                case 1: {
                    let days = Math.floor(times / (60 * 60 * 24));
                    let hours = Math.round((times - (days * 60 * 60 * 24)) / 3600);
                    let totalMoney = 0;
                    if (hours > (12 * 60 * 60)) {
                        days = days + 1;
                        hours = 0;
                    }
                    if (days > 0) {
                        const content = {
                            label: 'Tiền phòng ' + days + ' ngày',
                            value: days * priceSelection.price_day
                        };
                        totalMoney += (days * priceSelection.price_day);
                        arrayPrice.push(content);
                    } else {
                        const content = {
                            label: 'Tiền checkin theo ngày',
                            value: priceSelection.price_day
                        }
                        totalMoney += (priceSelection.price_day);
                        arrayPrice.push(content);
                    }
                    if (hours > 0) {
                        const content = {
                            label: 'Tiền phòng ' + hours + ' giờ',
                            value: hours * priceSelection.price_hour
                        };
                        totalMoney += (hours * priceSelection.price_hour);
                        arrayPrice.push(content);
                    }
                    setRoomPrice(parseInt(totalMoney));
                    break;
                }
                case 2: {
                    let weeks = Math.floor(times / (3600 * 24 * 7));
                    let day = Math.round((times - (weeks * 3600 * 24 * 7)) / (3600 * 24));
                    let totalMoney = 0;
                    if (weeks > 0) {
                        const content = {
                            label: 'Tiền phòng ' + weeks + ' tuần',
                            value: weeks * priceSelection.price_week
                        };
                        totalMoney += (weeks * priceSelection.price_week);
                        arrayPrice.push(content);
                        if (day > 0) {
                            const content = {
                                label: 'Tiền phòng ' + day + ' ngày',
                                value: day * priceSelection.price_day
                            };
                            totalMoney += (day * priceSelection.price_day);
                            arrayPrice.push(content);
                        }
                    } else {
                        const content = {
                            label: 'Tiền checkin theo tuần',
                            value: priceSelection.price_week
                        }
                        totalMoney += (priceSelection.price_week);
                        arrayPrice.push(content);
                    }
                    setRoomPrice(parseInt(totalMoney));
                    break;
                }
                case 3: {
                    let months = Math.floor(times / (3600 * 24 * 30))
                    let weeks = Math.floor((times - (months * 3600 * 24 * 30)) / (3600 * 24 * 7));
                    let day = Math.round((times - (weeks * 3600 * 24 * 7) - (months * 3600 * 24 * 30)) / (3600 * 24));
                    let totalMoney = 0;
                    if (months > 0) {
                        const content = {
                            label: 'Tiền phòng ' + months + ' tháng',
                            value: months * priceSelection.price_month
                        };
                        totalMoney += (months * priceSelection.price_months);
                        arrayPrice.push(content);
                        if (weeks > 0) {
                            const content = {
                                label: 'Tiền phòng ' + weeks + ' tuần',
                                value: weeks * priceSelection.price_week
                            };
                            totalMoney += (weeks * priceSelection.price_week);
                            arrayPrice.push(content);
                        }
                        if (day > 0) {
                            const content = {
                                label: 'Tiền phòng ' + day + ' ngày',
                                value:day * priceSelection.price_day
                            };
                            totalMoney += (day * priceSelection.price_day);
                            arrayPrice.push(content);
                        }
                    } else {
                        const content = {
                            label: 'Tiền checkin theo tháng',
                            value: priceSelection.price_month
                        }
                        totalMoney += (priceSelection.price_month);
                        arrayPrice.push(content);
                    }
                    setRoomPrice(parseInt(totalMoney));
                    break;

                }
                default: {
                    let hours = Math.round(times / 3600);
                    let totalMoney = 0;
                    if (hours > 0) {
                        const content = {
                            label: 'Tiền phòng ' + hours + ' giờ',
                            value: hours * priceSelection.price_hour
                        };
                        totalMoney += (hours * priceSelection.price_hour);
                        arrayPrice.push(content);
                    } else {
                        const content = {
                            label: 'Tiền checkin theo giờ',
                            value: priceSelection.price_hour
                        }
                        totalMoney += (priceSelection.price_hour);
                        arrayPrice.push(content);
                    }
                    setRoomPrice(parseInt(totalMoney));
                    break;
                }
            }
        }
        setPriceData(arrayPrice);
    }, [priceSelection, priceType, customerSelection])

    useEffect(() => {
        if (Object.keys(rowSelection).length > 0) {
            const nData = data[Object.keys(rowSelection)[0]];
            if (nData) {
                dispatch(setBedID([nData.id]));
                setCustomerSelection(nData);
                setCheckinTime(dayjs(nData.bed_checkin));
                setCheckoutTime(dayjs(nData.bed_checkout));
                setIdBedType(nData.id_bed_type);
                setDeposit(nData.bed_deposit);
                setIdPaymentMethod(-1);
                axios.get(process.env.REACT_APP_BACKEND + 'api/price/getPriceByIDBedType?id=' + nData.id_bed_type, { withCredentials: true })
                    .then(function (response) {
                        setPriceSelect(response.data.result);
                        setIdPrice(nData.Bed_type.bed_type_default_price);
                    }).catch(function (error) {
                        if (error.response) {
                            toast.error(error.response.data.error_code);
                        }
                    });
                axios.get(process.env.REACT_APP_BACKEND + 'api/servicedetail/getServiceDetailByIDBed?id=' + nData.id, { withCredentials: true })
                    .then(function (response) {
                        setServiceData(response.data.result);
                        let price = 0;
                        for (let i = 0; i < response.data.result.length; i++) {
                            price +=parseInt( response.data.result[i].total_price);
                        }
                        setServicePrice(parseInt(price));
                    }).catch(function (error) {
                        if (error.response) {
                            toast.error(error.response.data.error_code);
                        }
                    })
            } else {
                setRowSelection({});
            }
        } else {
            setIdPaymentMethod(-1);
            setDeposit(0);
            setTotalPrice(0);
            setServiceData([]);
            setCustomerSelection(null)
            dispatch(setBedID([]));
        }
    }, [rowSelection, data, dispatch])

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/bedtype/getAll', { withCredentials: true })
            .then(function (response) {
                setBedTypeSelect(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            });
        axios.get(process.env.REACT_APP_BACKEND + 'api/service/getAll', { withCredentials: true })
            .then(function (response) {
                setServiceSelect(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
        axios.get(process.env.REACT_APP_BACKEND + 'api/paymentmethod/getAll', { withCredentials: true })
            .then(function (reponse) {
                setPaymentMethodSelect(reponse.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }, [unchange]);

    useEffect(() => {
        if (idService !== -1 && serviceSelect.length > 0) {
            serviceSelect.forEach((value) => {
                if (idService === value.id)
                    setServiceSelection(value);
            })
        }
    }, [idService, serviceSelect])

    useEffect(() => {
        setTotalPrice(roomPrice + servicePrice);
    }, [roomPrice, servicePrice])

    useEffect(()=>{
        if(idPaymentMethod===-1){
            setPaymentMethodSelection(null);
        }else{
            paymentMethodSelect.forEach((value,key)=>{
                if(value.id===idPaymentMethod)
                {
                    setPaymentMethodSelection(value)
                }
            })
        }
    },[idPaymentMethod,paymentMethodSelect])

    const onHandleUpdate = () => {
        if (customerSelection) {
            axios.post(process.env.REACT_APP_BACKEND + 'api/bed/updateBed', {
                id: customerSelection.id,
                id_bed_type: idBedType,
                bed_checkin: checkinTime,
                bed_checkout: checkoutTime,
                bed_deposit: deposit,
            }, { withCredentials: true })
                .then(function (response) {
                    dispatch(setRoomUpdateSuccess());
                    setRowSelection({});
                    toast.success("Cập nhật thành công");
                }).catch(function (error) {
                    console.log(error);
                    if (error.response) {
                        toast.error(error.response.data.result);
                    }
                })
        }
    }

    const onHandleAddService = () => {
        if (customerSelection && !isNaN(serviceQuantity) && serviceQuantity > 0 && serviceSelection) {
            const price = serviceQuantity * serviceSelection.service_price;
            axios.post(process.env.REACT_APP_BACKEND + 'api/servicedetail/insertServiceDetail', {
                id_bed: customerSelection.id,
                id_service: idService,
                quantity: serviceQuantity,
                price: price,
            }, { withCredentials: true })
                .then(function (response) {
                    setServiceData([...serviceData,
                    {
                        Service: { service_name: serviceSelection.service_name },
                        service_quantity: serviceQuantity,
                        total_price: price,
                        id: response.data.result.id,
                    }])
                    setServicePrice(parseInt(servicePrice)+parseInt(price));
                    toast.success('Thêm thành công');
                    dispatch(setRoomUpdateSuccess());
                }).catch(function (error) {
                    console.log(error);
                    if (error.response) {
                        toast.error(error.response.data.result);
                    }
                })
        }
    }

    const onHandleDeleteService = (id) => {
        axios.post(process.env.REACT_APP_BACKEND + 'api/servicedetail/deleteServiceDetail', {
            id: id
        }, { withCredentials: true })
            .then(function (response) {
                setServiceData((current) => current.filter((service) => service.id !== id));
                dispatch(setRoomUpdateSuccess());
                toast.success('Xoá dịch vụ thành công');
            }).catch(function (error) {
                console.log(error);
                if (error.response) {
                    toast.error(error.response.data.result);
                }
            })
    }

    const onHandlePayment=()=>{
        dispatch(setRoomPriceTable(priceData));
        dispatch(setServicePriceTable(serviceData));
        dispatch(setOpenModalSinglePayment(true));
        dispatch(setPaymentMethod(paymentMethodSelection));
        dispatch(setPaymentInfor({totalPrice,deposit}));
    }


    return (<Modal show={floorFeature.openModalCheckOut} onClose={() => dispatch(setOpenModalCheckOut(false))}
        size="7xl">
        <Modal.Body>
            <IconContext.Provider value={{ size: "30px" }}>
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
                                localization={MRT_Localization_VI}
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
                                <legend className="text-blue-800 font-bold">Thông tin đặt giường</legend>
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
                            <fieldset style={{ border: "2px solid #E5E7EB" }}>
                                <legend className="text-blue-800 font-bold">Thông tin thanh toán</legend>
                                <div className="grid grid-cols-2">
                                    <div className="pl-2">
                                        <p>Tổng tiền: <strong>{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</strong></p>
                                        <p>Trả trước: <strong>{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(deposit)}</strong></p>
                                        <p>Thành tiền: <strong>{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(totalPrice - deposit)}</strong></p>

                                    </div>
                                    <div>
                                        <Text fullWidth label="Phương thức thanh toán" sx={{width:'90%'}} size="small" select value={idPaymentMethod} onChange={(e) => setIdPaymentMethod(e.target.value)}
                                        disabled={!customerSelection}>
                                            <MenuItem value={-1} disabled>Chọn phương thức</MenuItem>
                                            {paymentMethodSelect.map((value, key) => <MenuItem value={value.id} key={key}>{value.payment_method_name}</MenuItem>)}
                                        </Text>
                                    </div>
                                </div>

                            </fieldset>
                        </div>
                        <div className="pt-3 w-full">
                            <Button color="blue" className="float-end ml-2 " disabled={!customerSelection||!paymentMethodSelection}
                                onClick={() => onHandlePayment()}>Thanh toán</Button>
                            <Button color="success" className="float-end ml-2" disabled={!customerSelection}
                                onClick={() => dispatch(setOpenModalChangeRoom(true))}>Chuyển phòng</Button>
                            <Button color="gray" className="float-end ml-2" onClick={() => dispatch(setOpenModalCheckOut(false))}>Huỷ</Button>
                        </div>
                    </div>
                    <div className="w-full pl-2">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <fieldset style={{ border: "2px solid #E5E7EB", marginBottom: '5px' }}>
                                <legend className="text-blue-800 font-bold">Cập nhật thông tin đặt giường</legend>
                                <div className="grid grid-cols-2 p-2">
                                    <div className="py-1">
                                        <Text label="Loại giường" sx={{ width: "95%" }} select disabled={!customerSelection}
                                            value={idBedType} onChange={(e) => setIdBedType(e.target.value)} size="small">
                                            <MenuItem value={-1} disabled>Chọn loại giường</MenuItem>
                                            {bedTypeSelect.map((value, key) => <MenuItem value={value.id} key={key}>{value.bed_type_name}</MenuItem>)}
                                        </Text>
                                    </div>
                                    <div className="p-1">
                                        <Text label="Tiền đặt cọc" size="small" type="number" sx={{ display: 'float', float: 'left', width: '80%' }}
                                            disabled={!customerSelection} value={deposit} onChange={(e) => setDeposit(e.target.value)} />
                                        <Tooltip title="Lưu" color="blue">
                                            <div className="float-left">
                                                <IconButton color="primary" disabled={!customerSelection}
                                                    onClick={() => onHandleUpdate()}>
                                                    <FaArrowCircleDown />
                                                </IconButton>
                                            </div>
                                        </Tooltip>
                                    </div>
                                    <DateTime label="Ngày checkin" sx={{ width: "95%" }} value={checkinTime}
                                        onChange={(value) => setCheckinTime(value)} format="DD/MM/YYYY hh:mm A" disabled={!customerSelection} />
                                    <DateTime label="Ngày checkout" sx={{ width: "95%" }} value={checkoutTime}
                                        onChange={(value) => setCheckoutTime(value)} format="DD/MM/YYYY hh:mm A" disabled={!customerSelection} />
                                </div>
                            </fieldset>
                        </LocalizationProvider>
                        <fieldset style={{ border: "2px solid #E5E7EB", marginBottom: '5px' }}>
                            <legend className="text-blue-800 font-bold">Thông tin tiền giường</legend>
                            <div className="grid grid-cols-3">
                                <div className="text-end p-2">
                                    Tính tiền theo:
                                </div>
                                <Text label="Đơn giá" select size="small" sx={{ width: '95%' }} disabled={!customerSelection}
                                    value={idPrice} onChange={(e) => { setIdPrice(e.target.value); }}>
                                    <MenuItem value={-1} disabled>Chọn đơn giá</MenuItem>
                                    {
                                        priceSelect.map((value, key) => <MenuItem key={key} value={value.id}>{value.price_name}</MenuItem>)
                                    }
                                </Text>
                                <Text label="Phân loại" select size="small" sx={{ width: '95%' }} defaultValue={0} disabled={!customerSelection}
                                    value={priceType} onChange={(e) => setPriceType(e.target.value)}>
                                    <MenuItem value={0}>Theo giờ</MenuItem>
                                    <MenuItem value={1}>Theo ngày</MenuItem>
                                    <MenuItem value={2}>Theo tuần</MenuItem>
                                    <MenuItem value={3}>Theo tháng</MenuItem>
                                </Text>
                            </div>
                            <div className="w-full h-36 overflow-y-scroll">
                                <MaterialReactTable
                                    data={priceData}
                                    columns={priceColumns}
                                    enableBottomToolbar={false}
                                    enableTopToolbar={false}
                                    enableColumnActions={false}
                                />
                            </div>
                        </fieldset>
                        <fieldset style={{ border: "2px solid #E5E7EB" }}>
                            <legend className="text-blue-800 font-bold">Thông tin dịch vụ</legend>
                            <div className="grid grid-cols-5">
                                <div className="text-end p-2">
                                    Dịch vụ:
                                </div>
                                <div className="col-span-2">
                                    <Text label="Dịch vụ" size="small" select sx={{ width: '95%' }} value={idService}
                                        onChange={(e) => setIdService(e.target.value)} disabled={!customerSelection}>
                                        <MenuItem value={-1} disabled>Chọn dịch vụ</MenuItem>
                                        {serviceSelect.map((value, key) => <MenuItem value={value.id} key={key}>{value.service_name}</MenuItem>)}
                                    </Text>
                                </div>

                                <Text label="Số lượng" type="number" size="small" sx={{ width: '95%' }} disabled={!customerSelection}
                                    value={serviceQuantity} onChange={(e) => setServiceQuantity(e.target.value)} />
                                <div className="text-start px-5">
                                    <IconButton color="success" disabled={!customerSelection} onClick={() => onHandleAddService()}>
                                        <FaPlusCircle />
                                    </IconButton>
                                </div>
                            </div>
                            <div className="w-full h-40 overflow-y-scroll">
                                <MaterialReactTable
                                    data={serviceData}
                                    columns={serviceColumns}
                                    enableBottomToolbar={false}
                                    enableTopToolbar={false}
                                    enableRowActions
                                    positionActionsColumn="last"
                                    localization={MRT_Localization_VI}
                                    enableColumnActions={false}
                                    renderRowActions={({ row, table }) => (
                                        <IconButton color="error"
                                            title="Xoá hàng hoá" onClick={() => onHandleDeleteService(row.original.id)}>
                                            <Delete />
                                        </IconButton>
                                    )}
                                />
                            </div>
                        </fieldset>
                    </div>
                </div>
            </IconContext.Provider>
        </Modal.Body >
    </Modal >);
}