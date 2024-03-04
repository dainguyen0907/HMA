import React, { useEffect, useRef, useState } from "react";
import { IconContext } from "react-icons";
import { FcAssistant, FcDataSheet, FcDepartment, FcEngineering, FcMoneyTransfer, FcPortraitMode } from "react-icons/fc";
import MotelManager from "./sub_components/motel_manager_component";
import { useSelector } from "react-redux";
export default function SideBar() {
    const [sidebarExtend, setSidebarExtend] = useState(false);
    const [menuPosition, setMenuPosition] = useState('motel_setting');
    const [menuStatus, setMenuStatus] = useState([false, false, false, false, false, false]);
    const wrapperRef = useRef(null);
    const reception_role = useSelector(state => state.reception.reception_role);


    useEffect(() => {
        const newRoleArray = menuStatus;
        reception_role.map((value) => (
            newRoleArray[value - 1] = true
        ))
        setMenuStatus(newRoleArray);

        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setSidebarExtend(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [wrapperRef, menuStatus, reception_role]);

    const onToggleClick = (currentPosition) => {
        if (!sidebarExtend) {
            setSidebarExtend(true);
        } else {
            if (menuPosition === currentPosition) {
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
                    { link: "/motel/bed", name: "Danh sách loại giường" },
                    { link: "/motel/price", name: "Danh sách đơn giá" },
                ]
                menuName = "Loại giường và đơn giá";
                break;
            }
            default: {
                menu = [
                    { link: "/motel/floor", name: "Thiết lập khu vực" },
                ];
                menuName = "Thiết lập nhà nghỉ";
                break;
            }
        }
        return (<section id="side-bar-extend" className={"text-center h-screen w-52 bg-gray-100 text-blue-500 z-10 "}>
            <div className=" ">
                <MotelManager menuName={menuName} submenu={menu} extend={setSidebarExtend} />
            </div>
        </section>)
    }

    return (
        <div className="w-auto h-screen flex" ref={wrapperRef}>
            <section className="h-screen w-28 bg-gray-100 text-blue-500 font-bold p-2 z-50 border-r-2" id="side-bar">
                <IconContext.Provider value={{ color: "white", size: "30px" }}>
                    {menuStatus[0] ?
                        <div className="w-full h-fit p-2 text-center  hover:cursor-pointer">
                            <a href="/motel/room"><center><FcDataSheet /></center>
                                <small>Sơ đồ phòng</small>
                            </a>
                        </div> : ""
                    }
                    {menuStatus[1] ?
                        <div className="w-full h-fit p-2 text-center hover:cursor-pointer" onClick={() => { onToggleClick('motel_setting'); setMenuPosition('motel_setting') }}>
                            <center><FcDepartment /></center>
                            <small>Nhà nghỉ</small>
                        </div> : ""
                    }
                    {menuStatus[2] ?
                        <div className="w-full h-fit p-2 text-center  hover:cursor-pointer" onClick={() => { onToggleClick('bed_type_and_price'); setMenuPosition('bed_type_and_price') }}>
                            <center><FcMoneyTransfer /></center>
                            <small>Loại giường & đơn giá</small>
                        </div> : ""
                    }
                    {menuStatus[3] ?
                        <div className="w-full h-fit p-2 text-center  hover:cursor-pointer" onClick={() => setSidebarExtend(false)}>
                            <a href="/motel/service"><center><FcAssistant /></center>
                                <small>Dịch vụ</small>
                            </a>
                        </div> : ""
                    }
                    {menuStatus[4] ?
                        <div className="w-full h-fit p-2 text-center  hover:cursor-pointer">
                            <a href="/motel/customer"><center><FcPortraitMode /></center>
                                <small>Khách hàng</small>
                            </a>
                        </div> : ""
                    }
                    {menuStatus[5] ?
                        <div className="w-full h-fit p-2 text-center  hover:cursor-pointer">
                            <a href="/"><center><FcEngineering /></center>
                                <small>Thiết lập</small>
                            </a>
                        </div> : ""
                    }

                </IconContext.Provider>
            </section>
            {sidebarExtend ? renderSubMenu() : ""}
        </div>
    );
}

