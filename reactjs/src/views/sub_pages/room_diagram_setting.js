
import FloorComponent from "../../components/floor_component";
import { Button} from "flowbite-react";
import React from "react";
import ChangeFloorNameModal from "../../components/modal/floor_change_name_modal";
import InsertRoomModal from "../../components/modal/floor_insert_room_modal";



export default function RoomDiagramSetting() {
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
                        <FloorComponent/>
                    </div>
                    <ChangeFloorNameModal/>
                    <InsertRoomModal/>
                </div>
            </div>
        </div>
    );
}