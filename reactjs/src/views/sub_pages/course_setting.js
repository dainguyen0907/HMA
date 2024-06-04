import { Box, IconButton } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import { Button, Tooltip } from "flowbite-react";
import { AddCircleOutline, Delete, Download, Edit } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { setOpenLoadingScreen } from "../../redux_features/baseFeature";
import { setCourseSelection, setCourseUpdateSuccess, setOpenCourseModal } from "../../redux_features/courseFeature";
import CourseModal from "../../components/modal/course_modal/course_modal";
import { download, generateCsv, mkConfig } from "export-to-csv";

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: 'Course_list'
})

export default function CourseSetting() {
    const dispatch = useDispatch();
    const courseFeature = useSelector(state => state.course);

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'id',
            size: '12'
        },
        {
            accessorKey: 'course_name',
            header: 'Tên khoá học',
        },
        {
            accessorKey: 'course_start_date',
            header: 'Ngày bắt đầu',
            Cell: ({ renderValue, row }) => (
                <Box>
                    {new Date(row.original.course_start_date).toLocaleString()}
                </Box>
            )
        },
        {
            accessorKey: 'course_end_date',
            header: 'Ngày kết thúc',
            Cell: ({ renderValue, row }) => (
                <Box>
                    {new Date(row.original.course_end_date).toLocaleString()}
                </Box>
            )
        },
        {
            accessorKey: 'course_status',
            header: 'Trạng thái',
            Cell: ({ renderValue, row }) => (
                <Box>
                    {row.original.course_status?
                    <span className="text-green-500 font-bold">Đang hoạt động</span>
                    :<span className="text-red-500 font-bold">Kết thúc</span>}
                </Box>
            )
        },
    ], [])

    useEffect(() => {
        setIsLoading(true);
        dispatch(setOpenLoadingScreen(true));
        axios.get(process.env.REACT_APP_BACKEND + 'api/course/getAll', { withCredentials: true })
            .then(function (response) {
                setData(response.data.result);
                setIsLoading(false);
                dispatch(setOpenLoadingScreen(false));
            }).catch(function (error) {
                if (error.response) {
                    toast.error('Dữ liệu bảng Khoá học: ' + error.response.data.error_code);
                }
                dispatch(setOpenLoadingScreen(false));
            })
    }, [courseFeature.courseUpdateSuccess, dispatch])

    const onHandleDelete = (id) => {
        if (window.confirm('Bạn muốn xoá khoá học này?')) {
            axios.post(process.env.REACT_APP_BACKEND + 'api/course/deleteCourse', {
                id: id
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success('Xoá khoá học thành công');
                    dispatch(setCourseUpdateSuccess());
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        }
    }

    const onHandleExportFile = (e) => {
        if (data.length > 0) {
            let exportData=[];
            data.forEach((value,key)=>{
                exportData.push({
                    index:key,
                    course_name:value.course_name,
                    course_start_date:new Date(value.course_start_date).toLocaleString(),
                    course_end_date:new Date(value.course_end_date).toLocaleString(),
                    course_status:value.course_status?'Đang hoạt động':'Kết thúc',
                    createdAt: new Date(value.createdAt).toLocaleString(),
                })
            })
            const csv = generateCsv(csvConfig)(exportData);
            download(csvConfig)(csv);
        } else {
            toast.error("Không có dữ liệu để xuất!");
        }
    }

    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-2 h-fit">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Danh sách khoá học</h1>
                    </div>
                </div>
                <div className="w-full h-full">
                    <MaterialReactTable
                        data={data}
                        columns={columns}
                        localization={MRT_Localization_VI}
                        enableRowActions
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
                        renderRowActions={({ row, table }) => (
                            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                                <Tooltip content="Sửa thông tin">
                                    <IconButton color="primary"
                                        onClick={() => {
                                            dispatch(setCourseSelection(row.original));
                                            dispatch(setOpenCourseModal(true));
                                        }}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip content="Xoá khoá học">
                                    <IconButton color="error"
                                        onClick={() => onHandleDelete(row.original.id)}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                        positionActionsColumn="last"
                        enableTopToolbar
                        renderTopToolbarCustomActions={(row) => (
                            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '4px' }}>
                                <Button size="sm" outline gradientMonochrome="success"
                                    onClick={() => {
                                        dispatch(setCourseSelection(null));
                                        dispatch(setOpenCourseModal(true));
                                    }}>
                                    <AddCircleOutline /> Thêm khoá học
                                </Button>
                                <Button size="sm" outline gradientMonochrome="info"
                                onClick={onHandleExportFile}
                                >
                                    <Download/>Xuất file dữ liệu
                                </Button>
                            </Box>
                        )}
                    />
                    <CourseModal/>
                </div>
            </div>
        </div>
    )
}