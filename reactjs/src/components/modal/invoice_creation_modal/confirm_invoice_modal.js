import { Close } from "@mui/icons-material";
import { Box, Button, IconButton, MenuItem, TextField } from "@mui/material";
import { Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenConfirmInvoiceCreationModal } from "../../../redux_features/invoiceCreationFeature";
import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import axios from "axios";
import { setBedID, setInvoiceDiscount, setOpenModalSinglePayment, setPaymentInfor, setPaymentMethod, setPriceID, setRoomPriceTable, setServicePriceTable } from "../../../redux_features/floorFeature";
import { toast } from "react-toastify";

export default function ConfirmInvoiceModal() {

    const invoiceCreationFeature = useSelector(state => state.invoice_creation);
    const floorFeature=useSelector(state=>state.floor);
    const dispatch = useDispatch();

    const [paymentMethodList, setPaymentMethodList] = useState([]);

    const [invoiceInformation, setInvoiceInformation] = useState(null);

    const [bedData, setBedData] = useState([]);
    const [priceData, setPriceData] = useState([]);
    const [serviceData, setServiceData] = useState([]);

    const [roomPrice, setRoomPrice] = useState(0);
    const [servicePrice, setServicePrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [deposit, setDeposit] = useState(0);

    const [priceType, setPriceType] = useState(1);

    const [idPaymentMethod, setIdPaymentMethod] = useState(-1);
    const [paymentMethodSelection, setPaymentMethodSelection] = useState(null);


    const bedColumns = useMemo(() => [
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
        {
            accessorKey: 'bed_checkin',
            header: 'Checkin',
            Cell: ({ table, row }) => (<Box>
                {new Date(row.original.bed_checkin).toLocaleString()}
            </Box>)
        },
        {
            accessorKey: 'bed_checkout',
            header: 'Checkout',
            Cell: ({ table, row }) => (<Box>
                {new Date(row.original.bed_checkout).toLocaleString()}
            </Box>)
        }
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
    ], []);

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
        setPriceData([]);
        setServiceData([]);
        setBedData([]);
        setDeposit(0);
        setTotalPrice(0);
        if (invoiceCreationFeature.openConfirmInvoiceCreationModal) {
            setBedData(invoiceCreationFeature.bedSelectionList);
            dispatch(setInvoiceDiscount(0));
            axios.get(process.env.REACT_APP_BACKEND + 'api/paymentmethod/getAll', { withCredentials: true })
                .then(function (reponse) {
                    setPaymentMethodList(reponse.data.result);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error("Lỗi lấy dữ liệu phương thức thanh toán: " + error.response.data.error_code);
                    }
                })
        }
    }, [invoiceCreationFeature.openConfirmInvoiceCreationModal, invoiceCreationFeature.bedSelectionList, dispatch])

    useEffect(() => {
        if (bedData.length > 0) {
            setInvoiceInformation(bedData[0]);
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
            setInvoiceInformation(null);
        }
    }, [bedData, dispatch]);

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
                            totalMoney += parseInt(bedData[i].Price.price_hour);
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
                        console.log(bedData[i])
                        const checkin = new Date(bedData[i].bed_checkin);
                        const checkout = new Date(bedData[i].bed_checkout);
                        let days = (Math.round((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24))) + 1;
                        let hours = checkout.getHours() - 12;
                        let totalMoney = 0;
                        if (hours > 0) {
                            totalMoney += parseInt(bedData[i].Price.price_hour);
                        }
                        if (days > 0) {
                            totalMoney += days * parseInt(bedData[i].Price.price_day);
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
            }
        }
    }, [bedData, priceType])


    useEffect(() => {
        setTotalPrice(servicePrice + roomPrice);
    }, [servicePrice, roomPrice])

    useEffect(() => {
        if (idPaymentMethod === -1) {
            setPaymentMethodSelection(null);
        } else {
            for (let i = 0; i < paymentMethodList.length; i++)
                if (paymentMethodList[i].id === idPaymentMethod) {
                    setPaymentMethodSelection(paymentMethodList[i]);
                    break;
                }
        }
    }, [idPaymentMethod, paymentMethodList])

    const onHandlePayment = (e) => {
        if (paymentMethodSelection !== -1 && priceData.length > 0) {
            dispatch(setOpenModalSinglePayment(true));
            dispatch(setPaymentMethod(paymentMethodSelection));
            dispatch(setRoomPriceTable(priceData));
            dispatch(setServicePriceTable(serviceData));
            dispatch(setPaymentInfor({ totalPrice, deposit }));
            dispatch(setPriceID(-1));
            dispatch(setOpenConfirmInvoiceCreationModal(false));
        }
    }


    return (
        <Modal show={invoiceCreationFeature.openConfirmInvoiceCreationModal} className="relative" size="7xl">
            <Modal.Body>
                <div className="absolute top-1 right-2">
                    <IconButton onClick={() => dispatch(setOpenConfirmInvoiceCreationModal(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2">
                    <div className="px-2">
                        <fieldset style={{ border: "2px solid #E5E7EB" }}>
                            <legend className="text-blue-800 font-bold">Thông tin đại diện</legend>
                            <div className="grid lg:grid-cols-2 grid-cols-1 ">
                                <div className="pl-2">
                                    <p>Mã giường: <strong>{invoiceInformation?.id}</strong> </p>
                                    <p>Khách hàng: <strong>{invoiceInformation?.Customer.customer_name}</strong> </p>
                                    <p>CMND/CCCD: <strong>{invoiceInformation?.Customer.customer_identification}</strong></p>
                                </div><div className="pl-2">
                                    <p>Loại giường: <strong>{invoiceInformation?.Bed_type?.bed_type_name}</strong></p>
                                    <p>Ngày checkin: <strong>{invoiceInformation ? new Date(invoiceInformation.bed_checkin).toLocaleString() : ''}</strong> </p>
                                    <p>Ngày checkout: <strong>{invoiceInformation ? new Date(invoiceInformation.bed_checkout).toLocaleString() : ''}</strong> </p>
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
                                    <TextField fullWidth label="Giảm giá" size="small" sx={{ width: '90%', marginBottom: '10px' }} value={floorFeature.invoice_discount}
                                        type="number" onChange={(e) => {
                                            dispatch(setInvoiceDiscount(e.target.value))
                                        }} />
                                    <TextField fullWidth label="Phương thức thanh toán" size="small" select sx={{ width: '90%' }}
                                        value={idPaymentMethod} onChange={(e) => setIdPaymentMethod(e.target.value)} disabled={bedData.length === 0}>
                                        <MenuItem value={-1} disabled>Chọn phương thức</MenuItem>
                                        {paymentMethodList.map((value, key) => <MenuItem value={value.id} key={key}>{value.payment_method_name}</MenuItem>)}
                                    </TextField>
                                </div>
                            </div>
                        </fieldset>
                        <div className="pt-3 w-full flex flex-row-reverse gap-4">
                            <Button color="primary" variant="contained" onClick={onHandlePayment} disabled={idPaymentMethod===-1}>Thanh toán</Button>
                            <Button color="inherit" variant="outlined" onClick={() => dispatch(setOpenConfirmInvoiceCreationModal(false))}>Huỷ</Button>
                        </div>
                    </div>
                    <div className="px-2">
                        <div className="border-2 h-40 overflow-auto w-full">
                            <label className="relative left-2 bg-white inline-block font-bold text-blue-800 px-2">Danh sách thanh toán</label>
                            <MaterialReactTable
                                data={bedData}
                                columns={bedColumns}
                                enableTopToolbar={false}
                                enableBottomToolbar={false}
                                localization={MRT_Localization_VI}
                            />
                        </div>
                        <div className="border-2 h-50 w-full mt-2">
                            <label className="relative left-2 bg-white inline-block font-bold text-blue-800 px-2">Thông tin tiền giường</label>
                            <div className="grid grid-cols-2">
                                <div className="text-end p-2">
                                    Tính tiền theo:
                                </div>
                                <TextField label="Phân loại" select size="small" sx={{ width: '95%' }} value={priceType}
                                    onChange={(e) => setPriceType(e.target.value)}>
                                    <MenuItem value={0}>Nghỉ trưa</MenuItem>
                                    <MenuItem value={1}>Theo ngày</MenuItem>
                                </TextField>
                            </div>
                            <MaterialReactTable
                                data={priceData}
                                columns={priceColumns}
                                enableTopToolbar={false}
                                enableBottomToolbar={false}
                                localization={MRT_Localization_VI}
                            />
                        </div>
                        <div className="border-2 h-44 overflow-auto w-full mt-2">
                            <label className="relative left-2 bg-white inline-block font-bold text-blue-800 px-2">Dịch vụ sử dụng</label>
                            <MaterialReactTable
                                data={serviceData}
                                columns={serviceColumns}
                                enableTopToolbar={false}
                                enableBottomToolbar={false}
                                localization={MRT_Localization_VI}
                            />
                        </div>
                    </div>
                </div>

            </Modal.Body>
        </Modal>
    );
}