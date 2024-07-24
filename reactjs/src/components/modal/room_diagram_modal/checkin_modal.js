import { Button, Label, Modal, Radio } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCheckinErrorList, setOpenModalCheckIn, setOpenModalCheckinStatus, setRoomUpdateSuccess } from "../../../redux_features/floorFeature";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from "@mui/material/TextField";
import { Autocomplete, Box, IconButton, MenuItem, Tooltip, styled } from "@mui/material";
import { FaArrowCircleDown } from "react-icons/fa";
import { IconContext } from "react-icons";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import axios from "axios";
import { toast } from "react-toastify";
import { Close, Delete } from "@mui/icons-material"
import dayjs from "dayjs";

const Text = styled(TextField)(({ theme }) => ({
    'input:focus': {
        '--tw-ring-shadow': 'none'
    },
}));

const DateTime = styled(DateTimePicker)(({ theme }) => ({
    '.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input:focus': {
        '--tw-ring-shadow': 'none'
    },
    'input': {
        'paddingTop': '8.5px',
        'paddingBottom': '8.5px'
    }
}))

export default function CheckInModal() {

    const dispatch = useDispatch();
    const [idBedType, setIdBedType] = useState(-1);
    const [idPrice, setIDPrice] = useState(-1);
    const [checkinTime, setCheckinTime] = useState(null);
    const [checkoutTime, setCheckoutTime] = useState(null);
    const [bedDeposit, setBedDeposit] = useState("");
    const floorFeature = useSelector(state => state.floor);
    const [prepareCustomers, setPrepareCustomers] = useState([]);
    const [customerSelect, setCustomerSelect] = useState([]);
    const [bedTypeSelect, setBedTypeSelect] = useState([]);



    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerIdentification, setCustomerIdentification] = useState("");

    const [companyList, setCompanyList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [priceList, setPriceList] = useState([]);

    const [companyID, setCompanyID] = useState(-1);
    const [courseID, setCourseID] = useState(-1);
    const [stayNight, setStayNight] = useState(true);
    const [countLunchBreak, setCountLunchBreak] = useState(1);

    const [selectedCustomer, setSelectedCustomer] = useState(customerSelect[0]);

    const [isProcessing, setIsProcessing] = useState(false);

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'id',
            size: '10'
        },
        {
            accessorKey: 'customer_identification',
            header: 'Số CMND/CCCD',
            size: '12'
        },
        {
            accessorKey: 'customer_name',
            header: 'Tên khách hàng',
            size: '50'
        }, {
            accessorKey: 'customer_phone',
            header: 'Số điện thoại',
            size: '12'
        }, {
            header: 'Checkin',
            Cell: ({ renderedCellValue, row }) => (
                <Box className="flex items-center gap-4">
                    {new Date(row.original.bed_checkin).toLocaleString('vi-VI')}
                </Box>
            ),
        }, {
            header: 'Checkout',
            Cell: ({ renderedCellValue, row }) => (
                <Box className="flex items-center gap-4">
                    {new Date(row.original.bed_checkout).toLocaleString('vi-VI')}
                </Box>
            ),
        }
    ], [])

    const table = useMaterialReactTable({
        columns: columns,
        data: prepareCustomers,
        localization: MRT_Localization_VI,
        enableRowActions: true,
        positionActionsColumn: "last",
        enableFilters: false,
        enableFullScreenToggle: false,
        enableSorting: false,
        enableDensityToggle: false,
        enableHiding: false,
        enableColumnActions: false,
        enableTopToolbar: false,
        enableBottomToolbar: false,
        enablePagination: false,
        renderRowActions: ({ row }) => (
            <IconButton color="error" title="Huỷ khách hàng"
                onClick={() => {
                    setPrepareCustomers((current) =>
                        current.filter((customer) => customer !== row.original))
                }}>
                <Delete />
            </IconButton>
        )
    });

    useEffect(() => {
        setIdBedType(-1);
        setCheckinTime(dayjs());
        setCheckoutTime(dayjs());
        setCompanyID(-1);
        setCourseID(-1);
        setBedDeposit("");
        setCustomerIdentification("");
        setCustomerName("");
        setCustomerPhone("");
        setPrepareCustomers([]);
    }, [floorFeature.openModalCheckIn])


    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/bedtype/getAll', { withCredentials: true })
            .then(function (response) {
                setBedTypeSelect(response.data.result);
            }).catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error("Loại giường: " + error.response.data.error_code);
                } else {
                    toast.error('Loại giường: Xảy ra lỗi khi xử lý thông tin!');
                }
            })
    }, []);


    useEffect(() => {
        setSelectedCustomer(null);
        if (floorFeature.openModalCheckIn) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/company/getAll', { withCredentials: true })
                .then(function (response) {
                    setCompanyList(response.data.result)
                }).catch(function (error) {
                    if (error.code === 'ECONNABORTED') {
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    } else if (error.response) {
                        toast.error("Công ty: " + error.response.data.error_code);
                    } else {
                        toast.error('Công ty: Xảy ra lỗi khi xử lý thông tin!');
                    }
                })
            axios.get(process.env.REACT_APP_BACKEND + 'api/course/getEnableCourse', { withCredentials: true })
                .then(function (response) {
                    setCourseList(response.data.result)
                }).catch(function (error) {
                    if (error.code === 'ECONNABORTED') {
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    } else if (error.response) {
                        toast.error('Khoá học: ' + error.response.data.error_code);
                    } else {
                        toast.error('Khoá học: Xảy ra lỗi khi xử lý thông tin!');
                    }
                })
        }
    }, [floorFeature.openModalCheckIn])

    useEffect(() => {
        const checkin=checkinTime?checkinTime.$d:new Date().toLocaleString('EN-en');
        let query = process.env.REACT_APP_BACKEND + 'api/customer/getCustomerListByCourseAndCompany?company=' + companyID + '&course=' + courseID+'&checkin='+checkin;
        axios.get(query, { withCredentials: true })
            .then(function (response) {
                let CustomersData = [];
                response.data.result.forEach((value) => {
                    const row = { label: value.customer_name, value: value }
                    CustomersData.push(row);
                })
                setCustomerSelect(CustomersData);
                setSelectedCustomer({ label: "", value: {} });
            }).catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error('Khách hàng: ' + error.response.data.error_code);
                } else {
                    toast.error('Khách hàng: Xảy ra lỗi khi xử lý thông tin!');
                }
            })
    }, [companyID, courseID, checkinTime])

    useEffect(() => {
        if (idBedType === -1) {
            setPriceList([]);
            setIDPrice(-1);
        } else {
            axios.get(process.env.REACT_APP_BACKEND + 'api/price/getPriceByIDBedType?id=' + idBedType, { withCredentials: true })
                .then(function (response) {
                    setPriceList(response.data.result);
                    for (let i = 0; i < bedTypeSelect.length; i++) {
                        if (idBedType === bedTypeSelect[i].id) {
                            setIDPrice(bedTypeSelect[i].bed_type_default_price);
                            break;
                        }
                    }
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
    }, [idBedType, bedTypeSelect])

    const checkCustomerExist = (id_customer, list_customer) => {
        for (let i = 0; i < list_customer.length; i++) {
            if (list_customer[i].id === id_customer)
                return false;
        }
        return true;
    }


    const onHandleChooseCustomer = () => {

        if (selectedCustomer && idBedType && checkinTime && checkoutTime) {
            if (idBedType === -1) {
                toast.error('Hãy chọn loại giường')
            } else if (checkinTime > checkoutTime) {
                toast.error('Ngày checkin và ngày checkout chưa hợp lệ')
            } else if (selectedCustomer.value.id) {
                if (checkCustomerExist(selectedCustomer.value.id, prepareCustomers)) {
                    const preValue = {
                        ...selectedCustomer.value, id_price: idPrice, id_bed_type: idBedType,
                        bed_checkin: checkinTime.$d, bed_checkout: checkoutTime.$d,
                        bed_deposit: bedDeposit, bed_lunch_break: !stayNight, count_lunch_break: parseInt(countLunchBreak)
                    }
                    setPrepareCustomers([...prepareCustomers, preValue]);
                    setBedDeposit("");
                    setCustomerPhone("");
                    setCustomerIdentification("");
                    setSelectedCustomer({ label: "", value: {} });
                } else {
                    toast.error('Đã thêm khách hàng này vào phòng!')
                }
            } else {
                toast.error('Vui lòng kiểm tra lại thông tin!')
            }
        }
    }

    const onConfirmCheckin = () => {
        if (isProcessing)
            return;
        setIsProcessing(true);
        axios.post(process.env.REACT_APP_BACKEND + 'api/bed/insertBeds', {
            id_room: floorFeature.roomID,
            array_bed: prepareCustomers
        }, { withCredentials: true })
            .then(function (response) {
                setPrepareCustomers([]);
                setCheckinTime(null);
                setCheckoutTime(null);
                dispatch(setCheckinErrorList(response.data.result));
                dispatch(setOpenModalCheckinStatus(true));
                dispatch(setRoomUpdateSuccess());
                dispatch(setOpenModalCheckIn(false));
            }).catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error("Checkin: " + error.response.data.error_code);
                } else {
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            }).finally(function () {
                setIsProcessing(false);
            })
    }

    return (
        <Modal size="5xl" show={floorFeature.openModalCheckIn} onClose={() => dispatch(setOpenModalCheckIn(false))} className="relative">
            <Modal.Body>
                <div className="absolute top-3 right-4">
                    <IconButton onClick={() => dispatch(setOpenModalCheckIn(false))}>
                        <Close />
                    </IconButton>
                </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <center className="font-bold text-blue-500">Nhận phòng: {floorFeature.roomName}</center>
                    <div className="grid grid-cols-2 border-b-2 border-gray-300 py-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Text size="small" label="Loại giường" fullWidth variant="outlined" select value={idBedType}
                                onChange={(e) => setIdBedType(e.target.value)}>
                                <MenuItem value={-1} disabled>Chọn loại giường</MenuItem>
                                {bedTypeSelect.map((value, key) => <MenuItem value={value.id} key={key}>{value.bed_type_name}</MenuItem>)}
                            </Text>
                            <div className="flex flex-row gap-2 justify-center items-center">
                                <Radio checked={stayNight} onClick={() => setStayNight(true)} />
                                <Label value="Nghỉ đêm" />
                                <Radio checked={!stayNight} onClick={() => setStayNight(false)} />
                                <Label value="Nghỉ trưa" />
                                <Text variant="outlined" label="Số ngày nghỉ trưa" size="small" disabled={stayNight}
                                    value={countLunchBreak} onChange={(e) => setCountLunchBreak(e.target.value)} type="number"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Text variant="outlined" label="Đơn giá áp dụng" fullWidth size="small" select disabled={idBedType === -1}
                                value={idPrice} onChange={(e) => setIDPrice(e.target.value)}>
                                <MenuItem value={-1} disabled>Chọn đơn giá</MenuItem>
                                {
                                    priceList.map((value, index) => <MenuItem value={value.id} key={index}>{value.price_name}</MenuItem>)
                                }
                            </Text>
                            <div className="flex flex-row gap-2">
                                <DateTime label="Ngày checkin" value={checkinTime} ampm={false} minTime={stayNight ? null : dayjs().set('hour', 10).set('minute', 0)} maxTime={stayNight ? null : dayjs().set('hour', 14).set('minute', 0)}
                                    onChange={(value) => { setCheckinTime(value) }} format="DD/MM/YYYY hh:mm A"
                                />
                                <DateTime label="Ngày checkout" value={checkoutTime} ampm={false} maxDate={stayNight ? null : checkinTime} minDate={stayNight ? null : checkinTime} minTime={stayNight ? null : dayjs().set('hour', 10).set('minute', 0)} maxTime={stayNight ? null : dayjs().set('hour', 14).set('minute', 0)}
                                    onChange={(value) => setCheckoutTime(value)} format="DD/MM/YYYY hh:mm A" />
                            </div>
                        </div>
                    </div>
                    <center className="font-bold text-blue-500">Thông tin khách hàng</center>
                    <div className="grid grid-cols-2 pt-2 border-b-2 border-gray-300">
                        <div className="px-3 py-1">
                            <Text select size="small" fullWidth variant="outlined" label="Đơn vị" value={companyID} onChange={(e) => setCompanyID(e.target.value)}>
                                <MenuItem value={-1}>Không</MenuItem>
                                {companyList.map((value, index) => <MenuItem value={value.id} key={index}>{value.id}.{value.company_name}</MenuItem>)}
                            </Text>
                        </div>
                        <div className="px-3 py-1">
                            <Text select size="small" fullWidth variant="outlined" label="Khoá học" value={courseID} onChange={(e) => setCourseID(e.target.value)}>
                                <MenuItem value={-1}>Không</MenuItem>
                                {courseList.map((value, index) => <MenuItem value={value.id} key={index}>{value.id}.{value.course_name}</MenuItem>)}
                            </Text>
                        </div>
                        <div className="px-3 py-1">
                            <Autocomplete
                                freeSolo
                                options={customerSelect}
                                value={selectedCustomer}
                                onChange={(event, newValue) => {
                                    setSelectedCustomer(newValue);
                                    setCustomerPhone(newValue ? newValue.value.customer_phone : "");
                                    setCustomerIdentification(newValue ? newValue.value.customer_identification : "");
                                }
                                }
                                renderInput={(params) => (
                                    <Text {...params} label="Họ và tên" variant="outlined" size="small" />
                                )}
                                inputValue={customerName}
                                onInputChange={(event, newInputValue) => {
                                    setCustomerName(newInputValue)
                                }} />
                        </div>
                        <div className="px-3 py-1">
                            <Text label="Số điện thoại" size="small" fullWidth variant="outlined"
                                value={customerPhone} InputProps={{ readOnly: true }} />
                        </div>
                        <div className="px-3 py-1">
                            <Text label="CMND/CCCD" size="small" fullWidth variant="outlined"
                                value={customerIdentification} InputProps={{ readOnly: true }} />
                        </div>
                        <div className="px-3 py-1">
                            <IconContext.Provider value={{ size: "30px" }}>
                                <Tooltip title="Thêm khách hàng">
                                    <div className="float-end ml-2">
                                        <IconButton color="success" onClick={() => onHandleChooseCustomer()}>
                                            <FaArrowCircleDown />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                            </IconContext.Provider>
                        </div>
                    </div>
                    <div className="w-full h-40 bg-blue-50 overflow-y-scroll">
                        <MaterialReactTable
                            table={table}
                        />
                    </div>
                </LocalizationProvider>
                <div className="pt-3">
                    <Button color="blue" className="float-end ml-2" onClick={() => onConfirmCheckin()}>Nhận phòng</Button>
                    <Button color="gray" className="float-end ml-2" onClick={() => dispatch(setOpenModalCheckIn(false))}>Huỷ</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}