import { Backdrop, CircularProgress, List, ListItemButton, ListItemText } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { IconContext } from "react-icons";
import { FcAssistant, FcDataSheet, FcDepartment, FcEngineering, FcMoneyTransfer, FcPortraitMode, FcViewDetails } from "react-icons/fc";
import { useSelector } from "react-redux";

export default function SideBar() {
    const [sidebarExtend, setSidebarExtend] = useState(false);
    const [menuPosition, setMenuPosition] = useState(-1);
    const [menuRender, setMenuRender] = useState([]);
    const [menuStatus, setMenuStatus] = useState([false, false, false, false, false, false]);
    const wrapperRef = useRef(null);
    const reception_role = useSelector(state => state.reception.reception_role);
    const baseFeature=useSelector(state=>state.base);

    useEffect(() => {
        let newRoleArray = [false, false, false, false, false, false];
        if (reception_role.length > 0) {
            reception_role.forEach((value) => (
                newRoleArray[value - 1] = true
            ))
        }else{
            newRoleArray.forEach((value,key)=>(
                newRoleArray[key]=false
            ))
        }
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
    }, [wrapperRef, reception_role]);

    useEffect(() => {
        switch (menuPosition) {
            default: {
                break;
            }
            case 1: {
                break;
            }
            case 2: {
                const arrayMenu = [
                    {
                        name: 'Quản lí loại giường',
                        link: '/motel/bed'
                    }, {
                        name: 'Quản lí đơn giá giường',
                        link: '/motel/price'
                    }
                ];
                setMenuRender(arrayMenu);
                break;
            }
            case 3: {
                break;
            }
            case 4: {
                break;
            }
            case 5: {
                const arrayMenu = [
                    {
                        name: 'Kiểm tra hoá đơn',
                        link: '/motel/invoice'
                    },
                    {
                        name: 'Thống kê doanh thu',
                        link: '/motel/revenue'
                    }
                ];
                setMenuRender(arrayMenu);
                break;
            }
            case 6: {
                const arrayMenu = [
                    {
                        name: 'Quản trị tài khoản',
                        link: '/motel/admin/account'
                    },
                    {
                        name: 'Lịch sử chỉnh sửa',
                        link: '/motel/history'
                    }
                ];
                setMenuRender(arrayMenu);
                break;
            }

        }
    }, [menuPosition])

    const onToggleClick = (currentPosition) => {
        if (!sidebarExtend) {
            setSidebarExtend(true);
        } else {
            if (menuPosition === currentPosition) {
                setSidebarExtend(false);
            }
        }
        setMenuPosition(currentPosition)
    }


    return (
        <>
            <div className="h-screen flex w-auto" ref={wrapperRef}>
                <div className="h-screen w-28 bg-gray-100 text-blue-500 font-bold p-2 border-r-2 z-50" id="side-bar">
                    <IconContext.Provider value={{ color: "white", size: "30px" }}>
                        {menuStatus[0] ?
                            <div className="w-full h-fit p-2 text-center  hover:cursor-pointer">
                                <a href="/motel/room"><center><FcDataSheet /></center>
                                    <small>Sơ đồ phòng</small>
                                </a>
                            </div> : ""
                        }
                        {menuStatus[1] ?
                            <div className="w-full h-fit p-2 text-center hover:cursor-pointer">
                                <a href="/motel/floor"><center><FcDepartment /></center>
                                    <small>Nhà nghỉ</small></a>
                            </div> : ""
                        }
                        {menuStatus[2] ?
                            <div className="w-full h-fit p-2 text-center  hover:cursor-pointer" onClick={() => { onToggleClick(2); }}>
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
                            <div className="w-full h-fit p-2 text-center  hover:cursor-pointer" onClick={() => onToggleClick(5)}>
                                <center><FcViewDetails /></center>
                                    <small>Hoá đơn</small>
                            </div> : ""
                        }
                        {menuStatus[5] ?
                            <div className="w-full h-fit p-2 text-center  hover:cursor-pointer" onClick={() => onToggleClick(6)}>
                                <center><FcEngineering /></center>
                                <small>Thiết lập</small>
                            </div> : ""
                        }

                    </IconContext.Provider>
                </div>
                <div id="side-bar-extend" className={`text-center h-screen w-52 bg-gray-100 text-blue-500 fixed top-0 -left-52 z-40 transition duration-500 ${sidebarExtend ? "translate-x-80" : "translate-x-0"}`}>
                    <List>
                        {menuRender.map((value, key) =>
                            <ListItemButton onClick={() => { window.location.assign(value.link) }} key={key}>
                                <ListItemText primary={value.name} />
                            </ListItemButton>
                        )}
                    </List>
                </div>
            </div>
            <div className={`w-screen h-screen bg-black bg-opacity-50 fixed top-0 left-28 z-30 ${sidebarExtend ? "" : "hidden"}`}></div>
            <Backdrop sx={{ color: '#fff', zIndex:'30'}} open={baseFeature.openLoadingScreen}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        </>
    );
}

