import React from "react";
import { Link } from "react-router-dom";

export default function MotelManager(props) {
    return (
        <>
            <div className="border-b-2 py-10">
                <strong>{props.menuName}</strong>
            </div>
            <ul className="text-left">
                {props.submenu?props.submenu.map((menu)=>
                <li className="py-3 ps-3 hover:bg-blue-300 transition duration-300"><a href={menu.link} onClick={()=>{props.extend(false)}}>{menu.name}</a></li>
                ):""}
            </ul>
        </>
    );
}