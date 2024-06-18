import { Box, Button } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify";

export default function CustomerTable(){
    const custsomerStatisticFeature=useSelector(state=>state.customer_statistic);
    const dispatch=useDispatch();
    const colums=useMemo(()=>[
        {
            accessorKey: 'id',
            header: 'id',
            size: '1'
        },{
            accessorKey:'Customer.customer_name',
            header:'Tên khách hàng',
            size:'20'
        },{
            accessorKey:'Customer.customer_gender',
            header:'Giới tính',
            size:'1',
            Cell:({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                   {row.original.Customer?row.original.Customer.customer_gender?'Nam':'Nữ':''}
                </Box>
            )
        },{
            accessorKey:'Room.room_name',
            header:'Phòng',
            size:'5'
        },{
            accessorKey:'bed_checkin',
            header:'Checkin',
            size:'5',
            Cell:({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                   {new Date(row.original.bed_checkin).toLocaleString()}
                </Box>
            )
        },{
            accessorKey:'bed_checkin',
            header:'Checkout',
            size:'5',
            Cell:({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                   {new Date(row.original.bed_checkout).toLocaleString()}
                </Box>
            )
        },{
            accessorKey:'bed_lunch_break',
            header:'Phân loại',
            size:'5',
            Cell:({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                   {row.original.bed_lunch_break?<span className="text-orange-500 font-bold">Nghỉ trưa</span>:<span className="text-blue-500 font-bold">Nghỉ đêm</span>}
                </Box>
            )
        }
        
    ],[])

    const onHandlePrint=()=>{
        if(custsomerStatisticFeature.customerTable.lenngth===0){
            toast.error('Bảng dữ liệu rỗng! Không xuất được dữ liệu!');
        }else{
            let newList=[['TT','Họ tên','Giới tính','Đơn vị','Khoá học','ĐT','CCCD','Phòng','Ngày vào','Ngày ra','NĐ','NT']];
            let index=1;
            custsomerStatisticFeature.customerTable.forEach((value,key)=>{

            })
        }
        
    }

    return (
        <div className="w-full">
            <MaterialReactTable 
            columns={colums}
            data={custsomerStatisticFeature.customerTable}
            localization={MRT_Localization_VI}
            enableRowActions
            positionActionsColumn="last"
            renderRowActions={({row,table})=>(
                <Box sx={{display:'flex', flexWrap:'nowrap', gap:'4px'}}>

                </Box>
            )}
            enableTopToolbar
            renderTopToolbarCustomActions={(table)=>(
                <Box sx={{display:'flex', flexWrap:'nowrap', gap:'4px'}}>
                    <Button variant="contained" color="primary">
                        Xuất file
                    </Button>
                </Box>
            )}
            />
        </div>
    )
}