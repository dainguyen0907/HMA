
import FloorComponent from "../../components/customize_components/floor_component";
import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ChangeFloorNameModal from "../../components/modal/sub_component_modal/floor_change_name_modal";
import InsertRoomModal from "../../components/modal/sub_component_modal/floor_insert_room_modal";
import SelectAreaModal from "../../components/modal/sub_component_modal/floor_select_area_modal";
import { setOpenModalSelectArea, setPositionScrollbar, setRoomUpdateSuccess } from "../../redux_features/floorFeature";
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
    const [isProcessing,setIsProcessing]=useState(false);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/floor/getFloorByIDArea?id=' + floorFeature.areaID, { withCredentials: true })
            .then(function (response) {
                setFloor(response.data.result);
            }).catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error('Thông tin tầng: ' + error.response.data.error_code);
                } else {
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
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
            }).catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error('Đếm số lượng phòng trong khu vực: ' + error.response.data.error_code);
                } else {
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            }).finally(function () {
                dispatch(setOpenLoadingScreen(false));
            })

        axios.get(process.env.REACT_APP_BACKEND + 'api/room/countAllRoom', { withCredentials: true })
            .then(function (response) {
                setTotalBlankRoom(response.data.result.blankRoom);
                setTotalUsedRoom(response.data.result.fullRoom);
                setTotalMaintainceRoom(response.data.result.maintainceRoom);
            }).catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error('Đếm số lượng tất cả phòng: ' + error.response.data.error_code);
                } else {
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            })
    }, [floorFeature.roomUpdateSuccess, floorFeature.areaID, dispatch])

    const onQuickCheckoutHandle=(e)=>{
        if(isProcessing)
            return;
        if(window.confirm('Bạn đã kiểm tra lại thông tin trước khi trả phòng nhanh?'))
        {
            setIsProcessing(true);
            axios.post(process.env.REACT_APP_BACKEND+'api/bed/quickCheckoutForArea',{
                id:floorFeature.areaID
            },{withCredentials:true})
            .then(function(response){
                toast.success(response.data.result);
                dispatch(setRoomUpdateSuccess());
            }).catch(function(error){
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error('Lỗi checkout: ' + error.response.data.error_code);
                } else {
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            }).finally(function(){
                setIsProcessing(false);
            })
        }
    }

    return (
        <div className="w-full h-[90svh] p-2 overflow-auto" onScroll={(e) => {
            if (e.currentTarget.scrollTop === 0) {
                e.currentTarget.scroll(0, floorFeature.positionScrollbar)
                return;
            }
            dispatch(setPositionScrollbar(e.currentTarget.scrollTop))
        }}>
            <div className="border-2 rounded-xl w-full">
                <div className="px-3 py-1 flex flex-row justify-center items-center h-fit">
                    <Button outline gradientDuoTone="cyanToBlue" size="xs" className="lg:uppercase z-0"
                        onClick={(e) =>
                            dispatch(setOpenModalSelectArea(true))
                        }>
                        {floorFeature.areaName}
                    </Button>
                    <Tooltip title="Tạo mới" onClick={() => dispatch(setRoomUpdateSuccess())}>
                        <IconButton color="primary">
                            <Refresh />
                        </IconButton>
                    </Tooltip>

                </div>
                <div className=" h-fit text-sm text-center font-bold gap-4 flex flex-row p-2 items-center">
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
                    {
                        floorFeature.areaID !== -1 ?
                            <Button outline gradientMonochrome="success" size="xs" onClick={onQuickCheckoutHandle}>
                                Trả phòng nhanh
                            </Button>
                            : null
                    }

                </div>
                <div className="w-full">
                    {floor.map((value, key) =>
                        <FloorComponent floorID={value.id} floorName={value.floor_name} />)
                    }
                </div>
            </div>
            <ChangeFloorNameModal />
            <InsertRoomModal />
            <SelectAreaModal />
            <UpdateRoomModal />
            <CheckInModal />
            <CheckoutModal />
            <ChangeRoomModal />
            <CheckinStatusModal />
        </div>
    );
}