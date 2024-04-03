
import axios from "axios";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ServiceRevenueTab() {

    const revenueFeature = useSelector(state => state.revenue);

    const [totalPayment, setTotalPayment] = useState(0);
    const [countValue, setCountValue] = useState(0);
    const [bestSellerService, setBestSellerService] = useState(null);
    const [bestValueService, setBestValueService] = useState(null);
    const [bestPrice, setBestPrice] = useState(0);
    const [bestValue, setBestValue] = useState(0);
    const [valueData, setValueData] = useState({
        labels: [],
        datasets: []
    });
    const [priceData, setPriceData] = useState({
        labels: [],
        datasets: []
    });

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
            axios.get(process.env.REACT_APP_BACKEND + 'api/servicedetail/getTotalServiceRevenue?from=' + revenueFeature.fromDay + '&to=' + revenueFeature.toDay, {
                withCredentials: true
            }).then(function (response) {
                let labelArray = [];
                let valueArray = [];
                let priceArray = [];
                response.data.result.forEach(value => {
                    labelArray.push(value.service_name);
                    valueArray.push(value.count);
                    priceArray.push(value.sum);
                })
                const pData = {
                    labels: labelArray,
                    datasets: [
                        {
                            data: priceArray,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                }
                setPriceData(pData);
                const vData = {
                    labels: labelArray,
                    datasets: [
                        {
                            data: valueArray,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                }
                setValueData(vData);
            }).catch(function (error) {
                if (error.response)
                    toast.error("Chart:" + error.response.data.error_code);
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
                    {totalPayment > 0 ? Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(totalPayment) : ""}
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
            <div className={priceData.labels.length > 0 || valueData.labels.length > 0 ? "" : "hidden"}>
                <p className="font-semibold text-blue-700">Biểu đồ doanh thu</p>
                <div className="grid grid-cols-2 ">
                    <div className=" p-2">
                        <center><h1 className="font-bold">Biểu đồ giá trị doanh thu dịch vụ (VNĐ)</h1></center>
                        <Pie data={priceData} />
                    </div>
                    <div className=" p-2">
                        <center><h1 className="font-bold">Biểu đồ giá trị tiêu thụ dịch vụ (LƯỢT MUA)</h1></center>
                        <Pie data={valueData} />
                    </div>
                </div>
            </div>

        </div>
    )
}