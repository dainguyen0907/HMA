import axios from "axios";
import { Button, Modal } from "flowbite-react";
import React from "react";
import { toast } from "react-toastify";
import FloatTextComponent from "../../components/float_text_component"
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalChangeName } from "../../redux_features/floorFeature";


export default function ChangeFloorNameModal(props){
    const floorFeatures=useSelector(state=>state.floor);
    const dispatch=useDispatch();
    const onHandleConfirm = () => {
        axios.post(process.env.REACT_APP_BACKEND + "api/floor/updateFloor", {
            name: props.floorName,
            id: props.floorID
        }, { withCredentials: true })
            .then(function (response) {
                toast.success(response.data.result);
                dispatch(setOpenModalChangeName(false));
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error);
                }
            })
    }
    return (
        <Modal show={floorFeatures.openModalChangeName} dismissible onClose={() => dispatch(setOpenModalChangeName(false))}>
            <Modal.Body>
                <div className="grid grid-cols-10">
                    <div className="col-span-8">
                        <FloatTextComponent label="Tên tầng" type="text" data={props.floorName} setData={props.setFloorName}
                         />
                    </div>
                    <Button color="blue" className="mb-2 mx-1" onClick={() => window.alert("click")}>
                        &#10003;
                    </Button>
                    <Button color="red" className="mb-2 mx-1" onClick={() => dispatch(setOpenModalChangeName(false))}>
                        &#10060;
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}