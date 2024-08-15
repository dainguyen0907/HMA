import { validationResult } from "express-validator";
import companyService from "../service/company_service";
import customerService from "../service/customer_service";
import baseController from "./base_controller";

const getAllCompany = async (req, res) => {
    try {
        const companies = await companyService.getAllCompany();
        if (companies.status) {
            return res.status(200).json({ result: companies.result });
        } else {
            return res.status(500).json({ error_code: companies.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const insertCompany = async (req, res) => {
    try {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ error_code: validation.error[0].msg });
        }
        const companyInfor = {
            name: req.body.name.slice(0,50),
            phone: req.body.phone.slice(0,15),
            email: req.body.email.slice(0,150),
            address: req.body.address.slice(0,250)
        }
        const companyCreation = await companyService.insertCompany(companyInfor);
        if (companyCreation.status) {
            const message = "đã khởi tạo công ty " + companyCreation.result.id + "." + companyCreation.result.company_name;
            await baseController.saveLog(req, res, message);
            return res.status(201).json({ result: companyCreation.result });
        } else {
            return res.status(500).json({ error_code: companyCreation.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const updateCompany = async (req, res) => {
    try {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ error_code: validation.error[0].msg });
        }
        const companyInfor = {
            name: req.body.name?.slice(0,50),
            phone: req.body.phone?.slice(0,15),
            email: req.body.email?.slice(0,150),
            address: req.body.address?.slice(0,250),
            id: req.body.id
        }
        const companyUpdate = await companyService.updateCompany(companyInfor);
        if (companyUpdate.status) {
            const message = "đã cập nhật công ty có id là " + companyInfor.id;
            await baseController.saveLog(req, res, message);
            return res.status(200).json({ result: companyUpdate.result });
        } else {
            return res.status(500).json({ error_code: companyUpdate.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const deleteCompany = async (req, res) => {
    try {
        const id = req.body.id;
        const customerSearching = await customerService.getCustomerByIDCompany(id);
        if (customerSearching.status) {
            if (customerSearching.result.length > 0) {
                return res.status(400).json({ error_code: "Không thể xoá công ty đã có khách hàng" });
            }
            const companyDelete = await companyService.deleteCompany(id);
            if (companyDelete.status) {
                const message = "đã xoá công ty có id là " + id;
                await baseController.saveLog(req, res, message);
                return res.status(200).json({ result: companyDelete.result });
            } else {
                return res.status(500).json({ error_code: companyDelete.msg });
            }
        } else {
            return res.status(500).json({ error_code: customerSearching.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const getCompanyByCourse = async (req, res) => {
    try {
        const id_course = req.query.course;
        const searchResult = await companyService.getCompanyByCourse(id_course);
        if (searchResult.status)
            return res.status(200).json({ result: searchResult.result });
        else
            return res.status(500).json({ error_code: searchResult.msg });
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

module.exports = { 
    getAllCompany, getCompanyByCourse,
    insertCompany, 
    updateCompany, 
    deleteCompany, 
}