import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, IconButton } from "@mui/material";
import { Payment, Print, RemoveRedEye, Replay } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import PrintInvoiceModal from "../../components/modal/invoice_print_modal";
import { setInvoiceSelection, setOpenModalPrintInvoice } from "../../redux_features/invoiceFeature";

export default function InvoiceSetting() {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAllowedSetting, setIsAllowedSetting] = useState(false);
    const dispatch = useDispatch();
    const invoiceFeature = useSelector(state => state.invoice);
    const receptionFeature = useSelector(state => state.reception);


    const columns = useMemo(() => [
        {
            accessorKey: 'id',
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
        axios.get(process.env.REACT_APP_BACKEND + 'api/invoice/getAll', { withCredentials: true })
            .then(function (response) {
                setData(response.data.result);
                setIsLoading(false);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }, [invoiceFeature.successUpdateInvoice])

    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-2 h-[8%]">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Danh sách hoá đơn</h1>
                    </div>
                </div>
                <div className="w-full h-[92%]">
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
                                        <IconButton color="success"
                                            title="Thanh toán"
                                            onClick={() => {

                                            }}
                                        >
                                            <Payment />
                                        </IconButton> : null
                                }
                                <IconButton color="primary"
                                    title="Xem lịch sử"
                                    onClick={() => {

                                    }}
                                >
                                    <RemoveRedEye />
                                </IconButton>
                                <IconButton color="secondary"
                                    title="In lại hoá đơn"
                                    onClick={() => {
                                        dispatch(setInvoiceSelection(row.original));
                                        dispatch(setOpenModalPrintInvoice(true));
                                    }}>
                                    <Print />
                                </IconButton>
                                {
                                    isAllowedSetting ? <IconButton color="error"
                                        title="Hoàn lại hoá đơn"
                                        onClick={() => {

                                        }}>
                                        <Replay />
                                    </IconButton> : null
                                }

                            </Box>
                        )}

                    />
                </div>
                <PrintInvoiceModal />
            </div>
        </div>
    )
}