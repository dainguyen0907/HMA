import { Close } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenConfirmInvoiceCreationModal } from "../../../redux_features/invoiceCreationFeature";

export default function ConfirmInvoiceModal() {

    const invoiceCreationFeature = useSelector(state => state.invoice_creation);
    const dispatch = useDispatch();

    return (
        <Modal show={invoiceCreationFeature.openConfirmInvoiceCreationModal} className="relative" size="7xl">
            <Modal.Body>
                <div className="absolute top-2 right-2">
                    <IconButton onClick={() => dispatch(setOpenConfirmInvoiceCreationModal(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2">
                    <div className="px-2">
                        <fieldset style={{ border: "2px solid #E5E7EB" }}>
                            <legend className="text-blue-800 font-bold">Thông tin đại diện</legend>
                            <div className="grid lg:grid-cols-2 grid-cols-1 ">
                                <div className="pl-2">
                                    <p>Mã giường: <strong></strong> </p>
                                    <p>Khách hàng: <strong></strong> </p>
                                    <p>CMND/CCCD: <strong></strong></p>
                                </div><div className="pl-2">
                                    <p>Loại giường: <strong></strong></p>
                                    <p>Ngày checkin: <strong></strong> </p>
                                    <p>Ngày checkout: <strong></strong> </p>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset style={{ border: "2px solid #E5E7EB" }}>
                            <legend className="text-blue-800 font-bold">Thông tin thanh toán</legend>
                            <div className="grid lg:grid-cols-2 grid-cols-1 ">
                                <div className="pl-2">
                                    <p>Tổng tiền: <strong></strong></p>
                                    <p>Trả trước: <strong></strong></p>
                                    <p>Thành tiền: <strong></strong></p>
                                </div>
                                <div className="p-2">

                                </div>
                            </div>
                        </fieldset>
                        <div className="pt-3 w-full flex flex-row-reverse gap-4">
                            <Button color="primary" variant="contained">Thanh toán</Button>
                            <Button color="inherit" variant="outlined">Huỷ</Button>
                        </div>
                    </div>
                    <div className="px-2">
                        
                    </div>
                </div>

            </Modal.Body>
        </Modal>
    );
}