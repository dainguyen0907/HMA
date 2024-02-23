import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRoomBedQuantity, setRoomID, setRoomMenuAnchor, setRoomName } from "../redux_features/floorFeature";
import { IconContext } from "react-icons";
import { FaBed } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

export default function RoomInFloor(props) {
    const [color, setColor] = useState('bg-green-300');
    const [bedCount, setBedCount] = useState(0);
    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);

    const onHandleContext = (event) => {
        event.preventDefault();
        dispatch(setRoomMenuAnchor(event));
        dispatch(setRoomID(props.id));
        dispatch(setRoomName(props.roomName));
        dispatch(setRoomBedQuantity(props.bedQuantity));
    }

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/bed/countBedInUsedByRoomID?id=' + props.id, { withCredentials: true })
            .then(function (response) {
                setBedCount(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }, [floorFeature.roomUpdateSuccess, props.id])

    useEffect(() => {
        if (props.roomStatus) {
            if (props.bedQuantity > bedCount) {
                setColor('bg-green-300')
            } else {
                setColor('bg-red-300')
            }
        } else {
            setColor('bg-gray-300')
        }

    }, [bedCount, props.bedQuantity, props.roomStatus])
    return (
        <>
            <div className={"hover:cursor-pointer border-2 border-white " + color} onContextMenu={(e) => onHandleContext(e)}>
                <div className="grid grid-cols-2 h-1/3">
                    <div></div>
                    <div className="pl-2">
                        <IconContext.Provider value={{ size: '16', color: 'blue' }}>
                            <span className="float-end font-bold text-sm text-blue-700">&nbsp;{bedCount}/{props.bedQuantity}&nbsp;</span><FaBed className="float-end" />
                        </IconContext.Provider>

                    </div>
                </div>
                <div className="h-1/3 text-center">
                    <span className="font-bold text-blue-700">{props.roomName}</span>
                </div>
                <div className="grid grid-cols-2 h-1/3">

                </div>
            </div>
        </>

    )
}