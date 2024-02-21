
import FloorComponent from "../../components/floor_component";
import { Button} from "flowbite-react";
import React, { useEffect, useState } from "react";
import ChangeFloorNameModal from "../../components/modal/floor_change_name_modal";
import InsertRoomModal from "../../components/modal/floor_insert_room_modal";
import SelectAreaModal from "../../components/modal/floor_select_area_modal";
import { setOpenModalSelectArea } from "../../redux_features/floorFeature";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import UpdateRoomModal from "../../components/modal/floor_update_room_modal";


export default function RoomDiagramSetting() {
    const dispatch=useDispatch();
    const floorFeature=useSelector(state=>state.floor);
    const [floor,setFloor]=useState([]);

    useEffect(()=>{
        axios.get(process.env.REACT_APP_BACKEND+'api/floor/getFloorByIDArea?id='+floorFeature.areaID,{withCredentials: true})
        .then(function(response){
            setFloor(response.data.result);
        }).catch(function(error){
            if(error.response){
                toast.error(error.response.data.error_code);
            }
        })
    },[floorFeature.areaID,floorFeature.floorUpdateSuccess])

    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-3 h-[7%]">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Sắp xếp phòng</h1>
                    </div>
                    <div className="">
                        <center>
                            <Button outline gradientDuoTone="cyanToBlue" 
                            onClick={(e)=>dispatch(setOpenModalSelectArea(true))}>
                                Chọn khu vực
                            </Button>
                        </center>
                    </div>
                    <div className="ml-auto">

                    </div>
                </div>
                <div className="w-full h-[92%] block overflow-y-scroll">
                    <div className="w-full h-1/4 ">
                        {floor.map((value,key)=><FloorComponent key={key} floorID={value.id} floorName={value.floor_name}/>)}
                    </div>
                    <ChangeFloorNameModal/>
                    <InsertRoomModal/>
                    <SelectAreaModal/>
                    <UpdateRoomModal/>
                </div>
            </div>
        </div>
    );
}