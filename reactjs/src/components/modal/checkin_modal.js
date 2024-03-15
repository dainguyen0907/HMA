import { Button, Modal } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalCheckIn, setRoomUpdateSuccess } from "../../redux_features/floorFeature";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from "@mui/material/TextField";
import { Autocomplete, Box, IconButton, MenuItem, Radio, Tooltip, styled } from "@mui/material";
import { FaPlusCircle } from "react-icons/fa";
import { FaArrowCircleDown } from "react-icons/fa";
import { FaRedoAlt } from "react-icons/fa";
import { IconContext } from "react-icons";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import axios from "axios";
import { toast } from "react-toastify";
import { Delete } from "@mui/icons-material"

const Text = styled(TextField)(({ theme }) => ({
    '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input:focus': {
        '--tw-ring-shadow': 'none'
    },
    '.css-7209ej-MuiInputBase-input-MuiFilledInput-input:focus': {
        '--tw-ring-shadow': 'none'
    }
}));

const DateTime = styled(DateTimePicker)(({ theme }) => ({
    '.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input:focus': {
        '--tw-ring-shadow': 'none'
    }
}))

export default function CheckInModal() {

    const dispatch = useDispatch();
    const [idBedType, setIdBedType] = useState(-1);
    const [checkinTime, setCheckinTime] = useState(null);
    const [checkoutTime, setCheckoutTime] = useState(null);
    const [price, setPrice] = useState({});
    const [bedDeposit, setBedDeposit] = useState("");
    const floorFeature = useSelector(state => state.floor);
    const [prepareCustomers, setPrepareCustomers] = useState([]);
    const [isStudent, setIsStudent] = useState(-1);
    const [customerSelect, setCustomerSelect] = useState([]);
    const [bedTypeSelect, setBedTypeSelect] = useState([]);
    const unchange = 0;

    const [customerName, setCustomerName] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerIdentification, setCustomerIdentification] = useState("");

    const [selectedCustomer, setSelectedCustomer] = useState(customerSelect[0]);

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'Mã số',
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
            header: 'Là sinh viên',
            Cell: ({ renderedCellValue, row }) => (
                <Box className="flex items-center gap-4">
                    <Radio className="ml-10" checked={Boolean(row.original.customer_student_check)} disabled />
                </Box>
            ),
        }, {
            header: 'Checkin',
            Cell: ({ renderedCellValue, row }) => (
                <Box className="flex items-center gap-4">
                    {row.original.bed_checkin.toString()}
                </Box>
            ),
        }, {
            header: 'Checkout',
            Cell: ({ renderedCellValue, row }) => (
                <Box className="flex items-center gap-4">
                    {row.original.bed_checkout.toString()}
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

    useEffect(()=>{
        setIdBedType(-1);
        setCheckinTime(null);
        setCheckoutTime(null);
        setBedDeposit("");
        setIsStudent(-1);
        setCustomerAddress("");
        setCustomerIdentification("");
        setCustomerName("");
        setCustomerPhone("");
        setPrepareCustomers([]);
    },[floorFeature.openModalCheckIn])


    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/bedtype/getAll', { withCredentials: true })
            .then(function (response) {
                setBedTypeSelect(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }, [unchange]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/price/getPriceByID?id=' + idBedType, { withCredentials: true })
            .then(function (response) {
                setPrice(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }, [idBedType])

    useEffect(() => {
        setSelectedCustomer(null);
        setCustomerName("");
        if (isStudent !== -1) {
            let query = 'api/customer/getCustomerByType';
            if (isStudent) {
                query += '?isstudent=1';
            }
            axios.get(process.env.REACT_APP_BACKEND + query, { withCredentials: true })
                .then(function (response) {
                    let array = [];
                    response.data.result.forEach((value, index) => {
                        array.push({ label: value.customer_name, value: value })
                    })
                    setCustomerSelect(array);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        }
    }, [isStudent])


    const onHandleChooseCustomer = () => {
        if (selectedCustomer && idBedType&& checkinTime && checkoutTime) {
            if(idBedType===-1){
                toast.error('Hãy chọn loại giường')
                console.log(idBedType);
            }else if (checkinTime > checkoutTime) {
                toast.error('Ngày checkin và ngày checkout chưa hợp lệ')
            } else {
                const preValue = {
                    ...selectedCustomer.value, id_bed_type: idBedType,
                    bed_checkin: checkinTime.$d, bed_checkout: checkoutTime.$d,
                    bed_deposit: bedDeposit
                }
                setPrepareCustomers([...prepareCustomers, preValue]);
                setCustomerAddress("");
                setBedDeposit("");
                setCustomerIdentification("");
                setCustomerName("");
                setCustomerPhone("");
                setIsStudent(-1);
                setCustomerSelect([]);
            }
        }
    }

    const onHandleReset = () => {
        setIsStudent(-1);
        setCustomerAddress("");
        setBedDeposit("");
        setCustomerIdentification("");
        setCustomerName("");
        setCustomerPhone("");
        setCheckinTime(null);
        setCheckoutTime(null);
        setCustomerSelect([]);
    }

    const onHandleCreate = () => {
        if (window.confirm('Bạn muốn tạo mới khách hàng này?')) {
            if (customerName && customerIdentification &&
                customerPhone && idBedType && checkinTime && checkoutTime) {
                if (checkinTime > checkoutTime) {
                    toast.error('Ngày checkin và ngày checkout chưa hợp lệ')
                } else {
                    axios.post(process.env.REACT_APP_BACKEND + "api/customer/insertCustomer", {
                        name: customerName,
                        gender: true,
                        email: null,
                        address: customerAddress,
                        phone: customerPhone,
                        identification: customerIdentification,
                        student_check: isStudent,
                        dob: null,
                        student_code: null,
                        classroom: null,
                        pob: null
                    }, { withCredentials: true })
                        .then(function (response) {
                            const preValue = {
                                ...response.data.result, id_bed_type: idBedType,
                                bed_checkin: checkinTime.$d, bed_checkout: checkoutTime.$d,
                                bed_deposit: bedDeposit
                            }
                            setPrepareCustomers([...prepareCustomers, preValue]);
                            setCustomerAddress("");
                            setBedDeposit("");
                            setCustomerIdentification("");
                            setCustomerName("");
                            setCustomerPhone("");
                            setCustomerSelect([]);
                            setIsStudent(-1);
                        }).catch(function (error) {
                            if (error.response) {
                                toast.error(error.response.data.error_code);
                            }
                        });
                }
            } else {
                toast.error("Vui lòng nhập đầy đủ thông tin");
            }
        }
    }

    const onConfirmCheckin = () => {
        const msg = toast.loading('Đang xử lý...');
        axios.post(process.env.REACT_APP_BACKEND + 'api/bed/insertBeds', {
            id_room: floorFeature.roomID,
            array_bed:prepareCustomers
        }, { withCredentials: true })
            .then(function (response) {
                setPrepareCustomers([]);
                setCheckinTime(null);
                setCheckoutTime(null);
                dispatch(setRoomUpdateSuccess());
                dispatch(setOpenModalCheckIn(false));
                toast.update(msg, { render: 'Cập nhật thành công', isLoading: false, autoClose: 1000, closeOnClick: true })
            }).catch(function (error) {
                toast.update(msg, { type:'error', render: 'Lỗi khi khởi tạo', isLoading: false, autoClose: 1000, closeOnClick: true })
            })
    }

    return (
        <Modal size="5xl" show={floorFeature.openModalCheckIn} onClose={() => dispatch(setOpenModalCheckIn(false))}>
            <Modal.Body>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <center className="font-bold text-blue-500">Nhận phòng: {floorFeature.roomName}</center>
                    <div className="grid grid-cols-2 border-b-2 border-gray-300 p-2">
                        <div className="grid grid-cols-1 pr-5">
                            <Text size="small" label="Loại giường" fullWidth variant="outlined" select value={idBedType}
                                onChange={(e) => setIdBedType(e.target.value)}>
                                <MenuItem value={-1} disabled>Chọn loại giường</MenuItem>
                                {bedTypeSelect.map((value, key) => <MenuItem value={value.id} key={key}>{value.bed_type_name}</MenuItem>)}
                            </Text>
                            <div className="my-3 grid grid-cols-2">
                                <DateTime label="Ngày checkin" sx={{ width: "90%" }} value={checkinTime}
                                    onChange={(value) => { setCheckinTime(value) }} format="DD/MM/YYYY hh:mm A"/>
                                <DateTime label="Ngày checkout" sx={{ width: "90%" }} value={checkoutTime}
                                    onChange={(value) => setCheckoutTime(value)} format="DD/MM/YYYY hh:mm A" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <Text label="Đơn giá theo ngày" fullWidth variant="outlined" size="small"
                                inputProps={{ readOnly: true }}
                                value={price ? price.price_day : '0'} />
                            <Text size="small" label="Trả trước" fullWidth variant="outlined" type="number" helperText="Vui lòng chỉ nhập ký tự số"
                                value={bedDeposit} onChange={(e) => setBedDeposit(e.target.value)} />
                        </div>
                    </div>
                    <center className="font-bold text-blue-500">Thông tin khách hàng</center>
                    <div className="grid grid-cols-2 pt-2 border-b-2 border-gray-300">
                        <div className="px-3 py-1">
                            <Text select size="small" fullWidth variant="outlined" label="Đối tượng" value={isStudent} onChange={(e) => setIsStudent(e.target.value)}>
                                <MenuItem value={-1} disabled>Chọn đối tượng</MenuItem>
                                <MenuItem value={false}>Khách hàng</MenuItem>
                                <MenuItem value={true}>Sinh viên</MenuItem>
                            </Text>
                        </div>
                        <div className="px-3 py-1">
                            <Autocomplete
                                freeSolo
                                options={customerSelect}
                                value={selectedCustomer}
                                onChange={(event, newValue) => {
                                    setSelectedCustomer(newValue);
                                    if (newValue) {
                                        setCustomerAddress(newValue.value.customer_address);
                                        setCustomerPhone(newValue.value.customer_phone);
                                        setCustomerIdentification(newValue.value.customer_identification);
                                    }
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
                            <Text label="Địa chỉ" size="small" fullWidth variant="outlined"
                                value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
                        </div>
                        <div className="px-3 py-1">
                            <Text label="Số điện thoại" size="small" fullWidth variant="outlined"
                                value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                        </div>
                        <div className="px-3 py-1">
                            <Text label="CMND/CCCD" size="small" fullWidth variant="outlined"
                                value={customerIdentification} onChange={(e) => setCustomerIdentification(e.target.value)} />
                        </div>
                        <div className="px-3 py-1">
                            <IconContext.Provider value={{ size: "30px" }}>
                                <Tooltip title="Reset">
                                    <div className="float-end ml-2">
                                        <IconButton color="gray" onClick={() => onHandleReset()}>
                                            <FaRedoAlt />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                                <Tooltip title="Tạo mới">
                                    <div className="float-end ml-2">
                                        <IconButton color="primary" onClick={() => onHandleCreate()}>
                                            <FaPlusCircle />
                                        </IconButton>
                                    </div>
                                </Tooltip>
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