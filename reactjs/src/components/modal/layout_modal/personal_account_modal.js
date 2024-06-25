import { Button, FloatingLabel, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenPersonalAccountModal, setPersonalUpdateSuccess } from "../../../redux_features/personalFeature";
import { Box, IconButton, Tab, Tabs } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { Close } from "@mui/icons-material";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index}
            id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
            {value === index && (
                <div className="p-2">
                    {children}
                </div>
            )}
        </div>
    )
}

function tabProps(index) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}
//==================================================================


export default function PersonalAccountModal() {

    const personalFeature = useSelector(state => state.personal);
    const receptionFeature = useSelector(state => state.reception);
    const dispatch = useDispatch();
    const [value, setValue] = useState(0);
    const [userName, setUserName] = useState("");
    const [account, setAccount] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isProcessing,setIsProcessing]=useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const onHandleCancel = (event) => {
        dispatch(setOpenPersonalAccountModal(false));
    }

    useEffect(() => {
        if (personalFeature.openPersonalAccountModal) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/reception/getReceptionByID?id=' + receptionFeature.reception_id, {
                withCredentials: true
            }).then(function (response) {
                setAccount(response.data.result.reception_account);
                setUserName(response.data.result.reception_name);
                setUserEmail(response.data.result.reception_email);
                setUserPhone(response.data.result.reception_phone);
            }).catch(function (error) {
                if(error.code=== 'ECONNABORTED'){
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                }else if(error.response){
                    toast.error(error.response.data.error_code);
                }else{
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            })
        } else {
            setAccount("");
            setUserName("");
            setUserEmail("");
            setUserPhone("");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    }, [personalFeature.personalUpdateSuccess, receptionFeature.reception_id, personalFeature.openPersonalAccountModal])

    const onHandleUpdateInfor = (event) => {
        event.preventDefault();

        if(isProcessing)
            return;
        setIsProcessing(true);

        axios.post(process.env.REACT_APP_BACKEND + 'api/reception/updateReception', {
            id: receptionFeature.reception_id,
            name: userName,
            email: userEmail,
            phone: userPhone,
            status: true
        }, { withCredentials: true })
            .then(function (response) {
                dispatch(setPersonalUpdateSuccess());
                toast.success(response.data.result);
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

    const onHandleChangePassword = (event) => {
        event.preventDefault();

        if(isProcessing)
            return;

        setIsProcessing(true);

        axios.post(process.env.REACT_APP_BACKEND + 'api/reception/changePassword', {
            oldpassword: oldPassword,
            newpassword: newPassword,
            repassword: confirmPassword
        }, { withCredentials: true })
            .then(function (response) {
                setNewPassword("");
                setOldPassword("");
                setConfirmPassword("");
                toast.success(response.data.result);
            }).catch(function (error) {
                if(error.code=== 'ECONNABORTED'){
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                }else if(error.response){
                    toast.error(error.response.data.error_code);
                }else{
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            }).finally(function(){
                setIsProcessing(false)
            })
    }


    return (
        <Modal show={personalFeature.openPersonalAccountModal} onClose={() => dispatch(setOpenPersonalAccountModal(false))}>
            <Modal.Body>
                <div className="absolute top-2 right-4">
                    <IconButton onClick={onHandleCancel}>
                        <Close />
                    </IconButton>
                </div>
                <div className="w-full">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} >
                            <Tab sx={{ fontWeight: '700' }} {...tabProps(0)} label="Thông tin người dùng" />
                            <Tab sx={{ fontWeight: '700' }} {...tabProps(1)} label="Thay đổi mật khẩu" />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <div className="w-full p-2">
                            <form onSubmit={onHandleUpdateInfor}>
                                <fieldset style={{ border: '2px dashed #E5E7EB', padding: '0 5px' }}>
                                    <legend className="font-bold text-blue-700">Thông tin tài khoản</legend>
                                    <FloatingLabel variant="outlined" readOnly value={account} label="Tài khoản" />
                                </fieldset>
                                <fieldset style={{ border: '2px dashed #E5E7EB', padding: '0 5px' }}>
                                    <legend className="font-bold text-blue-700">Thông tin người dùng</legend>
                                    <FloatingLabel variant="outlined" readOnly value={userName} onChange={(e) => setUserName(e.target.value)} label="Tên người dùng" />
                                    <FloatingLabel variant="outlined" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} label="Địa chỉ mail" />
                                    <FloatingLabel variant="outlined" type="number" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} label="Số điện thoại" />
                                </fieldset>
                                <div className="flex flex-row-reverse pt-2 gap-4">
                                    <Button color="blue" type="submit">Cập nhật</Button>
                                    <Button color="gray" onClick={onHandleCancel}>Thoát</Button>
                                </div>
                            </form>
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <div className="w-full p-2">
                            <form onSubmit={onHandleChangePassword}>
                                <fieldset style={{ border: '2px dashed #E5E7EB', padding: '0 5px' }}>
                                    <legend className="font-bold text-blue-700">Thông tin tài khoản</legend>
                                    <FloatingLabel variant="outlined" readOnly value={account} label="Tài khoản" />
                                </fieldset>
                                <fieldset style={{ border: '2px dashed #E5E7EB', padding: '0 5px' }}>
                                    <legend className="font-bold text-blue-700">Cập nhật mật khẩu</legend>
                                    <FloatingLabel variant="outlined" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} label="Mật khẩu cũ" type="password" />
                                    <FloatingLabel variant="outlined" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} label="Mật khẩu mới" type="password" />
                                    <FloatingLabel variant="outlined" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} label="Xác nhận mật khẩu" type="password" />
                                </fieldset>
                                <div className="flex flex-row-reverse pt-2 gap-4">
                                    <Button color="blue" type="submit">Cập nhật</Button>
                                    <Button color="gray" onClick={onHandleCancel}>Thoát</Button>
                                </div>
                            </form>
                        </div>
                    </CustomTabPanel>
                </div>
            </Modal.Body>
        </Modal>
    )
}