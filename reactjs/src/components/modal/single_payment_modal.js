
import { Button, Modal } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalSinglePayment } from "../../redux_features/floorFeature";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import { toast } from "react-toastify";
import axios from "axios";
import { Box } from "@mui/material";


export default function SinglePayment() {
    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);
    const [priceData, setPriceData] = useState([]);

    const [deposit, setDeposit] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [bedPrice, setBedPrice] = useState(0);
    const [servicePrice, setServicePrice] = useState(0);
    const [bedInfor, setBedInfor] = useState(null);


    const priceColumns = useMemo(() => [
        {
            accessorKey: 'label',
            header: 'Nội dung',
            size: '10'
        },
        {
            accessorKey: 'quantity',
            header: 'Số lượng',
            size: '10'
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

    useEffect(()=>{
        let price=0;
        for(let i=0;i<floorFeature.roomPriceTable.length;i++)
        {
            price+=floorFeature.roomPriceTable[i].value;
        }
        setBedPrice(price);
    },[floorFeature.roomPriceTable])

    useEffect(()=>{
        let price=0;
        for(let i=0;i<floorFeature.servicePriceTable.length;i++)
        {
            price+=floorFeature.servicePriceTable[i].totalPrice;
        }
        setServicePrice(price);
    },[floorFeature.servicePriceTable])

    useEffect(()=>{
        let array=[];
        for(let i=0;i<floorFeature.roomPriceTable.length;i++)
        {
            const a=floorFeature.roomPriceTable[i];
            const value={
                label:a.label,
                quantity:null,
                value:a.value
            }
            array.push(value)
        }
        for(let i=0;i<floorFeature.servicePriceTable.length;i++)
        {
            const a=floorFeature.servicePriceTable[i];
            const value={
                label:a.Service.service_name,
                quantity:a.service_quantity,
                value:a.total_price
            }
            array.push(value)
        }
        setPriceData(array);

    },[floorFeature.roomPriceTable,floorFeature.servicePriceTable])


    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/bed/getBedByID?id=' + floorFeature.bedID, { withCredentials: true })
            .then(function (response) {
                setBedInfor(response.data.result);
                setDeposit(response.data.result.bed_deposit);
            }).catch(function (error) {
                console.log(error);
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }, [floorFeature.bedID])



    useEffect(() => {
        setTotalPrice(servicePrice + bedPrice);
    }, [servicePrice, bedPrice])



    return (
        <Modal show={floorFeature.openModalSinglePayment} onClose={() => dispatch(setOpenModalSinglePayment(false))}>
            <Modal.Body>
                <center><strong>THANH TOÁN HOÁ ĐƠN</strong></center>
                <div className="border-b-2 p-2 grid grid-cols-2">
                    <div className="">
                        <p>Mã giường: <strong>{bedInfor ? bedInfor.id : ''}</strong> </p>
                        <p>Khách hàng: <strong>{bedInfor ? bedInfor.Customer.customer_name : ''}</strong> </p>
                        <p>CMND/CCCD: <strong>{bedInfor ? bedInfor.Customer.customer_identification : ''}</strong></p>
                    </div><div className="">
                        <p>Loại giường: <strong>{bedInfor ? bedInfor.Bed_type.bed_type_name : ''}</strong></p>
                        <p>Ngày checkin: <strong>{bedInfor ? new Date(bedInfor.bed_checkin).toLocaleString() : ''}</strong> </p>
                        <p>Ngày checkout: <strong>{bedInfor ? new Date(bedInfor.bed_checkout).toLocaleString() : ''}</strong> </p>
                    </div>
                </div>
                <div className="p-2 border-b-2">
                    <span className="font-bold text-blue-700 mt-2">CHI TIẾT HOÁ ĐƠN</span>
                    <div className="py-2 w-full">
                        <MaterialReactTable
                            columns={priceColumns}
                            data={priceData}
                            enableBottomToolbar={false}
                            enableTopToolbar={false}
                            localization={MRT_Localization_VI}
                        />
                    </div>
                </div>

                <div className="p-2 border-b-2">
                    
                    
                </div>
                <div className="pt-3">
                    <Button color="success" className="float-end ml-2">Thanh toán</Button>
                    <Button color="gray" className="float-end ml-2" onClick={() => dispatch(setOpenModalSinglePayment(false))}>Huỷ</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}