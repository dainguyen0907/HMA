import { Modal } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalInvoiceHistory } from "../../redux_features/invoiceFeature";
import { MaterialReactTable } from "material-react-table";
import { Box } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";

export default function HistoryInvoiceModal() {
    const dispatch = useDispatch();
    const invoiceFeature = useSelector(state => state.invoice);
    const [bedData, setBedData] = useState([]);
    const [invoiceInfor, setInvoiceInfor] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [customerSelection, setCustomerSelection] = useState(null);
    const [serviceData, setServiceData] = useState([]);
    const [priceData, setPriceData] = useState([]);
    const [rentTime, setRentTime] = useState(0);

    const bedColumns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'Mã giường',
            size: '10'
        },
        {
            accessorKey: 'Customer.customer_name',
            header: 'Tên khách hàng',
            size: '50'
        }, {
            header: 'Checkin',
            size: '12',
            Cell: ({ render, row }) => (
                <Box className="flex items-center gap-4">
                    {new Date(row.original.bed_checkin).toLocaleDateString()}
                </Box>
            ),
        }
        , {
            header: 'Checkout',
            size: '12',
            Cell: ({ render, row }) => (
                <Box className="flex items-center gap-4">
                    {new Date(row.original.bed_checkout).toLocaleDateString()}
                </Box>
            ),
        }
    ], [])

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

    const priceColumns = useMemo(() => [
        {
            accessorKey: 'product_name',
            header: 'Nội dung',
            size: '10'
        },
        {
            accessorKey: 'product_value',
            header: 'Số lượng',
            size: '5'
        },
        {
            header: 'Thành tiền',
            size: '10',
            Cell: ({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                    {Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(row.original.product_total_price)}
                </Box>
            ),
        },
    ], [])

    useEffect(() => {
        setRowSelection({});
    }, [invoiceFeature.openModalInvoiceHistory])

    useEffect(() => {
        let arrayKey = Object.keys(rowSelection);
        if (arrayKey.length > 0) {
            const currentBed = bedData[arrayKey[0]];
            setCustomerSelection(currentBed);
            setRentTime(Math.round((new Date(currentBed.bed_checkout).getTime() - new Date(currentBed.bed_checkin).getTime()) / 3600000));
            axios.get(process.env.REACT_APP_BACKEND + 'api/servicedetail/getServiceDetailByIDBed?id=' + bedData[arrayKey[0]].id, { withCredentials: true })
                .then(function (response) {
                    setServiceData(response.data.result);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        } else {
            setRentTime(0);
            setServiceData([]);
            setCustomerSelection(null);
        }
    }, [rowSelection])

    useEffect(() => {
        if (invoiceFeature.invoiceSelection) {
            setInvoiceInfor(invoiceFeature.invoiceSelection);
            setPriceData(invoiceFeature.invoiceSelection.invoice_details);
            axios.get(process.env.REACT_APP_BACKEND + 'api/bed/getBedInInvoice?id=' + invoiceFeature.invoiceSelection.id, { withCredentials: true })
                .then(function (response) {
                    setBedData(response.data.result)
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        }
    }, [invoiceFeature.invoiceSelection])

    return (
        <Modal show={invoiceFeature.openModalInvoiceHistory} dismissible
            onClose={() => dispatch(setOpenModalInvoiceHistory(false))} size="7xl">
            <Modal.Body>
                <div className="grid grid-cols-2">
                    <div className="px-1 w-full">
                        <fieldset style={{ border: '2px solid #E5E7EB' }}>
                            <legend className="font-bold text-blue-700">Thông tin hoá đơn</legend>
                            <div className="pe-2 grid grid-cols-2">
                                <div className="px-2">
                                    <div className="grid grid-cols-3">
                                        <span>Mã hoá đơn:</span>
                                        <div className="col-span-2 col-start-2 text-end"><strong>{invoiceInfor.id}</strong></div>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <span>Khách hàng:</span>
                                        <div className="col-span-2 col-start-2 text-end"><strong>{invoiceInfor.Customer ? invoiceInfor.Customer.customer_name : ''}</strong> </div>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <span>Lập phiếu:</span>
                                        <div className="col-span-2 col-start-2 text-end"><strong>{new Date(invoiceInfor.invoice_receipt_date).toLocaleString()}</strong></div>
                                    </div>

                                </div>
                                <div className="px-2">
                                    <div className="grid grid-cols-3">
                                        <span>Tổng tiền:</span>
                                        <div className="col-span-2 col-start-2 text-end"><strong>{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(invoiceInfor.invoice_total_payment)}</strong></div>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <span>Hình thức:</span>
                                        <div className="col-span-2 col-start-2 text-end"><strong>{invoiceInfor.Payment_method ? invoiceInfor.Payment_method.payment_method_name : ""}</strong></div>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <span>Thanh toán:</span>
                                        <div className="col-span-2 col-start-2 text-end"><strong>{invoiceInfor.invoice_payment_date ? new Date(invoiceInfor.invoice_payment_date).toLocaleString() : 'Chưa thanh toán'}</strong></div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset style={{ border: '2px solid #E5E7EB' }}>
                            <legend className="font-bold text-blue-700">Chi tiết hoá đơn</legend>
                            <div className="w-full h-36 overflow-auto">
                                <MaterialReactTable
                                    columns={priceColumns}
                                    data={priceData}
                                    enableColumnActions={false}
                                    enableBottomToolbar={false}
                                    enableTopToolbar={false}
                                />
                            </div>
                        </fieldset>
                        <fieldset style={{ border: '2px solid #E5E7EB' }}>
                            <legend className="font-bold text-blue-700">Danh sách giường</legend>
                            <div className="w-full h-36 overflow-auto">
                                <MaterialReactTable
                                    columns={bedColumns}
                                    data={bedData}
                                    enableColumnActions={false}
                                    enableBottomToolbar={false}
                                    enableTopToolbar={false}
                                    enableRowSelection={true}
                                    enableMultiRowSelection={false}
                                    muiTableBodyRowProps={(row) => ({
                                        onClick: row.row.getToggleSelectedHandler(),
                                        sx: { cursor: "pointer" }
                                    })}
                                    onRowSelectionChange={setRowSelection}
                                    state={{ rowSelection }}
                                />
                            </div>
                        </fieldset>
                    </div>
                    <div className="px-1 w-full">
                        <fieldset style={{ border: '2px solid #E5E7EB' }}>
                            <legend className="font-bold text-blue-700">Thông tin đặt giường</legend>
                            <div className="grid grid-cols-2">
                                <div className="px-2">
                                    <div className="grid grid-cols-2">
                                        <span>Mã giường:</span>
                                        <div className="col-start-2 text-end"><strong>{customerSelection ? customerSelection.id : ''}</strong></div>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <span>Khách hàng:</span>
                                        <div className="col-span-2 col-start-2 text-end"><strong>{customerSelection ? customerSelection.Customer.customer_name : ''}</strong></div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <span>CMND/CCCD:</span>
                                        <div className="col-start-2 text-end"><strong>{customerSelection ? customerSelection.Customer.customer_identification : ''}</strong></div>
                                    </div>
                                </div>
                                <div className="px-2">
                                    <div className="grid grid-cols-2">
                                        <span>Loại giường:</span>
                                        <div className="col-start-2 text-end"><strong>{customerSelection ? customerSelection.Bed_type.bed_type_name : ''}</strong></div>
                                    </div>
                                    <div>
                                        <span className="float-start">Ngày checkin:</span>
                                        <div className="text-end"><strong>{customerSelection ? new Date(customerSelection.bed_checkin).toLocaleString() : '\u00A0' }</strong></div>
                                    </div>
                                    <div>
                                        <span className="float-start">Ngày checkout:</span>
                                        <div className="text-end"><strong>{customerSelection ? new Date(customerSelection.bed_checkout).toLocaleString() : '\u00A0'}</strong></div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset style={{ border: '2px solid #E5E7EB' }}>
                            <legend className="font-bold text-blue-700">Đơn giá áp dụng</legend>
                            <div className="grid grid-cols-2">
                                <div className="px-2">
                                    <div className="grid grid-cols-2">
                                        <span>Đơn giá giờ:</span>
                                        <div className="col-start-2 text-end"><strong>{customerSelection ?
                                            Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(customerSelection.Bed_type.Price.price_hour) : ''}</strong></div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <span>Đơn giá ngày:</span>
                                        <div className="col-start-2 text-end"><strong>{customerSelection ?
                                            Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(customerSelection.Bed_type.Price.price_day) : ''}</strong></div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <span>Thời gian ở:</span>
                                        <div className="col-start-2 text-end"><strong>{
                                            rentTime + " giờ"
                                        }
                                        </strong>
                                        </div>
                                    </div>
                                </div><div className="px-2">
                                    <div className="grid grid-cols-2">
                                        <span>Đơn giá tuần:</span>
                                        <div className="col-start-2 text-end"><strong>{customerSelection ?
                                            Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(customerSelection.Bed_type.Price.price_week) : ''}</strong></div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <span>Đơn giá tháng:</span>
                                        <div className="col-start-2 text-end"><strong>{customerSelection ?
                                            Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(customerSelection.Bed_type.Price.price_month) : ''}</strong></div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset style={{ border: '2px solid #E5E7EB' }}>
                            <legend className="font-bold text-blue-700">Thông tin dịch vụ</legend>
                            <MaterialReactTable
                                data={serviceData}
                                columns={serviceColumns}
                                enableBottomToolbar={false}
                                enableTopToolbar={false}
                                localization={MRT_Localization_VI}
                                enableColumnActions={false}
                            />
                        </fieldset>
                    </div>

                </div>
            </Modal.Body >
        </Modal >
    )
}