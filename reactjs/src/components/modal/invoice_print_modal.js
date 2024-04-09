import { Button, Modal } from "flowbite-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalPrintInvoice } from "../../redux_features/invoiceFeature";
import logo from "../../assets/images/hepc-logo.png"
import { useReactToPrint } from "react-to-print";

export default function PrintInvoiceModal() {

    const dispatch = useDispatch();
    const invoiceFeature = useSelector(state => state.invoice);
    const componentRef = useRef();

    const [priceData, setPriceData] = useState([]);
    const [customerData, setCustomerData] = useState({});
    const [invoiceData, setInvoiceData] = useState({});


    useEffect(() => {
        if (invoiceFeature.invoiceSelection) {
            setInvoiceData(invoiceFeature.invoiceSelection);
            setPriceData(invoiceFeature.invoiceSelection.invoice_details);
            setCustomerData(invoiceFeature.invoiceSelection.Customer);
        }
    }, [invoiceFeature.invoiceSelection])

    const onHandlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Hoá đơn',
        onBeforeGetContent: useCallback(() => { }, []),
        onBeforePrint: useCallback(() => { }, []),
        onAfterPrint: useCallback(() => { }, []),
        removeAfterPrint: true
    });

    return (
        <Modal show={invoiceFeature.openModalPrintInvoice}
            onClose={() => dispatch(setOpenModalPrintInvoice(false))}
            size="lg">
            <Modal.Body>
                <div ref={componentRef}>
                    <img src={logo} alt="Logo HEPC" className="w-full" />
                    <center><strong className="text-blue-700">PHIẾU THANH TOÁN</strong></center>
                    <center><small>Mã hoá đơn: {invoiceData.invoice_code} </small></center>
                    <div className="pl-2 border-b-2 border-dashed">
                        <div className="grid grid-cols-2">
                            <div>Khách hàng:</div>
                            <div >{customerData.customer_name}</div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>Phòng:</div>
                            <div >{invoiceFeature.invoiceSelection && invoiceFeature.invoiceSelection.Beds[0] ? invoiceFeature.invoiceSelection.Beds[0].Room.room_name : ""}</div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>Ngày lập phiếu:</div>
                            <div >{new Date(invoiceData.invoice_receipt_date).toLocaleString()}</div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>Ngày thanh toán:</div>
                            <div >{invoiceData.invoice_payment_date ? new Date(invoiceData.invoice_payment_date).toLocaleString() : "Chưa thanh toán"}</div>
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
                                <div className="font-semibold">- {value.product_name}</div>
                                <div className="grid grid-cols-4">
                                    <div className="col-start-2">
                                        {value.product_value && value.product_value > 0 ? Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(value.product_total_price) / parseFloat(value.product_value))
                                            : Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value.product_total_price)}
                                    </div>
                                    <div>
                                        {value.product_value}
                                    </div>
                                    <div>
                                        {Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value.product_total_price)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="px-2 border-b-2 border-dashed">
                        <div className="grid grid-cols-2">
                            <div>Tổng tiền:</div>
                            <div className="text-end">{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(invoiceData.invoice_total_payment)}</div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>Trả trước: </div>
                            <div className="text-end">{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(invoiceData.invoice_deposit)}</div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>Giảm giá: </div>
                            <div className="text-end">{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(invoiceData.invoice_discount)}</div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>Thành tiền: </div>
                            <div className="font-bold text-end">{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(parseInt(invoiceData.invoice_total_payment) - parseInt(invoiceData.invoice_deposit))}</div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>Hình thức</div>
                            <div className="text-end">{invoiceData.Payment_method ? invoiceData.Payment_method.payment_method_name : ""}</div>
                        </div>
                        <center><small>(Giá đã bao gồm thuế VAT)</small></center>
                    </div>
                    <div className="text-center">
                        <div>Người lập phiếu:{invoiceData.invoice_reception_name}</div>
                        <div>Cám ơn quý khách đã sử dụng dịch vụ</div>
                        <div>Mọi chi tiết thắc mắc vui lòng liên hệ 0123456789 để được giải đáp</div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="success" onClick={() => onHandlePrint()}>In hoá đơn</Button>
                <Button color="gray" onClick={() => dispatch(setOpenModalPrintInvoice(false))}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    )
}