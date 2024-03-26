import { Button, Datepicker, Label } from "flowbite-react";
import React, { useState } from "react";
import { IconContext } from "react-icons";
import { BiSearch } from "react-icons/bi";
import PropTypes from "prop-types";
import { Tab, Tabs } from "@mui/material";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index}
            id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div className="p-2">
                    {children}
                </div>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function RevenueSetting() {

    const [from, setFrom] = useState(new Date().toLocaleDateString('vi-VI'));
    const [to, setTo] = useState(new Date().toLocaleDateString('vi-VI'));
    const [value,setValue]=useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    return (<div className="w-full h-full overflow-auto p-2">
        <div className="border-2 rounded-xl w-full h-full">
            <div className="border-b-2 px-3 py-1 grid grid-cols-3 h-[8%]">
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
                            <Button gradientMonochrome="success" outline >
                                <BiSearch />
                                Tìm kiếm
                            </Button>
                        </IconContext.Provider>
                    </div>
                </div>
            </div>
            <div className="h-[92%] p-2 flex">
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider'}}
                >
                    <Tab label="Tổng hợp" {...a11yProps(0)} />
                    <Tab label="Theo khu vực" {...a11yProps(1)} />
                    <Tab label="Theo phòng" {...a11yProps(2)} />
                    <Tab label="Theo dịch vụ" {...a11yProps(3)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    Item One
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Item Two
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Item Three
                </TabPanel>
                <TabPanel value={value} index={3}>
                    Item Four
                </TabPanel>
                <TabPanel value={value} index={4}>
                    Item Five
                </TabPanel>
                <TabPanel value={value} index={5}>
                    Item Six
                </TabPanel>
                <TabPanel value={value} index={6}>
                    Item Seven
                </TabPanel>
            </div>
        </div>
    </div>)
}