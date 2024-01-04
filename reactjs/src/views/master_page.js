import React, { useEffect } from "react";
import SideBar from "../components/core_components/sideBar";
import Header from "../components/core_components/header";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setReceptionRole } from "../redux_features/receptionFeature";
import { Outlet } from "react-router-dom";

export default function MasterPage({children,cookie,removeCookie}){
    const dispatch = useDispatch();
    useEffect(()=>{
        if(cookie.loginCode){
            axios.get('http://localhost:8080/api/privilege/getUserPrivilege',{withCredentials: true})
            .then(function(res){
                if(res.status)
                {
                    dispatch(setReceptionRole(res.data.privilege));
                }
            })
            .catch(function(err){
                console.log(err);
            })
        }
    })
    return (
        <div className="flex">
            <SideBar/>
            <div className="bg-green-200 w-full h-screen">
                <Header removeCookie={removeCookie}/>
                {children?children:<Outlet/>}
            </div>
        </div>
    )
}