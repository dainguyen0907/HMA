import { Button, Radio } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { IconContext } from "react-icons";
import { FaCirclePlus } from "react-icons/fa6";
import CustomerModal from "../../components/modal/customer_modal";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import { Box, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";



export default function CustomerSetting() {

    const [openModal, setOpenModal] = useState(false);
    const [modalHeader, setModalHeader] = useState("Thêm khách hàng mới");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [success, setSuccess] = useState(0);
    const [idCustomer, setIdCustomer] = useState(-1);
    const [customerName, setCustomerName] = useState("");
    const [customerGender, setCustomerGender] = useState(true);
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerStatus, setCustomerStatus] = useState(true);
    const [customerStudentCheck, setCustomerStudentCheck] = useState(false);
    const [customerIdentification, setCustomerIdentification] = useState("");
    const [studentCode, setStudentCode] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [dobStudent, setDOBStudent] = useState(new Date().toLocaleDateString('vi-VI'));
    const [pobStudent, setPOBStudent] = useState("");

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
    ], []);

    useEffect(() => {
        setIsLoading(true);
        axios.get(process.env.REACT_APP_BACKEND + "api/customer/getAll", { withCredentials: true })
            .then(function (response) {
                setData(response.data.result);
                setIsLoading(false);
            }).catch(function (error) {
                console.log(error)
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }, [success]);

    const declareCustomer = (customer) => {
        setCustomerAddress(customer.customer_address);
        setCustomerEmail(customer.customer_email);
        setCustomerGender(customer.customer_gender);
        setCustomerIdentification(customer.customer_identification);
        setCustomerName(customer.customer_name);
        setCustomerPhone(customer.customer_phone);
        setCustomerStudentCheck(customer.customer_student_check);
        setStudentClass(customer.customer_class);
        setStudentCode(customer.customer_student_code);
        setDOBStudent(new Date(customer.customer_dob).toLocaleDateString('vi-VI'));
        setPOBStudent(customer.customer_pob);
        setIdCustomer(customer.id);
        setCustomerStatus(customer.customer_status);
        console.log(customerStudentCheck);
    }
    const initialCustomer = () => {
        setCustomerAddress("");
        setCustomerEmail("");
        setCustomerGender(true);
        setCustomerIdentification("");
        setCustomerName("");
        setCustomerPhone("");
        setCustomerStudentCheck(false);
        setStudentClass("");
        setStudentCode("");
        setDOBStudent(new Date().toLocaleDateString('vi-VI'));
        setPOBStudent("");
        setIdCustomer(-1);
    }

    const onDelete = (idCustomer) => {
        if (window.confirm("Bạn muốn xoá khách hàng này?")) {
            axios.post(process.env.REACT_APP_BACKEND + "api/customer/deleteCustomer", {
                id: idCustomer
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    setSuccess(success + 1);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                });
        }
    }

    const onConfirmAction = () => {
        if (idCustomer === -1) {
            axios.post(process.env.REACT_APP_BACKEND + "api/customer/insertCustomer", {
                name: customerName,
                gender: customerGender,
                email: customerEmail,
                address: customerAddress,
                phone: customerPhone,
                identification: customerIdentification,
                student_check: customerStudentCheck,
                dob: dobStudent,
                student_code: studentCode,
                classroom: studentClass,
                pob: pobStudent
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success("Thêm khách hàng mới thành công");
                    setOpenModal(false);
                    setSuccess(success + 1);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                });
        } else {
            axios.post(process.env.REACT_APP_BACKEND + "api/customer/updateCustomer", {
                id: idCustomer,
                name: customerName,
                gender: customerGender,
                email: customerEmail,
                address: customerAddress,
                phone: customerPhone,
                identification: customerIdentification,
                student_check: customerStudentCheck,
                dob: dobStudent,
                student_code: studentCode,
                classroom: studentClass,
                pob: pobStudent,
                status: customerStatus,
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    setOpenModal(false);
                    setSuccess(success + 1);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                });
        }
    }


    return (<div className="w-full h-full overflow-auto p-2">
        <div className="border-2 rounded-xl w-full h-full">
            <div className="border-b-2 px-3 py-1 grid grid-cols-2 h-[8%]">
                <div className="py-2">
                    <h1 className="font-bold text-blue-600">Danh sách khách hàng</h1>
                </div>
                <div className="ml-auto">
                    <IconContext.Provider value={{ size: '20px' }}>
                        <Button outline gradientMonochrome="success"
                            onClick={() => {
                                setOpenModal(true);
                                setModalHeader('Thêm khách hàng mới');
                                initialCustomer();
                            }}>
                            <FaCirclePlus className="mr-2"/> Thêm khách hàng mới
                        </Button>
                    </IconContext.Provider>
                    <CustomerModal openModal={openModal} setOpenModal={setOpenModal}
                        modalHeader={modalHeader} customerName={customerName} setCustomerName={setCustomerName}
                        customerIdentification={customerIdentification} setCustomerIdentification={setCustomerIdentification}
                        customerPhone={customerPhone} setCustomerPhone={setCustomerPhone}
                        customerEmail={customerEmail} setCustomerEmail={setCustomerEmail}
                        customerAddress={customerAddress} setCustomerAddress={setCustomerAddress}
                        customerGender={customerGender} setCustomerGender={setCustomerGender}
                        customerStatus={customerStatus} setCustomerStatus={setCustomerStatus}
                        idCustomer={idCustomer} customerStudentCheck={customerStudentCheck}
                        setCustomerStudentCheck={setCustomerStudentCheck} studentCode={studentCode}
                        setStudentCode={setStudentCode} studentClass={studentClass} setStudentClass={setStudentClass}
                        dobStudent={dobStudent} setDOBStudent={setDOBStudent} pobStudent={pobStudent}
                        setPOBStudent={setPOBStudent} onConfirmAction={onConfirmAction}
                    />
                </div>
            </div>
            <div className="w-full h-[92%]">
                <MaterialReactTable
                    columns={columns}
                    data={data}
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
                    localization={MRT_Localization_VI}
                    enableRowActions
                    positionActionsColumn="last"
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                            <IconButton color="primary"
                                title="Sửa thông tin"
                                onClick={() => {
                                    setOpenModal(true);
                                    setModalHeader("Cập nhật thông tin khách hàng")
                                    declareCustomer(row.original)
                                }}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton color="error"
                                title="Xoá khách hàng"
                                onClick={() => {
                                    onDelete(row.original.id)
                                }}>
                                <Delete />
                            </IconButton>
                        </Box>
                    )}
                />
            </div>
        </div>
    </div>)
}