import { Search } from "@mui/icons-material";
import { MenuItem, Tab, Tabs, TextField } from "@mui/material";
import { Button, Datepicker } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentIndex } from "../../redux_features/customerStatisticFeature";
import CustomerStatistic from "../../components/customer_statistic_components/customer_statistic";

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

    const customerStatisticFeature=useSelector(state=>state.customer_statistic);
    const dispatch=useDispatch();

    const handleChange=(e, newValue)=>{
        dispatch(setCurrentIndex(newValue))
    }

    return (
        <div className="p-2">
            <div className="w-full border-2 rounded-xl ">
                <div className="border-b-2 px-2">
                    <h1 className="font-bold text-blue-500">Thống kê khách hàng</h1>
                </div>
                <div className="justify-center flex flex-row gap-2 items-center w-full border-b-2">
                    <TextField variant="outlined" select size="small" label="Phân loại" sx={{ width: '200px' }} >
                        <MenuItem value={0}>Tất cả khách hàng</MenuItem>
                        <MenuItem value={1}>Khách hàng đã checkin</MenuItem>
                    </TextField>
                    <TextField variant="outlined" type="text" select size="small" label="Công ty" sx={{ width: '150px' }} >
                        <MenuItem value={-1}>Tất cả</MenuItem>

                    </TextField>
                    <TextField variant="outlined" type="text" select size="small" label="Khoá học" sx={{ width: '150px' }} >
                        <MenuItem value={-1}>Tất cả</MenuItem>

                    </TextField>
                    <span>Từ ngày</span>
                    <Datepicker
                        showClearButton={false}
                        showTodayButton={false}
                        language="VN"


                    />
                    <span>đến ngày</span>
                    <Datepicker
                        showClearButton={false}
                        showTodayButton={false}
                        language="VN"


                    />
                    <Button outline color="green">
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
                        <CustomerStatistic/>
                    </TabPanel>
                </div>
            </div>
        </div>

    )
}