import { FileDownload, Print } from "@mui/icons-material";
import { Button, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux"
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { utils, writeFile } from "xlsx";
import { StyledTableCell } from "../customize_components/style_table_cell";


export function CustomerStatisticByClass() {

    const customerStatisticFeature = useSelector(state => state.customer_statistic);
    const [courseList, setCourseList] = useState([]);
    const printRef = useRef();

    useEffect(() => {
        let newCourseList = [];
        for (let a = 0; a < customerStatisticFeature.customerTable.length; a++) {
            const element = customerStatisticFeature.customerTable[a];
            const elementObject = {
                id_customer: element.Customer.id,
                customer_name: element.Customer.customer_name,
                customer_phone: element.Customer.customer_phone,
                customer_identification: element.Customer.customer_identification,
                room: element.Room.room_name,
                checkin: element.bed_checkin,
                checkout: element.bed_checkout,
            }
            if (newCourseList.length === 0) {
                newCourseList.push({
                    id_course: element.Customer.id_course,
                    course_name: element.Customer.Course.course_name,
                    lunch_break_list: element.bed_lunch_break && element.Customer.id_company !== 0 ? [elementObject] : [],
                    night_list: element.bed_lunch_break && element.Customer.id_company !== 0 ? [] : [elementObject],
                    teacher_list: element.Customer.id_company === 0 ? [elementObject] : []
                })
            } else
                for (let i = 0; i < newCourseList.length; i++) {
                    if (parseInt(newCourseList[i].id_course) === parseInt(element.Customer.id_course)) {
                        if(element.Customer.id_company&&element.Customer.id_company===0){
                            newCourseList[i].teacher_list.push(elementObject);
                        }else if (element.bed_lunch_break) {
                            let flag = false;
                            for (let j = 0; j < newCourseList[i].lunch_break_list.length; j++) {
                                if (parseInt(element.id_customer) === parseInt(newCourseList[i].lunch_break_list[j].id_customer)) {
                                    if (new Date(newCourseList[i].lunch_break_list[j].checkout) < new Date(element.bed_checkout)) {
                                        newCourseList[i].lunch_break_list[j].checkout = element.bed_checkout;
                                    }
                                    if (new Date(newCourseList[i].lunch_break_list[j].checkin) > new Date(element.bed_checkin)) {
                                        newCourseList[i].lunch_break_list[j].checkin = element.bed_checkin;
                                    }
                                    flag = true;
                                    break;
                                }
                            }
                            if (!flag) {
                                newCourseList[i].lunch_break_list.push(elementObject);
                            }

                        } else {
                            newCourseList[i].night_list.push(elementObject);
                        }
                        break;
                    }
                }
        };
        setCourseList(newCourseList);
    }, [customerStatisticFeature.customerTable])

    const onHandleExportExcel = (e) => {
        if (courseList.length <= 0) {
            toast.error('Không có dữ liệu để xuất excel');
        } else {
            const title = ['TT', 'Phân loại', 'Họ và tên', 'Điện thoại', 'Số CMND', 'Phòng', 'Ngày vào', 'Ngày ra'];
            let newList = [];
            courseList.forEach((element, index) => {
                newList.push([element.course_name]);
                let no = 1;
                element.teacher_list.forEach((v, i) => {
                    newList.push([no, i === 0 ? 'Giảng viên' : '', v.customer_name, v.customer_phone, v.customer_identification, v.room, new Date(v.checkin).toLocaleString('VI-vi'), new Date(v.checkout).toLocaleString('VI-vi')]);
                    no += 1;
                });
                element.lunch_break_list.forEach((v, i) => {
                    newList.push([no, i === 0 ? 'Nghỉ trưa' : '', v.customer_name, v.customer_phone, v.customer_identification, v.room, new Date(v.checkin).toLocaleDateString('VI-vi'), new Date(v.checkout).toLocaleString('VI-vi')]);
                    no += 1;
                });
                element.night_list.forEach((v, i) => {
                    newList.push([no, i === 0 ? 'Nghỉ đêm' : '', v.customer_name, v.customer_phone, v.customer_identification, v.room, new Date(v.checkin).toLocaleDateString('VI-vi'), new Date(v.checkout).toLocaleString('VI-vi')]);
                    no += 1;
                });
            });
            const ws = utils.json_to_sheet(newList);
            const wb = utils.book_new();
            ws['!cols'] = [{ wch: 5 }];
            utils.book_append_sheet(wb, ws, "customer_list");
            utils.sheet_add_aoa(ws, [title], { origin: 'A1' });
            writeFile(wb, "Customer_statistic.xlsx");
        }
    }

    const onHandleExportPDF = useReactToPrint({
        content: () => printRef.current,
        documentTitle: 'Thống kê khách hàng',
        onBeforeGetContent: useCallback(() => { }, []),
        onBeforePrint: useCallback(() => { }, []),
        onAfterPrint: useCallback(() => { }, []),
        removeAfterPrint: true
    });

    return (
        <div className="w-full">
            <div className="flex flex-row gap-2">
                <Button color="primary" variant="outlined" onClick={onHandleExportPDF}>
                    <Print />In PDF
                </Button>
                <Button color="success" variant="outlined" onClick={onHandleExportExcel}>
                    <FileDownload />Xuất Excel
                </Button>
            </div>
            <div ref={printRef}>
                <div className="grid grid-cols-2">
                    <div className="flex flex-col gap-0 items-center">
                        <span className="uppercase font-semibold text-xs">TRƯỜNG CAO ĐẲNG ĐIỆN LỰC THÀNH PHỐ HỒ CHÍ MINH</span>
                        <span className=" font-semibold text-xs">Phòng Quản lý Học sinh - Sinh viên</span>
                    </div>
                </div>
                <div className="flex items-center flex-col gap-0 m-2">
                    <span className="font-bold text-blue-500 uppercase text-2xl">THỐNG KÊ KHÁCH HÀNG THEO DANH SÁCH LỚP</span>
                    <span className="font-bold text-sm"> Từ ngày {customerStatisticFeature.startSearchDate} đến ngày {customerStatisticFeature.endSearchDate}</span>
                </div>
                <center><hr className="border-t-2 border-dashed w-80 border-slate-500" /></center>
                <TableContainer component={Paper} className="mt-5">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>STT</StyledTableCell>
                                <StyledTableCell>Phân loại</StyledTableCell>
                                <StyledTableCell>Họ và tên</StyledTableCell>
                                <StyledTableCell>Điện thoại</StyledTableCell>
                                <StyledTableCell>Số CCCD</StyledTableCell>
                                <StyledTableCell>Phòng</StyledTableCell>
                                <StyledTableCell>Ngày vào</StyledTableCell>
                                <StyledTableCell>Ngày ra</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                courseList.map((value, index) => (
                                    <>
                                        <TableRow key={index}>
                                            <StyledTableCell colSpan={8} align="center" sx={{ backgroundColor: '#198754', color: 'white' }}>
                                                {value.course_name}
                                            </StyledTableCell>
                                        </TableRow>
                                        {
                                            value.teacher_list ? value.teacher_list.map((v, i) => (
                                                <TableRow>
                                                    <StyledTableCell>{i + 1}</StyledTableCell>
                                                    {
                                                        i === 0 ? <StyledTableCell rowSpan={value.night_list.length} >
                                                            Giảng viên
                                                        </StyledTableCell> : null
                                                    }
                                                    <StyledTableCell>{v.customer_name}</StyledTableCell>
                                                    <StyledTableCell>{v.customer_phone}</StyledTableCell>
                                                    <StyledTableCell>{v.customer_identification}</StyledTableCell>
                                                    <StyledTableCell>{v.room}</StyledTableCell>
                                                    <StyledTableCell>{new Date(v.checkin).toLocaleDateString('VI-vi')}</StyledTableCell>
                                                    <StyledTableCell>{new Date(v.checkout).toLocaleDateString('VI-vi')}</StyledTableCell>
                                                </TableRow>
                                            )) : null
                                        }
                                        {
                                            value.night_list ? value.night_list.map((v, i) => (
                                                <TableRow>
                                                    <StyledTableCell>{i + 1}</StyledTableCell>
                                                    {
                                                        i === 0 ? <StyledTableCell rowSpan={value.night_list.length} >
                                                            Nghỉ đêm
                                                        </StyledTableCell> : null
                                                    }
                                                    <StyledTableCell>{v.customer_name}</StyledTableCell>
                                                    <StyledTableCell>{v.customer_phone}</StyledTableCell>
                                                    <StyledTableCell>{v.customer_identification}</StyledTableCell>
                                                    <StyledTableCell>{v.room}</StyledTableCell>
                                                    <StyledTableCell>{new Date(v.checkin).toLocaleDateString('VI-vi')}</StyledTableCell>
                                                    <StyledTableCell>{new Date(v.checkout).toLocaleDateString('VI-vi')}</StyledTableCell>
                                                </TableRow>
                                            )) : null
                                        }
                                        {
                                            value.lunch_break_list ? value.lunch_break_list.map((v, i) => (
                                                <TableRow>
                                                    <StyledTableCell>{i + 1}</StyledTableCell>
                                                    {
                                                        i === 0 ? <StyledTableCell rowSpan={value.lunch_break_list.length}>
                                                            Nghỉ trưa
                                                        </StyledTableCell> : null
                                                    }
                                                    <StyledTableCell>{v.customer_name}</StyledTableCell>
                                                    <StyledTableCell>{v.customer_phone}</StyledTableCell>
                                                    <StyledTableCell>{v.customer_identification}</StyledTableCell>
                                                    <StyledTableCell>{v.room}</StyledTableCell>
                                                    <StyledTableCell>{new Date(v.checkin).toLocaleDateString('VI-vi')}</StyledTableCell>
                                                    <StyledTableCell>{new Date(v.checkout).toLocaleDateString('VI-vi')}</StyledTableCell>
                                                </TableRow>
                                            )) : null
                                        }
                                    </>

                                ))
                            }

                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}