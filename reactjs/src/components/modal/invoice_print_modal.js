import { Button, Modal } from "flowbite-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalPrintInvoice } from "../../redux_features/invoiceFeature";
import logo from "../../assets/images/hepc-logo.png"
import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import { useReactToPrint } from "react-to-print";

export default function PrintInvoiceModal() {

    const dispatch = useDispatch();
    const invoiceFeature = useSelector(state => state.invoice);
    const componentRef = useRef();

    const [priceData, setPriceData] = useState([]);
    const [customerData, setCustomerData] = useState({});
    const [invoiceData, setInvoiceData] = useState({});

    const columns = useMemo(() => [
        {
            accessorKey: 'product_name',
            header: 'Nội dung',
            grow:true
        },
        {
            header: 'Số lượng',
            size: 1,
            Cell: ({ renderValue, row }) => (
                <Box className="text-center">
                    {row.original.product_value}
                </Box>
            ),
        },
        {
            header: 'Thành tiền',
            size: 10,
            Cell: ({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                    {Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(row.original.product_total_price)}
                </Box>
            ),
        },
    ], []);

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
            onClose={() => dispatch(setOpenModalPrintInvoice(false))}>
            <Modal.Body>
                <div ref={componentRef}>
                    <img src={logo} alt="Logo HEPC" className="w-full" />
                    <center><strong className="text-blue-700">HOÁ ĐƠN BÁN LẺ</strong></center>
                    <div className="border-b-2 p-2 grid grid-cols-2">
                    <div className="pr-2">
                            <div>
                                <div className="float-start">Khách hàng:</div>
                                <div className="font-bold text-end">{customerData.customer_name}</div>
                            </div>
                            <div>
                                <div className="float-start">Phòng:</div>
                                <div className="font-bold text-end">{invoiceFeature.invoiceSelection&&invoiceFeature.invoiceSelection.Beds[0]?invoiceFeature.invoiceSelection.Beds[0].Room.room_name:""}</div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div className="float-start">Ngày lập phiếu:</div>
                                <div className="font-bold text-end">{new Date(invoiceData.invoice_receipt_date).toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="float-start">Ngày thanh toán:</div>
                                <div className="font-bold text-end">{invoiceData.invoice_payment_date ? new Date(invoiceData.invoice_payment_date).toLocaleString() : "Chưa thanh toán"}</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        <span className="font-bold text-blue-700 mt-2">CHI TIẾT HOÁ ĐƠN</span>
                        <div className="py-2 w-full">
                            <MaterialReactTable
                                columns={columns}
                                data={priceData}
                                enableBottomToolbar={false}
                                enableTopToolbar={false}
                                localization={MRT_Localization_VI}
                                enableSorting={false}
                                enableColumnActions={false}

                            />
                        </div>
                    </div>
                    <div className="p-2">
                        <div className="grid grid-cols-4">
                            <div className="col-start-3">
                                <p>Tổng tiền: </p>
                                <p>Trả trước: </p>
                                <p>Thành tiền: </p>
                                <p>PT thanh toán:</p>
                            </div>
                            <div className="col-start-4 text-end">
                                <p><strong>{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(invoiceData.invoice_total_payment)}</strong></p>
                                <p><strong>{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(invoiceData.invoice_deposit)}</strong></p>
                                <p><strong>{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(parseInt(invoiceData.invoice_total_payment) - parseInt(invoiceData.invoice_deposit))}</strong></p>
                                <p><strong>{invoiceData.Payment_method ? invoiceData.Payment_method.payment_method_name : ""}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="success"  onClick={() => onHandlePrint()}>In hoá đơn</Button>
                <Button color="gray" onClick={() => dispatch(setOpenModalPrintInvoice(false))}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    )
}