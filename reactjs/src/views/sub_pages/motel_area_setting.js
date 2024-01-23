import { Button, Modal } from "flowbite-react";
import React, { useEffect, useState, useMemo } from "react";
import { IconContext } from "react-icons";
import { FaCirclePlus } from "react-icons/fa6";
import FloatTextComponent from "../../components/float_text_component";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import { toast } from "react-toastify";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import { Box, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";



export default function AreaSetting() {
    const [openAddArea, setOpenAddArea] = useState(false);
    const [areaName, setAreaName] = useState("");
    const [areaFloor, setAreaFloor] = useState(0);
    const [areaRoom, setAreaRoom] = useState(0);
    const [idArea, setIDArea] = useState(-1);
    const [headerModal, setHeaderModal] = useState('Thêm khu vực mới')
    const [data, setData] = useState([]);
    const [success,setSuccess]=useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'Mã số',
            size: '10'
        },
        {
            accessorKey: 'area_name',
            header: 'Tên khu vực',
            size: '100'
        }, {
            accessorKey: 'area_floor_quantity',
            header: 'Số tầng',
            size: '10'
        }, {
            accessorKey: 'area_room_quantity',
            header: 'Số phòng',
            size: '10'
        }
    ], [])

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + "api/area/getAll", { withCredentials: true })
            .then(function (responsive) {
                console.log(responsive);
                setData(responsive.data);
                setIsLoading(false);
            }).catch(function (error) {
                if(error.response){
                    toast.error(error.response.data.error_code);
                }
            })
    }, [success])

    const confirmAction = () => {
        if (idArea !== -1) {
            axios.post(process.env.REACT_APP_BACKEND + "api/area/updateArea",{
                id_area:idArea,
                area_name:areaName,
                area_floor:areaFloor,
                area_room:areaRoom,
            },{withCredentials:true})
            .then(function(response){
                toast.success(response.data.result);
                setSuccess(success+1);
                setOpenAddArea(false);
            }).catch(function(error){
                if(error.response){
                    toast.error(error.response.data.error_code);
                }
            })
        } else {
            axios.post(process.env.REACT_APP_BACKEND+"api/area/insertArea",
            {
                area_name:areaName,
                area_floor:areaFloor,
                area_room:areaRoom
            },{withCredentials:true})
            .then(function(response){
                toast.success("Thêm thành công");
                setSuccess(success+1);
                setOpenAddArea(false);
            }).catch(function(error){
                if(error.response){
                    toast.error(error.response.data.error_code);
                }
            })
        }
        
    }

    const deleteAction=(idA)=>{
        if(window.confirm("Bạn muốn xoá khu vực này ?")){
            axios.post(process.env.REACT_APP_BACKEND + "api/area/deleteArea",
            { id_area:idA},{withCredentials:true})
            .then(function(response){
                toast.success(response.data.result);
                setSuccess(success+1);
            }).catch(function(error){
                if(error.response){
                    toast.error(error.response.data.error_code);
                }
            })
        }
    }

    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-2 h-[7%]">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Danh sách khu vực</h1>
                    </div>
                    <div className="ml-auto">
                        <IconContext.Provider value={{ size: '22px' }}>
                            <button className="border-2 p-1 flex bg-green-500 text-white rounded-lg"
                                onClick={() => {
                                    setOpenAddArea(true);
                                    setHeaderModal("Thêm khu vực mới");
                                    setAreaName("");
                                    setAreaFloor("");
                                    setAreaRoom("");
                                    setIDArea(-1);
                                }}>
                                <FaCirclePlus /> Thêm khu vực</button>
                        </IconContext.Provider>
                        <Modal show={openAddArea} onClose={() => { setOpenAddArea(false) }}>
                            <Modal.Header>{headerModal}</Modal.Header>
                            <Modal.Body>
                                <FloatTextComponent label="Tên khu vực" data={areaName} setData={setAreaName} type="text" />
                                <FloatTextComponent label="Số tầng" data={areaFloor} setData={setAreaFloor} type="number" />
                                <FloatTextComponent label="Số phòng" data={areaRoom} setData={setAreaRoom} type="number" />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button color="blue" onClick={() => confirmAction()}>Đồng ý</Button>
                                <Button color="gray" onClick={() => { setOpenAddArea(false) }}>Huỷ</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
                <div className="w-full h-[93%]">
                    <MaterialReactTable
                        columns={columns}
                        data={data}
                        state={{ isLoading: isLoading }}
                        muiCircularProgressProps={{
                            color: 'secondary',
                            thickness: 5,
                            size: 55,
                        }}
                        muiSkeletonProps={{
                            animation: 'pulse',
                            height: 28,
                        }}
                        localization={MRT_Localization_VI}
                        enableRowActions
                        positionActionsColumn="last"
                        renderRowActions={({ row, table }) => (
                            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                                <IconButton color="primary"
                                    onClick={() => {
                                        setHeaderModal('Cập nhật khu vực');
                                        setOpenAddArea(true);
                                        setAreaName(row.original.area_name);
                                        setAreaFloor(row.original.area_floor_quantity);
                                        setAreaRoom(row.original.area_room_quantity);
                                        setIDArea(row.original.id)
                                    }}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton color="error" 
                                onClick={()=>{
                                    deleteAction(row.original.id);
                                    }}>
                                    <Delete />
                                </IconButton>
                            </Box>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}