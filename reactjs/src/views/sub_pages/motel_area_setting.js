import React, { useState } from "react";
import { IconContext } from "react-icons";
import { FaCirclePlus } from "react-icons/fa6";

export default function AreaSetting() {
    const [openAddArea,setOpenAddArea]=useState(false);
    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-2">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Danh sách khu vực</h1>
                    </div>
                    <div className="ml-auto">
                        <IconContext.Provider value={{size:'22px'}}>
                            <button className="border-2 p-1 flex bg-green-500 text-white rounded-lg"
                            >
                            <FaCirclePlus /> Thêm khu vực</button>
                        </IconContext.Provider>
                        
                    </div>
                    

                </div>
            </div>

        </div>
    );
}