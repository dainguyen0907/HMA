import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBedInRoomStatus, setRoomBedQuantity, setRoomID, setRoomMenuAnchor, setRoomName, setRoomNote, setRoomStatus } from "../../redux_features/floorFeature";
import { IconContext } from "react-icons";
import { FaBed } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import "../../assets/scss/room_in_floor_component.scss";

export default function RoomInFloor(props) {
    const [color, setColor] = useState('bg-green-300');
    const [bedCount, setBedCount] = useState(0);
    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);

    const onHandleContext = (event) => {
        event.preventDefault();
        dispatch(setRoomMenuAnchor({ X: event.clientX, Y: event.clientY }));
        dispatch(setRoomID(props.room.id));
        dispatch(setRoomName(props.room.room_name));
        dispatch(setRoomBedQuantity(props.room.room_bed_quantity));
        dispatch(setRoomStatus(props.room.room_status));
        dispatch(setRoomNote(props.room.room_note));
        if (bedCount === 0) {
            dispatch(setBedInRoomStatus(-1));
        } else if (bedCount < props.room.room_bed_quantity) {
            dispatch(setBedInRoomStatus(0));
        } else {
            dispatch(setBedInRoomStatus(1));
        }
    }

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/bed/countBedInUsedByRoomID?id=' + props.room.id, { withCredentials: true })
            .then(function (response) {
                setBedCount(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error("Lỗi lấy dữ liệu số lượng giường: " + error.response.data.error_code);
                }
            })
    }, [floorFeature.roomUpdateSuccess, props.room.id])

    useEffect(() => {
        if (props.room.room_status) {
            if (props.room.room_bed_quantity > bedCount) {
                setColor('bg-green-300')
            } else {
                setColor('bg-red-300')
            }
        } else {
            setColor('bg-gray-300')
        }

    }, [bedCount, props.room.room_bed_quantity, props.room.room_status])
    return (
        <>
            <div className={"h-40 hover:cursor-pointer border-2 border-white rounded-lg " + color} onContextMenu={(e) => onHandleContext(e)}>
                <div className="flex flex-row-reverse">
                    <div className="p-1">
                        <IconContext.Provider value={{ size: '16', color: 'blue' }}>
                            <span className="float-end font-bold text-sm text-blue-700">&nbsp;{bedCount}/{props.room.room_bed_quantity}&nbsp;</span><FaBed className="float-end" />
                        </IconContext.Provider>
                    </div>
                </div>
                <div className="text-center">
                    <span className="font-bold text-blue-700">{props.room.room_name}</span>
                </div>
                {
                    !props.room.room_status ?
                        <div className="p-2 max-w-60">
                            <span className="note_tag">{props.room.room_note}</span>
                        </div> : null
                }
            </div>
        </>

    )
}