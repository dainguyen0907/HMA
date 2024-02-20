import React, { useEffect, useState } from "react";
import FloorContextMenu from "../../src/components/menu/floor_context_menu";
import { useDispatch } from "react-redux";
import { setFloorMenuAnchor } from "../redux_features/floorFeature";
import RoomInFloor from "./room_in_floor_component";
import { toast } from "react-toastify";
import axios from "axios";
export default function FloorComponent(props) {
    const dispatch = useDispatch();
    const [room, setRoom] = useState([]);

    const onHandleFloorContextMenu = (event) => {
        event.preventDefault();
        dispatch(setFloorMenuAnchor(event));
    }

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/room/getRoomByIDFloor?id=' + props.floorID,{withCredentials:true})
            .then(function (response) {
                setRoom(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }, [props.floorID]);

    return (
        <>
            <div className="h-full w-[5%] border-2 border-white bg-gray-900 relative float-start">
                <div className="w-full h-full hover:cursor-pointer p-2" id="button" onContextMenu={(e) => onHandleFloorContextMenu(e)}>
                    <h1 className="text-white font-bold absolute top-1/3">{props.floorName}</h1>
                </div>
                <FloorContextMenu />
            </div>
            <div className="h-full w-[95%] grid grid-cols-7">
                {room.map((value,key) => <RoomInFloor key={key} roomName={value.room_name} roomStatus={value.room_status}/>)}
            </div>
        </>

    )
}