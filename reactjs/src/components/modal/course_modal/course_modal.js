import { Close } from "@mui/icons-material";
import { IconButton, TextField, styled } from "@mui/material";
import { Button, Label, Modal, Radio } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourseUpdateSuccess, setOpenCourseModal } from "../../../redux_features/courseFeature";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";

const DateTime = styled(DatePicker)(({ theme }) => ({
    'input:focus': {
        '--tw-ring-shadow': 'none'
    },
    'input': {
        'paddingTop': '8.5px',
        'paddingBottom': '8.5px'
    }
}))

export default function CourseModal() {

    const dispatch = useDispatch();
    const courseFeature = useSelector(state => state.course);

    const [courseName, setCourseName] = useState('');
    const [courseStartDate, setCourseStartDate] = useState(null);
    const [courseEndDate, setCourseEndDate] = useState(null);
    const [courseStatus, setCourseStatus] = useState(true);

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (courseFeature.openCourseModal) {
            if (courseFeature.courseSelection) {
                const course = courseFeature.courseSelection;
                setCourseName(course.course_name);
                setCourseStartDate(dayjs(course.course_start_date));
                setCourseEndDate(dayjs(course.course_end_date));
                setCourseStatus(course.course_status);
            } else {
                setCourseName('');
                setCourseStartDate(null);
                setCourseEndDate(null);
                setCourseStatus(true);
            }
        }
    }, [courseFeature.openCourseModal, courseFeature.courseSelection])

    const onHandleSubmit = (e) => {
        e.preventDefault();

        if (isProcessing)
            return;

        setIsProcessing(true);

        if (courseFeature.courseSelection) {
            axios.post(process.env.REACT_APP_BACKEND + 'api/course/updateCourse', {
                id: courseFeature.courseSelection.id,
                name: courseName,
                start_date: courseStartDate,
                end_date: courseEndDate,
                status: courseStatus,
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success('Cập nhật Khoá học thành công');
                    dispatch(setOpenCourseModal(false));
                    dispatch(setCourseUpdateSuccess());
                }).catch(function (error) {
                    if (error.code === 'ECONNABORTED') {
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    } else if (error.response) {
                        toast.error(error.response.data.error_code);
                    } else {
                        toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                    }
                }).finally(function () {
                    setIsProcessing(false);
                })
        } else {
            if (!courseStartDate) {
                toast.error('Chưa chọn ngày bắt đầu khoá học')
            } else if (!courseEndDate) {
                toast.error('Chưa chọn ngày kết thúc khoá học')
            } else {
                axios.post(process.env.REACT_APP_BACKEND + 'api/course/insertCourse', {
                    name: courseName,
                    start_date: courseStartDate,
                    end_date: courseEndDate,
                    status: courseStatus,
                }, { withCredentials: true })
                    .then(function (response) {
                        toast.success('Khởi tạo Khoá học thành công');
                        dispatch(setOpenCourseModal(false));
                        dispatch(setCourseUpdateSuccess());
                    }).catch(function (error) {
                        if(error.code=== 'ECONNABORTED'){
                            toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                        }else if(error.response){
                            toast.error(error.response.data.error_code);
                        }else{
                            toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                        }
                    }).finally(function(){
                        setIsProcessing(false);
                    })
            }
        }
    }

    return (
        <Modal show={courseFeature.openCourseModal}>
            <Modal.Body className="relative">
                <form onSubmit={onHandleSubmit}>
                    <div className="absolute top-3 right-4">
                        <IconButton onClick={() => dispatch(setOpenCourseModal(false))}>
                            <Close />
                        </IconButton>
                    </div>
                    <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                        {courseFeature.courseSelection ? "Cập nhật khoá học" : "Thêm khoá học mới"}
                    </div>
                    <div className="flex flex-col gap-2">
                        <TextField size="small" label="Tên khoá học" variant="outlined" type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} autoComplete="off" required />
                        <div className="flex flex-row items-center gap-3">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <span>Từ: </span>
                                <DateTime label="Ngày bắt đầu" format="DD/MM/YYYY" value={courseStartDate} si
                                    onChange={(value) => setCourseStartDate(value)} />
                                <span>tới</span>
                                <DateTime label="Ngày kết thúc" format="DD/MM/YYYY" value={courseEndDate}
                                    onChange={(value) => setCourseEndDate(value)} />
                            </LocalizationProvider>
                        </div>
                        <div className="flex flex-row mt-2 gap-5">
                            <span>Trạng thái:</span>
                            <div className="flex items-center gap-2">
                                <Radio id="status_true" name="status" checked={courseStatus} onClick={() => setCourseStatus(true)} />
                                <Label htmlFor="status_true">Đang hoạt động</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Radio id="status_false" name="status" checked={!courseStatus} onClick={() => setCourseStatus(false)} />
                                <Label htmlFor="status_false">Kết thúc</Label>
                            </div>
                        </div>
                        <Button color="blue" type="submit">{courseFeature.courseSelection ? "Cập nhật" : "Thêm"}</Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    )
}