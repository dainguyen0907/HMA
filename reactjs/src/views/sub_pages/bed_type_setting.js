import { Delete, Edit } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { Button, Label, Modal, Select } from "flowbite-react";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import FloatTextComponent from "../../components/float_text_component";
import { IconContext } from "react-icons";
import { FaCirclePlus } from "react-icons/fa6";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import { toast } from "react-toastify";
import axios from "axios";

function UpdateBedTypeModal(props) {
    const [prices, setPrices] = useState([]);
    const [idSelectedPrice, setIdSelectedPrice] = useState(0);
    const [priceHour, setPriceHour] = useState(0);
    const [priceDate, setPriceDate] = useState(0);
    const [priceWeek, setPriceWeek] = useState(0);
    const [priceMonth, setPriceMonth] = useState(0);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + "api/price/getPriceByIDBedType?id=" + props.idBedType, { withCredentials: true })
            .then(function (response) {
                setPrices(response.data.result);
                setIdSelectedPrice(props.defaultPrice);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }, [props.idBedType, props.defaultPrice]);

    useEffect(() => {
        for (let i = 0; i < prices.length; i++) {
            if (parseInt(idSelectedPrice) === parseInt(prices[i].id)) {
                setPriceDate(prices[i].price_day);
                setPriceWeek(prices[i].price_week);
                setPriceMonth(prices[i].price_month);
                setPriceHour(prices[i].price_hour);
                break;
            }
        }
    }, [idSelectedPrice, prices]);

    const onConfirm=()=>{
        axios.post(process.env.REACT_APP_BACKEND+"api/bedtype/updateBedType",{
            name:props.bedTypeName,
            id:props.idBedType,
            default_price:idSelectedPrice,
        },{withCredentials:true})
        .then(function(response){
            toast.success(response.data.result);
            props.setOpen(false);
            props.setSuccess(props.success+1);
        }).catch(function(error){
            if(error.response){
                toast.error(error.response.data.error_code);
            }
        })
    }

    return (
        <Modal show={props.show} onClose={() => props.setOpen(false)}>
            <Modal.Header>Cập nhật loại giường</Modal.Header>
            <Modal.Body>
                <FloatTextComponent label="Tên loại giường" type="text" data={props.bedTypeName} setData={props.setBedTypeName} />
                <div className="mb-3">
                    <Label htmlFor="defaultPrice" value="Giá mặc định" />
                    <Select id="defaultPrice" onChange={(e) => setIdSelectedPrice(e.target.value)} value={idSelectedPrice}>
                        {prices.map((value) => <option value={value.id}>
                            {value.price_name}
                        </option>)}
                    </Select>
                </div>
                <FloatTextComponent label="Giá theo giờ" type="number" data={priceHour} setData={setPriceHour} readonly="true" />
                <FloatTextComponent label="Giá theo ngày" type="number" data={priceDate} setData={setPriceDate} readonly="true" />
                <FloatTextComponent label="Giá theo tuần" type="number" data={priceWeek} setData={setPriceWeek} readonly="true" />
                <FloatTextComponent label="Giá theo tháng" type="number" data={priceMonth} setData={setPriceMonth} readonly="true" />
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue" onClick={() => onConfirm()}>Cập nhật</Button>
                <Button color="gray" onClick={() => props.setOpen(false)}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default function BedTypeSetting() {
    const [data, setData] = useState([]);
    const [success, setSuccess] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [defaultPrice, setDefaultPrice] = useState(0);
    const [idBedType, setIdBedType] = useState(-1);
    const [isLoading, setIsLoading] = useState(true);
    const [bedTypeName, setBedTypeName] = useState("");
    const [datePrice, setDatePrice] = useState(0);
    const [weekPrice, setWeekPrice] = useState(0);
    const [monthPrice, setMonthPrice] = useState(0);
    const [hourPrice, setHourPrice] = useState(0);


    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'Mã số',
            size: '10'
        },
        {
            accessorKey: 'bed_type_name',
            header: 'Tên loại giường',
            size: '20'
        },
        {
            header: 'Đơn giá mặc định',
            accessorKey: 'Price.price_name'
        }
    ], []);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + "api/bedtype/getAll", { withCredentials: true })
            .then(function (response) {
                setData(response.data.result);
                setIsLoading(false);
            }).catch(function (error) {
                if (error.response)
                    toast.error(error.response.data.error_code);
            })
    }, [success]);


    const initBedType = () => {
        setBedTypeName("");
        setDatePrice("");
        setHourPrice("");
        setMonthPrice("");
        setWeekPrice("");
        setIdBedType(-1);
    }
    const onConfirmAction = () => {
        if (idBedType === -1) {
            axios.post(process.env.REACT_APP_BACKEND + "api/bedtype/insertBedType", {
                name: bedTypeName,
                price_day: datePrice,
                price_week: weekPrice,
                price_hour: hourPrice,
                price_month: monthPrice,
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success("Thêm loại giường mới thành công");
                    setOpenModal(false);
                    setSuccess(success + 1);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        } else {
        }
    }

    const onDelete = (idBedType) => {
        if (window.confirm("Bạn có muốn xoá loại giường này?")) {
            axios.post(process.env.REACT_APP_BACKEND + "api/bedtype/deleteBedType", {
                id: idBedType
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    setSuccess(success + 1);
                }).catch(function (error) {
                    if (error.response)
                        toast.error(error.response.data.error_code);
                })
        }
    }

    return (<div className="w-full h-full overflow-auto p-2">
        <div className="border-2 rounded-xl w-full h-full">
            <div className="border-b-2 px-3 py-1 grid grid-cols-2 h-[7%]">
                <div className="py-2">
                    <h1 className="font-bold text-blue-600">Danh sách loại giường</h1>
                </div>
                <div className="ml-auto">
                    <IconContext.Provider value={{ size: '22px' }}>
                        <button className="border-2 p-1 flex bg-green-500 text-white rounded-lg"
                            onClick={() => {
                                setOpenModal(true);
                                initBedType();
                            }}>
                            <FaCirclePlus /> Thêm loại giường mới</button>
                    </IconContext.Provider>
                    <Modal show={openModal} onClose={() => setOpenModal(false)}>
                        <Modal.Header>Thêm loại giường mới</Modal.Header>
                        <Modal.Body>
                            <FloatTextComponent label="Tên loại giường" setData={setBedTypeName} data={bedTypeName} type="text" />
                            <FloatTextComponent label="Giá theo giờ" setData={setHourPrice} data={hourPrice} type="number" />
                            <FloatTextComponent label="Giá theo ngày" setData={setDatePrice} data={datePrice} type="number" />
                            <FloatTextComponent label="Giá theo tuần" setData={setWeekPrice} data={weekPrice} type="number" />
                            <FloatTextComponent label="Giá theo tháng" setData={setMonthPrice} data={monthPrice} type="number"
                                helper="Lưu ý: Không nhập các ký tự khác ngoài số vào đơn giá" />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button color="blue" onClick={() => onConfirmAction()}>Đồng ý</Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>Huỷ</Button>
                        </Modal.Footer>
                    </Modal>
                    <UpdateBedTypeModal idBedType={idBedType} setOpen={setOpenModalUpdate} show={openModalUpdate}
                        defaultPrice={defaultPrice} bedTypeName={bedTypeName} setBedTypeName={setBedTypeName} 
                        success={success} setSuccess={setSuccess}/>
                </div>
            </div>
            <div className="w-full h-[93%]">
                <MaterialReactTable
                    columns={columns}
                    data={data}
                    state={{ isLoading: isLoading }}
                    muiCircularProgressProps={{
                        color: 'secondary',
                        thickness: 5,
                        size: 55,
                    }}
                    muiSkeletonProps={{
                        animation: 'pulse',
                        height: 28,
                    }}
                    localization={MRT_Localization_VI}
                    enableRowActions
                    positionActionsColumn="last"
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                            <IconButton color="primary"
                                title="Sửa thông tin"
                                onClick={() => {
                                    setIdBedType(row.original.id);
                                    setDefaultPrice(row.original.bed_type_default_price)
                                    setOpenModalUpdate(true);
                                    setBedTypeName(row.original.bed_type_name)
                                }}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton color="error"
                                title="Xoá loại giường"
                                onClick={() => {
                                    onDelete(row.original.id);
                                }}>
                                <Delete />
                            </IconButton>
                        </Box>
                    )}
                />
            </div>
        </div>
    </div>)
}