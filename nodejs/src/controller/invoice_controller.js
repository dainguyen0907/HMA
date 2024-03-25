import { validationResult } from "express-validator";
import invoiceService from "../service/invoice_service";
import bedService from "../service/bed_service";
import base_controller from "../controller/base_controller"

const getAllInvoice = async (req, res) => {
    try {
        const rs = await invoiceService.getAllInvoice();
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const insertInvoice = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    let id_bed, id_payment, id_customer, receipt_date, payment_date, deposit, total_payment, note, detail;
    try {
        id_bed = req.body.id_bed,
            id_payment = req.body.id_payment,
            id_customer = req.body.id_customer,
            receipt_date = req.body.receipt_date,
            payment_date = req.body.payment_date,
            deposit = req.body.deposit,
            total_payment = req.body.total_payment,
            note = req.body.note,
            detail = req.body.detail
        const newInvoice = {
            id_payment: id_payment,
            id_customer: id_customer,
            receipt_date: receipt_date,
            payment_date: payment_date,
            deposit: deposit,
            total_payment: total_payment,
            note: note
        }
        const rs = await invoiceService.insertInvoice(newInvoice);
        if (rs.status) {
            const message = "đã khởi tạo hoá đơn mới có mã " + rs.result.id;
            await base_controller.saveLog(req, res, message);
            for (let i = 0; i < detail.length; i++) {
                const d = {
                    id_invoice: rs.result.id,
                    product_name: detail[i].label,
                    product_value: detail[i].quantity,
                    product_total_price: detail[i].value
                }
                const createInvoiceDetail = await invoiceService.createInvoiceDetail(d);
                if (!createInvoiceDetail.status) {
                    return res.status(500).json({ error_code: createInvoiceDetail.msg });
                }
            }
            for (let j = 0; j < id_bed.length; j++) {
                const updateBed = await bedService.updateBedStatus({ id: id_bed[j], bed_status: false, id_invoice: rs.result.id });
                if (!updateBed.status) {
                    return res.status(500).json({ error_code: updateBed.msg });
                }
            }
            return res.status(201).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const updateInvoice = async (req, res) => {
    let id_payment, id, receipt_date, payment_date, deposit, total_payment, note;
    try {
        id_payment = req.body.id_payment == "" ? null : req.body.id_payment,
            id = req.body.id,
            receipt_date = req.body.receipt_date == "" ? null : req.body.receipt_date,
            payment_date = req.body.payment_date == "" ? null : req.body.payment_date,
            deposit = req.body.deposit == "" ? null : req.body.deposit,
            total_payment = req.body.total_payment == "" ? null : req.body.total_payment,
            note = req.body.note == "" ? null : req.body.note;
        const newInvoice = {
            id_payment: id_payment,
            id: id,
            receipt_date: receipt_date,
            payment_date: payment_date,
            deposit: deposit,
            total_payment: total_payment,
            note: note
        }
        const rs = await invoiceService.updateInvoice(newInvoice);
        if (rs.status) {
            const message = "đã cập nhật thông tin hoá đơn có mã " + id;
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const deleteInvoice = async (req, res) => {
    try {
        const id = req.body.id;
        const deleteDetail = await invoiceService.deleteInvoiceDetail(id);
        const updateBed = await bedService.updateBedStatusByInvoice({ bed_status: true, id_invoice: id });
        if (deleteDetail.status && updateBed.status) {
            const message = "đã xoá hoá đơn có mã " + id;
            await base_controller.saveLog(req, res, message);
            const rs = await invoiceService.deleteInvoice(id);
            if (rs.status) {
                return res.status(200).json({ result: rs.result });
            } else {
                return res.status(500).json({ error_code: rs.msg });
            }
        }
        else {
            return res.status(500).json({ error_code: "Lỗi khi cập nhật hoá đơn" });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

module.exports = {
    getAllInvoice, insertInvoice, updateInvoice, deleteInvoice
}