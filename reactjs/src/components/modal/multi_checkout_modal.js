import { Button, Modal } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBedID, setInvoiceDiscount, setOpenModalMultiCheckOut, setOpenModalSinglePayment, setPaymentInfor, setPaymentMethod, setRoomPriceTable, setServicePriceTable } from "../../redux_features/floorFeature";
import { Box, IconButton, MenuItem, TextField, Tooltip, styled } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { IconContext } from "react-icons";
import { FaPlusCircle } from "react-icons/fa";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import { Close, Delete } from "@mui/icons-material";

const Text = styled(TextField)(({ theme }) => ({
    'input:focus': {
        '--tw-ring-shadow': 'none'
    },
}));

export default function MultiCheckoutModal() {

    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);

    const [roomSelectBox, setRoomSelectBox] = useState([]);
    const [paymentMethodSelectBox, setPaymentMethodSelectBox] = useState([]);
    const [roomData, setRoomData] = useState([]);
    const [bedData, setBedData] = useState([]);
    const [priceData, setPriceData] = useState([]);
    const [serviceData, setServiceData] = useState([]);

    const [priceType, setPriceType] = useState(1);
    const [roomID, setRoomID] = useState(-1);
    const [bedSelection, setBedSelection] = useState(null);
    const [rowSelection, setRowSelection] = useState({});

    const [idPaymentMethod, setIdPaymentMethod] = useState(-1);
    const [paymentMethodSelection, setPaymentMethodSelection] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [servicePrice, setServicePrice] = useState(0);
    const [roomPrice, setRoomPrice] = useState(0);
    const [deposit, setDeposit] = useState(0);

    const roomColums = useMemo(() => [
        {
            accessorKey: 'Customer.customer_identification',
            header: 'CMND/CCCD',
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
    ], [])

    const bedColums = useMemo(() => [
        {
            accessorKey: 'Room.room_name',
            header: 'Phòng',
            size: '10'
        },
        {
            accessorKey: 'id',
            header: 'Mã giường',
            size: '10'
        },
        {
            accessorKey: 'Customer.customer_name',
            header: 'Tên khách hàng',
            size: '50'
        },
    ], [])

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
    ], [])

    const serviceColumns = useMemo(() => [
        {
            accessorKey: 'Service.service_name',
            header: 'Nội dung',
            size: '30'
        },
        {
            header: 'Số lượng',
            size: '5',
            Cell: ({ renderValue, row }) => (
                <center>
                    {row.original.service_quantity}
                </center>
            ),
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
        setRoomID(-1);
        setRoomData([]);
        setBedData([]);
        setPriceData([]);
        setServiceData([]);
        setDeposit(0);
        setTotalPrice(0);
        if (floorFeature.openModalMultiCheckOut) {
            dispatch(setInvoiceDiscount(0));
            axios.get(process.env.REACT_APP_BACKEND + 'api/paymentmethod/getAll', { withCredentials: true })
                .then(function (reponse) {
                    setPaymentMethodSelectBox(reponse.data.result);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error("Lỗi lấy dữ liệu phương thức thanh toán: " + error.response.data.error_code);
                    }
                })
        }
        if (floorFeature.areaID !== -1) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/room/getRoomInUsed?id=' + floorFeature.areaID, { withCredentials: true })
                .then(function (response) {
                    setRoomSelectBox(response.data.result);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error("Lỗi lấy dữ liệu phòng: " + error.response.data.error_code);
                    }
                })
        }
    }, [floorFeature.areaID, floorFeature.roomUpdateSuccess, floorFeature.openModalMultiCheckOut, dispatch])



    useEffect(() => {
        if (idPaymentMethod === -1) {
            setPaymentMethodSelection(null);
        } else {
            paymentMethodSelectBox.forEach((value, key) => {
                if (value.id === idPaymentMethod) {
                    setPaymentMethodSelection(value)
                }
            })
        }
    }, [idPaymentMethod, paymentMethodSelectBox])

    useEffect(() => {
        setTotalPrice(servicePrice + roomPrice);
    }, [servicePrice, roomPrice])



    useEffect(() => {
        if (bedData.length > 0) {
            switch (priceType) {
                default: {
                    let priceArray = [];
                    let total_price = 0;
                    for (let i = 0; i < bedData.length; i++) {
                        const checkin = new Date(bedData[i].bed_checkin);
                        const checkout = new Date(bedData[i].bed_checkout);
                        const times = (checkout.getTime() - checkin.getTime()) / 1000;
                        let hours = Math.round(times / 3600);
                        let totalMoney = 0;
                        if (hours < 5) {
                            totalMoney += parseInt(bedData[i].Bed_type.Price.price_hour);
                        } else {
                            toast.error('Giường ' + bedData[i].id + ' quá số giờ nghỉ trưa');
                            break;
                        }
                        priceArray.push({
                            label: 'Tiền (nghỉ trưa) giường ' + bedData[i].id + ' ' + bedData[i].Room.room_name,
                            value: totalMoney
                        })
                        total_price += totalMoney;
                    }
                    setRoomPrice(total_price);
                    setPriceData(priceArray);
                    break;
                }
                case 1: {
                    let priceArray = [];
                    let total_price = 0;
                    for (let i = 0; i < bedData.length; i++) {
                        const checkin = new Date(bedData[i].bed_checkin);
                        const checkout = new Date(bedData[i].bed_checkout);
                        let days = (Math.round((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24))) + 1;
                        let hours = checkout.getHours() - 12;
                        let totalMoney = 0;
                        if (hours > 0) {
                            totalMoney += parseInt(bedData[i].Bed_type.Price.price_hour);
                        }
                        if (days > 0) {
                            totalMoney += days * parseInt(bedData[i].Bed_type.Price.price_day);
                        }
                        priceArray.push({
                            label: 'Tiền (theo ngày) giường ' + bedData[i].id + ' ' + bedData[i].Room.room_name,
                            value: totalMoney
                        })
                        total_price += totalMoney;
                    }
                    setRoomPrice(total_price);
                    setPriceData(priceArray);
                    break;
                }
                case 2: {
                    let priceArray = [];
                    let total_price = 0;
                    for (let i = 0; i < bedData.length; i++) {
                        const checkin = new Date(bedData[i].bed_checkin);
                        const checkout = new Date(bedData[i].bed_checkout);
                        const times = (checkout.getTime() - checkin.getTime()) / 1000;
                        let weeks = Math.floor(times / (3600 * 24 * 7));
                        let days = Math.round((times - (weeks * 3600 * 24 * 7)) / (3600 * 24));
                        let totalMoney = 0;
                        if (weeks > 0) {
                            totalMoney += weeks * parseInt(bedData[i].Bed_type.Price.price_week);
                            if (days > 0) {
                                totalMoney += days * parseInt(bedData[i].Bed_type.Price.price_day);
                            }
                        } else {
                            totalMoney += parseInt(bedData[i].Bed_type.Price.price_week);
                        }
                        priceArray.push({
                            label: 'Tiền (theo tuần) giường ' + bedData[i].id + ' ' + bedData[i].Room.room_name,
                            value: totalMoney
                        })
                        total_price += totalMoney;
                    }
                    setRoomPrice(total_price);
                    setPriceData(priceArray);
                    break;
                }
                case 3: {
                    let priceArray = [];
                    let total_price = 0;
                    for (let i = 0; i < bedData.length; i++) {
                        const checkin = new Date(bedData[i].bed_checkin);
                        const checkout = new Date(bedData[i].bed_checkout);
                        const times = (checkout.getTime() - checkin.getTime()) / 1000;
                        let months = Math.floor(times / (3600 * 24 * 30))
                        let weeks = Math.floor((times - (months * 3600 * 24 * 30)) / (3600 * 24 * 7));
                        let days = Math.round((times - (weeks * 3600 * 24 * 7) - (months * 3600 * 24 * 30)) / (3600 * 24));
                        let totalMoney = 0;
                        if (months > 0) {
                            totalMoney += months * parseInt(bedData[i].Bed_type.Price.price_month);
                            if (weeks > 0) {
                                totalMoney += weeks * parseInt(bedData[i].Bed_type.Price.price_week);
                            }
                            if (days > 0) {
                                totalMoney += days * parseInt(bedData[i].Bed_type.Price.price_day);
                            }

                        } else {
                            totalMoney += parseInt(bedData[i].Bed_type.Price.price_month);
                        }
                        priceArray.push({
                            label: 'Tiền (theo tháng) giường ' + bedData[i].id + ' ' + bedData[i].Room.room_name,
                            value: totalMoney
                        })
                        total_price += totalMoney;
                    }
                    setRoomPrice(total_price);
                    setPriceData(priceArray);
                    break;
                }
            }
        }
    }, [bedData, priceType])

    useEffect(() => {
        if (roomID !== -1) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/bed/getBedInRoom?id=' + roomID, { withCredentials: true })
                .then(function (response) {
                    setRoomData(response.data.result);
                }).catch(function (error) {
                    toast.error("Lấy thông tin giường: " + error.response.data.error_code)
                })
        }
        setRowSelection({});
    }, [roomID])

    useEffect(() => {
        if (bedData.length > 0) {
            setBedSelection(bedData[0]);
            let array = [];
            let service_price = 0;
            let depos = 0;
            let bedid = [];
            for (let i = 0; i < bedData.length; i++) {
                axios.get(process.env.REACT_APP_BACKEND + 'api/servicedetail/getServiceDetailByIDBed?id=' + bedData[i].id, { withCredentials: true })
                    // eslint-disable-next-line
                    .then(function (response) {
                        const data = response.data.result;
                        for (let j = 0; j < data.length; j++) {
                            array.push({
                                Service: { service_name: bedData[i].Room.room_name + " " + data[j].Service.service_name },
                                service_quantity: data[j].service_quantity,
                                total_price: data[j].total_price
                            })
                            service_price += parseInt(data[j].total_price);
                            if (i === bedData.length - 1) {
                                setServiceData(array);
                                setServicePrice(service_price);
                            }
                        }
                    }).catch(function (error) {
                        if (error.response) {
                            toast.error("Lỗi lấy dữ liệu chi tiết dịch vụ: " + error.response.data.error_code);
                        }
                    })
                depos += parseInt(bedData[i].bed_deposit);
                bedid.push(bedData[i].id);
            }
            dispatch(setBedID(bedid));
            setDeposit(depos);
        } else {
            dispatch(setBedID([]));
            setBedSelection(null);
        }
    }, [bedData, dispatch])

    const onHandleAddBed = () => {
        const arrayKey = Object.keys(rowSelection);
        if (arrayKey.length > 0) {
            let newArray = [];
            for (let i = 0; i < arrayKey.length; i++) {
                if (bedData.length === 0) {
                    newArray.push(roomData[arrayKey[i]]);
                } else {
                    let count = 0;
                    for (let j = 0; j < bedData.length; j++) {
                        if (roomData[arrayKey[i]].id !== bedData[j].id) {
                            count += 1;
                        }
                    }
                    if (count === bedData.length) {
                        newArray.push(roomData[arrayKey[i]]);
                    }
                }
            }
            setBedData([...bedData, ...newArray]);
        }
        setRowSelection({});
    }

    const onHandleDeleteBed = (id) => {
        setBedData(current => current.filter((bed) => bed.id !== id));
    }

    const onHandlePayment = () => {
        if (paymentMethodSelection !== -1 && priceData.length > 0) {
            dispatch(setOpenModalSinglePayment(true));
            dispatch(setPaymentMethod(paymentMethodSelection));
            dispatch(setRoomPriceTable(priceData));
            dispatch(setServicePriceTable(serviceData));
            dispatch(setPaymentInfor({ totalPrice, deposit }));
        }
    }

    return (
        <Modal show={floorFeature.openModalMultiCheckOut && floorFeature.areaID !== -1}
            onClose={() => dispatch(setOpenModalMultiCheckOut(false))} size="7xl" className="relative">
            <Modal.Body>
                <div className="absolute top-0 right-4">
                    <IconButton onClick={() => dispatch(setOpenModalMultiCheckOut(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2">
                    <div className="px-2">
                        <div className="w-full grid grid-cols-3">
                            <Text label=" Chọn phòng" fullWidth size="small" select onChange={(e) => setRoomID(e.target.value)} value={roomID}>
                                <MenuItem value={-1} disabled>Chọn phòng</MenuItem>
                                {roomSelectBox.map((value, key) => <MenuItem value={value.id} key={key}>{value.room_name}</MenuItem>)}
                            </Text>
                            <div className="col-start-3 text-end">
                                <IconContext.Provider value={{ size: '30px' }}>
                                    <Tooltip title="Thêm vào hoá đơn" color="primary">
                                        <div>
                                            <IconButton disabled={Object.keys(rowSelection).length <= 0}
                                                onClick={() => onHandleAddBed()} color="primary">
                                                <FaPlusCircle />
                                            </IconButton>
                                        </div>
                                    </Tooltip>
                                </IconContext.Provider>
                            </div>
                        </div>
                        <div className="w-full h-40 overflow-y-scroll">
                            <MaterialReactTable
                                data={roomData}
                                columns={roomColums}
                                enableBottomToolbar={false}
                                enableTopToolbar={false}
                                localization={MRT_Localization_VI}
                                enableRowSelection={true}
                                enableColumnActions={false}
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
                        <fieldset style={{ border: "2px solid #E5E7EB" }}>
                            <legend className="text-blue-800 font-bold">Thông tin đại diện</legend>
                            <div className="grid lg:grid-cols-2 grid-cols-1 ">
                                <div className="pl-2">
                                    <p>Mã giường: <strong>{bedSelection ? bedSelection.id : ''}</strong> </p>
                                    <p>Khách hàng: <strong>{bedSelection ? bedSelection.Customer.customer_name : ''}</strong> </p>
                                    <p>CMND/CCCD: <strong>{bedSelection ? bedSelection.Customer.customer_identification : ''}</strong></p>
                                </div><div className="pl-2">
                                    <p>Loại giường: <strong>{bedSelection ? bedSelection.Bed_type.bed_type_name : ''}</strong></p>
                                    <p>Ngày checkin: <strong>{bedSelection ? new Date(bedSelection.bed_checkin).toLocaleString() : ''}</strong> </p>
                                    <p>Ngày checkout: <strong>{bedSelection ? new Date(bedSelection.bed_checkout).toLocaleString() : ''}</strong> </p>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset style={{ border: "2px solid #E5E7EB" }}>
                            <legend className="text-blue-800 font-bold">Thông tin thanh toán</legend>
                            <div className="grid lg:grid-cols-2 grid-cols-1 ">
                                <div className="pl-2">
                                    <p>Tổng tiền: <strong>{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</strong></p>
                                    <p>Trả trước: <strong>{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(deposit)}</strong></p>
                                    <p>Thành tiền: <strong>{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(totalPrice - deposit)}</strong></p>
                                </div>
                                <div className="p-2">
                                    <Text fullWidth label="Giảm giá" size="small" sx={{ width: '90%', marginBottom: '10px' }} value={floorFeature.invoice_discount}
                                        type="number" onChange={(e) => {
                                            dispatch(setInvoiceDiscount(e.target.value))
                                        }} />
                                    <Text fullWidth label="Phương thức thanh toán" size="small" select sx={{ width: '90%' }}
                                        value={idPaymentMethod} onChange={(e) => setIdPaymentMethod(e.target.value)} disabled={bedData.length === 0}>
                                        <MenuItem value={-1} disabled>Chọn phương thức</MenuItem>
                                        {paymentMethodSelectBox.map((value, key) => <MenuItem value={value.id} key={key}>{value.payment_method_name}</MenuItem>)}
                                    </Text>
                                </div>
                            </div>
                        </fieldset>
                        <div className="pt-3 w-full flex flex-row-reverse gap-4">
                            <Button color="blue" onClick={() => onHandlePayment()} disabled={bedData.length < 2 || idPaymentMethod === -1 || priceData.length === 0}>Thanh toán</Button>
                            <Button color="gray" onClick={() => dispatch(setOpenModalMultiCheckOut(false))}>Huỷ</Button>
                        </div>
                    </div>
                    <div className="px-2">
                        <fieldset style={{ border: "2px solid #E5E7EB" }}>
                            <legend className="text-blue-800 font-bold">Khách đã chọn</legend>
                            <div className="mt-1 w-full h-40 overflow-y-scroll">
                                <MaterialReactTable
                                    data={bedData}
                                    columns={bedColums}
                                    enableBottomToolbar={false}
                                    enableTopToolbar={false}
                                    localization={MRT_Localization_VI}
                                    enableRowActions
                                    enableColumnActions={false}
                                    positionActionsColumn="last"
                                    renderRowActions={({ row, table }) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                                            <IconButton color="error" onClick={() => onHandleDeleteBed(row.original.id)}
                                                title="Xoá khách hàng">
                                                <Delete />
                                            </IconButton>
                                        </Box>

                                    )}
                                />
                            </div>
                        </fieldset>
                        <fieldset style={{ border: "2px solid #E5E7EB", marginBottom: '5px' }}>
                            <legend className="text-blue-800 font-bold">Thông tin tiền giường</legend>
                            <div >
                                <div className="grid grid-cols-2">
                                    <div className="text-end p-2">
                                        Tính tiền theo:
                                    </div>
                                    <Text label="Phân loại" select size="small" sx={{ width: '95%' }} value={priceType}
                                        onChange={(e) => setPriceType(e.target.value)} disabled={bedData.length === 0}>
                                        <MenuItem value={0}>Nghỉ trưa</MenuItem>
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
                                        localization={MRT_Localization_VI}
                                    />
                                </div>
                            </div>
                        </fieldset>
                        <fieldset style={{ border: "2px solid #E5E7EB" }}>
                            <legend className="text-blue-800 font-bold">Thông tin dịch vụ</legend>
                            <div className="w-full h-40 overflow-y-scroll">
                                <MaterialReactTable
                                    data={serviceData}
                                    columns={serviceColumns}
                                    enableBottomToolbar={false}
                                    enableColumnActions={false}
                                    enableTopToolbar={false}
                                    localization={MRT_Localization_VI}

                                />
                            </div>
                        </fieldset>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}