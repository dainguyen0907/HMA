
import FloorComponent from "../../components/customize_components/floor_component";
import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ChangeFloorNameModal from "../../components/modal/floor_change_name_modal";
import InsertRoomModal from "../../components/modal/floor_insert_room_modal";
import SelectAreaModal from "../../components/modal/floor_select_area_modal";
import { setOpenModalMultiCheckOut, setOpenModalSelectArea } from "../../redux_features/floorFeature";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import UpdateRoomModal from "../../components/modal/floor_update_room_modal";
import CheckInModal from "../../components/modal/checkin_modal";
import CheckoutModal from "../../components/modal/checkout_modal";
import ChangeRoomModal from "../../components/modal/change_room_modal";
import SinglePayment from "../../components/modal/single_payment_modal";
import MultiCheckoutModal from "../../components/modal/multi_checkout_modal";



export default function RoomDiagramSetting() {
    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);
    const [floor, setFloor] = useState([]);
    const [blankRoom, setBlankRoom] = useState(0);
    const [usedRoom, setUsedRoom] = useState(0);
    const [manitainceRoom, setMaintainceRoom] = useState(0);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/floor/getFloorByIDArea?id=' + floorFeature.areaID, { withCredentials: true })
            .then(function (response) {
                setFloor(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }, [floorFeature.areaID, floorFeature.floorUpdateSuccess])

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/room/countRoomByIDArea?id=' + floorFeature.areaID, { withCredentials: true })
            .then(function (response) {
                setBlankRoom(response.data.result.blankRoom);
                setUsedRoom(response.data.result.fullRoom);
                setMaintainceRoom(response.data.result.maintainceRoom);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }, [floorFeature.roomUpdateSuccess, floorFeature.areaID])

    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="px-3 py-1 grid grid-cols-5 h-[5%]">
                    <Button outline size="xs" gradientDuoTone="purpleToBlue" disabled={floorFeature.areaID === -1}
                        onClick={() => dispatch(setOpenModalMultiCheckOut(true))}>
                        TÍNH HOÁ ĐƠN GỘP
                    </Button>
                    <Button outline gradientDuoTone="cyanToBlue" size="xs" className="col-start-3 uppercase"
                        onClick={(e) => dispatch(setOpenModalSelectArea(true))}>
                        {floorFeature.areaName}
                    </Button>
                    <div className="ml-auto">

                    </div>
                </div>
                <div className=" border-b-2 h-[5%]">
                    <div className="text-sm font-bold p-2 col-start-2 text-center">
                        <div className="w-6 h-fit px-1 bg-green-300 float-start"><span className="font-normal">{blankRoom}</span></div>
                        <div className="float-start">
                            Phòng còn giường,&nbsp;
                        </div>
                        <div className="w-6 h-fit px-1 bg-red-300 float-start"><span className="font-normal">{usedRoom}</span></div>
                        <div className="float-left">
                            Phòng đầy,&nbsp;
                        </div>
                        <div className="w-6 h-fit px-1 bg-gray-300 float-start"><span className="font-normal">{manitainceRoom}</span></div>
                        <div className="float-left">
                            Phòng đang sửa
                        </div>
                    </div>

                </div>
                <div className="w-full h-[90%] block overflow-y-scroll">
                    <div className="w-full h-1/4 ">
                        {floor.map((value, key) => <FloorComponent key={key} floorID={value.id} floorName={value.floor_name} />)}
                    </div>
                    <ChangeFloorNameModal />
                    <InsertRoomModal />
                    <SelectAreaModal />
                    <UpdateRoomModal />
                    <CheckInModal />
                    <CheckoutModal />
                    <ChangeRoomModal />
                    <SinglePayment />
                    <MultiCheckoutModal />
                </div>
            </div>
        </div>
    );
}