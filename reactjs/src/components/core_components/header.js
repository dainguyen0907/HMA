import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import PersonalAccountModal from "../modal/personal_account_modal";
import { setOpenPersonalAccountModal } from "../../redux_features/personalFeature";
import { Home, Logout } from "@mui/icons-material";
import { Tooltip } from "@mui/material";



export default function Header(props) {
    const reception = useSelector(state => state.reception);
    const [receptionName, setReceptionName] = useState("");
    const dispatch = useDispatch();

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
        <div className="w-full h-fit bg-blue-500">
            <div className="grid grid-cols-12 text-white">
                <div className="p-2 col-span-3 hidden md:block">
                    <a href="/" title="Trang chủ">
                        <p><strong>HEPC Motel management</strong></p>
                    </a>
                </div>
                <div className="px-2 col-span-3 md:hidden block">
                    <a href="/" title="Trang chủ">
                        <Home />
                    </a>
                </div>
                <div className="col-span-6 text-center md:p-2">
                    <Tooltip title="Cập nhật người dùng">
                        <span className="cursor-pointer" onClick={() => dispatch(setOpenPersonalAccountModal(true))}>
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