import { Box, List } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { IconContext } from "react-icons";
import { FcAssistant, FcDataSheet, FcDepartment, FcEngineering, FcMoneyTransfer, FcPortraitMode, FcViewDetails } from "react-icons/fc";
import { useSelector } from "react-redux";

export default function SideBar() {
    const [sidebarExtend, setSidebarExtend] = useState(false);
    const [menuPosition, setMenuPosition] = useState(0);
    const [menuRender,setMenuRender]=useState([]);
    const [menuStatus, setMenuStatus] = useState([false, false, false, false, false, false]);
    const wrapperRef = useRef(null);
    const reception_role = useSelector(state => state.reception.reception_role);


    useEffect(() => {
        let newRoleArray = menuStatus;
        reception_role.forEach((value) => (
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

    useEffect(()=>{
        
    },[menuPosition])

    const onToggleClick = (currentPosition) => {
        if (!sidebarExtend) {
            setSidebarExtend(true);
        } else {
            if (menuPosition === currentPosition) {
                setSidebarExtend(false);
            }
        }
    }


    return (
        <>
            <div className={sidebarExtend ? "h-screen flex w-80 " : "h-screen flex w-32 overflow-hidden"} ref={wrapperRef}>
                <div className="h-screen w-28 bg-gray-100 text-blue-500 font-bold p-2 border-r-2" id="side-bar">
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
                        {menuStatus[0] ?
                            <div className="w-full h-fit p-2 text-center  hover:cursor-pointer">
                                <a href="/motel/invoice"><center><FcViewDetails /></center>
                                    <small>Hoá đơn</small>
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
                </div>
                <div id="side-bar-extend" className={sidebarExtend?"text-center h-screen w-52 bg-gray-100 text-blue-500":'hidden'}>
                    <List>

                    </List>
                </div>

            </div>
            {
                sidebarExtend ? <div className="w-screen h-screen bg-black bg-opacity-50 fixed top-0 left-80 z-50"></div> : null
            }
        </>
    );
}

