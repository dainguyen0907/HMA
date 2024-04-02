
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


export default function ServiceRevenueTab() {

    const revenueFeature = useSelector(state => state.revenue);
    
    const [totalPayment, setTotalPayment] = useState(0);
    const [countValue, setCountValue] = useState(0);
    const [bestSellerService, setBestSellerService] = useState(null);
    const [bestValueService, setBestValueService] = useState(null);
    const [bestPrice, setBestPrice] = useState(0);
    const [bestValue, setBestValue] = useState(0);

    useEffect(() => {
        if (revenueFeature.currentIndex === 2) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/servicedetail/getServiceRevenue?from=' + revenueFeature.fromDay + '&to=' + revenueFeature.toDay, {
                withCredentials: true
            }).then(function (response) {
                setCountValue(response.data.result.countValue);
                setTotalPayment(response.data.result.sumPayment);
            }).catch(function (error) {
                if (error.response)
                    toast.error("Service details:" + error.response.data.error_code);
            })
            axios.get(process.env.REACT_APP_BACKEND + 'api/servicedetail/getServiceDetailRevenue?from=' + revenueFeature.fromDay + '&to=' + revenueFeature.toDay, {
                withCredentials: true
            }).then(function (response) {
                setBestSellerService(response.data.result.bestSellerService);
                setBestValueService(response.data.result.bestValueService);
            }).catch(function (error) {
                if (error.response)
                    toast.error("Service details:" + error.response.data.error_code);
            })
        } else {
            setCountValue(0);
            setTotalPayment(0);
            setBestSellerService(null);
            setBestValueService(null);
        }
    }, [revenueFeature.fromDay, revenueFeature.toDay, revenueFeature.currentIndex])

    useEffect(() => {
        if (bestSellerService && bestSellerService.Service_details) {
            let price = 0;
            bestSellerService.Service_details.forEach(element => {
                price += parseInt(element.total_price);
            });
            setBestPrice(price);
        } else {
            setBestPrice(0);
        }
    }, [bestSellerService])

    useEffect(() => {
        if (bestValueService && bestValueService.Service_details) {
            let value = 0;
            bestValueService.Service_details.forEach(element => {
                value += parseInt(element.service_quantity);
            });
            setBestValue(value);
        } else {
            setBestValue(0);
        }
    }, [bestValueService])

    return (
        <div >
            <div className="font-bold text-blue-700 text-center">
                THỐNG KÊ TỔNG HỢP DOANH THU DỊCH VỤ<br />
                <small>Từ {revenueFeature.fromDay} đến {revenueFeature.toDay}</small>
            </div>
            <p className="font-semibold text-blue-700">Thông tin đơn vị</p>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Đơn vị:
                </div>
                <div className="col-span-3 text-start font-semibold">
                    Trường Cao đẳng Điện lực Thành phố Hồ Chí Minh.
                </div>
            </div>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Địa chỉ:
                </div>
                <div className="col-span-3 text-start font-semibold">
                    554 đường Hà Huy Giáp, phường Thạnh Lộc, Quận 12, Thành phố Hồ Chí Minh.
                </div>
            </div>
            <hr />
            <p className="font-semibold text-blue-700">Dữ liệu doanh thu</p>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Tổng doanh thu dịch vụ:
                </div>
                <div className="col-span-3 text-start font-semibold">
                    {totalPayment>0?Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(totalPayment):""}
                </div>
            </div>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Tổng số lượng dịch vụ được sử dụng:
                </div>
                <div className="col-span-3 text-start font-semibold">
                    {countValue}
                </div>
            </div>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Dịch vụ doanh thu cao:
                </div>
                <div className="text-start font-semibold">
                    {bestSellerService ? bestSellerService.service_name : ""}
                </div>
                <div className="text-center" hidden={bestPrice === 0}>
                    với tổng doanh thu là:
                </div>
                <div className="text-start font-semibold" hidden={bestPrice === 0}>
                    {Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(bestPrice)}
                </div>
            </div>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Dịch vụ được sử dụng nhiều:
                </div>
                <div className=" text-start font-semibold">
                    {bestValueService ? bestValueService.service_name : ""}
                </div>
                <div className="text-center" hidden={bestValue === 0}>
                    với tổng số lượng là:
                </div>
                <div className="text-start font-semibold" hidden={bestValue === 0}>
                    {bestValue} phần
                </div>
            </div>
            <hr />
            <p className="font-semibold text-blue-700">Biểu đồ doanh thu</p>
            <div className="grid grid-cols-2">

            </div>
        </div>
    )
}