import { Print } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function CustomerStatistic() {

    const customerStatisticFeature = useSelector(state => state.customer_statistic);
    const [studentNumber, setStudentNumber] = useState(0);
    const [checkinNumber, setCheckinNumber] = useState(0);
    const [durationOfStay, setDurationOfStay] = useState(0);
    const [lunchBreakNumber, setLunchBreakNumber] = useState(0);
    const [durationOfLunchBreak, setDurationOfLunchBreak] = useState(0);

    useEffect(() => {
        setCheckinNumber(customerStatisticFeature.customerTable.length);
        let lunchbreakvalue = 0
        let duration = 0;
        let durationoflunchbreak = 0;
        customerStatisticFeature.customerTable.forEach((value, index) => {
            duration += (new Date(value.bed_checkout).getTime() - new Date(value.bed_checkin));
            if (value.bed_lunch_break) {
                lunchbreakvalue += 1;
                durationoflunchbreak += (new Date(value.bed_checkout).getTime() - new Date(value.bed_checkin));
            }
        })
        setLunchBreakNumber(lunchbreakvalue);
        setDurationOfStay(duration / 1000);
        setDurationOfLunchBreak(durationoflunchbreak / 1000);
    }, [customerStatisticFeature.customerTable]);

    useEffect(() => {
        let customerList = [];
        customerStatisticFeature.customerTable.forEach((value, index) => {
            if (customerList.length === 0) {
                customerList.push(value);
                return;
            }
            let flag = false;
            for (let j = 0; j < customerList.length; j++)
                if (customerList[j].id_customer === value.id_customer) {
                    flag = true;
                    break;
                }
            if (flag)
                return;
            else
                customerList.push(value);
        });
        setStudentNumber(customerList.length);
    }, [customerStatisticFeature.customerTable])


    return (
        <div className="w-full">
            <div className="flex flex-row">
                <Button color="primary" variant="outlined" disabled>
                    <Print />In
                </Button>
            </div>
            <div className="grid grid-cols-2">
                <div className="flex flex-col gap-0 items-center">
                    <span className="uppercase font-semibold text-sm">TRƯỜNG CAO ĐẲNG ĐIỆN LỰC THÀNH PHỐ HỒ CHÍ MINH</span>
                    <span className=" font-semibold text-sm">Phòng Quản lý Học sinh - Sinh viên</span>
                </div>
            </div>
            <div className="flex items-center flex-col gap-0 m-2">
                <span className="font-bold text-blue-500 uppercase text-2xl">BẢN THỐNG KÊ TỔNG HỢP SỐ LƯỢT KHÁCH TẠI NHÀ NGHỈ</span>
                <span className="font-bold text-sm"> Từ ngày {customerStatisticFeature.startSearchDate} đến ngày {customerStatisticFeature.endSearchDate}</span>
            </div>
            <center><hr className="border-t-2 border-dashed w-80 border-slate-500" /></center>
            <div className="flex flex-col gap-2 m-2">
                <div className="flex flex-row gap-2">
                    <div className="w-60 font-bold uppercase">
                        Khoá học:
                    </div>
                    <div className="w-full border-b-2 border-dotted">
                        {customerStatisticFeature.course_name}
                    </div>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="w-60 font-bold uppercase">
                        Đơn vị:
                    </div>
                    <div className="w-full border-b-2 border-dotted">
                        {customerStatisticFeature.company_name}
                    </div>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="w-60 font-bold uppercase">
                        Học viên nhận phòng:
                    </div>
                    <div className="w-full border-b-2 border-dotted">
                        {studentNumber} học viên
                    </div>
                </div>

                <div className="flex flex-row gap-2">
                    <div className="w-60 font-bold uppercase">
                        Số lượt nhận phòng:
                    </div>
                    <div className="w-full border-b-2 border-dotted">
                        {checkinNumber} lượt
                    </div>
                </div>

                <div className="flex flex-row gap-2">
                    <div className="w-60 font-bold uppercase">
                        Tổng thời gian ở:
                    </div>
                    <div className="w-full border-b-2 border-dotted">
                        {Math.floor(durationOfStay / (86400))} ngày {Math.floor((durationOfStay - Math.floor(durationOfStay / (86400)) * 86400) / 3600)} giờ {(durationOfStay - Math.floor(durationOfStay / (86400)) * 86400 - Math.floor((durationOfStay - Math.floor(durationOfStay / (86400)) * 86400) / 3600) * 3600) / 60} phút
                    </div>
                </div>

                <div className="flex flex-row gap-2">
                    <div className="w-60 font-bold uppercase">
                        Số lượt nghỉ trưa:
                    </div>
                    <div className="w-full border-b-2 border-dotted">
                        {lunchBreakNumber} lượt
                    </div>
                </div>

                <div className="flex flex-row gap-2">
                    <div className="w-60 font-bold uppercase">
                        Tổng TG nghỉ trưa:
                    </div>
                    <div className="w-full border-b-2 border-dotted">
                        {Math.floor(durationOfLunchBreak / (86400))} ngày {Math.floor((durationOfLunchBreak - Math.floor(durationOfLunchBreak / (86400)) * 86400) / 3600)} giờ {(durationOfLunchBreak - Math.floor(durationOfLunchBreak / (86400)) * 86400 - Math.floor((durationOfLunchBreak - Math.floor(durationOfLunchBreak / (86400)) * 86400) / 3600) * 3600) / 60} phút
                    </div>
                </div>

                <div className="flex flex-row gap-2">
                    <div className="w-60 font-bold uppercase">
                        Số lượt nghỉ đêm:
                    </div>
                    <div className="w-full border-b-2 border-dotted">
                        {checkinNumber - lunchBreakNumber} lượt
                    </div>
                </div>

                <div className="flex flex-row gap-2">
                    <div className="w-60 font-bold uppercase">
                        Tổng TG nghỉ đêm:
                    </div>
                    <div className="w-full border-b-2 border-dotted">
                        {Math.floor((durationOfStay - durationOfLunchBreak) / (86400))} ngày {Math.floor(((durationOfStay - durationOfLunchBreak) - Math.floor((durationOfStay - durationOfLunchBreak) / (86400)) * 86400) / 3600)} giờ {((durationOfStay - durationOfLunchBreak) - Math.floor((durationOfStay - durationOfLunchBreak) / (86400)) * 86400 - Math.floor(((durationOfStay - durationOfLunchBreak) - Math.floor((durationOfStay - durationOfLunchBreak) / (86400)) * 86400) / 3600) * 3600) / 60} phút
                    </div>
                </div>
            </div>
        </div>
    )
}