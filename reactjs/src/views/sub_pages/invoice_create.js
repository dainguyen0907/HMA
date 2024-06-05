import { Search } from "@mui/icons-material";
import { Box, MenuItem, TextField } from "@mui/material";
import { Button } from "flowbite-react";
import { MaterialReactTable } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import axios from "axios";
import { toast } from "react-toastify";

export default function InvoiceCreationPage() {
    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            size: '10'
        },
        {
            accessorKey: 'Customer.customer_name',
            header: 'Tên khách hàng',
            size: '100'
        },
        {
            accessorKey: 'Room.room_name',
            header: 'Tên phòng',
            size: '100'
        },
        {
            accessorKey: 'Bed_type.bed_type_name',
            header: 'Loại giường',
            size: '100'
        },
        {
            accessorKey: 'bed_status',
            header: 'Trạng thái',
            Cell: ({ table, row }) => (
                <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '4px' }}>
                    {row.original.bed_status ? <span className="text-green-500">Đã thành toán</span> : <span className="text-red-500">Chưa thanh toán</span>}
                </Box>
            )
        },
    ], []);
    const [dataTable, setDataTable] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [companyList, setCompanyList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [idCompany,setIDCompany]=useState(-1);
    const [idCourse,setIDCourse]=useState(-1);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/company/getAll', { withCredentials: true })
            .then(function (response) {
                setCompanyList(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error('Dữ liệu Công ty: ' + error.response.data.error_code);
                }
            })
    }, []);

    useEffect(()=>{
        axios.get(process.env.REACT_APP_BACKEND + 'api/course/getDisableCourse', { withCredentials: true })
                .then(function (response) {
                    setCourseList(response.data.result);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error('Dữ liệu Khoá học: ' + error.response.data.error_code);
                    }
                })
    },[])

    const onHandleSearch=(e)=>{
        axios.get(process.env.REACT_APP_BACKEND+'api/bed/getUnpaidBedByCourseAndCompany?course='+idCourse+'&company='+idCompany,{withCredentials:true})
        .then(function(response){
            setDataTable(response.data.result);
            console.log(response.data.result)
        }).catch(function(error){
            if(error.response){
                toast.error(error.response.data.error_code);
            }
        })
    }


    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-2 items-center h-fit">
                    <h1 className="font-bold text-blue-600">Danh sách khách hàng chưa lập hoá đơn</h1>
                </div>
                <div className="w-full">
                    <div className="w-full border-b-2 flex flex-row gap-2 p-3 items-center justify-center">
                        <span>Tìm kiếm theo:</span>
                        <TextField variant="outlined" label="Khoá học" size="small" select sx={{ width: '15%' }}
                        value={idCourse} onChange={(e)=>setIDCourse(e.target.value)}>
                            <MenuItem value={-1}>Tất cả</MenuItem>
                            {
                                courseList.map(value=><MenuItem value={value.id}>{value.course_name}</MenuItem>)
                            }
                        </TextField>
                        <span>---</span>
                        <TextField variant="outlined" label="Công ty" size="small" select sx={{ width: '15%' }}
                        value={idCompany} onChange={(e)=>setIDCompany(e.target.value)}>
                            <MenuItem value={-1}>Tất cả</MenuItem>
                            {
                                companyList.map(value=><MenuItem value={value.id}>{value.company_name}</MenuItem>)
                            }
                        </TextField>
                        <Button outline gradientDuoTone="cyanToBlue" onClick={onHandleSearch}>
                            <Search />Tìm kiếm
                        </Button>
                    </div>
                    <MaterialReactTable
                        data={dataTable}
                        columns={columns}
                        localization={MRT_Localization_VI}
                        enableTopToolbar
                        renderTopToolbarCustomActions={({ table }) => (
                            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '4px' }}>
                                <Button gradientDuoTone="cyanToBlue" outline disabled={Object.keys(rowSelection).length === 0}>
                                    Tạo hoá đơn
                                </Button>
                            </Box>
                        )}
                        enableRowSelection
                        onRowSelectionChange={setRowSelection}
                        state={{rowSelection}}
                    />
                </div>
            </div>
        </div>
    )
}