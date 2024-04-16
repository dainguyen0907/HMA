
import { Button, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalInvoicePayment, setSuccessUpdateInvoice } from "../../redux_features/invoiceFeature";
import { IconButton, MenuItem, TextField } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { Close } from "@mui/icons-material";

export default function InvoicePaymentModal() {

    const dispatch = useDispatch();
    const invoiceFeature = useSelector(state => state.invoice);
    const [idPaymentMethod, setIdPaymentMethod] = useState(-1);
    const [paymentMethodSelectBox, setPaymentMethodSelectBox] = useState([]);

    const [invoiceInfor, setInvoiceInfor] = useState({});

    useEffect(() => {
        if (invoiceFeature.openModalInvoicePayment) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/paymentmethod/getAll', { withCredentials: true })
                .then(function (response) {
                    setPaymentMethodSelectBox(response.data.result);
                    setIdPaymentMethod(invoiceFeature.invoiceSelection.id_payment_method);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error("Lỗi lấy dữ liệu phương thức thanh toán: " + error.response.data.error_code);
                    }
                })
        }
    }, [invoiceFeature.invoiceSelection, invoiceFeature.openModalInvoicePayment])

    useEffect(() => {
        if (invoiceFeature.invoiceSelection) {
            setInvoiceInfor(invoiceFeature.invoiceSelection);
        }
    }, [invoiceFeature.invoiceSelection]);

    const onHandlePayment = () => {
        if (idPaymentMethod !== -1 && idPaymentMethod !== 3 && invoiceFeature.invoiceSelection) {
            axios.post(process.env.REACT_APP_BACKEND + 'api/invoice/updateInvoice', {
                id_payment: idPaymentMethod,
                id: invoiceInfor.id,
                receipt_date: invoiceInfor.invoice_receipt_date,
                payment_date: new Date(),
                deposit: invoiceInfor.invoice_deposit,
                total_payment: invoiceInfor.invoice_total_payment
            }, { withCredentials: true })
                .then(function (response) {
                    dispatch(setSuccessUpdateInvoice());
                    dispatch(setOpenModalInvoicePayment(false));
                    toast.success(response.data.result);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error("Lỗi cập nhật thông tin: " + error.response.data.error_code);
                    }
                })
        }
    }

    return (
        <Modal show={invoiceFeature.openModalInvoicePayment}
            onClose={() => dispatch(setOpenModalInvoicePayment(false))}
            className="relative">
            <Modal.Body>
                <div className="absolute top-1 right-4">
                    <IconButton onClick={() => dispatch(setOpenModalInvoicePayment(false))}>
                        <Close />
                    </IconButton>
                </div>
                <center><strong className="text-blue-700">THANH TOÁN CÔNG NỢ</strong></center>
                <div className="p-2 grid grid-cols-2">
                    <div>
                        <p>Mã hoá đơn:<strong>{invoiceInfor.id}</strong></p>
                        <p>Khách hàng: <strong>{invoiceInfor.Customer ? invoiceInfor.Customer.customer_name : ''}</strong> </p>
                        <p>CMND/CCCD: <strong>{invoiceInfor.Customer ? invoiceInfor.Customer.customer_identification : ''}</strong></p>
                    </div><div>
                        <p>Ngày lập phiếu: <strong>{new Date(invoiceInfor.invoice_receipt_date).toLocaleString()}</strong> </p>
                        <p>Ngày thanh toán: <strong>{invoiceInfor.invoice_payment_date ? new Date(invoiceInfor.invoice_payment_date).toLocaleString() : 'Chưa thanh toán'}</strong> </p>
                    </div>
                </div>
                <fieldset style={{ border: "2px solid #E5E7EB" }}>
                    <legend className="font-bold text-blue-700">Thông tin thanh toán</legend>
                    <div className="grid grid-cols-4">
                        <div className="col-span-2 p-2 ">
                            <TextField select label="Phương thức thanh toán" fullWidth value={idPaymentMethod}
                                onChange={(e) => setIdPaymentMethod(e.target.value)} size="small">
                                <MenuItem value={-1} disabled>Phương thức thanh toán</MenuItem>
                                {
                                    paymentMethodSelectBox.map((value, key) =>
                                        <MenuItem value={value.id} key={key} disabled={value.id === 3}>{value.payment_method_name}</MenuItem>)
                                }
                            </TextField>
                        </div>
                        <div className="col-start-3">
                            <p>Tổng tiền: </p>
                            <p>Trả trước: </p>
                            <p>Thành tiền: </p>
                        </div>
                        <div className="col-start-4 text-end pe-2">
                            <p><strong>{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(invoiceInfor.invoice_total_payment)}</strong></p>
                            <p><strong>{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(invoiceInfor.invoice_deposit)}</strong></p>
                            <p><strong>{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(parseInt(invoiceInfor.invoice_total_payment) - parseInt(invoiceInfor.invoice_deposit))}</strong></p>
                        </div>
                    </div>
                </fieldset>
                <div className="p-2">
                    <Button className="float-end ml-2" color="blue" disabled={idPaymentMethod === -1 || idPaymentMethod === 3}
                        onClick={() => onHandlePayment()}>Thanh toán</Button>
                    <Button className="float-end" color="gray" onClick={() => dispatch(setOpenModalInvoicePayment(false))}>Huỷ</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}