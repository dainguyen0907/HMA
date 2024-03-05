import { Button, Modal } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalCheckOut } from "../../redux_features/floorFeature";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";

export default function CheckoutModal() {
    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);
    const [data, setData] = useState([]);

    const columns = useMemo(() => [
        {
            accessorKey: 'Customer.customer_identification',
            header: 'Số CMND/CCCD',
            size: '12'
        },
        {
            accessorKey: 'Customer.customer_name',
            header: 'Tên khách hàng',
            size: '50'
        }, {
            accessorKey: 'Customer.customer_phone',
            header: 'Số điện thoại',
            size: '12'
        }
    ], [])

    useEffect(()=>{
        axios.get(process.env.REACT_APP_BACKEND+'api/bed/getBedInRoom?id='+floorFeature.roomID,{withCredentials: true})
        .then(function(response){
            setData(response.data.result);
        }).catch(function(error){
            console.log(error)
        })
    },[floorFeature.roomID]);

    return (<Modal show={floorFeature.openModalCheckOut} onClose={() => dispatch(setOpenModalCheckOut(false))}
        size="7xl">
        <Modal.Body>
            <div className="w-full grid grid-cols-2">
                <div className="w-full px-1">
                    <div className="w-full h-40 bg-slate-200 overflow-y-scroll">
                        <MaterialReactTable
                        data={data}
                        columns={columns}
                        enableBottomToolbar={false}
                        enableTopToolbar={false}
                        muiTableBodyRowProps={(row)=>({
                            onClick:(event)=>{
                                
                            },
                            sx:{
                                cursor:'pointer'
                            }
                        })}
                        />
                    </div>
                    <div className="pt-3 w-full">
                        <Button color="blue" className="float-end ml-2">Thanh toán</Button>
                        <Button color="success" className="float-end ml-2">Chuyển phòng</Button>
                        <Button color="gray" className="float-end ml-2" onClick={() => dispatch(setOpenModalCheckOut(false))}>Huỷ</Button>
                    </div>
                </div>
                <div className="w-full px-1">

                </div>
            </div>
        </Modal.Body>
    </Modal>);
}