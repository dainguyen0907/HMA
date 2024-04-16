import { Button, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenPrivilegeModal, setUpdateSuccess } from "../../redux_features/accountFeature";
import { Checkbox, FormControlLabel, FormGroup, IconButton } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { Close } from "@mui/icons-material";

export default function AccountPrivilegeModal() {

    const accountFeature = useSelector(state => state.account);
    const dispatch = useDispatch();
    const [roomPrivilege, setRoomPrivilege] = useState(false);
    const [areaPrivilege, setAreaPrivilege] = useState(false);
    const [pricePrivilege, setPricePrivilege] = useState(false);
    const [servicePrivilege, setServicePrivilege] = useState(false);
    const [customerPrivilege, setCustomerPrivilege] = useState(false);
    const [adminPrivilege, setAdminPrivilege] = useState(false);

    useEffect(() => {
        if (!accountFeature.openPrivilegeModal) {
            setRoomPrivilege(false);
            setAreaPrivilege(false);
            setPricePrivilege(false);
            setServicePrivilege(false);
            setCustomerPrivilege(false);
            setAdminPrivilege(false);
        }
    }, [accountFeature.openPrivilegeModal])

    useEffect(() => {
        if (accountFeature.openPrivilegeModal && accountFeature.receptionSelection) {
            const arrayPrivilege = accountFeature.receptionSelection.Privilege_details;
            if (arrayPrivilege.length > 0) {
                arrayPrivilege.forEach((value, key) => {
                    switch (value.id_privilege) {
                        case 1: setRoomPrivilege(true); break;
                        case 2: setAreaPrivilege(true); break;
                        case 3: setPricePrivilege(true); break;
                        case 4: setServicePrivilege(true); break;
                        case 5: setCustomerPrivilege(true); break;
                        case 6: setAdminPrivilege(true); break;
                        default:break;
                    }
                })
            } else {
                setRoomPrivilege(false);
                setAreaPrivilege(false);
                setPricePrivilege(false);
                setServicePrivilege(false);
                setCustomerPrivilege(false);
                setAdminPrivilege(false);
            }
        }
    }, [accountFeature.openPrivilegeModal, accountFeature.receptionSelection])

    const onHandleConfirm=()=>{
        const arrayPrivilege=[roomPrivilege,areaPrivilege,pricePrivilege,servicePrivilege,customerPrivilege,adminPrivilege];
        let array=[];
        arrayPrivilege.forEach((value,key)=>{
            if(value){
                array.push(key+1);
            }
        })
        if(accountFeature.receptionSelection){
            axios.post(process.env.REACT_APP_BACKEND+'api/privilegedetail/updatePrivilegeDetail',{
                id:accountFeature.receptionSelection.id,
                privilege:array
            },{withCredentials:true})
            .then(function(response){
                dispatch(setUpdateSuccess());
                dispatch(setOpenPrivilegeModal(false));
                toast.success(response.data.result);
            }).catch(function(error){
                if(error.response){
                    toast.error("Lỗi cập nhật thông tin: "+error.response.data.error_code);
                }
            })
        }
    }
    return (
        <Modal show={accountFeature.openPrivilegeModal} onClose={() => dispatch(setOpenPrivilegeModal(false))} className="relative">
            <Modal.Body>
                <div className="absolute top-1 right-3">
                    <IconButton onClick={()=> dispatch(setOpenPrivilegeModal(false))}>
                        <Close/>
                    </IconButton>
                </div>
                <fieldset style={{ border: '2px dashed #E5E7EB', padding: '0 5px' }} className="flex flex-col gap-4">
                    <legend className="font-bold text-blue-700">Phân quyền</legend>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={roomPrivilege} onChange={() => setRoomPrivilege(!roomPrivilege)} />} label="Checkin, checkout, lập và kiểm tra hoá đơn." />
                        <FormControlLabel control={<Checkbox checked={areaPrivilege} onChange={() => setAreaPrivilege(!areaPrivilege)} />} label="Khởi tạo, sắp xếp, điều chỉnh thông tin khu vực, phòng." />
                        <FormControlLabel control={<Checkbox checked={servicePrivilege} onChange={() => setServicePrivilege(!servicePrivilege)} />} label="Khởi tạo, điều chỉnh dịch vụ kèm theo." />
                        <FormControlLabel control={<Checkbox checked={pricePrivilege} onChange={() => setPricePrivilege(!pricePrivilege)} />} label="Khởi tạo, quản lí loại giường và đơn giá tương ứng." />
                        <FormControlLabel control={<Checkbox checked={customerPrivilege} onChange={() => setCustomerPrivilege(!customerPrivilege)} />} label="Khởi tạo, quản lí thông tin khách hàng." />
                        <FormControlLabel control={<Checkbox checked={adminPrivilege} onChange={() => setAdminPrivilege(!adminPrivilege)} />} label="Thiết lập và quản lí hệ thống phần mềm." />
                    </FormGroup>
                </fieldset>
                <div className="flex flex-row-reverse gap-2 pt-1">
                    <Button color="blue" onClick={()=>onHandleConfirm()}>Cập nhật</Button>
                    <Button color="gray" onClick={()=>dispatch(setOpenPrivilegeModal(false))}>Huỷ</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}