import { validationResult } from "express-validator";
import customerService from "../service/customer_service";
import bedService from "../service/bed_service";
import base_controller from "../controller/base_controller"
import invoiceService from "../service/invoice_service";

const getAllCustomer = async (req, res) => {
    try {
        const rs = await customerService.getAllCustomer();
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}


const insertCustomer = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    let name, gender, email, address, phone, identification;
    try {
        name = req.body.name;
        gender = Boolean(req.body.gender);
        email = req.body.email;
        address = req.body.address;
        phone = req.body.phone;
        identification = req.body.identification;
        let customer = {
            name: name,
            gender: gender,
            email: email,
            address: address,
            phone: phone,
            identification: identification,
        }
        const rs = await customerService.insertCustomer(customer);
        if (rs.status) {
            const message = "đã khởi tạo khách hàng mới có mã " + rs.result.id;
            await base_controller.saveLog(req, res, message);
            return res.status(201).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const updateCustomer = async (req, res) => {
    let name, gender, email, address, phone, identification, status, id;
    try {
        id = req.body.id;
        name = req.body.name == "" ? null : req.body.name;
        gender = req.body.gender;
        email = req.body.email == "" ? null : req.body.email;
        address = req.body.address == "" ? null : req.body.address;
        phone = req.body.phone == "" ? null : req.body.phone;
        identification = req.body.identification == "" ? null : req.body.identification;
        status = req.body.status;

        let customer = {
            id: id,
            name: name,
            gender: gender,
            email: email,
            address: address,
            phone: phone,
            identification: identification,
            status: status
        }
        const rs = await customerService.updateCustomer(customer);
        if (rs.status) {
            const message = "đã cập nhật thông tin khách hàng có mã " + id;
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const deleteCustomer = async (req, res) => {
    try {
        const id = req.body.id;
        const count_bed = await bedService.countCustomerBed(id);
        const count_invoice = await invoiceService.countCustomerInvoice(id);
        if (count_bed.status && count_invoice.status && count_bed.result > 0 && count_invoice.result > 0) {
            const rs = await customerService.deleteCustomer(id);
            if (rs.status) {
                const message = "đã xoá khách hàng có mã " + id;
                await base_controller.saveLog(req, res, message);
                return res.status(200).json({ result: rs.result });
            } else {
                return res.status(500).json({ error_code: rs.msg });
            }
        } else {
            return res.status(500).json({ error_code: "Không thể xoá khách hàng đã thao tác trong hệ thống." });
        }

    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

module.exports = {
    getAllCustomer, insertCustomer, updateCustomer, deleteCustomer
}