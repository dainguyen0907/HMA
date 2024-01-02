import React from "react";
import SideBar from "../components/core_components/sideBar";

export default function MasterPage(){
    return (
        <div className="flex">
            <SideBar/>
            <div className="bg-green-200 w-full h-screen"></div>
        </div>
    )
}