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
            onClick={() => dispatch(setOpenModalPrintInvoice(false))}>
            <Modal.Body>
                <div ref={componentRef}>
                    <img src={logo} alt="Logo HEPC" className="w-full" />
                    <center><strong className="text-blue-700">HOÁ ĐƠN BÁN LẺ</strong></center>
                    <div className="border-b-2 p-2 grid grid-cols-2">
                        <div className="">
                            <p>Khách hàng: <strong>{customerData.customer_name}</strong> </p>
                            <p>CMND/CCCD: <strong>{customerData.customer_identification}</strong></p>
                        </div><div className="">
                            <p>Ngày lập phiếu: <strong>{new Date(invoiceData.invoice_receipt_date).toLocaleString()}</strong> </p>
                            <p>Ngày thanh toán: <strong>{invoiceData.invoice_payment_date ? new Date(invoiceData.invoice_payment_date).toLocaleString() : "Chưa thanh toán"}</strong> </p>
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