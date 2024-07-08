import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import PersonalAccountModal from "../modal/layout_modal/personal_account_modal";
import { setOpenPersonalAccountModal } from "../../redux_features/personalFeature";
import { Logout, TableRows } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { toggleSideBar } from "../../redux_features/baseFeature";



export default function Header(props) {
    const reception = useSelector(state => state.reception);
    const [receptionName, setReceptionName] = useState("");
    const dispatch = useDispatch();
    const baseFeature=useSelector(state=>state.base);

    useEffect(() => {
        setReceptionName(reception.reception_name);
    }, [reception.reception_name]);


    const onHandleLogout = () => {
        if (window.confirm("Bạn muốn thoát chương trình ?")) {
            props.removeCookie('loginCode', { path: '/' });
            toast.success("Đã thoát chương trình.");
        }
    }

    return (
        <div className="w-full h-fit bg-blue-500 z-20 fixed top-0 left-0">
            <div className={`grid grid-cols-12 text-white ${baseFeature.openSideBar?'pl-28':''}`}>
                <div className="p-2 col-span-3">
                    <IconButton color="inherit" onClick={()=>dispatch(toggleSideBar())}>
                        <TableRows />
                    </IconButton>

                </div>
                <div className="col-span-6 text-center md:p-2">
                    <Tooltip title="Cập nhật người dùng">
                        <span className="cursor-pointer" onClick={() =>{ 
                            dispatch(setOpenPersonalAccountModal(true))
                        }}>
                            {receptionName}
                        </span>
                    </Tooltip>
                    <PersonalAccountModal />
                </div>
                <div className="col-span-3 px-5 md:py-2 flex text-center flex-row-reverse ">
                    <div className="w-fit hover:cursor-pointer" onClick={() => onHandleLogout()}>
                        <Logout />
                        Thoát
                    </div>
                </div>
            </div>
        </div>
    );
}