import { Button, Modal } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { IconContext } from "react-icons";
import { FaCirclePlus } from "react-icons/fa6";
import FloatTextComponent from "../../components/float_text_component";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export default function ServiceSetting() {

    const [openModal, setOpenModal] = useState(false);
    const [serviceName, setServiceName] = useState("");
    const [servicePrice, setServicePrice] = useState(0);
    const [data, setData] = useState([]);
    const [success, setSuccess] = useState(0);
    const [idService, setIDService] = useState(-1);
    const [headerModal, setHeaderModal] = useState("Thêm dịch vụ mới");
    const [isLoading, setIsLoading] = useState(true);

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'Mã số',
            size: '10'
        },
        {
            accessorKey: 'service_name',
            header: 'Tên dịch vụ',
            size: '100'
        }, {
            accessorKey: 'service_price',
            header: 'Đơn giá (VNĐ)',
            size: '12'
        }
    ], [])

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + "api/service/getAll", { withCredentials: true })
            .then(function (response) {
                setData(response.data.result);
                setIsLoading(false);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }, [success])

    const onConfirmAction = () => {
        if (idService === -1) {
            axios.post(process.env.REACT_APP_BACKEND + "api/service/insertService", {
                name: serviceName,
                price: servicePrice
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success("Thêm thành công");
                    setSuccess(success + 1);
                    setOpenModal(false);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        } else {
            axios.post(process.env.REACT_APP_BACKEND + "api/service/updateService", {
                name: serviceName,
                price: servicePrice,
                id:idService
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    setSuccess(success + 1);
                    setOpenModal(false);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        }
    }

    const onDelete=(ids)=>{
        if(window.confirm("Bạn có muốn xoá dịch vụ này?")){
            axios.post(process.env.REACT_APP_BACKEND + "api/service/deleteService", {
                id:ids
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    setSuccess(success + 1);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        }
    }

    return (<div className="w-full h-full overflow-auto p-2">
        <div className="border-2 rounded-xl w-full h-full">
            <div className="border-b-2 px-3 py-1 grid grid-cols-2 h-[7%]">
                <div className="py-2">
                    <h1 className="font-bold text-blue-600">Danh sách dịch vụ</h1>
                </div>
                <div className="ml-auto">
                    <IconContext.Provider value={{ size: '22px' }}>
                        <button className="border-2 p-1 flex bg-green-500 text-white rounded-lg"
                            onClick={() => {
                                setOpenModal(true);
                                setHeaderModal("Thêm dịch vụ mới")
                                setIDService(-1);
                                setServiceName("");
                                setServicePrice(0);
                            }}>
                            <FaCirclePlus /> Thêm dịch vụ</button>
                    </IconContext.Provider>
                    <Modal show={openModal} onClose={() => setOpenModal(false)}>
                        <Modal.Header>{headerModal}</Modal.Header>
                        <Modal.Body>
                            <FloatTextComponent label="Tên dịch vụ" type="text" setData={setServiceName} data={serviceName} />
                            <FloatTextComponent label="Đơn giá" type="number" setData={setServicePrice} data={servicePrice}
                            helper="Lưu ý: Không nhập các ký tự như ', . +' vào đơn giá " />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button color="blue" onClick={() => onConfirmAction()}>Đồng ý</Button>
                            <Button color="gray" onClick={()=>setOpenModal(false)}>Huỷ</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
            <div className="w-full h-[93%]">
                <MaterialReactTable
                    columns={columns}
                    data={data}
                    state={{ isLoading: isLoading }}
                    localization={MRT_Localization_VI}
                    muiCircularProgressProps={{
                        color: 'secondary',
                        thickness: 5,
                        size: 55
                    }}
                    muiSkeletonProps={{
                        animation: 'pulse',
                        height: 28
                    }}
                    enableRowActions
                    positionActionsColumn="last"
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                            <IconButton color="primary"
                                onClick={() => {
                                    setHeaderModal("Cập nhật dịch vụ");
                                    setServiceName(row.original.service_name);
                                    setServicePrice(row.original.service_price);
                                    setIDService(row.original.id);
                                    setOpenModal(true);
                                }}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton color="error"
                                onClick={() => {
                                    onDelete(row.original.id)
                                }}>
                                <Delete />
                            </IconButton>
                        </Box>
                    )}
                />
            </div>
        </div>
    </div>)
}