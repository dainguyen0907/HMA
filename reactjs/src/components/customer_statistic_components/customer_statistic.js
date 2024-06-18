import { Print } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";

export default function CustomerStatistic(){
    const customerStatisticFeature=useSelector(state=>state.customer_statistic);
    return (
        <div className="w-full">
            <div className="flex flex-row">
                <Button color="primary" variant="outlined">
                    <Print/>In
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
            <div className="flex flex-col gap-2 m-2">
                
            </div>
        </div>
    )
}