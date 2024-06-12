import { Button, Datepicker, Tooltip } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import CustomerModal from "../../components/modal/customer_modal/customer_modal";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import { Box, IconButton, MenuItem, TextField } from "@mui/material";
import { AddCircleOutline, Delete, Edit, Search } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerSelection, setCustomerUpdateSuccess, setOpenCustomerImportFileModal, setOpenCustomerModal } from "../../redux_features/customerFeature";
import { setOpenLoadingScreen } from "../../redux_features/baseFeature";
import { download, generateCsv, mkConfig } from "export-to-csv";
import CustomerImportFileModal from "../../components/modal/customer_modal/customer_import_file_modal";
import CustomerImportFileStatusModal from "../../components/modal/customer_modal/customer_import_file_status";

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: 'Customer_list'
})

export default function CustomerSetting() {

    const [courses, setCourses] = useState([]);
    const [companies, setCompanies] = useState([]);

    const [courseID, setCourseID] = useState(-1);
    const [confirmCourseID, setConfirmCourseID] = useState(-1);
    const [companyID, setCompanyID] = useState(-1);
    const [confirmCompanyID, setConfirmCompanyID] = useState(-1);

    const [idType, setIDType] = useState(0);

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const customerFeature = useSelector(state => state.customer);

    const [dateStart, setDateStart] = useState(new Date().toLocaleDateString());
    const [confirmDateStart, setConfirmDateStart] = useState(new Date().toLocaleDateString());
    const [dateEnd, setDateEnd] = useState(new Date().toLocaleDateString());
    const [confirmDateEnd, setConfirmDateEnd] = useState(new Date().toLocaleDateString());

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'id',
            size: '1'
        },
        {
            accessorKey: 'customer_identification',
            header: 'CCCD',
            size: '10'
        },
        {
            accessorKey: 'customer_name',
            header: 'Tên khách hàng',
            size: '50'
        },
        {
            accessorKey: 'customer_gender',
            header: 'Giới tính',
            Cell: ({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                    {row.original.customer_gender ? "Nam" : "Nữ"}
                </Box>
            ),
            size: '10'
        },
        {
            accessorKey: 'customer_phone',
            header: 'Số điện thoại',
            size: '12'
        },
        {
            accessorKey: 'Company.company_name',
            header: 'Công ty'
        },
        {
            accessorKey: 'Course.course_name',
            header: 'Khoá học',
        },
        {
            header: 'Phòng',
            Cell: ({ renderValue, row }) => (
                <Box>
                    {row.original.Bed ? row.original.Bed.Room.room_name : <span className="text-red-500 font-bold">Chưa có phòng</span>}
                </Box>
            ),
            size: '10'
        }, {
            header: 'Phân loại',
            Cell: ({ renderValue, row }) => (
                <Box>
                    {row.original.Bed ? ((new Date(row.original.Bed.bed_checkout) - new Date(row.original.Bed.bed_checkin)) / 1000) > 21600 ?
                        <span className="text-blue-500">Nghỉ đêm</span> : <span className="text-green-500">Nghỉ trưa</span> : <span className="text-red-500">Chưa xác định</span>}
                </Box>
            ),
            size: '10'
        }
    ], []);

    useEffect(() => {
        if(customerFeature.customerUpdateSuccess>0){
            dispatch(setOpenLoadingScreen(true));
            setIsLoading(true);
            let query = process.env.REACT_APP_BACKEND + 'api/customer/getCustomerInUsedByCourseAndCompany?company=' + confirmCompanyID
                + '&course=' + confirmCourseID + '&startdate=' + confirmDateStart + '&enddate=' + confirmDateEnd;
            if (idType === 0) {
                query = process.env.REACT_APP_BACKEND + 'api/customer/getCustomerByCourseAndCompany?company=' + confirmCompanyID
                    + '&course=' + confirmCourseID;
            }
            axios.get(query, { withCredentials: true })
                .then(function (response) {
                    setData(response.data.result);
                    setIsLoading(false);
                    dispatch(setOpenLoadingScreen(false));
                }).catch(function (error) {
                    if (error.response) {
                        toast.error("Dữ liệu bảng: " + error.response.data.error_code);
                    }
                    dispatch(setOpenLoadingScreen(false));
                })
        }
        
    }, [customerFeature.customerUpdateSuccess, confirmCompanyID, confirmCourseID, confirmDateEnd, confirmDateStart, dispatch, idType])

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/company/getAll', { withCredentials: true })
            .then(function (response) {
                setCompanies(response.data.result)
            }).catch(function (error) {
                if (error.response) {
                    toast.error('Dữ liệu công ty: ' + error.response.data.error_code);
                }
            })
        axios.get(process.env.REACT_APP_BACKEND + 'api/course/getAll', { withCredentials: true })
            .then(function (response) {
                setCourses(response.data.result)
            }).catch(function (error) {
                if (error.response) {
                    toast.error('Dữ liệu khoá học: ' + error.response.data.error_code);
                }
            })
    }, [])



    const onDelete = (idCustomer) => {
        if (window.confirm("Bạn muốn xoá khách hàng này?")) {
            axios.post(process.env.REACT_APP_BACKEND + "api/customer/deleteCustomer", {
                id: idCustomer
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setCustomerUpdateSuccess());
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                });
        }
    }

    const onHandleExportFile = (e) => {
        if (data.length > 0) {
            let exportList = [];
            data.forEach((value, index) => {
                let count_day = 0;
                let count_night = 0;
                if (value.Beds) {
                    const checkin = new Date(value.Beds[0].bed_checkin);
                    const checkout = new Date(value.Beds[0].bed_checkout);
                    count_night = (Math.floor((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24))) + 1;
                    const hours = checkout.getHours() - 12;
                    if (hours > 0)
                        count_day = 1;
                }
                const row = {
                    no: index + 1,
                    customerName: value.customer_name,
                    customerGender: value.customer_gender ? 'Nam' : 'Nữ',
                    company: value.Company ? value.Company.company_name : "",
                    course: value.Course ? value.Course.course_name : "",
                    customerPhone: value.customer_phone,
                    customerIdentification: value.customer_identification,
                    room: value.Beds ? value.Beds[0].Room.room_name : "",
                    checkinDate: value.Beds ? new Date(value.Beds[0].bed_checkin).toLocaleDateString() : "",
                    checkoutDate: value.Beds ? new Date(value.Beds[0].bed_checkout).toLocaleDateString() : "",
                    standOnDay: count_day,
                    unitPriceOnDay: value.Beds && value.Beds[0].Price ? value.Beds[0].Price.price_hour : "",
                    standOnNight: count_night,
                    unitPriceOnNight: value.Beds && value.Beds[0].Price ? value.Beds[0].Price.price_day : "",
                }
                exportList.push(row)
            })
            const csv = generateCsv(csvConfig)(exportList);
            download(csvConfig)(csv);
        } else {
            toast.error("Không có dữ liệu để xuất!");
        }
    }

    const onHandleSearch = (e) => {
        const dayFrom = new Date(Date.UTC(dateStart.split('/')[2], dateStart.split('/')[1] - 1, dateStart.split('/')[0])).getTime();
        const dayTo = new Date(Date.UTC(dateEnd.split('/')[2], dateEnd.split('/')[1] - 1, dateEnd.split('/')[0])).getTime();
        if (idType===1&&dayFrom > dayTo) {
            toast.error('Lựa chọn ngày chưa phù hợp! Vui lòng kiểm tra lại.');
        } else {
            dispatch(setCustomerUpdateSuccess());
            setConfirmCompanyID(companyID);
            setConfirmCourseID(courseID);
            setConfirmDateStart(dateStart);
            setConfirmDateEnd(dateEnd);
        }

    }

    return (<div className="w-full h-full p-2">
        <div className="border-2 rounded-xl w-full h-full">
            <div className="border-b-2 p-3">
                <h1 className="font-bold text-blue-600">Danh sách khách hàng</h1>
            </div>
            <div className="justify-center flex flex-row gap-2 items-center w-full">
                <TextField variant="outlined" select size="small" label="Phân loại" sx={{ width: '200px' }} value={idType} onChange={(e) => setIDType(e.target.value)}>
                    <MenuItem value={0}>Tất cả khách hàng</MenuItem>
                    <MenuItem value={1}>Khách hàng đã checkin</MenuItem>
                </TextField>
                <TextField variant="outlined" type="text" select size="small" label="Công ty" sx={{ width: '150px' }} value={companyID}
                    onChange={(e) => setCompanyID(e.target.value)}>
                    <MenuItem value={-1}>Tất cả</MenuItem>
                    {companies.map((value, index) => <MenuItem value={value.id} key={index}>{value.id}.{value.company_name}</MenuItem>)}
                </TextField>
                <TextField variant="outlined" type="text" select size="small" label="Khoá học" sx={{ width: '150px' }} value={courseID}
                    onChange={(e) => setCourseID(e.target.value)}>
                    <MenuItem value={-1}>Tất cả</MenuItem>
                    {courses.map((value, index) => <MenuItem value={value.id} key={index}>{value.id}.{value.course_name}</MenuItem>)}
                </TextField>
                <span>Từ ngày</span>
                <Datepicker
                    showClearButton={false}
                    showTodayButton={false}
                    language="VN"
                    value={dateStart}
                    onSelectedDateChanged={(e) => setDateStart(new Date(e).toLocaleDateString())}
                    disabled={idType === 0}
                />
                <span>đến ngày</span>
                <Datepicker
                    showClearButton={false}
                    showTodayButton={false}
                    language="VN"
                    value={dateEnd}
                    onSelectedDateChanged={(e) => setDateEnd(new Date(e).toLocaleDateString())}
                    disabled={idType === 0}
                />
                <Button onClick={onHandleSearch} outline color="green">
                    <Search />
                </Button>
            </div>

            <div className="w-full h-full">
                <MaterialReactTable
                    columns={columns}
                    data={data}
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
                    localization={MRT_Localization_VI}
                    enableRowActions
                    positionActionsColumn="last"
                    renderTopToolbarCustomActions={(table) => (
                        <div className="flex flex-row gap-2">
                            <Button size="sm" outline gradientMonochrome="success"
                                onClick={() => {
                                    dispatch(setCustomerSelection(null));
                                    dispatch(setOpenCustomerModal(true));
                                }}>
                                <AddCircleOutline /> Thêm khách hàng
                            </Button>
                            <Button size="sm" outline gradientMonochrome="success"
                                onClick={() => {
                                    dispatch(setOpenCustomerImportFileModal(true));
                                }}>
                                <AddCircleOutline /> Nhập file CSV
                            </Button>
                            <Button size="sm" outline gradientMonochrome="success"
                                onClick={onHandleExportFile}>
                                <AddCircleOutline /> Xuất file CSV
                            </Button>
                        </div>
                    )}
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                            <Tooltip content="Sửa thông tin">
                                <IconButton color="primary"
                                    onClick={() => {
                                        dispatch(setCustomerSelection(row.original));
                                        dispatch(setOpenCustomerModal(true));
                                    }}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip content="Xoá khách hàng">
                                <IconButton color="error"
                                    onClick={() => {
                                        onDelete(row.original.id)
                                    }}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                />
                <CustomerModal />
                <CustomerImportFileModal />
                <CustomerImportFileStatusModal />
            </div>
        </div>
    </div>)
}