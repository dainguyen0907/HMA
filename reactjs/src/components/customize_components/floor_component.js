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
        if (receptionFeature.reception_role.indexOf(2) !== -1) {
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
                if (error.response) {
                    toast.error("Lỗi lấy dữ liệu phòng "+error.response.data.error_code);
                }
            })
    }, [props.floorID, floorFeature.roomUpdateSuccess]);

    return (
        <>
            <div className="h-full lg:w-[5%] w-[10%] border-2 border-white bg-gray-900 float-start items-center justify-center flex" onContextMenu={(e) => onHandleFloorContextMenu(e)}>
                <div className="w-full h-fit hover:cursor-pointer p-2" id="button">
                    <h1 className="text-white font-bold">{props.floorName}</h1>
                </div>
            </div>
            <div className="h-full lg:w-[95%] w-[90%] grid lg:grid-cols-7 grid-cols-4">
                {room.map((value, key) =>
                    <RoomInFloor key={key} room={value} />)}
            </div>
            <FloorContextMenu />
            <RoomContextMenu />
        </>

    )
}