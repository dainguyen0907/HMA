import { Button, Datepicker, Label } from "flowbite-react";
import React, { useState } from "react";
import { IconContext } from "react-icons";
import { BiSearch } from "react-icons/bi";
import { Tab, Tabs } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentIndex, setFromDate, setToDay } from "../../redux_features/revenueFeature";
import MainRevenueTab from "../../components/revenue_components/main_revenue_component";
import { toast } from "react-toastify";
import HistoryInvoiceModal from "../../components/modal/invoice_modal/invoice_history_modal";
import PrintInvoiceModal from "../../components/modal/invoice_modal/invoice_print_modal";
import AreaRevenueTab from "../../components/revenue_components/area_revenue_component";
import ServiceRevenueTab from "../../components/revenue_components/service_revenue_component";
import CourseRevenueTab from "../../components/revenue_components/course_revenue_component";
import CompanyRevenueTab from "../../components/revenue_components/company_revenue_component";


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

export default function RevenueSetting() {

    const dispatch=useDispatch();
    const revenueFeature=useSelector(state=>state.revenue);

    const [from, setFrom] = useState(new Date().toLocaleDateString('vi-VI'));
    const [to, setTo] = useState(new Date().toLocaleDateString('vi-VI'));

    const handleChange = (event, newValue) => {
        dispatch(setCurrentIndex(newValue));
      };

    const onHandleSearch=(event)=>{
        const dayFrom = new Date(Date.UTC(from.split('/')[2], from.split('/')[1] - 1, from.split('/')[0])).getTime();
        const dayTo = new Date(Date.UTC(to.split('/')[2], to.split('/')[1] - 1, to.split('/')[0])).getTime();
        if (dayFrom <= dayTo) {
            dispatch(setFromDate(from));
            dispatch(setToDay(to));
        }else {
            toast.error("Lựa chọn ngày chưa phù hợp. Vui lòng kiểm tra lại!")
        }
    }


    return (<div className="w-full h-full overflow-auto p-2">
        <div className="border-2 rounded-xl w-full h-full">
            <div className="border-b-2 px-3 py-1 grid grid-cols-3 h-fit">
                <div className="py-2">
                    <h1 className="font-bold text-blue-600">Thống kê doanh thu</h1>
                </div>
                <div className="col-span-2 grid grid-cols-3">
                    <div className="flex gap-2">
                        <Label htmlFor="from" className="pt-2 ">Từ ngày: </Label>
                        <Datepicker id="from" language="vi-VI" labelTodayButton="Hiện tại" labelClearButton="Huỷ"
                            value={from} onSelectedDateChanged={(date) => setFrom(new Date(date).toLocaleDateString('vi-VI'))} />
                    </div>
                    <div className="flex gap-2">
                        <Label className="pt-2" htmlFor="to">đến ngày:</Label>
                        <Datepicker id="to" language="vi-VI" labelTodayButton="Hiện tại" labelClearButton="Huỷ"
                            value={to} onSelectedDateChanged={(date) => setTo(new Date(date).toLocaleDateString('vi-VI'))} />
                    </div>
                    <div className="">
                        <IconContext.Provider value={{ size: '20px' }}>
                            <Button gradientMonochrome="success" outline onClick={onHandleSearch}>
                                <BiSearch />
                                Tìm kiếm
                            </Button>
                        </IconContext.Provider>
                    </div>
                </div>
            </div>
            <div className="h-full p-2 flex">
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={revenueFeature.currentIndex}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider'}}
                >
                    <Tab sx={{fontWeight:'700', color:'#1A56DB'}} label="Tổng hợp" {...a11yProps(0)} value={0}/>
                    <Tab sx={{fontWeight:'700', color:'#1A56DB'}} label="Theo khu vực" {...a11yProps(1)} value={1}/>
                    <Tab sx={{fontWeight:'700', color:'#1A56DB'}} label="Theo dịch vụ" {...a11yProps(2)} value={2}/>
                    <Tab sx={{fontWeight:'700', color:'#1A56DB'}} label="Theo khoá học" {...a11yProps(3)} value={3}/>
                    <Tab sx={{fontWeight:'700', color:'#1A56DB'}} label="Theo công ty" {...a11yProps(3)} value={4}/>
                </Tabs>
                <TabPanel value={revenueFeature.currentIndex} index={0}>
                    <MainRevenueTab/>
                </TabPanel>
                <TabPanel value={revenueFeature.currentIndex} index={1}>
                    <AreaRevenueTab/>
                </TabPanel>
                <TabPanel value={revenueFeature.currentIndex} index={2}>
                    <ServiceRevenueTab/>
                </TabPanel>
                <TabPanel value={revenueFeature.currentIndex} index={3}>
                    <CourseRevenueTab/>
                </TabPanel>
                <TabPanel value={revenueFeature.currentIndex} index={4}>
                    <CompanyRevenueTab/>
                </TabPanel>
                <HistoryInvoiceModal/>
                <PrintInvoiceModal/>
            </div>
        </div>
    </div>)
}