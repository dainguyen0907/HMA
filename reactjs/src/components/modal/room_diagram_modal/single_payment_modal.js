
import { Button, Modal } from "flowbite-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalSinglePayment, setRoomUpdateSuccess } from "../../../redux_features/floorFeature";
import { toast } from "react-toastify";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import logo from "../../../assets/images/hepc-logo.png";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";


export default function SinglePayment() {
    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);
    const receptionFeature = useSelector(state => state.reception);
    const [priceData, setPriceData] = useState([]);

    const [deposit, setDeposit] = useState(0);
    const [invoiceCode, setInvoiceCode] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const [bedPrice, setBedPrice] = useState(0);
    const [servicePrice, setServicePrice] = useState(0);
    const [bedInfor, setBedInfor] = useState(null);
    const componentRef = useRef();




    useEffect(() => {
        let price = 0;
        for (let i = 0; i < floorFeature.roomPriceTable.length; i++) {
            price += floorFeature.roomPriceTable[i].value;
        }
        setBedPrice(parseInt(price));
    }, [floorFeature.roomPriceTable])

    useEffect(() => {
        let price = 0;
        for (let i = 0; i < floorFeature.servicePriceTable.length; i++) {
            price += parseInt(floorFeature.servicePriceTable[i].total_price);
        }
        setServicePrice(parseInt(price));
    }, [floorFeature.servicePriceTable])

    useEffect(() => {
        if (floorFeature.openModalSinglePayment) {
            const currentTime = new Date().toLocaleTimeString().split(':');
            const currentDate = new Date().toLocaleDateString('en-GB', { year: '2-digit', month: '2-digit', day: '2-digit' }).split('/');
            const code = 'HD' + currentDate[2] + currentDate[1] + currentDate[0] + currentTime[0] + currentTime[1] + currentTime[2];
            setInvoiceCode(code);
        }
    }, [floorFeature.openModalSinglePayment])

    useEffect(() => {
        let array = [];
        if (floorFeature.roomPriceTable.length > 0)
            for (let i = 0; i < floorFeature.roomPriceTable.length; i++) {
                const a = floorFeature.roomPriceTable[i];
                const value = {
                    label: a.label,
                    quantity: null,
                    value: a.value
                }
                array.push(value)
            }
        if (floorFeature.servicePriceTable.length > 0)
            for (let i = 0; i < floorFeature.servicePriceTable.length; i++) {
                const a = floorFeature.servicePriceTable[i];
                const value = {
                    label: a.Service.service_name,
                    quantity: a.service_quantity,
                    value: a.total_price
                }
                array.push(value)
            }
        setPriceData(array);

    }, [floorFeature.roomPriceTable, floorFeature.servicePriceTable])


    useEffect(() => {
        if (floorFeature.bedID.length > 0) {
            if (floorFeature.bedID[0] !== -1) {
                axios.get(process.env.REACT_APP_BACKEND + 'api/bed/getBedByID?id=' + floorFeature.bedID[0], { withCredentials: true })
                    .then(function (response) {
                        setBedInfor(response.data.result);
                        if (floorFeature.paymentInfor) {
                            setDeposit(floorFeature.paymentInfor.deposit);
                        }
                    }).catch(function (error) {
                        if (error.response) {
                            toast.error("Lỗi lây thông tin giường: " + error.response.data.error_code);
                        }
                    })
            }
        }
    }, [floorFeature.bedID, floorFeature.paymentInfor])



    useEffect(() => {
        setTotalPrice(servicePrice + bedPrice);
    }, [servicePrice, bedPrice])


    const onHandlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Hoá đơn',
        onBeforeGetContent: useCallback(() => { }, []),
        onBeforePrint: useCallback(() => { }, []),
        onAfterPrint: useCallback(() => { }, []),
        removeAfterPrint: true
    });

    const onHandleConfirm = () => {
        axios.post(process.env.REACT_APP_BACKEND + 'api/invoice/insertInvoice', {
            id_bed: floorFeature.bedID,
            id_payment: floorFeature.paymentMethod.id,
            id_customer: bedInfor.Customer.id,
            id_price: floorFeature.priceID,
            invoice_code: invoiceCode,
            invoice_discount: floorFeature.invoice_discount,
            reception: receptionFeature.reception_name,
            receipt_date: new Date(),
            payment_date: floorFeature.paymentMethod.id !== 3 ? new Date() : null,
            deposit: deposit,
            total_payment: totalPrice,
            note: null,
            detail: priceData
        }, { withCredentials: true })
            .then(function (response) {
                toast.success("Thanh toán thành công.")
                onHandlePrint();
                dispatch(setRoomUpdateSuccess());
                dispatch(setOpenModalSinglePayment(false));
            }).catch(function (error) {
                if (error.response) {
                    toast.error("Lỗi khởi tạo thông tin: " + error.response.data.error_code);
                }
            })
    }

    return (
        <Modal show={floorFeature.openModalSinglePayment} onClose={() => dispatch(setOpenModalSinglePayment(false))} size="lg">
            <Modal.Body>
                <div className="absolute top-3 right-4">
                    <IconButton onClick={() => dispatch(setOpenModalSinglePayment(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div ref={componentRef}>
                    <img src={logo} className="w-full" alt="Logo HEPC" />
                    <center><strong className="text-blue-700">PHIẾU THANH TOÁN</strong></center>
                    <center><small>Mã hoá đơn: {invoiceCode} </small></center>
                    <div className="pl-2 border-b-2 border-dashed">
                        <div className="grid grid-cols-2">
                            <div>Khách hàng:</div>
                            <div >{bedInfor ? bedInfor.Customer.customer_name : '\u00A0'}</div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>Phòng:</div>
                            <div >{bedInfor ? bedInfor.Room.room_name : '\u00A0'}</div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>Ngày lập phiếu:</div>
                            <div >{new Date().toLocaleString()}</div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>Ngày thanh toán:</div>
                            <div >{floorFeature.paymentMethod && floorFeature.paymentMethod.id !== 3 ? new Date().toLocaleString() : '\u00A0'}</div>
                        </div>
                    </div>
                    <div className=" p-2 border-b-2 border-dashed">
                        <div className="grid grid-cols-4">
                            <div className="col-start-2">
                                Đơn giá
                            </div>
                            <div>
                                Số lượng
                            </div>
                            <div>
                                Thành tiền
                            </div>
                        </div>
                        {priceData.map((value, key) =>
                            <div className="pl-2" key={key}>
                                <div className="font-semibold">- {value.label}</div>
                                <div className="grid grid-cols-4">
                                    <div className="col-start-2">
                                        {value.quantity > 0 ? Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(value.value) / parseFloat(value.quantity))
                                            : Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value.value)}
                                    </div>
                                    <div>
                                        {value.quantity}
                                    </div>
                                    <div>
                                        {Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value.value)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="px-2 border-b-2 border-dashed">
                        <div className="grid grid-cols-2">
                            <div>Tổng tiền:</div>
                            <div className="text-end">{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>Trả trước: </div>
                            <div className="text-end">{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(deposit)}</div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>Giảm giá: </div>
                            <div className="text-end">{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(floorFeature.invoice_discount)}</div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>Thành tiền: </div>
                            <div className="font-bold text-end">{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(totalPrice - deposit - floorFeature.invoice_discount)}</div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>Hình thức</div>
                            <div className="text-end">{floorFeature.paymentMethod ? floorFeature.paymentMethod.payment_method_name : ''}</div>
                        </div>
                        <center><small>(Giá đã bao gồm thuế VAT)</small></center>
                    </div>
                    <div className="text-center">
                        <div>Người lập phiếu: {receptionFeature.reception_name}</div>
                        <div>Cám ơn quý khách đã sử dụng dịch vụ</div>
                        <div>Mọi chi tiết thắc mắc vui lòng liên hệ 0123456789 để được giải đáp</div>
                    </div>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="success" className="float-end ml-2" onClick={() => onHandleConfirm()}>Trả phòng</Button>
                <Button color="gray" className="float-end ml-2" onClick={() => dispatch(setOpenModalSinglePayment(false))}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    );
}