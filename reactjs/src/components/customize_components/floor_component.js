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
                    toast.error(error.response.data.error_code);
                }
            })
    }, [props.floorID, floorFeature.roomUpdateSuccess]);

    return (
        <>
            <div className="h-full w-[5%] border-2 border-white bg-gray-900 relative float-start">
                <div className="w-full h-full hover:cursor-pointer p-2" id="button" onContextMenu={(e) => onHandleFloorContextMenu(e)}>
                    <h1 className="text-white font-bold absolute top-1/3">{props.floorName}</h1>
                </div>
            </div>
            <div className="h-full w-[95%] grid grid-cols-7">
                {room.map((value, key) =>
                    <RoomInFloor key={key} room={value} roomName={value.room_name} roomStatus={value.room_status}
                        id={value.id} bedQuantity={value.room_bed_quantity}
                    />)}
            </div>
            <FloorContextMenu />
            <RoomContextMenu />
        </>

    )
}