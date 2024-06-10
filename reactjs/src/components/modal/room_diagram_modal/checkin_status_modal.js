import { Button, Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalCheckinStatus } from "../../../redux_features/floorFeature";

export default function CheckinStatusModal(){
    const floorFeature=useSelector(state=>state.floor);
    const dispatch=useDispatch();

    return (
        <Modal show={floorFeature.openModalCheckinStatus}>
            <Modal.Body>
                <div className="flex flex-col gap-2">
                    {
                        floorFeature.checkinErrorList.length>0?
                        <>
                        <span className="text-orange-500 font-bold">Không thể checkin một số khách hàng:</span>
                                <ul>
                                    {
                                        floorFeature.checkinErrorList.map((value,index)=>
                                        <li>{value}</li>)
                                    }
                                </ul>
                        </>:
                        <span className="font-bold text-green-500">Checkin thành công</span>
                    }
                    <Button outlined color="green" onClick={()=>dispatch(setOpenModalCheckinStatus(false))}>
                        Xác nhận
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}