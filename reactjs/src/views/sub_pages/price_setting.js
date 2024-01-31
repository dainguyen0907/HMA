import axios from "axios";
import { Button } from "flowbite-react";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { IconContext } from "react-icons";
import { FaCirclePlus } from "react-icons/fa6";
import { toast } from "react-toastify";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import SelectBedTypeModal from "../../components/modal/price_select_bed_type_modal";
import { Box, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import PriceModal from "../../components/modal/price_modal";


export default function PriceSetting() {

    const [openModalBedType, setOpenModalBedType] = useState(false);
    const [openModalPrice, setOpenModalPrice] = useState(false);
    const [modalHeader,setModlHeader]=useState("Thêm đơn giá mới");
    const [bedTypeList, setBedTypeList] = useState([]);
    const [success, setSuccess] = useState(0);
    const [selectedBedType,setSelectedBedType]=useState(-1);
    const [bedTypeName,setBedTypeName]=useState("");
    const [data,setData]=useState([]);
    const [isLoading,setIsLoading]=useState(true);

    const [idPrice,setIdPrice]=useState(-1);
    const [priceName,setPriceName]=useState("");
    const [hourPrice,setHourPrice]=useState(0);
    const [datePrice,setDatePrice]=useState(0);
    const [weekPrice,setWeekPrice]=useState(0);
    const [monthPrice,setMonthPrice]=useState(0);

    const columns=useMemo(()=>[
        {
            accessorKey: 'id',
            header: 'Mã số',
            size: '10'
        },
        {
            accessorKey: 'price_name',
            header: 'Tên đơn giá',
            size: '100'
        }
        ,
        {
            accessorKey: 'price_hour',
            header: 'Giá theo giờ',
            size: '12'
        }
        ,
        {
            accessorKey: 'price_day',
            header: 'Giá theo ngày',
            size: '12'
        }
        ,
        {
            accessorKey: 'price_week',
            header: 'Giá theo tuần',
            size: '12'
        },
        {
            accessorKey: 'price_month',
            header: 'Giá theo tháng',
            size: '12'
        }
    ],[])

    useEffect(()=>{
        axios.get(process.env.REACT_APP_BACKEND+"api/price/getPriceByIDBedType?id="+selectedBedType,{withCredentials:true})
        .then(function(response){
            setData(response.data.result);
            setIsLoading(false);
            
        }).catch(function(error){
            if(error.response){
                toast.error(error.response.data.error_code);
            }
        })
    },[selectedBedType,success])

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND+"api/bedtype/getAll",{withCredentials:true})
        .then(function(response){
            setBedTypeList(response.data.result);
        }).catch(function(error){
            if(error.response){
                toast.error(error.response.data.error_code);
            }
        })
    }, [success])

    const onHandleCreateButton=()=>{
        if(selectedBedType===-1)
        {
            window.alert("Vui lòng chọn loại giường!");
        }else{
            setOpenModalPrice(true);
            setModlHeader("Thêm đơn giá mới");
            setIdPrice(-1);
            setPriceName("");
            setHourPrice(0);
            setDatePrice(0);
            setWeekPrice(0);
            setMonthPrice(0);
        }
    }

    const onHandleDelete=(idPrice)=>{
        if(window.confirm("Bạn muốn xoá đơn giá này?")){
            axios.post(process.env.REACT_APP_BACKEND+"api/price/deletePrice",{
                id:idPrice
            },{withCredentials:true})
            .then(function(response){
                toast.success(response.data.result);
                setSuccess(success+1);
            }).catch(function(error){
                if(error.response){
                    toast.error(error.response.data.error_code);
                }
            })
        }
    }

    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-3 h-[8%]">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Danh sách đơn giá theo loại giường {bedTypeName}</h1>
                    </div>
                    <div className=" relative">
                        <Button className="absolute m-0 left-1/4" gradientDuoTone="cyanToBlue" outline
                            onClick={() => setOpenModalBedType(true)}>Chọn loại giường</Button>
                        <SelectBedTypeModal openModal={openModalBedType} setOpenModal={setOpenModalBedType} bedType={bedTypeList} 
                        setSelectedBedType={setSelectedBedType} setBedTypeName={setBedTypeName}/>
                    </div>
                    <div className="ml-auto">
                        <IconContext.Provider value={{ size: '20px' }}>
                            <Button outline gradientMonochrome="success" onClick={()=>onHandleCreateButton()}>
                                <FaCirclePlus className="mr-2" /> Thêm đơn giá mới
                            </Button>
                        </IconContext.Provider>
                        <PriceModal openModal={openModalPrice} setOpenModal={setOpenModalPrice} modalHeader={modalHeader}
                        idPrice={idPrice} setSuccess={setSuccess} success={success}
                        bedTypeName={bedTypeName} setBedTypeName={setBedTypeName} selectedBedType={selectedBedType}
                        priceName={priceName} setPriceName={setPriceName}
                        hourPrice={hourPrice} setHourPrice={setHourPrice}
                        datePrice={datePrice} setDatePrice={setDatePrice}
                        weekPrice={weekPrice} setWeekPrice={setWeekPrice}
                        monthPrice={monthPrice} setMonthPrice={setMonthPrice}/>
                    </div>
                </div>
                <div className="w-full h-[92%]">
                    <MaterialReactTable
                    data={data}
                    columns={columns}
                    state={{isLoading:isLoading}}
                    localization={MRT_Localization_VI}
                    enableRowActions
                    positionActionsColumn="last"
                    renderRowActions={({row,table})=>(
                        <Box sx={{display: 'flex', flexWrap: 'nowrap', gap: '8px'}}>
                            <IconButton color="primary" title="Sửa đơn giá"
                            onClick={()=>{
                                setOpenModalPrice(true);
                                setIdPrice(row.original.id);
                                setPriceName(row.original.price_name);
                                setHourPrice(row.original.price_hour);
                                setDatePrice(row.original.price_day);
                                setWeekPrice(row.original.price_week);
                                setMonthPrice(row.original.price_month);
                            }}>
                                <Edit/>
                            </IconButton>
                            <IconButton color="error" title="Xoá đơn giá"
                            onClick={()=>onHandleDelete(row.original.id)}>
                                <Delete/>
                            </IconButton>
                        </Box>
                    )}
                    />


                </div>
            </div>
        </div>
    );

}