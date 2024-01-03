import React from "react";
import SideBar from "../components/core_components/sideBar";
import Header from "../components/core_components/header";

export default function MasterPage(props){
    return (
        <div className="flex">
            <SideBar/>
            <div className="bg-green-200 w-full h-screen">
                <Header removeCookie={props.removeCookie}/>
            </div>
        </div>
    )
}