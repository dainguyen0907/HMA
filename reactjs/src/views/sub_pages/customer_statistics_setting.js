import { Search } from "@mui/icons-material";
import { MenuItem, Tab, Tabs, TextField } from "@mui/material";
import { Button, Datepicker } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setCompanyNameTitle, setCountUpdateSuccess, setCourseNameTitle, setCurrentIndex, setCustomerTable, setEndSearchDate, setIdCompany, setIdCourse, setStartSearchDate } from "../../redux_features/customerStatisticFeature";
import CustomerStatistic from "../../components/customer_statistic_components/customer_statistic";
import CustomerTable from "../../components/customer_statistic_components/customer_table";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { setOpenLoadingScreen } from "../../redux_features/baseFeature";
import BedUpdateModal from "../../components/modal/customer_statistic_modal/bed_update_modal";
import { CustomerStatisticByClass } from "../../components/customer_statistic_components/customer_statistic_by_class";
import CustomerStatisticByRoom from "../../components/customer_statistic_components/customer_statistic_by_room";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index}
            id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`}
            {...other} className="w-full h-full overflow-auto"
        >
            {value === index && (
                <div className="p-2">
                    {children}
                </div>
            )}
        </div>
    )
}


function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function CustomerStatisticsSetting() {

    const customerStatisticFeature = useSelector(state => state.customer_statistic);
    const dispatch = useDispatch();

    const [companyList, setCompanyList] = useState([]);
    const [idCompany, setIDCompany] = useState(-1);
    const [courseList, setCourseList] = useState([]);
    const [idCourse, setIDCourse] = useState(-1);
    const [startDate, setStartDate] = useState(new Date().toLocaleDateString('vi-VI'));
    const [endDate, setEndDate] = useState(new Date().toLocaleDateString('vi-VI'));

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/company/getAll', { withCredentials: true })
            .then(function (response) {
                setCompanyList(response.data.result)
            }).catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error('Công ty: ' + error.response.data.error_code);
                } else {
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            });
            axios.get(process.env.REACT_APP_BACKEND + 'api/course/getDisableCourse', { withCredentials: true })
            .then(function (response) {
                setCourseList(response.data.result)
            }).catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error('Công ty: ' + error.response.data.error_code);
                } else {
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            })
    }, [])

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/course/get/coursesStartedDuringThePeriod?startdate=' + startDate +
            '&enddate=' + endDate, { withCredentials: true })
            .then(function (response) {
                setCourseList(response.data.result)
            }).catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error('Khoá học: ' + error.response.data.error_code);
                } else {
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            })
    }, [startDate, endDate])

    const handleChange = (e, newValue) => {
        dispatch(setCurrentIndex(newValue))
    }

    useEffect(() => {
        if (customerStatisticFeature.countUpdateSuccess > 0) {
            const dayFrom = new Date(customerStatisticFeature.startSearchDate.split('/')[2], customerStatisticFeature.startSearchDate.split('/')[1], customerStatisticFeature.startSearchDate.split('/')[0]);
            const dayTo = new Date(customerStatisticFeature.endSearchDate.split('/')[2], customerStatisticFeature.endSearchDate.split('/')[1], customerStatisticFeature.endSearchDate.split('/')[0]);
            if (dayFrom > dayTo) {
                toast.error('Ngày bắt đầu và ngày kết thúc chưa phù hợp.');
            } else {
                dispatch(setOpenLoadingScreen(true));
                axios.get(process.env.REACT_APP_BACKEND + 'api/bed/getCheckoutedBed?course=' + customerStatisticFeature.idCourse + '&company=' + customerStatisticFeature.idCompany +
                    '&startdate=' + customerStatisticFeature.startSearchDate + '&enddate=' + customerStatisticFeature.endSearchDate, { withCredentials: true }
                ).then(function (response) {
                    dispatch(setCustomerTable(response.data.result))
                }).catch(function (error) {
                    if (error.code === 'ECONNABORTED') {
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    } else if (error.response) {
                        toast.error('Thông tin giường: ' + error.response.data.error_code);
                    } else {
                        toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                    }
                }).finally(function () {
                    dispatch(setOpenLoadingScreen(false));
                })
            }
        }
    }, [customerStatisticFeature.countUpdateSuccess, customerStatisticFeature.idCourse, customerStatisticFeature.idCompany, customerStatisticFeature.startSearchDate, customerStatisticFeature.endSearchDate, dispatch])



    const onHandleSearch = (e) => {
        dispatch(setStartSearchDate(startDate));
        dispatch(setEndSearchDate(endDate));
        dispatch(setIdCompany(idCompany));
        dispatch(setIdCourse(idCourse));
        dispatch(setCountUpdateSuccess());
        if (idCompany === -1)
            dispatch(setCompanyNameTitle('Tất cả công ty'));
        else
            for (let i = 0; i < companyList.length; i++) {
                if (companyList[i].id === idCompany) {
                    dispatch(setCompanyNameTitle(companyList[i].company_name));
                    break;
                }
            }
        if (idCourse === -1)
            dispatch(setCourseNameTitle('Tất cả khoá học'));
        else
            for (let i = 0; i < courseList.length; i++) {
                if (courseList[i].id === idCourse) {
                    dispatch(setCourseNameTitle(courseList[i].course_name));
                    break;
                }
            }
    }

    return (
        <div className="p-2 min-h-[400px]">
            <div className="w-full border-2 rounded-xl ">
                <div className="border-b-2 px-2">
                    <h1 className="font-bold text-blue-500">Thống kê khách hàng</h1>
                </div>
                <div className="justify-center flex flex-row gap-2 items-center w-full border-b-2">
                    <TextField variant="outlined" type="text" select size="small" label="Công ty" sx={{ width: '150px' }}
                        value={idCompany} onChange={(e) => setIDCompany(e.target.value)}>
                        <MenuItem value={-1}>Tất cả</MenuItem>
                        {companyList.map((value, index) => <MenuItem value={value.id} key={index}>{value.id}.{value.company_name}</MenuItem>)}
                    </TextField>
                    <TextField variant="outlined" type="text" select size="small" label="Khoá học" sx={{ width: '150px' }}
                        value={idCourse} onChange={(e) => setIDCourse(e.target.value)}>
                        <MenuItem value={-1}>Tất cả</MenuItem>
                        {courseList.map((value, index) => <MenuItem value={value.id} key={index}>{value.id}.{value.course_name}</MenuItem>)}
                    </TextField>
                    <span>Từ ngày</span>
                    <Datepicker
                        showClearButton={false}
                        showTodayButton={false}
                        language="VN"
                        value={startDate}
                        onSelectedDateChanged={(newValue) => setStartDate(new Date(newValue).toLocaleDateString('vi-VI'))}
                    />
                    <span>đến ngày</span>
                    <Datepicker
                        showClearButton={false}
                        showTodayButton={false}
                        language="VN"
                        value={endDate}
                        onSelectedDateChanged={(newValue) => setEndDate(new Date(newValue).toLocaleDateString('vi-VI'))}
                    />
                    <Button outline color="green" onClick={onHandleSearch}>
                        <Search />
                    </Button>
                </div>
                <div className="h-full p-2 flex">
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={customerStatisticFeature.currentIndex}
                        onChange={handleChange}
                        sx={{ borderRight: 1, borderColor: 'divider', maxWidth:'100px' }}
                    >
                        <Tab sx={{ fontWeight: '600', color: '#1A56DB' }} label="Tổng hợp" {...a11yProps(0)} value={0} />
                        <Tab sx={{ fontWeight: '600', color: '#1A56DB' }} label="Bảng tổng hợp" {...a11yProps(1)} value={1} />
                        <Tab sx={{ fontWeight: '600', color: '#1A56DB' }} label="theo lớp" {...a11yProps(1)} value={2} />
                        <Tab sx={{ fontWeight: '600', color: '#1A56DB' }} label="theo phòng" {...a11yProps(1)} value={3} />
                    </Tabs>
                    <TabPanel value={customerStatisticFeature.currentIndex} index={0}>
                        <CustomerStatistic />
                    </TabPanel>
                    <TabPanel value={customerStatisticFeature.currentIndex} index={1}>
                        <CustomerTable />
                    </TabPanel>
                    <TabPanel value={customerStatisticFeature.currentIndex} index={2}>
                        <CustomerStatisticByClass/>
                    </TabPanel>
                    <TabPanel value={customerStatisticFeature.currentIndex} index={3}>
                        <CustomerStatisticByRoom/>
                    </TabPanel>
                </div>
                <BedUpdateModal />
            </div>
        </div>

    )
}