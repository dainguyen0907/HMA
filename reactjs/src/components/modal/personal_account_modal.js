import { Button, FloatingLabel, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenPersonalAccountModal, setPersonalUpdateSuccess } from "../../redux_features/personalFeature";
import { Box, Tab, Tabs } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

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
                if (error.response) {
                    toast.error("Lấy dữ liệu người dùng thất bại! " + error.response.data.error_code);
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

    const onHandleUpdateInfor=(event)=>{
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
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }

    const onHandleChangePassword=(event)=>{
        axios.post(process.env.REACT_APP_BACKEND + 'api/reception/changePassword', {
            oldpassword:oldPassword,
            newpassword:newPassword,
            repassword:confirmPassword
        }, { withCredentials: true })
            .then(function (response) {
                setNewPassword("");
                setOldPassword("");
                setConfirmPassword("");
                toast.success(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }


    return (
        <Modal show={personalFeature.openPersonalAccountModal} onClose={() => dispatch(setOpenPersonalAccountModal(false))}>
            <Modal.Body>
                <div className="w-full">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} >
                            <Tab sx={{ fontWeight: '700' }} {...tabProps(0)} label="Thông tin người dùng" />
                            <Tab sx={{ fontWeight: '700' }} {...tabProps(1)} label="Thay đổi mật khẩu" />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <div className="w-full p-2">
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
                                <Button color="blue" onClick={onHandleUpdateInfor}>Cập nhật</Button>
                                <Button color="gray" onClick={onHandleCancel}>Thoát</Button>
                            </div>
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <div className="w-full p-2">
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
                                <Button color="blue" onClick={onHandleChangePassword}>Cập nhật</Button>
                                <Button color="gray" onClick={onHandleCancel}>Thoát</Button>
                            </div>
                        </div>
                    </CustomTabPanel>
                </div>
            </Modal.Body>
        </Modal>
    )
}