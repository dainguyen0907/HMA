import React, { useEffect, useState} from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { IconContext } from "react-icons";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";


export default function Header(props) {
    const reception=useSelector(state=>state.reception);
    const [receptionName,setReceptionName]=useState("");
    
    useEffect(()=>{
        setReceptionName(reception.reception_name);
    },[reception.reception_name]);
    
    const onHandleLogout=()=>{
        if(window.confirm("Bạn muốn thoát chương trình ?"))
        {
            props.removeCookie('loginCode');
            toast.success("Đã thoát chương trình.");
        }
    }
    
    return (
        <div className="w-full h-full bg-blue-500">
            <div className="grid grid-cols-12 text-white">
                <div className=" p-2  col-span-3">
                    <p><strong>HEPC Motel management</strong></p>
                    <p><small>Phần mềm quản lý nhà nghỉ</small></p>
                </div>
                <div className="col-span-6 text-center p-2">
                    <p>{receptionName}</p>
                    </div>
                <div className="col-span-3 p-1 text-center">
                    <IconContext.Provider value={{size:"30px"}}>
                        <div className="m-auto w-fit hover:cursor-pointer" onClick={()=>onHandleLogout()}>
                            <AiOutlineLogout />
                            Thoát
                        </div>
                         
                    </IconContext.Provider>
                </div>
            </div>
        </div>
    );
}