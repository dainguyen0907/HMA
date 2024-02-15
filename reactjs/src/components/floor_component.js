import React from "react";
import FloorContextMenu from "../../src/components/menu/floor_context_menu";
import { useDispatch} from "react-redux";
import { setFloorMenuAnchor } from "../redux_features/floorFeature";
export default function FloorComponent(){
    const dispatch=useDispatch();

    const onHandleFloorContextMenu = (event) => {
        event.preventDefault();
        dispatch(setFloorMenuAnchor(event));
    }
    return (
        <>
            <div className="h-full w-[5%] border-2 border-white bg-gray-900 relative float-start">
                <div className="w-full h-full hover:cursor-pointer p-2" id="button" onContextMenu={(e) => onHandleFloorContextMenu(e)}>
                    <h1 className="text-white font-bold absolute top-1/3">Tầng 1</h1>
                </div>
                <FloorContextMenu/>
            </div>
            <div className="h-full w-[95%] grid grid-cols-7">
                <div className="bg-gray-300">

                </div>
                <div className="bg-red-400">

                </div>
                <div className="bg-gray-300">

                </div>
                <div className="bg-red-400">

                </div>
                <div className="bg-gray-300">

                </div>
                <div className="bg-red-400">

                </div>
                <div className="bg-gray-300">

                </div>
                <div className="bg-red-400">

                </div>
            </div>
        </>

    )
}