import { Button, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalChangeRoom, setRoomUpdateSuccess } from "../../../redux_features/floorFeature";
import { MenuItem, TextField, styled } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

const Text = styled(TextField)(({ theme }) => ({
    'input:focus': {
        '--tw-ring-shadow': 'none'
    },
}));

export default function ChangeRoomModal() {

    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);
    const [idRoom, setIdRoom] = useState(-1);
    const [roomSelect, setRoomSelect] = useState([]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/room/getAvaiableRoomByIDArea?id=' + floorFeature.areaID, { withCredentials: true })
            .then(function (response) {
                setRoomSelect(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error("Lỗi lấy dữ liệu phòng phù hợp: "+error.response.data.error_code);
                }
            })
    }, [floorFeature.areaID])

    useEffect(()=>{
        setIdRoom(-1);
    },[floorFeature.openModalChangeRoom])

    const onConfirm = () => {
        if (idRoom !== -1) {
            axios.post(process.env.REACT_APP_BACKEND + 'api/bed/changeRoom', {
                id_room: idRoom,
                id_bed: floorFeature.bedID,
                id_old_room:floorFeature.roomID
            }, { withCredentials: true })
                .then(function (response) {
                    dispatch(setOpenModalChangeRoom(false));
                    dispatch(setRoomUpdateSuccess());
                    toast.success(response.data.result);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error("Lỗi cập nhật thông tin: "+error.response.data.error_code);
                    }
                })
        }
    }


    return (
        <Modal show={floorFeature.openModalChangeRoom} onClose={() => dispatch(setOpenModalChangeRoom(false))}>
            <Modal.Body>
                <div className="grid grid-cols-10">
                    <span className="col-span-2 mt-2">Chuyển đến</span>
                    <div className="col-span-6">
                        <Text label="Phòng" size="small" fullWidth select value={idRoom} onChange={(e) => setIdRoom(e.target.value)}>
                            <MenuItem value={-1} disabled>Chọn phòng</MenuItem>
                            {roomSelect.map((value, key) => <MenuItem key={key} value={value.id}>{value.room_name}</MenuItem>)}
                        </Text>
                    </div>
                    <Button color="blue" className="mb-2 mx-1" disabled={floorFeature.bedID === -1 || idRoom === -1}
                    onClick={()=>onConfirm()}>
                        &#10003;
                    </Button>
                    <Button color="red" className="mb-2 mx-1" onClick={() => dispatch(setOpenModalChangeRoom(false))}>
                        &#10060;
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}