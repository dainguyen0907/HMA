import { Download, Print, RemoveRedEye } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setInvoiceSelection, setOpenModalInvoiceHistory, setOpenModalPrintInvoice } from "../../redux_features/invoiceFeature";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import { download, generateCsv, mkConfig } from "export-to-csv";

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename:'HMA Log'
})


export default function MainRevenueTab() {

    const revenueFeature = useSelector(state => state.revenue);
    const [data, setData] = useState([]);
    const [totalPayment, setTotalPayment] = useState(0);
    const [countInvoice, setCountInvoice] = useState(0);
    const [countCheckin,setCountCheckin]=useState(0);
    const [countRoom,setCountRoom]=useState(0);
    const dispatch=useDispatch();

    const onHandleExportCSV = () => {
        if (data.length > 0) {
            const csv = generateCsv(csvConfig)(data);
            download(csvConfig)(csv);
        }else{
            toast.error("Không có dữ liệu để xuất!");        }
    }

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
        if (revenueFeature.currentIndex === 0) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/invoice/getRevenueInvoice?from=' + revenueFeature.fromDay + '&to=' + revenueFeature.toDay, {
                withCredentials: true
            }).then(function (response) {
                setCountInvoice(response.data.result.countInvoice);
                setTotalPayment(response.data.result.sumPayment);
                setData(response.data.result.data);
            }).catch(function (error) {
                if (error.response)
                    toast.error("Invoice:"+error.response.data.error_code);
            })
            axios.get(process.env.REACT_APP_BACKEND + 'api/bed/getRevenueBed?from=' + revenueFeature.fromDay + '&to=' + revenueFeature.toDay, {
                withCredentials: true
            }).then(function (response) {
                setCountCheckin(response.data.result.countCheckin);
                setCountRoom(response.data.result.countRoom);
            }).catch(function (error) {
                if (error.response)
                    toast.error("Bed:"+error.response.data.error_code);
            })
        }
    }, [revenueFeature.fromDay, revenueFeature.toDay, revenueFeature.currentIndex])

    return (
        <div >
            <div className="font-bold text-blue-700 text-center">
                THỐNG KÊ TỔNG HỢP DOANH THU<br />
                <small>Từ {revenueFeature.fromDay} đến {revenueFeature.toDay}</small>
            </div>
            <p className="font-semibold text-blue-700">Thông tin đơn vị</p>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Đơn vị:
                </div>
                <div className="col-span-3 text-start font-semibold">
                    Trường Cao đẳng Điện lực Thành phố Hồ Chí Minh.
                </div>
            </div>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Địa chỉ:
                </div>
                <div className="col-span-3 text-start font-semibold">
                    554 đường Hà Huy Giáp, phường Thạnh Lộc, Quận 12, Thành phố Hồ Chí Minh.
                </div>
            </div>
            <hr />
            <p className="font-semibold text-blue-700">Dữ liệu doanh thu</p>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Tổng doanh thu:
                </div>
                <div className="col-span-3 text-start font-semibold">
                    {Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(totalPayment)}
                </div>
            </div>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Tổng số hoá đơn:
                </div>
                <div className="col-span-3 text-start font-semibold">
                    {countInvoice}
                </div>
            </div>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Tổng lượt checkin:
                </div>
                <div className="col-span-3 text-start font-semibold">
                    {countCheckin}
                </div>
            </div>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Tổng số phòng:
                </div>
                <div className="col-span-3 text-start font-semibold">
                    {countRoom}
                </div>
            </div>
            <hr />
            <p className="text-blue-700 font-semibold">
                Chi tiết hoá đơn
            </p>
            <MaterialReactTable
                data={data}
                columns={columns}
                enableBottomToolbar={false}
                renderTopToolbarCustomActions={(table)=>(
                    <Button startIcon={<Download/>} onClick={onHandleExportCSV} color="success">
                        Xuất file CSV
                    </Button>
                )}
                localization={MRT_Localization_VI}
                positionActionsColumn="last"
                enableRowActions={true}
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                        <IconButton color="primary"
                            title="Xem lịch sử"
                            onClick={() => {
                                dispatch(setInvoiceSelection(row.original));
                                dispatch(setOpenModalInvoiceHistory(true));
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

                    </Box>
                )}
            />
        </div>
    )
}