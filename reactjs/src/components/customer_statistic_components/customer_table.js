import { Delete, Edit } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify";
import { setBedSelection, setCountUpdateSuccess, setOpenBedUpdateModal } from "../../redux_features/customerStatisticFeature";
import {  utils, writeFile } from 'xlsx';



export default function CustomerTable() {
    const custsomerStatisticFeature = useSelector(state => state.customer_statistic);
    const dispatch = useDispatch();
    const colums = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'id',
            size: '1'
        }, {
            accessorKey: 'Customer.customer_name',
            header: 'Tên khách hàng',
            size: '20'
        }, {
            accessorKey: 'Customer.customer_gender',
            header: 'Giới tính',
            size: '1',
            Cell: ({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                    {row.original.Customer ? row.original.Customer.customer_gender ? 'Nam' : 'Nữ' : ''}
                </Box>
            )
        }, {
            accessorKey: 'Room.room_name',
            header: 'Phòng',
            size: '5'
        }, {
            accessorKey: 'Customer.Company.company_name',
            header: 'Tên công ty',
            size: '5'
        }, {
            accessorKey: 'Customer.Course.course_name',
            header: 'Khoá học',
            size: '5'
        }, {
            accessorKey: 'bed_checkin',
            header: 'Checkin',
            size: '5',
            Cell: ({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                    {new Date(row.original.bed_checkin).toLocaleString('vi-VI')}
                </Box>
            )
        }, {
            accessorKey: 'bed_checkout',
            header: 'Checkout',
            size: '5',
            Cell: ({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                    {new Date(row.original.bed_checkout).toLocaleString('vi-VI')}
                </Box>
            )
        }, {
            accessorKey: 'bed_lunch_break',
            header: 'Phân loại',
            size: '5',
            Cell: ({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                    {row.original.bed_lunch_break ? <span className="text-orange-500 font-bold">Nghỉ trưa</span> : <span className="text-blue-500 font-bold">Nghỉ đêm</span>}
                </Box>
            )
        }

    ], [])


    const onHandlePrint = (e) => {
        if (custsomerStatisticFeature.customerTable.length === 0) {
            toast.error('Bảng dữ liệu rỗng! Không xuất được dữ liệu!');
        } else {
            const title=['TT', 'id KH', 'Họ tên', 'Giới tính', 'Đơn vị', 'Khoá học', 'ĐT', 'CCCD', 'Phòng', 'Ngày vào', 'Ngày ra', 'NĐ', 'NT', 'Loại giường', 'Đơn giá'];
            let newList = [];
            let index = 1;
            custsomerStatisticFeature.customerTable.forEach((value, key) => {
                let flag = false;
                for (let i = 1; i < newList.length; i++) {
                    if (newList[i][1] === parseInt(value.id_customer) && newList[i][11] !== 'x' && value.bed_lunch_break
                        && newList[i][14] === value.Price.price_name) {
                        newList[i][10] = new Date(value.bed_checkout).toLocaleString('vi-VI');
                        newList[i][12] += 1;
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    return;
                }
                newList.push([index, value.id_customer, value.Customer.customer_name, value.Customer.customer_gender ? 'Nam' : 'Nữ', value.Customer.Company.company_name,
                    value.Customer.Course.course_name, value.Customer.customer_phone, value.Customer.customer_identification, value.Room.room_name,
                    new Date(value.bed_checkin).toLocaleString('vi-VI'), new Date(value.bed_checkout).toLocaleString('vi-VI'),
                    value.bed_lunch_break ? 0 : 'x', value.bed_lunch_break ? 1 : 0, value.Bed_type ? value.Bed_type.bed_type_name : '', value.Price ? value.Price.price_name : ''
                ])
                index += 1;
            })
            const ws=utils.json_to_sheet(newList);
            const wb=utils.book_new();
            ws['!cols']=[{wch:10}];
            utils.book_append_sheet(wb,ws,"customer_list");
            utils.sheet_add_aoa(ws,[title],{origin:'A1'});
            writeFile(wb,"Customer_statistic.xlsx");
        }

    }

    const onHandleDeleteBed = (id) => {
        if (window.confirm('Bạn muốn xoá giường này ?')) {
            axios.post(process.env.REACT_APP_BACKEND + 'api/bed/deleteBed', {
                id: id
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setCountUpdateSuccess());
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        }
    }

    const onHandleClickUpdateButton = (bed) => {
        dispatch(setOpenBedUpdateModal(true));
        dispatch(setBedSelection(bed));
    }

    return (
        <div className="w-full">
            <MaterialReactTable
                columns={colums}
                data={custsomerStatisticFeature.customerTable}
                localization={MRT_Localization_VI}
                enableRowActions
                enableRowNumbers
                positionActionsColumn="last"
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '4px' }}>
                        <Tooltip title="Sửa thông tin">
                            <IconButton color="primary" onClick={() => onHandleClickUpdateButton(row.original)}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Xoá giường">
                            <IconButton color="error" onClick={() => onHandleDeleteBed(row.original.id)}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
                enableTopToolbar
                renderTopToolbarCustomActions={(table) => (
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '4px' }}>
                        <Button variant="contained" color="primary" onClick={onHandlePrint}>
                            Xuất file
                        </Button>
                    </Box>
                )}
            />
        </div>
    )
}