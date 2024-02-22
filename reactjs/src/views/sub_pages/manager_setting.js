import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ManagerSetting() {
    const dispatch=useDispatch();
    const managerFeature=useSelector(state=>state.manager);
    const [areaName,setAreaName]=useState('Chọn khu vực');
    const [floorList,setFloorList]=useState([]);

    useEffect(()=>{
        
    },[managerFeature.areaID])

    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className=" px-3 pb-0 grid grid-cols-3 h-[5%]">
                    <div className="mb-0 text-sm">
                        <div className="float-start font p-1 font-bold">Số lượng phòng:</div>
                        <div className="w-fit bg-green-300 border-2 border-green-800 float-start px-1">
                            0
                        </div>
                        <div className="p-1 float-start ">
                            Còn trống
                        </div>
                        <div className="w-fit bg-red-300 border-2 border-red-800 float-start px-1">
                            0
                        </div>
                        <div className="p-1 float-start ">
                            Đang sử dụng
                        </div>
                    </div>
                    <div className="pt-1"><center>
                        <Button size="xs" gradientDuoTone="cyanToBlue" outline>
                            {areaName}
                        </Button>
                    </center>
                    </div>
                </div>
                <div className="border-b-2 px-3 py-1 h-[5%]">

                </div>
                <div className="w-full h-[90%] block overflow-y-scroll">

                </div>
            </div>
        </div>
    )
}