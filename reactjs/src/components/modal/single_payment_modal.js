
import { Button, Modal } from "flowbite-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalSinglePayment, setRoomUpdateSuccess } from "../../redux_features/floorFeature";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import { toast } from "react-toastify";
import axios from "axios";
import { Box } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import logo from "../../assets/images/hepc-logo.png";


export default function SinglePayment() {
    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);
    const [priceData, setPriceData] = useState([]);

    const [deposit, setDeposit] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [bedPrice, setBedPrice] = useState(0);
    const [servicePrice, setServicePrice] = useState(0);
    const [bedInfor, setBedInfor] = useState(null);
    const componentRef = useRef();


    const priceColumns = useMemo(() => [
        {
            accessorKey: 'label',
            header: 'Nội dung',
            size: '10'
        },
        {
            header: 'Số lượng',
            size: '1',
            Cell: ({ renderValue, row }) => (
                <Box className="text-center">
                    {row.original.quantity}
                </Box>
            ),
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
    ], [])

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
                        console.log(error);
                        if (error.response) {
                            toast.error(error.response.data.error_code);
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
                console.log(error);
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }

    return (
        <Modal show={floorFeature.openModalSinglePayment} onClose={() => dispatch(setOpenModalSinglePayment(false))}>
            <Modal.Body>
                <div ref={componentRef}>
                    <img src={logo} className="w-full" alt="Logo HEPC" />
                    <center><strong className="text-blue-700">HOÁ ĐƠN BÁN LẺ</strong></center>
                    <div className="border-b-2 p-2 grid grid-cols-2">
                        <div className="pr-2">
                            <div>
                                <div className="float-start">Khách hàng:</div>
                                <div className="font-bold text-end">{bedInfor ? bedInfor.Customer.customer_name : '\u00A0'}</div>
                            </div>
                            <div>
                                <div className="float-start">CMND/CCCD:</div>
                                <div className="font-bold text-end">{bedInfor ? bedInfor.Customer.customer_identification : '\u00A0'}</div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div className="float-start">Ngày lập phiếu:</div>
                                <div className="font-bold text-end">{new Date().toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="float-start">Ngày thanh toán:</div>
                                <div className="font-bold text-end">{floorFeature.paymentMethod && floorFeature.paymentMethod.id !== 3 ? new Date().toLocaleString() : '\u00A0'}</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        <span className="font-bold text-blue-700 mt-2">CHI TIẾT HOÁ ĐƠN</span>
                        <div className="py-2 w-full">
                            <MaterialReactTable
                                columns={priceColumns}
                                data={priceData}
                                enableBottomToolbar={false}
                                enableTopToolbar={false}
                                localization={MRT_Localization_VI}
                                enableColumnActions={false}
                                enableSorting={false}
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
                                <p><strong>{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</strong></p>
                                <p><strong>{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(deposit)}</strong></p>
                                <p><strong>{Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(totalPrice - deposit)}</strong></p>
                                <p><strong>{floorFeature.paymentMethod ? floorFeature.paymentMethod.payment_method_name : ''}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="success" className="float-end ml-2" onClick={() => onHandleConfirm()}>Thanh toán</Button>
                <Button color="gray" className="float-end ml-2" onClick={() => dispatch(setOpenModalSinglePayment(false))}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    );
}