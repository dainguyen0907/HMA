
import { Print, Search } from "@mui/icons-material";
import { MenuItem, TextField, Tooltip } from "@mui/material";
import axios from "axios";
import { Button, Label } from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";

export function CostConfirmationForm() {
    const formFeature=useSelector(state=>state.form);
    const [courseID, setCourseID] = useState(-1);
    const [companyID, setCompanyID] = useState(-1);
    const [courseList,setCourseList]=useState([]);
    const [companyList,setCompanyList]=useState([]);
    const [printFlag, setPrintFlag] = useState(false);
    const printRef=useRef();

    const [courseName,setCourseName]=useState("");

    useEffect(()=>{
        axios.get(process.env.REACT_APP_BACKEND + 'api/company/getAll', { withCredentials: true })
        .then(function (response) {
           setCompanyList(response.data.result);
        }).catch(function (error) {
            if (error.response) {
                toast.error('Dữ liệu công ty: ' + error.response.data.error_code);
            }
        })
    axios.get(process.env.REACT_APP_BACKEND + 'api/course/getAll', { withCredentials: true })
        .then(function (response) {
            setCourseList(response.data.result);
        }).catch(function (error) {
            if (error.response) {
                toast.error('Dữ liệu khoá học: ' + error.response.data.error_code);
            }
        })
    },[])

    const onHandleSearch=(e)=>{
        if(companyID===-1||courseID===-1){
            toast.error("Vui lòng kiểm tra lại khoá học và công ty");
        }else{
            setPrintFlag(true);
        }
    }


    const onHandlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: 'Hoá đơn',
        onBeforeGetContent: useCallback(() => { }, []),
        onBeforePrint: useCallback(() => { }, []),
        onAfterPrint: useCallback(() => { }, []),
        removeAfterPrint: true
    });

    return (
        <div className="h-full">
            <div className="flex flex-row gap-4 items-center justify-center pb-5 border-b-2 border-dashed">
                <Label>Chọn khoá học:</Label>
                <TextField variant="outlined" select size="small" label="Khoá học" sx={{ width: '20%' }} value={courseID}
                    onChange={(e) => setCourseID(e.target.value)}>
                    <MenuItem value={-1} disabled>Chọn khoá học</MenuItem>
                    {
                        courseList.map((value,key)=><MenuItem value={value.id} key={key}>{value.id}.{value.course_name}</MenuItem>)
                    }
                </TextField>
                <Label>Chọn công ty:</Label>
                <TextField variant="outlined" select size="small" label="Công ty" sx={{ width: '20%' }} value={companyID}
                    onChange={(e) => setCompanyID(e.target.value)}>
                    <MenuItem value={-1} disabled>Chọn công ty</MenuItem>
                    {
                        companyList.map((value,key)=><MenuItem value={value.id} key={key}>{value.id}.{value.company_name}</MenuItem>)
                    }
                </TextField>
                <Tooltip title="Xuất phiếu">
                    <span>
                        <Button gradientMonochrome="success" outline onClick={onHandleSearch}>
                            <Search />
                        </Button>
                    </span>
                </Tooltip>
                <Tooltip title="In">
                    <span>
                        <Button gradientMonochrome="cyan" outline  onClick={()=>onHandlePrint()} disabled={!printFlag}>
                            <Print />
                        </Button>
                    </span>
                </Tooltip>
            </div>
            <div ref={printRef} hidden={!printFlag}>
                <div className="font-normal text-base p-2">
                    <div className="grid grid-cols-2">
                        <div className="uppercase flex flex-col justify-center align-middle items-center text-sm text-center">
                            <span>Tổng Công ty Điện Lực Miền Nam TNHH</span>
                            <span className="font-semibold">Trường Cao Đẳng Điện lực TP.HCM</span>
                        </div>
                        <div className=" flex justify-center items-center uppercase underline font-bold">
                            Phiếu xác nhận chi phí nghỉ
                        </div>
                    </div>
                </div>
                <div className="uppercase font-bold p-2 w-full text-xl flex flex-col justify-center items-center border-b-2 text-center">
                    <span>KHOÁ ĐÀO TẠO "{courseName}"</span>
                    <span>({formFeature.fromDay} -{formFeature.toDay})</span>
                </div>
                <div className="uppercase font-bold p-2 w-full text-xl text-center">
                    <span>THÔNG TIN HOÁ ĐƠN</span>
                </div>
                <div>
                    <div className="flex flex-row gap-2 pb-1 pr-5">
                        <span className="basis-1/3 text-end">Họ tên người mua hàng:</span>
                        <div className="border-b-2 border-black w-full border-dashed"></div>
                    </div>
                    <div className="flex flex-row gap-2 pb-1 pr-5">
                        <span className="basis-1/3 text-end">Tên đơn vị:</span>
                        <div className="border-b-2 border-black w-full border-dashed">
                            <span></span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 pb-1 pr-5">
                        <span className="basis-1/3 text-end">Địa chỉ:</span>
                        <div className="border-b-2 border-black w-full border-dashed">
                            <span></span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 pb-1 pr-5">
                        <span className="basis-1/3 text-end">Tài khoản:</span>
                        <div className="border-b-2 border-black w-full border-dashed">
                            <span></span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 pb-1 pr-5">
                        <span className="basis-1/3 text-end">Mã số thuế:</span>
                        <div className="border-b-2 border-black w-full border-dashed">
                            <span></span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 pb-1 pr-5">
                        <span className="basis-1/3 text-end">Hình thức:</span>
                        <div className="border-b-2 border-black w-full border-dashed">
                            <span className="font-bold">Chuyển khoản</span>
                        </div>
                    </div>
                    <div className="pb-2"><span className="underline font-bold ">CHI PHÍ GHI HOÁ ĐƠN:</span><span> ghi 1 hoá đơn:</span></div>
                    <table className="table-auto w-full border border-black border-collapse">
                        <thead>
                            <tr>
                                <th className="border border-black max-w-48">TT</th>
                                <th className="border border-black max-w-48">Tên hàng hoá </th>
                                <th className="border border-black max-w-48">ĐVT</th>
                                <th className="border border-black max-w-48">SL</th>
                                <th className="border border-black max-w-48">Đơn giá  </th>
                                <th className="border border-black max-w-48">Thành tiền</th>
                                <th className="border border-black max-w-48">HTTT</th>
                                <th className="border border-black max-w-48">Ghi chú </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-black max-w-48">1</td>
                                <td className="border border-black max-w-48">Chi phí ở túc xá khoá học "BDKT kỹ năng thực hành quản lý sửa chữa đường dây cao thế" từ ngày 18/03/2024 - 05/04/2024</td>
                                <td className="border border-black max-w-48">Học viên</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">2,925,000</td>
                                <td className="border border-black max-w-48">23,400,000</td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"> Đã có VAT</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="pb-2"><span className="underline font-bold ">Chi tiết chi phí:</span><span> Số lượng học viên: 8</span></div>
                    <table className="table-auto w-full border border-black border-collapse">
                        <thead>
                            <tr>
                                <th className="border border-black max-w-48">Ngày</th>
                                <th className="border border-black max-w-48">1</th>
                                <th className="border border-black max-w-48">2</th>
                                <th className="border border-black max-w-48">3</th>
                                <th className="border border-black max-w-48">4</th>
                                <th className="border border-black max-w-48">5</th>
                                <th className="border border-black max-w-48">6</th>
                                <th className="border border-black max-w-48">7</th>
                                <th className="border border-black max-w-48">8</th>
                                <th className="border border-black max-w-48">9</th>
                                <th className="border border-black max-w-48">10</th>
                                <th className="border border-black max-w-48">11</th>
                                <th className="border border-black max-w-48">12</th>
                                <th className="border border-black max-w-48">13</th>
                                <th className="border border-black max-w-48">14</th>
                                <th className="border border-black max-w-48">15</th>
                                <th className="border border-black max-w-48">Tổng</th>
                                <th className="border border-black max-w-48">Đơn giá</th>
                                <th className="border border-black max-w-48">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-black max-w-48">Nghỉ đêm</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">120</td>
                                <td className="border border-black max-w-48">150,000</td>
                                <td className="border border-black max-w-48">18,000,000</td>
                            </tr>
                            <tr>
                                <td className="border border-black max-w-48">Nghỉ trưa</td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48">0</td>
                                <td className="border border-black max-w-48">40,000</td>
                                <td className="border border-black max-w-48">0</td>
                            </tr>
                            <tr>
                                <th className="border border-black max-w-48">Ngày</th>
                                <th className="border border-black max-w-48">16</th>
                                <th className="border border-black max-w-48">17</th>
                                <th className="border border-black max-w-48">18</th>
                                <th className="border border-black max-w-48">19</th>
                                <th className="border border-black max-w-48">20</th>
                                <th className="border border-black max-w-48">21</th>
                                <th className="border border-black max-w-48">22</th>
                                <th className="border border-black max-w-48">23</th>
                                <th className="border border-black max-w-48">24</th>
                                <th className="border border-black max-w-48">25</th>
                                <th className="border border-black max-w-48">26</th>
                                <th className="border border-black max-w-48">27</th>
                                <th className="border border-black max-w-48">28</th>
                                <th className="border border-black max-w-48">29</th>
                                <th className="border border-black max-w-48">30</th>
                                <th className="border border-black max-w-48">Tổng</th>
                                <th className="border border-black max-w-48">Đơn giá</th>
                                <th className="border border-black max-w-48">Thành tiền</th>
                            </tr>
                            <tr>
                                <td className="border border-black max-w-48">Nghỉ đêm</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">8</td>
                                <td className="border border-black max-w-48">120</td>
                                <td className="border border-black max-w-48">150,000</td>
                                <td className="border border-black max-w-48">18,000,000</td>
                            </tr>
                            <tr>
                                <td className="border border-black max-w-48">Nghỉ trưa</td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48"></td>
                                <td className="border border-black max-w-48">0</td>
                                <td className="border border-black max-w-48">40,000</td>
                                <td className="border border-black max-w-48">0</td>
                            </tr>
                            <tr>
                                <td className="border border-black font-bold text-center underline" colSpan="17">Tổng cộng</td>
                                <td className="border border-black"></td>
                                <td className="border border-black font-bold">36,000,000</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="italic font-bold text-justify">Lưu ý: Đề nghị các anh/chị học viên điền đầy đủ thông tin, kiểm tra kỹ các chi phí và vui lòng KÝ XÁC NHẬN vào bên dưới để tránh tình trạng bị sai hoá đơn. Nhà trường chỉ xuất hoá đơn một lần. XIN CẢM ƠN.</div>
                    <div className="grid grid-cols-2 p-2 h-52">
                        <div className="col-start-2 flex flex-col gap-0 items-center">
                            <span className="font-bold">Xác nhận thông tin và chi phí</span>
                            <span className="italic">(Ký và ghi rõ họ tên)</span>
                        </div>
                    </div>
                    <div className="underline font-bold">*Thông tin người nhận hoá đơn:</div>
                    <div className="text-justify">
                        Học viên đại diện nhận hoá đơn điện tử sẽ được gởi qua <span className="font-bold">Email hoặc Zalo </span>cá nhân và chuyển về cho bộ phận
                        thanh toán của đơn vị (phòng TCKT hoặc P. TCNS) sau khi kết thúc lớp học. Học viên vui lòng cho thông tin cụ thể - chính xác và chụp lại phiếu
                        xác nhận. Trong vòng 1 tuần sau khi kết thúc lớp, nếu chưa nhận được hoá đơn hoặc có vấn đề liên quan cần hỗ trợ học viên vui lòng liên hệ C. Nguyên
                        (kế toán) - 028.22 155 665.
                    </div>
                    <div className="grid grid-cols-4 pr-10">
                        <span className="text-end">Tên người nhận:</span>
                        <div className="w-full border-b-2 border-gray-500"></div>
                        <span className="text-center border-b-2 border-gray-500">Số điện thoại (zalo):</span>
                        <div className="w-full border-b-2 border-gray-500"></div>
                        <span className="text-end">Địa chỉ Email:</span>
                        <div className="col-span-3">
                            <div className="w-full border-b-2 border-gray-500">&nbsp;</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}