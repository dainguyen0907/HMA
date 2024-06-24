import { Modal } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBedID, setOpenModalChangeRoom, setOpenModalCheckOut, setPriceID, setRoomUpdateSuccess } from "../../../redux_features/floorFeature";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import { IconButton, MenuItem, TextField, styled, Button } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import { Close } from "@mui/icons-material";

const Text = styled(TextField)(({ theme }) => ({
    'input:focus': {
        '--tw-ring-shadow': 'none'
    },
}));

const DateTime = styled(DateTimePicker)(({ theme }) => ({
    'input:focus': {
        '--tw-ring-shadow': 'none'
    },
    'input': {
        'paddingTop': '8.5px',
        'paddingBottom': '8.5px'
    }
}))

export default function CheckoutModal() {
    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);
    const [data, setData] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [customerSelection, setCustomerSelection] = useState(null);
    const [bedTypeSelect, setBedTypeSelect] = useState([]);
    const [priceSelect, setPriceSelect] = useState([]);
    const unchange = 0;

    const [idBedType, setIdBedType] = useState(-1);
    const [checkinTime, setCheckinTime] = useState(null);
    const [checkoutTime, setCheckoutTime] = useState(null);
    const [deposit, setDeposit] = useState(0);


    const columns = useMemo(() => [
        {
            accessorKey: 'Customer.Company.company_name',
            header: 'Công ty',
        },
        {
            accessorKey: 'Customer.customer_name',
            header: 'Tên khách hàng',
        }, {
            accessorKey: 'Customer.Course.course_name',
            header: 'Khoá học',
        }
    ], []);


    useEffect(() => {
        setRowSelection({});
    }, [floorFeature.openModalCheckOut]);


    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/bed/getBedInRoom?id=' + floorFeature.roomID, { withCredentials: true })
            .then(function (response) {
                setData(response.data.result);
            }).catch(function (error) {
                toast.error("Lỗi lấy dữ liệu giường: " + error.response.data.error_code);
            })
    }, [floorFeature.roomID, floorFeature.roomUpdateSuccess]);



    useEffect(() => {
        if (Object.keys(rowSelection).length > 0) {
            const nData = data[Object.keys(rowSelection)[0]];
            if (nData) {
                dispatch(setBedID([nData.id]));
                setCustomerSelection(nData);
                setCheckinTime(dayjs(nData.bed_checkin));
                setCheckoutTime(dayjs(nData.bed_checkout));
                dispatch(setPriceID(nData.id_price));
                setIdBedType(nData.id_bed_type);
                setDeposit(nData.bed_deposit);
            } else {
                setRowSelection({});
            }
        } else {
            setDeposit(0);
            setCustomerSelection(null)
            dispatch(setBedID([]));
        }
    }, [rowSelection, data, dispatch]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/price/getPriceByIDBedType?id=' + idBedType, { withCredentials: true })
            .then(function (response) {
                setPriceSelect(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error("Lỗi lấy dữ liệu đơn giá: " + error.response.data.error_code);
                }
            });
    }, [idBedType])

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/bedtype/getAll', { withCredentials: true })
            .then(function (response) {
                setBedTypeSelect(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error("Lỗi lấy dữ liệu loại giường: " + error.response.data.error_code);
                }
            });
    }, [unchange]);




    const onHandleUpdate = () => {
        if (checkinTime > checkoutTime) {
            toast.error('Ngày checkin và ngày checkout chưa hợp lệ');
        } else {
            if (customerSelection) {
                axios.post(process.env.REACT_APP_BACKEND + 'api/bed/updateBed', {
                    id: customerSelection.id,
                    id_bed_type: idBedType,
                    id_price: floorFeature.priceID,
                    bed_checkin: checkinTime,
                    bed_checkout: checkoutTime,
                    bed_deposit: deposit,
                }, { withCredentials: true })
                    .then(function (response) {
                        dispatch(setRoomUpdateSuccess());
                        setRowSelection({});
                        toast.success("Cập nhật thành công");
                    }).catch(function (error) {
                        if (error.response) {
                            toast.error("Lỗi cập nhật thông tin: " + error.response.data.error_code);
                        }
                    })
            }
        }

    }

    const onHandleDeleteBed = () => {
        if (window.confirm('Bạn muốn xoá giường này ?')) {
            if (customerSelection) {
                axios.post(process.env.REACT_APP_BACKEND + 'api/bed/deleteBed', {
                    id: customerSelection.id
                }, { withCredentials: true })
                    .then(function (response) {
                        dispatch(setRoomUpdateSuccess());
                        toast.success(response.data.result);
                    }).catch(function (error) {
                        if (error.response) {
                            toast.error(error.response.data.error_code);
                        }
                    })
            }
        }
    }

    const onHandleCheckoutCustomer=(e)=>{
        axios.post(process.env.REACT_APP_BACKEND + 'api/bed/checkoutSingleBed', {
            id: customerSelection.id
        }, { withCredentials: true })
            .then(function (response) {
                dispatch(setRoomUpdateSuccess());
                toast.success(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }



    return (<Modal show={floorFeature.openModalCheckOut} onClose={() => dispatch(setOpenModalCheckOut(false))}
        size="7xl" className="relative">
        <Modal.Body>
            <div className="absolute top-0 right-3">
                <IconButton onClick={() => dispatch(setOpenModalCheckOut(false))}>
                    <Close />
                </IconButton>
            </div>
            <div className="flex flex-row">
                <div className="w-11/12">
                    <div className="w-full h-40 bg-slate-200">
                        <MaterialReactTable
                            data={data}
                            columns={columns}
                            enableBottomToolbar={false}
                            enableTopToolbar={false}
                            enableRowSelection={true}
                            enableMultiRowSelection={false}
                            enableStickyHeader={true}
                            localization={MRT_Localization_VI}
                            muiTableContainerProps={{ sx: { maxHeight: '160px' } }}
                            muiTableBodyRowProps={(row) => ({
                                onClick: row.row.getToggleSelectedHandler(),
                                sx: {
                                    cursor: 'pointer'
                                }
                            })}
                            onRowSelectionChange={setRowSelection}
                            state={{ rowSelection }}
                        />
                    </div>
                    <div className="w-full pl-2">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <fieldset style={{ border: "2px solid #E5E7EB" }}>
                                <legend className="text-blue-800 font-bold">Thông tin đặt giường</legend>
                                <div className="grid lg:grid-cols-2 grid-cols-1 ">
                                    <div className="pl-2 pr-2">
                                        <div className="grid grid-cols-3">
                                            <div>Mã giường:</div>
                                            <div className="col-span-2 text-right font-bold">{customerSelection ? customerSelection.id : ''}</div>
                                        </div>
                                        <div className="grid grid-cols-3">
                                            <div>Khách hàng:</div>
                                            <div className="col-span-2 text-right font-bold">{customerSelection && customerSelection.Customer ? customerSelection.Customer.customer_name : ''}</div>
                                        </div>
                                        <div className="grid grid-cols-3">
                                            <div>Giới tính:</div>
                                            <div className="col-span-2 text-right font-bold">{customerSelection && customerSelection.Customer ? customerSelection.Customer.customer_gender? 'Nam' : 'Nữ' :''}</div>
                                        </div>
                                        <div className="grid grid-cols-3">
                                            <div>Số điện thoại:</div>
                                            <div className="col-span-2 text-right font-bold">{customerSelection && customerSelection.Customer ? customerSelection.Customer.customer_phone : ''}</div>
                                        </div>
                                    </div>
                                    <div className="pr-2 md:pl-2">
                                        <div className="grid grid-cols-3">
                                            <div>Phân loại:</div>
                                            <div className="col-span-2 text-right font-bold">{customerSelection ? customerSelection.bed_lunch_break ? 'Nghỉ trưa' : 'Nghỉ đêm' : ''}</div>
                                        </div>
                                        <div className="grid grid-cols-3">
                                            <div>Loại giường:</div>
                                            <div className="col-span-2 text-right font-bold">{customerSelection && customerSelection.Bed_type ? customerSelection.Bed_type.bed_type_name : ''}</div>
                                        </div>
                                        <div className="grid grid-cols-3">
                                            <div>Đơn giá:</div>
                                            <div className="col-span-2 text-right font-bold">{customerSelection && customerSelection.Price ? customerSelection.Price.price_name : ''}</div>
                                        </div>
                                        <div className="">
                                            <div className="float-start">Ngày checkin:</div>
                                            <div className="text-end font-bold">{customerSelection ? new Date(customerSelection.bed_checkin).toLocaleString() : '\u00A0'}</div>
                                        </div>
                                        <div className="">
                                            <div className="float-start">Ngày checkout:</div>
                                            <div className="text-end font-bold">{customerSelection ? new Date(customerSelection.bed_checkout).toLocaleString() : '\u00A0'}</div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset style={{ border: "2px solid #E5E7EB", marginBottom: '5px' }}>
                                <legend className="text-blue-800 font-bold">Cập nhật thông tin đặt giường</legend>
                                <div className="grid lg:grid-cols-2 grid-cols-1 p-2">
                                    <div className="py-1">
                                        <Text label="Loại giường" sx={{ width: "95%" }} select disabled={!customerSelection}
                                            value={idBedType} onChange={(e) => setIdBedType(e.target.value)} size="small">
                                            <MenuItem value={-1} disabled>Chọn loại giường</MenuItem>
                                            {bedTypeSelect.map((value, key) => <MenuItem value={value.id} key={key}>{value.bed_type_name}</MenuItem>)}
                                        </Text>
                                    </div>
                                    <div className="flex flex-row gap-2 items-center">
                                        <Text label="Đơn giá" select size="small" sx={{ width: '80%' }} disabled={!customerSelection}
                                            value={floorFeature.priceID} onChange={(e) => { dispatch(setPriceID(e.target.value)); }}>
                                            <MenuItem value={-1} disabled>Chọn đơn giá</MenuItem>
                                            {
                                                priceSelect.map((value, key) => <MenuItem key={key} value={value.id}>{value.price_name}</MenuItem>)
                                            }
                                        </Text>
                                        <Button variant='outlined' size="small" color="primary" disabled={!customerSelection} onClick={() => onHandleUpdate()}>
                                            Lưu
                                        </Button>
                                    </div>
                                    <DateTime label="Ngày checkin" sx={{ width: "95%" }} value={checkinTime}
                                        onChange={(value) => setCheckinTime(value)} format="DD/MM/YYYY hh:mm A" disabled={!customerSelection} />
                                    <DateTime label="Ngày checkout" sx={{ width: "95%" }} value={checkoutTime}
                                        onChange={(value) => setCheckoutTime(value)} format="DD/MM/YYYY hh:mm A" disabled={!customerSelection} />
                                </div>
                            </fieldset>
                        </LocalizationProvider>
                    </div>
                </div>
                <div className="w-auto h-full gap-4 flex flex-col justify-end px-2 py-5">
                    <Button color="primary" disabled={!customerSelection} variant="contained" onClick={onHandleCheckoutCustomer}>Trả phòng</Button>
                    <Button color="success" disabled={!customerSelection} variant="contained"
                        onClick={() => dispatch(setOpenModalChangeRoom(true))}>Chuyển phòng</Button>
                    <Button color="error" disabled={!customerSelection} variant="contained"
                        onClick={() => onHandleDeleteBed()}>Xoá giường</Button>
                </div>
            </div>
        </Modal.Body >
    </Modal >);
}