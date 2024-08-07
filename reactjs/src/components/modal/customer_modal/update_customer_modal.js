import { Close, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Button, IconButton, MenuItem, Radio, styled, TextField } from "@mui/material";
import { Label, Modal } from "flowbite-react";
import { setCustomerImportFileErrorList, setCustomerUpdateSuccess, setOpenCustomerImportFileStatusModal, setOpenCustomerListModal } from "../../../redux_features/customerFeature";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { setOpenLoadingScreen } from "../../../redux_features/baseFeature";



const Text = styled(TextField)(({ theme }) => ({
    'input:focus': {
        '--tw-ring-shadow': 'none'
    },
}))


export default function UpdateCustomerModal() {

    const dispatch = useDispatch();
    const customerFeature = useSelector(state => state.customer);

    const [index, setIndex] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const [customerGender, setCustomerGender] = useState(true);
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerIdentification, setCustomerIdentification] = useState('');
    const [idCompany, setIDCompany] = useState(-1);
    const [idCourse, setIDCourse] = useState(-1);

    const [companies, setCompanies] = useState([]);
    const [courses, setCourses] = useState([]);

    const [customers, setCustomers] = useState([]);

    const [customerNameFlag, setCustomerNameFlag] = useState(false);

    const [isProcessing,setIsProcessing]=useState(false);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/company/getAll', { withCredentials: true })
            .then(function (response) {
                setCompanies(response.data.result);
            }).catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error("Công ty: " + error.response.data.error_code);
                } else {
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            })
        axios.get(process.env.REACT_APP_BACKEND + 'api/course/getAll', { withCredentials: true })
            .then(function (response) {
                setCourses(response.data.result);
            }).catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error('Khoá học: ' + error.response.data.error_code);
                } else {
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            })
    }, [])

    useEffect(() => {
        if (customerName.length >= 5)
            setCustomerNameFlag(true);
        else
            setCustomerNameFlag(false);
    }, [customerName])

    useEffect(() => {
        setCustomers(customerFeature.customerList);
    }, [customerFeature.customerList])

    const updateCustomers = () => {
        const newCustomer = {
            id: customers[index].id,
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_identification: customerIdentification,
            customer_email:customers[index].customer_email,
            customer_address:customers[index].customer_address,
            customer_gender: customerGender,
            id_company: idCompany,
            id_course: idCourse,
            customer_status:customers[index].customer_status,
        }
        let newCustomerList = customers;
        newCustomerList = [...newCustomerList.slice(0, index), newCustomer, ...newCustomerList.slice(index + 1)];
        setCustomers(newCustomerList);
    }

    useEffect(() => {
        if (customerFeature.openCustomerListModal) {
            setCustomerName(customerFeature.customerList[0].customer_name);
            setCustomerGender(customerFeature.customerList[0].customer_gender);
            setCustomerPhone(customerFeature.customerList[0].customer_phone);
            setCustomerIdentification(customerFeature.customerList[0].customer_identification);
            setIDCompany(customerFeature.customerList[0].id_company);
            setIDCourse(customerFeature.customerList[0].id_course);
        } else {
            setIndex(0);
        }
    }, [customerFeature.openCustomerListModal, customerFeature.customerList])


    const onHandleLeftButton = (e) => {
        if (index > 0 && customerNameFlag) {
            updateCustomers();
            setCustomerName(customers[index - 1].customer_name);
            setCustomerGender(customers[index - 1].customer_gender);
            setCustomerPhone((customers[index - 1].customer_phone));
            setCustomerIdentification(customers[index - 1].customer_identification);
            setIDCompany(customers[index - 1].id_company);
            setIDCourse(customers[index - 1].id_course);
            setIndex(index - 1);
        }
    }

    const onHandleRightButton = (e) => {
        if (index < customers.length - 1 && customerNameFlag) {
            updateCustomers();
            setCustomerName(customers[index + 1].customer_name);
            setCustomerGender(customers[index + 1].customer_gender);
            setCustomerPhone((customers[index + 1].customer_phone));
            setCustomerIdentification(customers[index + 1].customer_identification);
            setIDCompany(customers[index + 1].id_company);
            setIDCourse(customers[index + 1].id_course);
            setIndex(index + 1);
        }
    }

    const onHandleConfirm=(e)=>{
        e.preventDefault();
        if (isProcessing)
            return;

        if(customerNameFlag){
            dispatch(setOpenLoadingScreen(true));
            const newCustomer = {
                id: customers[index].id,
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_identification: customerIdentification,
                customer_email:customers[index].customer_email,
                customer_address:customers[index].customer_address,
                customer_gender: customerGender,
                id_company: idCompany,
                id_course: idCourse,
                customer_status:customers[index].customer_status,
            }
            let newCustomerList = customers;
            newCustomerList = [...newCustomerList.slice(0, index), newCustomer, ...newCustomerList.slice(index + 1)];
            axios.post(process.env.REACT_APP_BACKEND+'api/customer/updateCustomerList',{
                customer_list:newCustomerList
            },{withCredentials:true})
            .then(function(response){
                dispatch(setCustomerImportFileErrorList(response.data.error_code));
                dispatch(setOpenCustomerImportFileStatusModal(true));
                dispatch(setCustomerUpdateSuccess());
                dispatch(setOpenCustomerListModal(false));
            }).catch(function(error){
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error(error.response.data.error_code);
                } else {
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            }).finally(function(){
                dispatch(setOpenLoadingScreen(false));
                setIsProcessing(false);
            })
        }
    }

    return (
        <Modal show={customerFeature.openCustomerListModal} onClose={() => dispatch(setOpenCustomerListModal(false))} className="relative">
            <Modal.Body>
                <div className="absolute top-3 right-4">
                    <IconButton onClick={() => dispatch(setOpenCustomerListModal(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                    Cập nhật khách hàng số lượng lớn
                </div>
                <form onSubmit={onHandleConfirm}>
                    <div className="flex flex-row gap-1 mb-2">
                        <Button onClick={onHandleLeftButton}>
                            <KeyboardArrowLeft />
                        </Button>
                        <div className="flex flex-col gap-3">
                            <Text variant="outlined" required style={{ width: '455px' }} type="text" error={!customerNameFlag} label="Tên khách hàng" size="small" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                            <div className="flex flex-row gap-4 items-center">
                                <legend>Giới tính</legend>
                                <div className="flex flex-row gap-1 items-center">
                                    <Radio id="male" name="gender" className="mr-2" checked={customerGender} onClick={() => setCustomerGender(true)} />
                                    <Label htmlFor="male" value="Nam" />
                                </div>
                                <div className="flex flex-row gap-1 items-center">
                                    <Radio id="female" name="gender" className="mr-2" checked={!customerGender} onClick={() => setCustomerGender(false)} />
                                    <Label htmlFor="female" value="Nữ" />
                                </div>
                            </div>
                            <Text size="small" fullWidth label="Số điện thoại" variant="outlined" type="number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                            <Text size="small" fullWidth label="CMND/CCCD" variant="outlined" type="number" value={customerIdentification} onChange={(e) => setCustomerIdentification(e.target.value)} />
                            <TextField select variant="outlined" label="Công ty" size="small" style={{ width: '455px' }} value={idCompany} onChange={(e) => setIDCompany(e.target.value)}>
                                <MenuItem value={-1}>Không</MenuItem>
                                {companies.map((value, index) => <MenuItem value={value.id} key={index}>
                                    {value.company_name}
                                </MenuItem>)}
                            </TextField>
                            <TextField select variant="outlined" label="Khoá học" size="small" style={{ width: '455px' }} value={idCourse} onChange={(e) => setIDCourse(e.target.value)}>
                                <MenuItem value={-1}>Không</MenuItem>
                                {courses.map((value, index) => <MenuItem value={value.id} key={index}>
                                    {value.course_name}
                                </MenuItem>)}
                            </TextField>
                            <div className="flex flex-row-reverse">
                                {index + 1}/{customers.length}
                            </div>
                        </div>
                        <Button onClick={onHandleRightButton}>
                            <KeyboardArrowRight />
                        </Button>
                    </div>
                    <Button variant="contained" color="primary" type="submit" fullWidth>Đồng ý</Button>
                </form>

            </Modal.Body>
        </Modal>
    )
}