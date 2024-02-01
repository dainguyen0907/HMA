import FloorContextMenu from "../../components/menu/floor_context_menu";
import { Button } from "flowbite-react";
import React, { useState } from "react";

export default function RoomDiagramSetting() {
    const [floorAnchorEl, setFloorAnchorEl] = useState(null);
    const openFloorContext = Boolean(floorAnchorEl);
    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-3 h-[7%]">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Sắp xếp phòng</h1>
                    </div>
                    <div className="">
                        <center>
                            <Button outline gradientDuoTone="cyanToBlue">
                                Chọn khu vực
                            </Button>
                        </center>
                    </div>
                    <div className="ml-auto">

                    </div>
                </div>
                <div className="w-full h-[92%] block overflow-y-scroll">
                    <div className="w-full h-1/4 bg-slate-600">
                        <div className="h-full w-[5%] border-2 border-white bg-gray-900 relative p-2 float-start">
                            <div className="w-full h-full hover:cursor-pointer" id="button" onContextMenu={(e) => setFloorAnchorEl(e.currentTarget)}>
                                <h1 className="text-white font-bold absolute top-1/3">Tầng 1</h1>
                            </div>
                            <FloorContextMenu open={openFloorContext} anchorEl={floorAnchorEl}
                                setAnchorEl={setFloorAnchorEl} />
                        </div>
                        <div className="h-full w-[95%] grid grid-cols-7">
                            <div className="bg-gray-300">

                            </div>
                            <div className="bg-red-400">

                            </div>
                            <div className="bg-gray-300">

                            </div>
                            <div className="bg-red-400">

                            </div>
                            <div className="bg-gray-300">

                            </div>
                            <div className="bg-red-400">

                            </div>
                            <div className="bg-gray-300">

                            </div>
                            <div className="bg-red-400">

                            </div>

                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}