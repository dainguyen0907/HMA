import React, { useEffect, useRef, useState } from "react";
import { IconContext } from "react-icons";
import { FcAssistant, FcDataSheet, FcDepartment, FcEngineering, FcMoneyTransfer, FcPortraitMode } from "react-icons/fc";
import { Link } from "react-router-dom";
import MotelManager from "./sub_components/motel_manager_component";
export default function SideBar() {
    const [sidebarExtend, setSidebarExtend] = useState(false);
    const [classExtend, setClassExtend] = useState("-translate-x-56");
    const [menuPosition, setMenuPosition] = useState('motel_setting');
    const wrapperRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setSidebarExtend(false);
                setClassExtend("-translate-x-60");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [wrapperRef])
    const onToggleClick = (currentPosition) => {
        if (!sidebarExtend) {
            setSidebarExtend(true);
            setClassExtend("");
        } else {
            if (menuPosition===currentPosition) {
                setSidebarExtend(false);
            }
        }
        
    }

    const renderSubMenu = () => {
        let menuName = "";
        let menu = [];
        switch (menuPosition) {
            case 'bed_type_and_price': {
                menu = [
                    { link: "/", name: "Danh sách loại giường" },
                    { link: "/", name: "Khởi tạo loại giường" },
                ]
                menuName = "Loại giường và đơn giá";
                break;
            }
            default: {
                menu = [
                    { link: "/", name: "Danh sách khu vực" },
                    { link: "/", name: "Quản lý tầng lầu" },
                ];
                menuName = "Thiết lập nhà nghỉ";
                break;
            }
        }
        return (<section id="side-bar-extend" className={" text-center h-screen w-52 bg-blue-400 z-0 transition duration-300 " + classExtend}>
            <div className=" text-white">
                <MotelManager menuName={menuName} submenu={menu} />
            </div>
        </section>)
    }

    return (
        <div className="w-auto h-screen flex" ref={wrapperRef}>
            <section className="h-screen w-28 bg-blue-400 p-2 z-10 border-r-2" id="side-bar">
                <IconContext.Provider value={{ color: "white", size: "30px" }}>
                    <div className="w-full h-fit p-2 text-center text-white hover:cursor-pointer">
                        <center><FcDataSheet /></center>
                        <small>Sơ đồ phòng</small>
                    </div>
                    <div className="w-full h-fit p-2 text-center text-white hover:cursor-pointer" onClick={() => {onToggleClick('motel_setting');setMenuPosition('motel_setting')  }}>
                        <center><FcDepartment /></center>
                        <small>Nhà nghỉ</small>
                    </div>
                    <div className="w-full h-fit p-2 text-center text-white hover:cursor-pointer" onClick={() => {onToggleClick('bed_type_and_price');setMenuPosition('bed_type_and_price')  }}>
                        <center><FcMoneyTransfer /></center>
                        <small>Loại giường & đơn giá</small>
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
                    <div className="w-full h-fit p-2 text-center text-white hover:cursor-pointer">
                        <Link to="/"><center><FcEngineering /></center>
                            <small>Thiết lập</small>
                        </Link>
                    </div>
                    <div className="w-full h-fit p-2 text-center text-white hover:cursor-pointer">
                        <Link to="/"><center><FcEngineering /></center>
                            <small>Thoát</small>
                        </Link>
                    </div>
                </IconContext.Provider>
            </section>
            {sidebarExtend ? renderSubMenu() : ""}
        </div>
    );
}

