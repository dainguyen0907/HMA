import { Close } from "@mui/icons-material";
import { Button, IconButton, MenuItem, TextField } from "@mui/material";
import { Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setCountUpdateSuccess, setOpenUpdateBedModal } from "../../../redux_features/invoiceCreationFeature";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function UpdateBedModal() {

    const invoiceCreationFeature = useSelector(state => state.invoice_creation);
    const dispatch = useDispatch();
    const [customerName, setCustomerName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [idBedType, setIDBedType] = useState(-1);
    const [idPrice, setIDPrice] = useState(-1);
    const [bedTypeList, setBedTypeList] = useState([]);
    const [priceList, setPriceList] = useState([]);

    useEffect(() => {
        if (invoiceCreationFeature.openUpdateBedModal && invoiceCreationFeature.bedSelection) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/bedtype/getAll', { withCredentials: true })
                .then(function (response) {
                    setBedTypeList(response.data.result);
                    setIDBedType(invoiceCreationFeature.bedSelection ? invoiceCreationFeature.bedSelection.id_bed_type : -1);
                    setIDPrice(invoiceCreationFeature.bedSelection ? invoiceCreationFeature.bedSelection.id_price : -1);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error("Lỗi lấy dữ liệu loại giường: " + error.response.data.error_code);
                    }
                })
            setCustomerName(invoiceCreationFeature.bedSelection.Customer.customer_name);
            setRoomName(invoiceCreationFeature.bedSelection.Room.room_name);
        } else {
            setCustomerName('');
            setRoomName('');
            setIDBedType(-1);
            setIDPrice(-1);
            setBedTypeList([]);
            setPriceList([]);
        }
    }, [invoiceCreationFeature.openUpdateBedModal, invoiceCreationFeature.bedSelection]);

    useEffect(() => {
        if (idBedType === -1) {
            setIDPrice(-1);
            setPriceList([]);
        } else {
            axios.get(process.env.REACT_APP_BACKEND + 'api/price/getPriceByIDBedType?id=' + idBedType, { withCredentials: true })
                .then(function (response) {
                    setPriceList(response.data.result);
                }).catch(function (error) {
                    if (error.code === 'ECONNABORTED') {
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    } else if (error.response) {
                        toast.error(error.response.data.error_code);
                    } else {
                        toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                    }
                })
        }
    }, [idBedType, invoiceCreationFeature.bedSelection])

    const onHandleSubmit = (e) => {
        e.preventDefault();
        if (invoiceCreationFeature.bedSelection) {
            if (idPrice === -1 || idBedType === -1) {
                toast.error('Vui lòng chọn loại giường và đơn giá hợp lệ');
            }else{
                axios.post(process.env.REACT_APP_BACKEND + 'api/bed/updateBed', {
                    id: invoiceCreationFeature.bedSelection.id,
                    id_bed_type: idBedType,
                    id_price: idPrice,
                    bed_checkin: invoiceCreationFeature.bedSelection.bed_checkin,
                    bed_checkout: invoiceCreationFeature.bedSelection.bed_checkout,
                    bed_deposit: invoiceCreationFeature.bedSelection.bed_deposit,
                }, { withCredentials: true })
                    .then(function (response) {
                        toast.success("Cập nhật thành công");
                        dispatch(setOpenUpdateBedModal(false));
                        dispatch(setCountUpdateSuccess());
                    }).catch(function (error) {
                        if (error.response) {
                            toast.error("Lỗi cập nhật thông tin: " + error.response.data.error_code);
                        }
                    })
            }
        }
    }

    return (<Modal className="relative" show={invoiceCreationFeature.openUpdateBedModal}>
        <Modal.Body>
            <div className="absolute right-2 top-2">
                <IconButton onClick={() => dispatch(setOpenUpdateBedModal(false))}>
                    <Close />
                </IconButton>
            </div>
            <div className="w-full px-2 text-center uppercase text-blue-500 font-bold">
                Cập nhật thông tin giường
            </div>
            <form onSubmit={onHandleSubmit}>
                <div className="flex flex-col gap-2 pt-2">
                    <TextField variant="outlined" type="text" size="small" label="Tên khách hàng" autoComplete="off" disabled value={customerName} />
                    <TextField variant="outlined" type="text" size="small" label="Phòng" autoComplete="off" disabled value={roomName} />
                    <TextField variant="outlined" type="text" size="small" label="Loại giường" select
                        value={idBedType} onChange={(e) => setIDBedType(e.target.value)}>
                        <MenuItem value={-1} disabled>Chọn loại giường</MenuItem>
                        {bedTypeList.map((value, key) => <MenuItem value={value.id} key={key}>{value.bed_type_name}</MenuItem>)}
                    </TextField>
                    <TextField variant="outlined" type="text" size="small" label="Đơn giá" select
                        value={idPrice} onChange={(e) => setIDPrice(e.target.value)}>
                        <MenuItem value={-1} disabled>Chọn loại giường</MenuItem>
                        {priceList.map((value, key) => <MenuItem value={value.id} key={key}>{value.price_name}</MenuItem>)}
                    </TextField>
                    <Button variant="contained" type="submit" color="primary" disabled={idBedType === -1 || idPrice === -1}>Cập nhật</Button>
                </div>
            </form>

        </Modal.Body>
    </Modal>)
}