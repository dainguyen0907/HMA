import { Edit, Search } from "@mui/icons-material";
import { Box, IconButton, MenuItem, TextField, Tooltip } from "@mui/material";
import { Button } from "flowbite-react";
import { MaterialReactTable } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import axios from "axios";
import { toast } from "react-toastify";
import UpdateBedModal from "../../components/modal/invoice_creation_modal/update_bed_modal";
import { useDispatch, useSelector } from "react-redux";
import { setBedSelection, setOpenConfirmInvoiceCreationModal, setOpenUpdateBedModal } from "../../redux_features/invoiceCreationFeature";
import ConfirmInvoiceModal from "../../components/modal/invoice_creation_modal/confirm_invoice_modal";

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
        }, {
            accessorKey: 'Price.price_name',
            header: 'Đơn giá',
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
    const [idCompany, setIDCompany] = useState(-1);
    const [idCourse, setIDCourse] = useState(-1);

    const invoiceCreationFeature = useSelector(state => state.invoice_creation);
    const dispatch = useDispatch();

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

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/course/getDisableCourse', { withCredentials: true })
            .then(function (response) {
                setCourseList(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error('Dữ liệu Khoá học: ' + error.response.data.error_code);
                }
            })
    }, [])

    useEffect(() => {
        if (invoiceCreationFeature.countUpdateSuccess > 0) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/bed/getUnpaidBedByCourseAndCompany?course=' + idCourse + '&company=' + idCompany, { withCredentials: true })
                .then(function (response) {
                    setDataTable(response.data.result);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        }
    }, [invoiceCreationFeature.countUpdateSuccess,idCompany,idCourse])

    const onHandleSearch = (e) => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/bed/getUnpaidBedByCourseAndCompany?course=' + idCourse + '&company=' + idCompany, { withCredentials: true })
            .then(function (response) {
                setDataTable(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }

    const onHandleUpdateBed = (row) => {
        dispatch(setOpenUpdateBedModal(true));
        dispatch(setBedSelection(row));
    }

    const onHandleCreateInvoiceButton=(e)=>{
        dispatch(setOpenConfirmInvoiceCreationModal(true));
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
                            value={idCourse} onChange={(e) => setIDCourse(e.target.value)}>
                            <MenuItem value={-1}>Tất cả</MenuItem>
                            {
                                courseList.map((value, key) => <MenuItem value={value.id} key={key}>{value.course_name}</MenuItem>)
                            }
                        </TextField>
                        <span>---</span>
                        <TextField variant="outlined" label="Công ty" size="small" select sx={{ width: '15%' }}
                            value={idCompany} onChange={(e) => setIDCompany(e.target.value)}>
                            <MenuItem value={-1}>Tất cả</MenuItem>
                            {
                                companyList.map((value, key) => <MenuItem value={value.id} key={key}>{value.company_name}</MenuItem>)
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
                                <Button gradientDuoTone="cyanToBlue" outline disabled={Object.keys(rowSelection).length === 0}
                                onClick={onHandleCreateInvoiceButton}>
                                    Tạo hoá đơn
                                </Button>
                            </Box>
                        )}
                        enableRowSelection
                        onRowSelectionChange={setRowSelection}
                        state={{ rowSelection }}
                        enableRowActions
                        positionActionsColumn="last"
                        renderRowActions={({ table, row }) => (
                            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '4px' }}>
                                <Tooltip title="Cập nhật">
                                    <IconButton color="success" onClick={() => onHandleUpdateBed(row.original)}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    />
                    <UpdateBedModal />
                    <ConfirmInvoiceModal/>
                </div>
            </div>
        </div>
    )
}