import React, { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { IconContext } from "react-icons";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import PersonalAccountModal from "../modal/personal_account_modal";
import { setOpenPersonalAccountModal } from "../../redux_features/personalFeature";


export default function Header(props) {
    const reception = useSelector(state => state.reception);
    const [receptionName, setReceptionName] = useState("");
    const dispatch=useDispatch();

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
        <div className="w-full h-full bg-blue-500">
            <div className="grid grid-cols-12 text-white">
                <div className=" p-2  col-span-3">
                    <a href="/" title="Trang chủ">
                        <p><strong>HEPC Motel management</strong></p>
                        <p><small>Phần mềm quản lý nhà nghỉ</small></p>
                    </a>
                </div>
                <div className="col-span-6 text-center p-2">
                    <span className="cursor-pointer" onClick={()=>dispatch(setOpenPersonalAccountModal(true))}>
                        {receptionName}
                    </span>
                    <PersonalAccountModal/>
                </div>
                <div className="col-span-3 p-1 text-center">
                    <IconContext.Provider value={{ size: "30px" }}>
                        <div className="m-auto w-fit hover:cursor-pointer" onClick={() => onHandleLogout()}>
                            <AiOutlineLogout />
                            Thoát
                        </div>
                    </IconContext.Provider>
                </div>
            </div>
        </div>
    );
}