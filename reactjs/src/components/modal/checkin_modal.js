import { Button, Modal } from "flowbite-react";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalCheckIn } from "../../redux_features/floorFeature";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from "@mui/material/TextField";
import { Box, IconButton, MenuItem, Radio, Tooltip, styled } from "@mui/material";
import { FaPlusCircle } from "react-icons/fa";
import { FaArrowCircleDown } from "react-icons/fa";
import { FaRedoAlt } from "react-icons/fa";
import { IconContext } from "react-icons";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";

const Text = styled(TextField)(({ theme }) => ({
    '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input:focus': {
        '--tw-ring-shadow': 'none'
    },
    '.css-7209ej-MuiInputBase-input-MuiFilledInput-input:focus': {
        '--tw-ring-shadow': 'none'
    }
}));

const DateTime = styled(DateTimePicker)(({ theme }) => ({
    '.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input:focus': {
        '--tw-ring-shadow': 'none'
    }
}))

export default function CheckInModal() {

    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);
    const [customers, setCustomers] = useState([]);

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'Mã số',
            size: '10'
        },
        {
            accessorKey: 'customer_identification',
            header: 'Số CMND/CCCD',
            size: '12'
        },
        {
            accessorKey: 'customer_name',
            header: 'Tên khách hàng',
            size: '50'
        }, {
            header: 'Giới tính',
            Cell: ({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                    {row.original.customer_gender ? "Nam" : "Nữ"}
                </Box>
            ),
        }, {
            accessorKey: 'customer_phone',
            header: 'Số điện thoại',
            size: '12'
        }, {
            header: 'Là sinh viên',
            Cell: ({ renderedCellValue, row }) => (
                <Box className="flex items-center gap-4">
                    <Radio className="ml-10" checked={Boolean(row.original.customer_student_check)} disabled />
                </Box>
            ),
        }
    ], [])


    return (
        <Modal size="5xl" show={floorFeature.openModalCheckIn} onClose={() => dispatch(setOpenModalCheckIn(false))}>
            <Modal.Body>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <center className="font-bold text-blue-500">Nhận phòng: {floorFeature.roomName}</center>
                    <div className="grid grid-cols-2 border-b-2 border-gray-300 p-2">
                        <div className="grid grid-cols-1 pr-5">
                            <Text size="small" label="Đơn giá" fullWidth variant="outlined" />
                            <div className="my-3 grid grid-cols-2">
                                <DateTime label="Ngày checkin" sx={{ width: "90%" }} />
                                <DateTime label="Ngày checkout" sx={{ width: "90%" }} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <Text size="small" label="Trả trước" fullWidth variant="outlined" />
                            <div className="row-span-2 my-3">
                                <Text label="Ghi chú" fullWidth variant="outlined" size="small"/>
                            </div>
                        </div>
                    </div>
                    <center className="font-bold text-blue-500">Thông tin khách hàng</center>
                    <div className="grid grid-cols-2 pt-2 border-b-2 border-gray-300">
                        <div className="px-3 py-1">
                            <Text select size="small" fullWidth variant="outlined" label="Đối tượng">
                                <MenuItem value={false}>Khách hàng</MenuItem>
                                <MenuItem value={true}>Sinh viên</MenuItem>
                            </Text>
                        </div>
                        <div className="px-3 py-1">
                            <Text label="Họ và tên" size="small" fullWidth variant="outlined" />
                        </div>
                        <div className="px-3 py-1">
                            <Text label="Địa chỉ" size="small" fullWidth variant="outlined" />
                        </div>
                        <div className="px-3 py-1">
                            <Text label="Số điện thoại" size="small" fullWidth variant="outlined" />
                        </div>
                        <div className="px-3 py-1">
                            <Text label="CMND/CCCD" size="small" fullWidth variant="outlined" />
                        </div>
                        <div className="px-3 py-1">
                            <IconContext.Provider value={{ size: "30px" }}>
                                <Tooltip title="Reset">
                                    <div className="float-end ml-2">
                                        <IconButton color="gray">
                                            <FaRedoAlt />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                                <Tooltip title="Tạo mới">
                                    <div className="float-end ml-2">
                                        <IconButton color="primary">
                                            <FaPlusCircle />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                                <Tooltip title="Thêm khách hàng">
                                    <div className="float-end ml-2">
                                        <IconButton color="success">
                                            <FaArrowCircleDown />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                            </IconContext.Provider>
                        </div>
                    </div>
                    <div className="w-full h-20 bg-blue-50 overflow-y-scroll">
                        <MaterialReactTable
                            columns={columns}
                            data={customers}
                            localization={MRT_Localization_VI}
                            enableRowActions
                            positionActionsColumn="last"
                            enableFilters={false}
                            enableFullScreenToggle={false}
                            enableSorting={false}
                            enableDensityToggle={false}
                            enableHiding={false}
                            enableColumnActions={false}
                            enablePagination={false}
                            enableTopToolbar={false}
                            enableBottomToolbar={false}
                        />
                    </div>
                </LocalizationProvider>
                <div className="pt-3">
                    <Button color="blue" className="float-end ml-2">Nhận phòng</Button>
                    <Button color="gray" className="float-end ml-2" onClick={() => dispatch(setOpenModalCheckIn(false))}>Huỷ</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}