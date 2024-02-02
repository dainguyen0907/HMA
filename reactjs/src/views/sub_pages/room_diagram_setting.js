import axios from "axios";
import FloorContextMenu from "../../components/menu/floor_context_menu";
import { Button, Modal } from "flowbite-react";
import React, {  useState } from "react";
import { toast } from "react-toastify";
import FloatTextComponent from "../../components/float_text_component";

function ChangeFloorNameModal(props) {
    const onHandleConfirm = () => {
        axios.post(process.env.REACT_APP_BACKEND + "api/floor/updateFloor", {
            name: props.floorName,
            id: props.floorID
        }, { withCredentials: true })
            .then(function (response) {
                toast.success(response.data.result);
                props.setOpenModal(false);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error);
                }
            })
    }
    return (
        <Modal show={props.openModal} dismissible onClose={() => props.setOpenModal(false)}>
            <Modal.Body>
                <div className="grid grid-cols-10">
                    <div className="col-span-8">
                        <FloatTextComponent label="Tên tầng" type="text" data={props.floorName} setData={props.setFloorName}
                         />
                    </div>
                    <Button color="blue" className="mb-2 mx-1" onClick={() => window.alert("click")}>
                        &#10003;
                    </Button>
                    <Button color="red" className="mb-2 mx-1" onClick={() => props.setOpenModal(false)}>
                        &#10060;
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default function RoomDiagramSetting() {
    const [floorAnchorEl, setFloorAnchorEl] = useState(null);
    const [openFloorModal, setOpenFloorModal] = useState(false);
    const openFloorContext = Boolean(floorAnchorEl);

    const onHandleFloorContextMenu = (event) => {
        event.preventDefault();
        setFloorAnchorEl(
            floorAnchorEl === null ? {
                mouseX: event.clientX + 2,
                mouseY: event.clientY - 6,
            } : null
        )
    }

    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-3 h-[7%]">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Sắp xếp phòng</h1>
                    </div>
                    <div className="">
                        <center>
                            <Button outline gradientDuoTone="cyanToBlue">
                                Chọn khu vực
                            </Button>
                        </center>
                    </div>
                    <div className="ml-auto">

                    </div>
                </div>
                <div className="w-full h-[92%] block overflow-y-scroll">
                    <div className="w-full h-1/4 bg-slate-600">
                        <div className="h-full w-[5%] border-2 border-white bg-gray-900 relative float-start">
                            <div className="w-full h-full hover:cursor-pointer p-2" id="button" onContextMenu={(e) => onHandleFloorContextMenu(e)}>
                                <h1 className="text-white font-bold absolute top-1/3">Tầng 1</h1>
                            </div>
                            <FloorContextMenu open={openFloorContext} anchorEl={floorAnchorEl}
                                setAnchorEl={setFloorAnchorEl} setOpenFloorModal={setOpenFloorModal} />
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
                    </div>
                    <ChangeFloorNameModal openModal={openFloorModal} setOpenModal={setOpenFloorModal}
                    />
                </div>
            </div>
        </div>
    );
}