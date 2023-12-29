import React from "react";
import { IconContext } from "react-icons";
import { FcAssistant, FcDataSheet, FcDepartment, FcMoneyTransfer, FcPortraitMode } from "react-icons/fc";
import { Link } from "react-router-dom";
export default function SideBar() {
    
    return (
        <section className="h-screen w-28 bg-blue-500 p-2">
            <IconContext.Provider value={{color:"white",size:"30px"}}>
                <div className="w-full h-fit p-2 text-center text-white hover:cursor-pointer">
                   <Link to="/"><center><FcDataSheet /></center>
                    <small>Sơ đồ phòng</small>
                    </Link>     
                </div>
                <div className="w-full h-fit p-2 text-center text-white hover:cursor-pointer">
                   <Link to="/"><center><FcDepartment /></center>
                    <small>Nhà nghỉ</small>
                    </Link>     
                </div>
                <div className="w-full h-fit p-2 text-center text-white hover:cursor-pointer">
                   <Link to="/"><center><FcMoneyTransfer /></center>
                    <small>Loại phòng & giá</small>
                    </Link>     
                </div>
                <div className="w-full h-fit p-2 text-center text-white hover:cursor-pointer">
                   <Link to="/"><center><FcAssistant /></center>
                    <small>Dịch vụ</small>
                    </Link>     
                </div>
                <div className="w-full h-fit p-2 text-center text-white hover:cursor-pointer">
                   <Link to="/"><center><FcPortraitMode /></center>
                    <small>Khách hàng</small>
                    </Link>     
                </div>
            </IconContext.Provider>    
        </section>
    );
}