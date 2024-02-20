import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setRoomMenuAnchor } from "../redux_features/floorFeature";
import RoomContextMenu from "./menu/room_context_menu";

export default function RoomInFloor(props) {
    const [color, setColor] = useState('bg-green-300');
    const dispatch = useDispatch();

    const onHandleContext = (event) => {
        event.preventDefault();
        dispatch(setRoomMenuAnchor(event));
    }

    useEffect(() => {
        if (props.roomStatus) {
            setColor('bg-green-300')
        } else {
            setColor('bg-red-300')
        }
    }, [props.roomStatus])
    return (
        <>
        <div className={"hover:cursor-pointer border-2 border-white " + color} onContextMenu={(e) => onHandleContext(e)}>
            <div className="grid grid-cols-2 h-1/3">

            </div>
            <div className="h-1/3 text-center">
                <span className="font-semibold">{props.roomName}</span>
            </div>
            <div className="grid grid-cols-2 h-1/3">

            </div>
        </div>
        <RoomContextMenu />
        </>

    )
}