import { Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalCheckOutCompany } from "../../redux_features/floorFeature";
import { Button, IconButton, MenuItem, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CheckoutCompanyModal() {

    const floorFeature = useSelector(state => state.floor);
    const dispatch = useDispatch();

    const [courseList, setCourseList] = useState([]);
    const [idCourse, setIDCourse] = useState(-1);
    const [companyList, setCompanyList] = useState([]);
    const [idCompany, setIDCompany] = useState(-1);

    useEffect(()=>{
        if(floorFeature.openModalCheckOutCompany){
            axios.get(process.env.REACT_APP_BACKEND+'api/course/getAll',{withCredentials:true})
            .then(function (response) {
                setCourseList(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error('Dữ liệu Khoá học: ' + error.response.data.error_code);
                }
            })
            axios.get(process.env.REACT_APP_BACKEND + 'api/company/getAll', { withCredentials: true })
            .then(function (response) {
                setCompanyList(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error('Dữ liệu Công ty: ' + error.response.data.error_code);
                }
            })
        }
    },[floorFeature.openModalCheckOutCompany])

    const onHandleConfirm=(e)=>{
        e.preventDefault();
        if(idCompany!==-1&&idCourse!==-1){
            
        }else{
            toast.error('Có thông tin chưa hợp lệ. Vui lòng kiểm tra lại!')
        }
    }

    return (
        <Modal show={floorFeature.openModalCheckOutCompany} className="relative">
            <Modal.Body>
                <div className="absolute top-3 right-4">
                    <IconButton onClick={() => dispatch(setOpenModalCheckOutCompany(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                    Trả phòng theo đơn vị
                </div>
                <form onSubmit={onHandleConfirm}>
                <div className="flex flex-col gap-2">
                    <TextField variant="outlined" label="Công ty" size="small" select fullWidth value={idCompany}
                    onChange={(e)=>setIDCompany(e.target.value)}>
                        <MenuItem value={-1} disabled>--Không--</MenuItem>
                        {companyList.map((value,index)=><MenuItem value={value.id} key={index}>{value.company_name}</MenuItem>)}
                    </TextField>
                    <TextField variant="outlined" label="Khoá học" size="small" select fullWidth value={idCourse}
                    onChange={(e)=>setIDCourse(e.target.value)}>
                        <MenuItem value={-1} disabled>--Không--</MenuItem>
                        {courseList.map((value,index)=><MenuItem value={value.id} key={index}>{value.course_name}</MenuItem>)}
                    </TextField>
                    <Button type="submit" color="primary" variant="contained" disabled={idCompany===-1||idCourse===-1}>Trả phòng</Button>
                </div>
                </form>
            </Modal.Body>
        </Modal>
    )
}