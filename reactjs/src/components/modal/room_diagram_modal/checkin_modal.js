import { Button, Modal } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalCheckIn, setRoomUpdateSuccess } from "../../../redux_features/floorFeature";
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
    const [idPrice,setIDPrice]=useState(-1);
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
    
    const [companyList,setCompanyList]=useState([]);
    const [courseList,setCourseList]=useState([]);
    const [priceList,setPriceList]=useState([]);

    const [companyID,setCompanyID]=useState(-1);
    const [courseID,setCourseID]=useState(-1);

    const [selectedCustomer, setSelectedCustomer] = useState(customerSelect[0]);

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
                    {new Date(row.original.bed_checkin).toLocaleString()}
                </Box>
            ),
        }, {
            header: 'Checkout',
            Cell: ({ renderedCellValue, row }) => (
                <Box className="flex items-center gap-4">
                    {new Date(row.original.bed_checkout).toLocaleString()}
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
        setCheckinTime(null);
        setCheckoutTime(null);
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
                if (error.response) {
                    toast.error("Lỗi lấy dữ liệu loại giường: " + error.response.data.error_code);
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
                if (error.response) {
                    toast.error('Dữ liệu công ty: ' + error.response.data.error_code);
                }
            })
        axios.get(process.env.REACT_APP_BACKEND + 'api/course/getEnableCourse', { withCredentials: true })
            .then(function (response) {
                setCourseList(response.data.result)
            }).catch(function (error) {
                if (error.response) {
                    toast.error('Dữ liệu khoá học: ' + error.response.data.error_code);
                }
            })
        }
    }, [floorFeature.openModalCheckIn])

    useEffect(()=>{
        let query = process.env.REACT_APP_BACKEND + 'api/customer/getAvaiableCustomerByCourseAndCompany?company=' + companyID + '&course=' + courseID;
            axios.get(query, { withCredentials: true })
                .then(function (response) {
                    let CustomersData=[];
                    response.data.result.forEach((value)=>{
                        delete value.Company;
                        delete value.Course;
                        delete value.Bed;
                        const row={label: value.customer_name, value:value}
                        CustomersData.push(row);
                    })
                    setCustomerSelect(CustomersData);
                    setSelectedCustomer({label:"",value:{}});
                }).catch(function (error) {
                    if (error.response) {
                        toast.error("Dữ liệu bảng: " + error.response.data.error_code);
                    }
                })
    },[companyID,courseID])

    useEffect(()=>{
        if(idBedType===-1){
            setPriceList([]);
            setIDPrice(-1);
        }else{
            axios.get(process.env.REACT_APP_BACKEND+'api/price/getPriceByIDBedType?id='+idBedType,{withCredentials:true})
            .then(function(response){
                setPriceList(response.data.result);
                for(let i=0;i<bedTypeSelect.length;i++){
                    if(idBedType===bedTypeSelect[i].id){
                        setIDPrice(bedTypeSelect[i].bed_type_default_price);
                        break;
                    }
                }
            }).catch(function(error){
                if(error.response){
                    toast.error(error.response.data.error_code);
                }
            })
        }
    },[idBedType,bedTypeSelect])

    const checkCustomerExist=(id_customer, list_customer)=>{
        for(let i=0;i<list_customer.length;i++){
            if(list_customer[i].id===id_customer)
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
            } else if (selectedCustomer.value.id){
                if(checkCustomerExist(selectedCustomer.value.id,prepareCustomers)){
                    const preValue = {
                        ...selectedCustomer.value, id_bed_type: idBedType,
                        bed_checkin: checkinTime.$d, bed_checkout: checkoutTime.$d,
                        bed_deposit: bedDeposit
                    }
                    setPrepareCustomers([...prepareCustomers, preValue]);
                    setBedDeposit("");
                    setCustomerPhone("");
                    setCustomerIdentification("");
                    setSelectedCustomer({label:"",value:{}});
                }else{
                    toast.error('Đã thêm khách hàng này vào phòng!')
                }
            } else {
                toast.error('Vui lòng kiểm tra lại thông tin!')
            }
        }
    }

    const onConfirmCheckin = () => {
        const msg = toast.loading('Đang xử lý...');
        axios.post(process.env.REACT_APP_BACKEND + 'api/bed/insertBeds', {
            id_room: floorFeature.roomID,
            array_bed: prepareCustomers
        }, { withCredentials: true })
            .then(function (response) {
                setPrepareCustomers([]);
                setCheckinTime(null);
                setCheckoutTime(null);
                dispatch(setRoomUpdateSuccess());
                dispatch(setOpenModalCheckIn(false));
                toast.update(msg, { render: 'Cập nhật thành công', isLoading: false, autoClose: 1000, closeOnClick: true })
            }).catch(function (error) {
                toast.update(msg, { type: 'error', render: 'Lỗi khi khởi tạo', isLoading: false, autoClose: 1000, closeOnClick: true })
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
                    <div className="grid grid-cols-2 border-b-2 border-gray-300 pt-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Text size="small" label="Loại giường" fullWidth variant="outlined" select value={idBedType}
                                onChange={(e) => setIdBedType(e.target.value)}>
                                <MenuItem value={-1} disabled>Chọn loại giường</MenuItem>
                                {bedTypeSelect.map((value, key) => <MenuItem value={value.id} key={key}>{value.bed_type_name}</MenuItem>)}
                            </Text>
                            <div className="flex flex-row gap-2">
                                <DateTime label="Ngày checkin" value={checkinTime}
                                    onChange={(value) => { setCheckinTime(value) }} format="DD/MM/YYYY hh:mm A" />
                                <DateTime label="Ngày checkout" value={checkoutTime}
                                    onChange={(value) => setCheckoutTime(value)} format="DD/MM/YYYY hh:mm A" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Text variant="outlined" label="Đơn giá áp dụng" fullWidth size="small" select disabled={idBedType===-1} 
                            value={idPrice} onChange={(e)=>setIDPrice(e.target.value)}>
                                <MenuItem value={-1} disabled>Chọn đơn giá</MenuItem>
                                {
                                    priceList.map((value,index)=><MenuItem value={value.id} key={index}>{value.price_name}</MenuItem>)
                                }
                            </Text>
                            <Text size="small" label="Trả trước" fullWidth variant="outlined" type="number" helperText="Vui lòng chỉ nhập ký tự số"
                                value={bedDeposit} onChange={(e) => setBedDeposit(e.target.value)} />
                        </div>
                    </div>
                    <center className="font-bold text-blue-500">Thông tin khách hàng</center>
                    <div className="grid grid-cols-2 pt-2 border-b-2 border-gray-300">
                        <div className="px-3 py-1">
                            <Text select size="small" fullWidth variant="outlined" label="Đơn vị" value={companyID} onChange={(e)=>setCompanyID(e.target.value)}>
                                <MenuItem value={-1}>Không</MenuItem>
                                {companyList.map((value,index)=><MenuItem value={value.id} key={index}>{value.id}.{value.company_name}</MenuItem>)}
                            </Text>
                        </div>
                        <div className="px-3 py-1">
                            <Text select size="small" fullWidth variant="outlined" label="Khoá học" value={courseID} onChange={(e)=>setCourseID(e.target.value)}>
                                <MenuItem value={-1}>Không</MenuItem>
                                {courseList.map((value,index)=><MenuItem value={value.id} key={index}>{value.id}.{value.course_name}</MenuItem>)}
                            </Text>
                        </div>
                        <div className="px-3 py-1">
                            <Autocomplete
                                freeSolo
                                options={customerSelect}
                                value={selectedCustomer}
                                onChange={(event, newValue) => {
                                    setSelectedCustomer(newValue);
                                        setCustomerPhone(newValue?newValue.value.customer_phone:"");
                                        setCustomerIdentification(newValue?newValue.value.customer_identification:"");
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
                                value={customerPhone} InputProps={{readOnly:true}}/>
                        </div>
                        <div className="px-3 py-1">
                            <Text label="CMND/CCCD" size="small" fullWidth variant="outlined"
                                value={customerIdentification} InputProps={{readOnly:true}} />
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