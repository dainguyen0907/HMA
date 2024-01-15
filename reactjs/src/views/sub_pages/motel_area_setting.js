import { Button, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { FaCirclePlus } from "react-icons/fa6";
import FloatTextComponent from "../../components/float_text_component";


export default function AreaSetting() {
    const [openAddArea,setOpenAddArea]=useState(false);
    const [areaName,setAreaName]=useState("");
    const [areaFloor,setAreaFloor]=useState(0);
    const [areaRoom,setAreaRoom]=useState(0);

    useEffect(()=>{
        
    },[])

    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-2">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Danh sách khu vực</h1>
                    </div>
                    <div className="ml-auto">
                        <IconContext.Provider value={{size:'22px'}}>
                            <button className="border-2 p-1 flex bg-green-500 text-white rounded-lg"
                            onClick={()=>setOpenAddArea(true)}>
                            <FaCirclePlus /> Thêm khu vực</button>
                        </IconContext.Provider>
                        <Modal show={openAddArea} onClose={()=>{setOpenAddArea(false)}}>
                            <Modal.Header>Thêm khu vực mới</Modal.Header>
                            <Modal.Body>
                                <FloatTextComponent label="Tên khu vực" data={areaName} setData={setAreaName} type="text"/>
                                <FloatTextComponent label="Số tầng" data={areaFloor} setData={setAreaFloor} type="number"/>
                                <FloatTextComponent label="Số phòng" data={areaRoom} setData={setAreaRoom} type="number"/>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button color="blue" onClick={()=>setOpenAddArea(false)}>Thêm mới</Button>
                                <Button color="gray" onClick={()=>{setOpenAddArea(false)}}>Huỷ</Button>
                            </Modal.Footer>
                        </Modal>
            
                    </div>
                    

                </div>
            </div>

        </div>
    );
}