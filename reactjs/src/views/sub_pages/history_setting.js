import { Button, Datepicker, Label } from "flowbite-react";
import { MaterialReactTable } from "material-react-table";
import React, { useMemo, useState } from "react";
import { IconContext } from "react-icons";
import { BiSearch } from "react-icons/bi";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import { toast } from "react-toastify";
import axios from "axios";
import { Box } from "@mui/material";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { Download } from "@mui/icons-material";

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename:'HMA Log'
})

export default function HistorySetting() {

    const [from, setFrom] = useState(new Date().toLocaleDateString('vi-VI'));
    const [to, setTo] = useState(new Date().toLocaleDateString('vi-VI'));

    const [data, setData] = useState([]);
    const columns = useMemo(() => [
        {
            accessorKey: 'createdAt',
            header: 'Ngày tháng năm',
            Cell: ({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                    {new Date(row.original.createdAt).toLocaleString()}
                </Box>
            )
        },
        {
            accessorKey: 'content',
            header: 'Nội dung',
            size: '400'
        },
    ], [])

    const onHandleExportCSV = () => {
        if (data.length > 0) {
            const csv = generateCsv(csvConfig)(data);
            download(csvConfig)(csv);
        }else{
            toast.error("Vui lòng chọn khoảng thời gian để xuất file!");        }
    }

    const onHandleSearch = () => {
        const dayFrom = new Date(Date.UTC(from.split('/')[2], from.split('/')[1] - 1, from.split('/')[0])).getTime();
        const dayTo = new Date(Date.UTC(to.split('/')[2], to.split('/')[1] - 1, to.split('/')[0])).getTime();
        if (dayFrom <= dayTo) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/history?from=' + from + '&to=' + to, { withCredentials: true })
                .then(function (response) {
                    setData(response.data.result);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        } else {
            toast.error("Lựa chọn ngày chưa phù hợp. Vui lòng kiểm tra lại!")
        }
    }

    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-3 h-fit">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Lịch sử cập nhật</h1>
                    </div>
                    <div className="col-span-2 grid grid-cols-3">
                        <div className="flex gap-2">
                            <Label htmlFor="from" className="pt-2 ">Từ ngày: </Label>
                            <Datepicker id="from" language="vi-VI" labelTodayButton="Hiện tại" labelClearButton="Huỷ"
                                value={from} onSelectedDateChanged={(date) => setFrom(new Date(date).toLocaleDateString('vi-VI'))} />
                        </div>
                        <div className="flex gap-2">
                            <Label className="pt-2" htmlFor="to">đến ngày:</Label>
                            <Datepicker id="to" language="vi-VI" labelTodayButton="Hiện tại" labelClearButton="Huỷ"
                                value={to} onSelectedDateChanged={(date) => setTo(new Date(date).toLocaleDateString('vi-VI'))} />
                        </div>
                        <div className="">
                            <IconContext.Provider value={{ size: '20px' }}>
                                <Button gradientMonochrome="success" outline type="outlined" onClick={() => onHandleSearch()}>
                                    <BiSearch />
                                    Tìm kiếm
                                </Button>
                            </IconContext.Provider>
                        </div>
                    </div>
                </div>
                <div className="w-full h-full">
                    <MaterialReactTable
                        data={data}
                        columns={columns}
                        localization={MRT_Localization_VI}
                        renderTopToolbarCustomActions={(table) => (
                            <Box sx={{
                                display: 'flex',
                                padding: '2px',
                                flexWrap: 'wrap'
                            }}>
                                <Button color="success" startIcon={<Download/>} outline
                                onClick={onHandleExportCSV}>
                                    Xuất file csv
                                </Button>
                            </Box>
                        )}

                    />
                </div>
            </div>
        </div>
    )
}