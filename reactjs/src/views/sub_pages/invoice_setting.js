import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import axios from "axios";
import { toast } from "react-toastify";
import { Tooltip } from "flowbite-react";
import { Box, IconButton } from "@mui/material";
import { Payment, Print, RemoveRedEye, Replay } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import PrintInvoiceModal from "../../components/modal/invoice_modal/invoice_print_modal";
import { setInvoiceSelection, setOpenModalInvoiceHistory, setOpenModalInvoicePayment, setOpenModalPrintInvoice, setSuccessUpdateInvoice } from "../../redux_features/invoiceFeature";
import InvoicePaymentModal from "../../components/modal/invoice_modal/invoice_payment_modal";
import HistoryInvoiceModal from "../../components/modal/invoice_modal/invoice_history_modal";
import { setOpenLoadingScreen } from "../../redux_features/baseFeature";

export default function InvoiceSetting() {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAllowedSetting, setIsAllowedSetting] = useState(false);
    const dispatch = useDispatch();
    const invoiceFeature = useSelector(state => state.invoice);
    const receptionFeature = useSelector(state => state.reception);
    const [isProcessing,setIsProcessing]=useState(false);


    const columns = useMemo(() => [
        {
            accessorKey: 'invoice_code',
            header: 'Mã hoá đơn',
            size: '1'
        },
        {
            accessorKey: 'Customer.customer_name',
            header: 'Khách hàng',
            size: '10'
        },
        {
            header: 'Tổng tiền',
            Cell: ({ renderedCellValue, row }) => (
                <Box className="flex items-center gap-4">
                    {Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(row.original.invoice_total_payment)}
                </Box>
            ),
        },
        {
            header: 'Ngày thanh toán',
            Cell: ({ renderedCellValue, row }) => (
                <Box className={row.original.invoice_payment_date ? "flex items-center gap-4" : "text-red-700 font-bold"}>
                    {row.original.invoice_payment_date ? new Date(row.original.invoice_payment_date).toLocaleString() : "Chưa thanh toán"}
                </Box>
            ),
        },
        {
            accessorKey: 'Payment_method.payment_method_name',
            header: 'PT thanh toán',
            size: '10'
        },
    ], [])

    useEffect(() => {
        if (receptionFeature.reception_role.length > 0) {
            receptionFeature.reception_role.forEach((value) => {
                if (value === 6) {
                    setIsAllowedSetting(true);
                }
            })
        } else {
            setIsAllowedSetting(false);
        }
    }, [receptionFeature.reception_role])

    useEffect(() => {
        dispatch(setOpenLoadingScreen(true));
        axios.get(process.env.REACT_APP_BACKEND + 'api/invoice/getAll', { withCredentials: true })
            .then(function (response) {
                setData(response.data.result);
                setIsLoading(false);
            }).catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error('Hoá đơn:'+error.response.data.error_code);
                } else {
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            }).finally(function(){
                dispatch(setOpenLoadingScreen(false));
            })
    }, [invoiceFeature.successUpdateInvoice, dispatch])

    const onHandleRefundConfirm = (id) => {
        if(isProcessing)
            return;
        if (window.confirm('Bạn muốn hoàn lại hoá đơn này?')) {
            setIsProcessing(true)
            axios.post(process.env.REACT_APP_BACKEND + 'api/invoice/deleteInvoice', {
                id: id
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setSuccessUpdateInvoice());
                }).catch(function (error) {
                    if (error.code === 'ECONNABORTED') {
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    } else if (error.response) {
                        toast.error(error.response.data.error_code);
                    } else {
                        toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                    }
                }).finally(function(){
                    setIsProcessing(false);
                })
        }
    }

    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-2 h-fit">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Danh sách hoá đơn</h1>
                    </div>
                </div>
                <div className="w-full h-full">
                    <MaterialReactTable
                        data={data}
                        columns={columns}
                        localization={MRT_Localization_VI}
                        state={{ isLoading: isLoading }}
                        muiCircularProgressProps={{
                            color: 'secondary',
                            thickness: 5,
                            size: 55,
                        }}
                        muiSkeletonProps={{
                            animation: 'pulse',
                            height: 28,
                        }}
                        enableRowActions
                        positionActionsColumn="last"
                        renderRowActions={({ row, table }) => (
                            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                                {
                                    !row.original.invoice_payment_date && isAllowedSetting ?
                                        <Tooltip content="Thanh toán">
                                            <IconButton color="success"
                                                onClick={() => {
                                                    dispatch(setOpenModalInvoicePayment(true));
                                                    dispatch(setInvoiceSelection(row.original));
                                                }}>
                                                <Payment />
                                            </IconButton>
                                        </Tooltip> : null
                                }
                                <Tooltip content="Xem lịch sử">
                                    <IconButton color="primary"
                                        onClick={() => {
                                            dispatch(setInvoiceSelection(row.original));
                                            dispatch(setOpenModalInvoiceHistory(true));
                                        }}
                                    >
                                        <RemoveRedEye />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip content="In lại hoá đơn">
                                    <IconButton color="secondary"
                                        onClick={() => {
                                            dispatch(setInvoiceSelection(row.original));
                                            dispatch(setOpenModalPrintInvoice(true));
                                        }}>
                                        <Print />
                                    </IconButton>
                                </Tooltip>

                                {
                                    isAllowedSetting ?
                                        <Tooltip content="Hoàn lại hoá đơn">
                                            <IconButton color="error"
                                                onClick={() => {
                                                    onHandleRefundConfirm(row.original.id)
                                                }}>
                                                <Replay />
                                            </IconButton>
                                        </Tooltip> : null
                                }

                            </Box>
                        )}

                    />
                </div>
                <PrintInvoiceModal />
                <InvoicePaymentModal />
                <HistoryInvoiceModal />
            </div>
        </div>
    )
}

