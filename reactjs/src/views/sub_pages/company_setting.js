import { MaterialReactTable } from "material-react-table";
import React, { useMemo, useState } from "react";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import { Box } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { Button } from "flowbite-react";

export default function CompanySetting() {
    const [data, setData] = useState([]);
    const columns = useMemo(() => [
        {
            accessorKey: 'company_name',
            header: 'Tên công ty',
        },
        {
            accessorKey: 'company_phone',
            header: 'Số điện thoại',
        },
        {
            accessorKey: 'company_email',
            header: 'Email',
        },
        {
            accessorKey: 'company_address',
            header: 'Địa chỉ',
        },
    ])
    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-2 h-fit">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Danh sách công ty</h1>
                    </div>

                </div>
                <div className="w-full h-full">
                    <MaterialReactTable
                        data={data}
                        columns={columns}
                        localization={MRT_Localization_VI}
                        enableRowActions
                        positionActionsColumn="last"
                        renderRowActions={({row,table})=>(
                            <Box sx={{ display:"flex", flexWrap:"nowrap", gap:"8px"}}>

                            </Box>
                        )}
                        enableTopToolbar
                        renderTopToolbarCustomActions={(table) => (
                            <div className="flex gap-4">
                                <Button size="sm" outline gradientMonochrome="success"
                                    onClick={() => {
                                        
                                    }}>
                                    <AddCircleOutline /> Thêm công ty
                                </Button>
                            </div>
                        )
                        }
                    />
                </div>
            </div>
        </div>
    )
}