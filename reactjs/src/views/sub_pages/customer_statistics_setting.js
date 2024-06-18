import { Search } from "@mui/icons-material";
import { MenuItem, Tab, Tabs, TextField } from "@mui/material";
import { Button, Datepicker } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentIndex, setCustomerTable, setEndSearchDate, setStartSearchDate } from "../../redux_features/customerStatisticFeature";
import CustomerStatistic from "../../components/customer_statistic_components/customer_statistic";
import CustomerTable from "../../components/customer_statistic_components/customer_table";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { setOpenLoadingScreen } from "../../redux_features/baseFeature";

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
    const [startDate, setStartDate] = useState(new Date().toLocaleDateString());
    const [endDate, setEndDate] = useState(new Date().toLocaleDateString());

    useEffect(()=>{
        axios.get(process.env.REACT_APP_BACKEND + 'api/company/getAll', { withCredentials: true })
            .then(function (response) {
                setCompanyList(response.data.result)
            }).catch(function (error) {
                if (error.response) {
                    toast.error('Dữ liệu công ty: ' + error.response.data.error_code);
                }
            })
        axios.get(process.env.REACT_APP_BACKEND + 'api/course/getAll', { withCredentials: true })
            .then(function (response) {
                setCourseList(response.data.result)
            }).catch(function (error) {
                if (error.response) {
                    toast.error('Dữ liệu khoá học: ' + error.response.data.error_code);
                }
            })
    },[])

    const handleChange = (e, newValue) => {
        dispatch(setCurrentIndex(newValue))
    }

    const onHandleSearch = (e) => {
        const dayFrom = new Date(startDate.split('/')[2], startDate.split('/')[1], startDate.split('/')[0]);
        const dayTo = new Date(endDate.split('/')[2], endDate.split('/')[1], endDate.split('/')[0]);
        if (dayFrom>dayTo) {
            toast.error('Ngày bắt đầu và ngày kết thúc chưa phù hợp.');
        } else {
            dispatch(setStartSearchDate(startDate));
            dispatch(setEndSearchDate(endDate));
            dispatch(setOpenLoadingScreen(true));
            axios.get(process.env.REACT_APP_BACKEND + 'api/bed/getCheckoutedBed?course=' + idCourse + '&company=' + idCompany +
                '&startdate=' + startDate + '&enddate=' + endDate, { withCredentials: true }
            ).then(function (response) {
                dispatch(setCustomerTable(response.data.result))
                dispatch(setOpenLoadingScreen(false));
            }).catch(function (error) {
                if (error.response) {
                    toast.error("Dữ liệu bảng: " + error.response.data.error_code);
                }
                dispatch(setOpenLoadingScreen(false));
            })
        }

    }

    return (
        <div className="p-2">
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
                        onSelectedDateChanged={(newValue) => setStartDate(new Date(newValue).toLocaleDateString())}
                    />
                    <span>đến ngày</span>
                    <Datepicker
                        showClearButton={false}
                        showTodayButton={false}
                        language="VN"
                        value={endDate}
                        onSelectedDateChanged={(newValue) => setEndDate(new Date(newValue).toLocaleDateString())}
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
                        sx={{ borderRight: 1, borderColor: 'divider' }}
                    >
                        <Tab sx={{ fontWeight: '700', color: '#1A56DB' }} label="Tổng hợp" {...a11yProps(0)} value={0} />
                        <Tab sx={{ fontWeight: '700', color: '#1A56DB' }} label="Dữ liệu bảng" {...a11yProps(1)} value={1} />
                        <Tab sx={{ fontWeight: '700', color: '#1A56DB' }} label="Biểu đồ" {...a11yProps(2)} value={2} />
                    </Tabs>
                    <TabPanel value={customerStatisticFeature.currentIndex} index={0}>
                        <CustomerStatistic />
                    </TabPanel>
                    <TabPanel value={customerStatisticFeature.currentIndex} index={1}>
                        <CustomerTable />
                    </TabPanel>
                </div>
            </div>
        </div>

    )
}