import { Button, Modal } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalCheckIn } from "../../redux_features/floorFeature";
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
        },{
            accessorKey: 'bed_checkin',
            header: 'Checkin',
            size: '20'
        },{
            accessorKey: 'bed_checkout',
            header: 'Checkout',
            size: '20'
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
    });


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
        if (selectedCustomer && idBedType && checkinTime && checkoutTime) {
            if (checkinTime > checkoutTime) {
                toast.error('Ngày checkin và ngày checkout chưa hợp lệ')
            } else {
                const preValue = { ...selectedCustomer.value, id_bed_type: idBedType, bed_checkin:checkinTime.$d.toString(), bed_checkout:checkoutTime.$d.toString() }
                setPrepareCustomers([...prepareCustomers, preValue]);
                setIdBedType(-1);
                setCheckinTime(null);
                setCheckoutTime(null);
                setCustomerAddress("");
                setCustomerIdentification("");
                setCustomerName("");
                setCustomerPhone("");
            }

        }
    }


    return (
        <Modal size="5xl" show={floorFeature.openModalCheckIn} onClose={() => dispatch(setOpenModalCheckIn(false))}>
            <Modal.Body>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <center className="font-bold text-blue-500">Nhận phòng: {floorFeature.roomName}</center>
                    <div className="grid grid-cols-2 border-b-2 border-gray-300 p-2">
                        <div className="grid grid-cols-1 pr-5">
                            <Text size="small" label="Loại giường" fullWidth variant="outlined" select defaultValue={-1}
                                onChange={(e) => setIdBedType(e.target.value)}>
                                <MenuItem value={-1} disabled>Chọn loại giường</MenuItem>
                                {bedTypeSelect.map((value, key) => <MenuItem value={value.id} key={key}>{value.bed_type_name}</MenuItem>)}
                            </Text>
                            <div className="my-3 grid grid-cols-2">
                                <DateTime label="Ngày checkin" sx={{ width: "90%" }} value={checkinTime}
                                    onChange={(value) =>{setCheckinTime(value);console.log(value.$d.toString())}} format="DD/MM/YYYY hh:mm A"/>
                                <DateTime label="Ngày checkout" sx={{ width: "90%" }} value={checkoutTime}
                                    onChange={(value) => setCheckoutTime(value)} format="DD/MM/YYYY hh:mm A"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <Text label="Đơn giá theo ngày" fullWidth variant="outlined" size="small"
                                inputProps={{ readOnly: true }}
                                value={price ? price.price_day : '0'} />
                            <Text size="small" label="Trả trước" fullWidth variant="outlined" type="number" helperText="Vui lòng chỉ nhập ký tự số" />
                        </div>
                    </div>
                    <center className="font-bold text-blue-500">Thông tin khách hàng</center>
                    <div className="grid grid-cols-2 pt-2 border-b-2 border-gray-300">
                        <div className="px-3 py-1">
                            <Text select size="small" fullWidth variant="outlined" label="Đối tượng" defaultValue={-1} onChange={(e) => setIsStudent(e.target.value)}>
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
                                        <IconButton color="gray">
                                            <FaRedoAlt />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                                <Tooltip title="Tạo mới">
                                    <div className="float-end ml-2">
                                        <IconButton color="primary">
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
                    <Button color="blue" className="float-end ml-2">Nhận phòng</Button>
                    <Button color="gray" className="float-end ml-2" onClick={() => dispatch(setOpenModalCheckIn(false))}>Huỷ</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}