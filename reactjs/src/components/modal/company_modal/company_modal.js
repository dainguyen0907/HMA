import { Close } from "@mui/icons-material";
import { Button, IconButton, TextField } from "@mui/material";
import { Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenCompanyModal, setUpdateCompanySuccess } from "../../../redux_features/companyFeature";
import axios from "axios";
import { toast } from "react-toastify";

export default function CompanyModal() {

    const dispatch = useDispatch();
    const companyFeature = useSelector(state => state.company);
    const [companyName, setCompanyName] = useState("");
    const [companyPhone, setCompanyPhone] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");

    useEffect(() => {
        if (companyFeature.openCompanyModal) {
            if (companyFeature.companySelection) {
                const company = companyFeature.companySelection;
                setCompanyName(company.company_name);
                setCompanyPhone(company.company_phone);
                setCompanyEmail(company.company_email);
                setCompanyAddress(company.company_address);
            } else {
                setCompanyName("");
                setCompanyPhone("");
                setCompanyEmail("");
                setCompanyAddress("");
            }
        }
    }, [companyFeature.openCompanyModal, companyFeature.companySelection])

    const onHandleSubmit = (event) => {
        event.preventDefault();
        if (companyFeature.companySelection) {
            axios.post(process.env.REACT_APP_BACKEND + 'api/company/updateCompany', {
                name: companyName,
                phone: companyPhone,
                email: companyEmail,
                address: companyAddress,
                id: companyFeature.companySelection.id
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setUpdateCompanySuccess());
                    dispatch(setOpenCompanyModal(false));
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        } else {
            axios.post(process.env.REACT_APP_BACKEND + 'api/company/insertCompany', {
                name: companyName,
                phone: companyPhone,
                email: companyEmail,
                address: companyAddress,
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success("Thêm mới Công ty thành công");
                    dispatch(setUpdateCompanySuccess());
                    dispatch(setOpenCompanyModal(false));
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        }
    }

    return (
        <Modal show={companyFeature.openCompanyModal} >
            <Modal.Body className="relative">
                <form onSubmit={onHandleSubmit}>
                    <div className="absolute top-3 right-4">
                        <IconButton onClick={() => dispatch(setOpenCompanyModal(false))}>
                            <Close />
                        </IconButton>
                    </div>
                    <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                        {companyFeature.companySelection ? "Cập nhật công ty" : "Thêm công ty mới"}
                    </div>
                    <div className="flex flex-col gap-2">
                        <TextField label="Tên công ty" required size="small" variant="outlined" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} autoComplete="off" />
                        <TextField label="Số điện thoại" size="small" variant="outlined" type="number" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} autoComplete="off" />
                        <TextField label="Email" size="small" variant="outlined" type="text" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} autoComplete="off" />
                        <TextField label="Địa chỉ" size="small" variant="outlined" type="text" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} autoComplete="off" />
                        <Button color="primary" type="submit" variant="contained">{companyFeature.companySelection ? "Cập nhật" : "Thêm"}</Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    )
}