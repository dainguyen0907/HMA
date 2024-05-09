import { Tab, Tabs } from "@mui/material";
import { Datepicker, Label } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setCurrentIndex, setFromDate, setToDay } from "../../redux_features/formFeature";
import { CostConfirmationForm } from "../../components/form_components/cost_confirmation";

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

export default function FormExportSetting() {
    const [from, setFrom] = useState(new Date().toLocaleDateString('vi-VI'));
    const [to, setTo] = useState(new Date().toLocaleDateString('vi-VI'));

    const formFeature = useSelector(state => state.form);
    const dispatch = useDispatch();


    useEffect(() => {
        const dayFrom = new Date(Date.UTC(from.split('/')[2], from.split('/')[1] - 1, from.split('/')[0])).getTime();
        const dayTo = new Date(Date.UTC(to.split('/')[2], to.split('/')[1] - 1, to.split('/')[0])).getTime();
        if (dayFrom <= dayTo) {
            dispatch(setFromDate(from));
            dispatch(setToDay(to));
        } else {
            setTo(from);
            toast.error("Lựa chọn ngày chưa phù hợp. Vui lòng kiểm tra lại!")
        }
    }, [from,to,dispatch])



    return (<div className="w-full h-full p-2">
        <div className="border-2 rounded-xl w-full h-full overflow-auto">
            <div className="border-b-2 px-3 py-1 h-fit relative">
                <div className="absolute top-3 left-2">
                    <h1 className="font-bold text-blue-600">Xuất biểu mẫu</h1>
                </div>
                <div className="flex flex-row justify-center items-center gap-4">
                    <Label htmlFor="from" className="pt-2 ">Từ ngày: </Label>
                    <Datepicker id="from" language="vi-VI" labelTodayButton="Hiện tại" labelClearButton="Huỷ"
                        value={from} onSelectedDateChanged={(date) => setFrom(new Date(date).toLocaleDateString('vi-VI'))} />
                    <Label className="pt-2" htmlFor="to">đến ngày:</Label>
                    <Datepicker id="to" language="vi-VI" labelTodayButton="Hiện tại" labelClearButton="Huỷ"
                        value={to} onSelectedDateChanged={(date) => setTo(new Date(date).toLocaleDateString('vi-VI'))} />
                </div>
            </div>
            <div className="h-full p-2 flex">
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    aria-label="Vertical tabs example"
                    value={formFeature.currentIndex}
                    onChange={(e, newvalue) => dispatch(setCurrentIndex(newvalue))}
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                >
                    <Tab sx={{ fontWeight: '700', color: '#1A56DB' }} label="Phiếu xác nhận chi phí nghỉ" {...a11yProps(0)} value={0} />
                </Tabs>
                <TabPanel index={0} value={formFeature.currentIndex}>
                    <CostConfirmationForm />
                </TabPanel>

            </div>

        </div>
    </div>
    )
}