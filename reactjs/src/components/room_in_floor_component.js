import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setRoomBedQuantity, setRoomID, setRoomMenuAnchor, setRoomName } from "../redux_features/floorFeature";

export default function RoomInFloor(props) {
    const [color, setColor] = useState('bg-green-300');
    const dispatch = useDispatch();

    const onHandleContext = (event) => {
        event.preventDefault();
        dispatch(setRoomMenuAnchor(event));
        dispatch(setRoomID(props.id));
        dispatch(setRoomName(props.roomName));
        dispatch(setRoomBedQuantity(props.bedQuantity));
    }

    useEffect(() => {
        if (!props.roomStatus) {
            setColor('bg-green-300')
        } else {
            setColor('bg-red-300')
        }
    }, [props.roomStatus])
    return (
        <>
        <div className={"hover:cursor-pointer border-2 border-white " + color} onContextMenu={(e) => onHandleContext(e)}>
            <div className="grid grid-cols-2 h-1/3">
                <div></div>
                <div className="pl-2">
                    <small>Số giường: <span className="font-bold">{props.bedQuantity}</span></small>
                </div>
            </div>
            <div className="h-1/3 text-center">
                <span className="font-semibold">{props.roomName}</span>
            </div>
            <div className="grid grid-cols-2 h-1/3">

            </div>    
        </div>
        </>

    )
}