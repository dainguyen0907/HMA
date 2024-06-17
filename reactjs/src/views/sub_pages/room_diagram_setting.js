
import FloorComponent from "../../components/customize_components/floor_component";
import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ChangeFloorNameModal from "../../components/modal/sub_component_modal/floor_change_name_modal";
import InsertRoomModal from "../../components/modal/sub_component_modal/floor_insert_room_modal";
import SelectAreaModal from "../../components/modal/sub_component_modal/floor_select_area_modal";
import { setOpenModalSelectArea, setRoomUpdateSuccess } from "../../redux_features/floorFeature";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import UpdateRoomModal from "../../components/modal/room_diagram_modal/floor_update_room_modal";
import CheckInModal from "../../components/modal/room_diagram_modal/checkin_modal";
import CheckoutModal from "../../components/modal/room_diagram_modal/checkout_modal";
import ChangeRoomModal from "../../components/modal/room_diagram_modal/change_room_modal";
import { setOpenLoadingScreen } from "../../redux_features/baseFeature";
import CheckinStatusModal from "../../components/modal/room_diagram_modal/checkin_status_modal";
import { IconButton, Tooltip } from "@mui/material";
import { Refresh } from "@mui/icons-material";



export default function RoomDiagramSetting() {
    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);
    const [floor, setFloor] = useState([]);
    const [blankRoom, setBlankRoom] = useState(0);
    const [usedRoom, setUsedRoom] = useState(0);
    const [manitainceRoom, setMaintainceRoom] = useState(0);
    const [totalBlankRoom, setTotalBlankRoom] = useState(0);
    const [totalUsedRoom, setTotalUsedRoom] = useState(0);
    const [totalManitainceRoom, setTotalMaintainceRoom] = useState(0);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/floor/getFloorByIDArea?id=' + floorFeature.areaID, { withCredentials: true })
            .then(function (response) {
                setFloor(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error("Dữ liệu bảng: " + error.response.data.error_code);
                }
            })
    }, [floorFeature.areaID, floorFeature.floorUpdateSuccess])

    useEffect(() => {
        dispatch(setOpenLoadingScreen(true));
        axios.get(process.env.REACT_APP_BACKEND + 'api/room/countRoomByIDArea?id=' + floorFeature.areaID, { withCredentials: true })
            .then(function (response) {
                setBlankRoom(response.data.result.blankRoom);
                setUsedRoom(response.data.result.fullRoom);
                setMaintainceRoom(response.data.result.maintainceRoom);
                dispatch(setOpenLoadingScreen(false));
            }).catch(function (error) {
                if (error.response) {
                    toast.error("Đếm số lượng phòng: " + error.response.data.error_code);
                }
                dispatch(setOpenLoadingScreen(false));
            })
        axios.get(process.env.REACT_APP_BACKEND + 'api/room/countAllRoom', { withCredentials: true })
            .then(function (response) {
                setTotalBlankRoom(response.data.result.blankRoom);
                setTotalUsedRoom(response.data.result.fullRoom);
                setTotalMaintainceRoom(response.data.result.maintainceRoom);
            }).catch(function (error) {
                if (error.response) {
                    toast.error("Đếm tất cả số lượng phòng: " + error.response.data.error_code);
                }
            })
    }, [floorFeature.roomUpdateSuccess, floorFeature.areaID, dispatch])

    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="px-3 py-1 flex flex-row justify-center items-center lg:h-[5%] h-fit">
                    <Button outline gradientDuoTone="cyanToBlue" size="xs" className="lg:uppercase"
                        onClick={(e) => dispatch(setOpenModalSelectArea(true))}>
                        {floorFeature.areaName}
                    </Button>
                    <Tooltip title="Tạo mới" onClick={()=>dispatch(setRoomUpdateSuccess())}>
                        <IconButton color="primary">
                            <Refresh />
                        </IconButton>
                    </Tooltip>

                </div>
                <div className=" border-b-2 lg:h-[5%] h-fit text-sm text-center font-bold gap-4 flex flex-row p-2">
                    <div className="flex flex-row">
                        <div className=" h-fit bg-green-300 px-1"><span className="font-normal">{blankRoom}/</span><span className="text-blue-700">{totalBlankRoom}</span></div>
                        Phòng còn giường,&nbsp;
                    </div>
                    <div className="flex flex-row">
                        <div className=" h-fit  bg-red-300 px-1"><span className="font-normal">{usedRoom}/</span><span className="text-blue-700">{totalUsedRoom}</span></div>
                        Phòng đầy,&nbsp;
                    </div>
                    <div className="flex flex-row">
                        <div className=" h-fit bg-gray-300 px-1"><span className="font-normal">{manitainceRoom}/</span><span className="text-blue-700">{totalManitainceRoom}</span></div>
                        Phòng ngưng sử dụng
                    </div>
                </div>
                <div className="w-full lg:h-[90%] h-[85%] block overflow-y-scroll">
                    {floor.map((value, key) => <div className="w-full h-1/2 " key={key}>
                        <FloorComponent floorID={value.id} floorName={value.floor_name} />
                    </div>)}
                    <ChangeFloorNameModal />
                    <InsertRoomModal />
                    <SelectAreaModal />
                    <UpdateRoomModal />
                    <CheckInModal />
                    <CheckoutModal />
                    <ChangeRoomModal />
                    <CheckinStatusModal />
                </div>
            </div>
        </div>
    );
}