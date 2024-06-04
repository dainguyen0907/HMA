import { Label, Modal, Radio } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerUpdateSuccess, setOpenCustomerModal } from "../../../redux_features/customerFeature";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, IconButton, MenuItem, TextField, styled } from "@mui/material";
import { Close } from "@mui/icons-material";

const Text = styled(TextField)(({ theme }) => ({
    'input:focus': {
        '--tw-ring-shadow': 'none'
    },
}))

export default function CustomerModal() {

    const dispatch = useDispatch();
    const customerFeature = useSelector(state => state.customer);

    const [customerName, setCustomerName] = useState("");
    const [customerGender, setCustomerGender] = useState(true);
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerStatus, setCustomerStatus] = useState(true);
    const [customerIdentification, setCustomerIdentification] = useState("");
    const [companyID, setCompanyID] = useState(-1);
    const [courseID, setCourseID] = useState(-1);

    const [companies, setCompanies] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/company/getAll', { withCredentials: true })
            .then(function (response) {
                setCompanies(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error('Dữ liệu công ty: ' + error.response.data.error_code);
                }
            })
        axios.get(process.env.REACT_APP_BACKEND + 'api/course/getEnableCourse', { withCredentials: true })
            .then(function (response) {
                setCourses(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error('Dữ liệu khoá học: ' + error.response.data.error_code);
                }
            })
    }, [])

    const onHandleConfirm = (e) => {
        e.preventDefault();
        if (companyID === -1 || courseID === -1)
            toast.error('Chưa chọn công ty và khoá học thích hợp');
        else {
            if (!customerFeature.customerSelection) {
                axios.post(process.env.REACT_APP_BACKEND + "api/customer/insertCustomer", {
                    name: customerName,
                    gender: customerGender,
                    email: customerEmail,
                    address: customerAddress,
                    phone: customerPhone,
                    identification: customerIdentification,
                    company: companyID,
                    course: courseID,
                }, { withCredentials: true })
                    .then(function (response) {
                        toast.success("Thêm khách hàng mới thành công");
                        dispatch(setCustomerUpdateSuccess());
                        dispatch(setOpenCustomerModal(false));
                    }).catch(function (error) {
                        if (error.response) {
                            toast.error("Lỗi khởi tạo thông tin: " + error.response.data.error_code);
                        }
                    });
            } else {
                axios.post(process.env.REACT_APP_BACKEND + "api/customer/updateCustomer", {
                    id: customerFeature.customerSelection.id,
                    name: customerName,
                    gender: customerGender,
                    email: customerEmail,
                    address: customerAddress,
                    phone: customerPhone,
                    identification: customerIdentification,
                    status: customerStatus,
                    company: companyID,
                    course: courseID,
                }, { withCredentials: true })
                    .then(function (response) {
                        toast.success(response.data.result);
                        dispatch(setCustomerUpdateSuccess());
                        dispatch(setOpenCustomerModal(false));
                    }).catch(function (error) {
                        if (error.response) {
                            toast.error("Lỗi cập nhật thông tin: " + error.response.data.error_code);
                        }
                    });
            }
        }

    }

    useEffect(() => {
        if (customerFeature.customerSelection) {
            setCustomerName(customerFeature.customerSelection.customer_name);
            setCustomerGender(customerFeature.customerSelection.customer_gender);
            setCustomerEmail(customerFeature.customerSelection.customer_email);
            setCustomerAddress(customerFeature.customerSelection.customer_address);
            setCustomerPhone(customerFeature.customerSelection.customer_phone);
            setCustomerStatus(customerFeature.customerSelection.customer_status);
            setCustomerIdentification(customerFeature.customerSelection.customer_identification);
            setCourseID(customerFeature.customerSelection.id_course);
            setCompanyID(customerFeature.customerSelection.id_company);

        } else {
            setCustomerName("");
            setCustomerGender(true);
            setCustomerEmail("");
            setCustomerAddress("");
            setCustomerPhone("");
            setCustomerStatus(true);
            setCustomerIdentification("");
            setCourseID(-1);
            setCompanyID(-1);
        }
    }, [customerFeature.customerSelection])

    return (
        <Modal show={customerFeature.openCustomerModal} onClose={() => dispatch(setOpenCustomerModal(false))} className="relative">
            <Modal.Body>
                <div className="absolute top-3 right-4">
                    <IconButton onClick={() => dispatch(setOpenCustomerModal(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                    {customerFeature.customerSelection ? 'Cập nhật thông tin khách hàng' : 'Thêm khách hàng mới'}
                </div>
                <form onSubmit={onHandleConfirm}>
                    <div className="flex flex-col gap-3">
                        <Text variant="outlined" required fullWidth type="text" label="Tên khách hàng" size="small" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                        <Text size="small" fullWidth label="CMND/CCCD" variant="outlined" type="number" value={customerIdentification} onChange={(e) => setCustomerIdentification(e.target.value)} />
                        <Text size="small" fullWidth label="Số điện thoại" variant="outlined" type="number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                        <Text size="small" fullWidth label="Địa chỉ email" variant="outlined" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                        <Text size="small" fullWidth label="Địa chỉ liên hệ" variant="outlined" type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
                        <TextField select variant="outlined" label="Công ty" size="small" fullWidth value={companyID} onChange={(e) => setCompanyID(e.target.value)}>
                            <MenuItem value={-1}>Không</MenuItem>
                            {companies.map((value, index) => <MenuItem value={value.id} key={index}>{value.id}.{value.company_name}</MenuItem>)}
                        </TextField>
                        <TextField select variant="outlined" label="Khoá học" size="small" fullWidth value={courseID} onChange={(e) => setCourseID(e.target.value)}>
                            <MenuItem value={-1}>Không</MenuItem>
                            {courses.map((value, index) => <MenuItem value={value.id} key={index}>{value.id}.{value.course_name}</MenuItem>)}
                        </TextField>

                        <div className="grid grid-cols-2">
                            <fieldset>
                                <legend>Giới tính</legend>
                                <div className="float-start mr-9">
                                    <Radio id="male" name="gender" className="mr-2" checked={customerGender} onClick={() => setCustomerGender(true)} />
                                    <Label htmlFor="male" value="Nam" />
                                </div>
                                <div className="float-start">
                                    <Radio id="female" name="gender" className="mr-2" checked={!customerGender} onClick={() => setCustomerGender(false)} />
                                    <Label htmlFor="female" value="Nữ" />
                                </div>
                            </fieldset>
                            <fieldset hidden={!customerFeature.customerSelection}>
                                <legend>Trạng thái</legend>
                                <div className="float-start mr-9">
                                    <Radio id="on" name="status" className="mr-2" checked={customerStatus} onClick={() => setCustomerStatus(true)} />
                                    <Label htmlFor="on" value="Sử dụng" />
                                </div>
                                <div className="float-start" >
                                    <Radio id="off" name="status" className="mr-2" checked={!customerStatus} onClick={() => setCustomerStatus(false)} />
                                    <Label htmlFor="off" value="Khoá" />
                                </div>
                            </fieldset>
                        </div>
                        <Button variant="contained" color="primary" type="submit" disabled={companyID === -1 || courseID === -1}>Đồng ý</Button>
                    </div>
                </form>

            </Modal.Body>
        </Modal>
    );
}