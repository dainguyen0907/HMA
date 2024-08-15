import React, { useEffect, useState } from "react";
import FloorContextMenu from "../menu/floor_context_menu";
import { useDispatch, useSelector } from "react-redux";
import { setFloorID, setFloorMenuAnchor, setFloorName } from "../../redux_features/floorFeature";
import RoomInFloor from "../customize_components/room_in_floor_component";
import { toast } from "react-toastify";
import axios from "axios";
import RoomContextMenu from "../menu/room_context_menu";
export default function FloorComponent(props) {
    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);
    const receptionFeature = useSelector(state => state.reception);
    const [room, setRoom] = useState([]);

    const onHandleFloorContextMenu = (event) => {
        event.preventDefault();
        if (receptionFeature.reception_role.indexOf(2) === -1 && receptionFeature.reception_role.indexOf(8) === -1) {
            toast.warning('Bạn không có quyền cập nhật Tầng');
        } else {
            dispatch(setFloorMenuAnchor({ X: event.clientX, Y: event.clientY }));
            dispatch(setFloorName(props.floorName));
            dispatch(setFloorID(props.floorID));
        }
    }

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/room/getRoomByIDFloor?id=' + props.floorID, { withCredentials: true })
            .then(function (response) {
                setRoom(response.data.result);
            }).catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                } else if (error.response) {
                    toast.error(error.response.data.error_code);
                } else {
                    toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                }
            })
    }, [props.floorID, floorFeature.roomUpdateSuccess]);

    return (
        <div className="flex flex-row">
            <div className="h-auto w-1/12 border-2 border-white bg-gray-900 items-center flex" onContextMenu={(e) => onHandleFloorContextMenu(e)}>
                <div className="w-full hover:cursor-pointer p-2 text-white font-bold" id="button">
                    {props.floorName}
                </div>
            </div>
            <div className="h-full w-full grid lg:grid-cols-8 grid-cols-4">
                {room.map((value, key) =>
                    <RoomInFloor key={key} room={value} />)}
            </div>
            <FloorContextMenu />
            <RoomContextMenu />
        </div>

    )
}