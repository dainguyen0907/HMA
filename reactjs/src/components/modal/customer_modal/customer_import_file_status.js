import { Button, Modal } from "flowbite-react"
import { useDispatch, useSelector } from "react-redux"
import { setOpenCustomerImportFileStatusModal } from "../../../redux_features/customerFeature";

export default function CustomerImportFileStatusModal() {
    const customerFeature = useSelector(state => state.customer);
    const dispatch = useDispatch();

    return (
        <Modal show={customerFeature.openCustomerImportFileStatusModal}>
            <Modal.Body>
                <div className="flex flex-col justify-center items-center">
                    {
                        customerFeature.customerImportFileErrorList.length > 0 ?
                            <>
                                <span className="text-orange-500 font-bold">Không thể thêm một số khách hàng:</span>
                                <ul>
                                    {
                                        customerFeature.customerImportFileErrorList.map((value,index)=>
                                        <li>{value}</li>)
                                    }
                                </ul>
                            </> :
                            <span color="text-green-500 font-bold">Thêm danh sách thành công.</span>
                    }
                    <Button outlined color="blue" onClick={(e)=>dispatch(setOpenCustomerImportFileStatusModal(false))}>
                        Đồng ý
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}