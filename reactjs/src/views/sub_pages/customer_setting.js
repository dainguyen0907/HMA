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
import CustomerImportFileModal from "../../components/modal/customer_modal/customer_import_file_modal";
import CustomerImportFileStatusModal from "../../components/modal/customer_modal/customer_import_file_status";



export default function CustomerSetting() {

    const [courses, setCourses] = useState([]);
    const [companies, setCompanies] = useState([]);

    const [courseID, setCourseID] = useState(-1);
    const [confirmCourseID, setConfirmCourseID] = useState(-1);
    const [companyID, setCompanyID] = useState(-1);
    const [confirmCompanyID, setConfirmCompanyID] = useState(-1);

    const [idType, setIDType] = useState(0);
    const [confirmIDType,setConfirmIDType]=useState(0);

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const customerFeature = useSelector(state => state.customer);

    const [dateStart, setDateStart] = useState(new Date().toLocaleDateString('vi-VI'));
    const [confirmDateStart, setConfirmDateStart] = useState(new Date().toLocaleDateString('vi-VI'));
    const [dateEnd, setDateEnd] = useState(new Date().toLocaleDateString('vi-VI'));
    const [confirmDateEnd, setConfirmDateEnd] = useState(new Date().toLocaleDateString('vi-VI'));

    const [isProcessing, setIsProcessing] = useState(false);

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
            header: 'Phân loại',
            Cell: ({ renderValue, row }) => (
                <Box>
                    {row.original.Beds && row.original.Beds.length > 0 ?
                        <span className="font-bold text-green-500">Đã có phòng</span> :
                        <span className="font-bold text-red-500">Chưa có phòng</span>}
                </Box>
            )
        }
    ], []);

    useEffect(() => {
        if (customerFeature.customerUpdateSuccess > 0) {
            dispatch(setOpenLoadingScreen(true));
            setIsLoading(true);
            let query = process.env.REACT_APP_BACKEND + 'api/customer/getCustomerInUsedByCourseAndCompany?company=' + confirmCompanyID
                + '&course=' + confirmCourseID + '&startdate=' + confirmDateStart + '&enddate=' + confirmDateEnd;
            if (confirmIDType === 0) {
                query = process.env.REACT_APP_BACKEND + 'api/customer/getCustomerByCourseAndCompany?company=' + confirmCompanyID
                    + '&course=' + confirmCourseID;
            }
            if(confirmIDType ===2){
                query = process.env.REACT_APP_BACKEND + 'api/customer/getRoomlessCustomerByCourseAndCompany?company=' + confirmCompanyID
                    + '&course=' + confirmCourseID;
            }
            axios.get(query, { withCredentials: true })
                .then(function (response) {
                    setData(response.data.result);
                    setIsLoading(false);
                }).catch(function (error) {
                    if (error.code === 'ECONNABORTED') {
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    } else if (error.response) {
                        toast.error('Khách hàng: ' + error.response.data.error_code);
                    } else {
                        toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                    }

                }).finally(function () {
                    dispatch(setOpenLoadingScreen(false));
                })
        }

    }, [customerFeature.customerUpdateSuccess, confirmCompanyID, confirmCourseID, confirmDateEnd, confirmDateStart, dispatch, confirmIDType])

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/company/getAll', { withCredentials: true })
            .then(function (response) {
                setCompanies(response.data.result)
            }).catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error('Công ty: ' + error.response.data.error_code);
                } else {
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            })
        axios.get(process.env.REACT_APP_BACKEND + 'api/course/getAll', { withCredentials: true })
            .then(function (response) {
                setCourses(response.data.result)
            }).catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error('Khoá học: ' + error.response.data.error_code);
                } else {
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            })
    }, [])



    const onDelete = (idCustomer) => {
        if (isProcessing)
            return;
        if (window.confirm("Bạn muốn xoá khách hàng này?")) {
            axios.post(process.env.REACT_APP_BACKEND + "api/customer/deleteCustomer", {
                id: idCustomer
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setCustomerUpdateSuccess());
                }).catch(function (error) {
                    if (error.code === 'ECONNABORTED') {
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    } else if (error.response) {
                        toast.error(error.response.data.error_code);
                    } else {
                        toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                    }
                }).finally(function () {
                    setIsProcessing(false);
                })
        }
    }

    const onHandleSearch = (e) => {
        const dayFrom = new Date(Date.UTC(dateStart.split('/')[2], dateStart.split('/')[1] - 1, dateStart.split('/')[0])).getTime();
        const dayTo = new Date(Date.UTC(dateEnd.split('/')[2], dateEnd.split('/')[1] - 1, dateEnd.split('/')[0])).getTime();
        if (idType === 1 && dayFrom > dayTo) {
            toast.error('Lựa chọn ngày chưa phù hợp! Vui lòng kiểm tra lại.');
        } else {
            dispatch(setCustomerUpdateSuccess());
            setConfirmCompanyID(companyID);
            setConfirmCourseID(courseID);
            setConfirmDateStart(dateStart);
            setConfirmDateEnd(dateEnd);
            setConfirmIDType(idType);
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
                    <MenuItem value={2}>Khách hàng chưa checkin</MenuItem>
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
                    onSelectedDateChanged={(e) => setDateStart(new Date(e).toLocaleDateString('vi-VI'))}
                    disabled={idType !== 1}
                />
                <span>đến ngày</span>
                <Datepicker
                    showClearButton={false}
                    showTodayButton={false}
                    language="VN"
                    value={dateEnd}
                    onSelectedDateChanged={(e) => setDateEnd(new Date(e).toLocaleDateString('vi-VI'))}
                    disabled={idType !== 1}
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