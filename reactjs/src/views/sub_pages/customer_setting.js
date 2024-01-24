import { Button, Modal } from "flowbite-react";
import React, { useState } from "react";
import { IconContext } from "react-icons";
import { FaCirclePlus } from "react-icons/fa6";
import FloatTextComponent from "../../components/float_text_component";

export default function CustomerSetting() {

    const [openModal,setOpenModal]=useState(false);
    const [idCustomer,setIdCustomer]=useState(-1);
    const [customerName,setCustomerName]=useState("");
    const [customerGender,setCustomerGender]=useState(true);
    const [customerEmail,setCustomerEmail]=useState("");
    const [customerAddress,setCustomerAddress]=useState("");
    const [customerPhone,setCustomerPhone]=useState("");
    const [customerStudentCheck,setCustomerStudentCheck]=useState(false);
    const [customerIdentification,setCustomerIdentification]=useState("");
    

    return (<div className="w-full h-full overflow-auto p-2">
        <div className="border-2 rounded-xl w-full h-full">
            <div className="border-b-2 px-3 py-1 grid grid-cols-2 h-[7%]">
                <div className="py-2">
                    <h1 className="font-bold text-blue-600">Danh sách khách hàng</h1>
                </div>
                <div className="ml-auto">
                    <IconContext.Provider value={{ size: '22px' }}>
                        <button className="border-2 p-1 flex bg-green-500 text-white rounded-lg"
                            onClick={() => {
                                setOpenModal(true);
                            }}>
                            <FaCirclePlus /> Thêm khách hàng mới</button>
                    </IconContext.Provider>
                    <Modal show={openModal} onClose={() => { setOpenModal(false) }}>
                        <Modal.Header>{}</Modal.Header>
                        <Modal.Body>
                            <FloatTextComponent label="Tên khu vực" data={{}} setData={{}} type="text" />
                            <FloatTextComponent label="Số tầng" data={{}} setData={{}} type="number" />
                            <FloatTextComponent label="Số phòng" data={{}} setData={{}} type="number" />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button color="blue" onClick={() =>{} }>Đồng ý</Button>
                            <Button color="gray" onClick={() => { setOpenModal(false) }}>Huỷ</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
            <div className="w-full h-[93%]">
                
            </div>
        </div>
    </div>)
}