import { validationResult } from "express-validator";
import serviceDetail from "../service/service_detail_service";

const getServiceDetailByIDBed = async (req, res) => {
    try {
        const id = req.query.id;
        const rs = await serviceDetail.getServiceDetailByIDBed(id);
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const insertServiceDetail = async (req, res) => {
    let id_bed, id_service, quantity, price;
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    try {
        id_bed = req.body.id_bed;
        id_service = req.body.id_service;
        quantity = req.body.quantity;
        price = req.body.price;
        const sDetail = {
            id_bed: id_bed,
            id_service: id_service,
            quantity: quantity,
            price: price,
        }
        const rs = await serviceDetail.insertServiceDetail(sDetail);
        if (rs.status) {
            return res.status(201).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const updateServiceDetail = async (req, res) => {
    let id_bed, id_service, quantity, price;
    try {
        id_bed = req.body.id_bed;
        id_service = req.body.id_service;
        quantity = req.body.quantity == "" || isNaN(req.body.quantity) ? null : req.body.quantity;
        price = req.body.price == "" || isNaN(req.body.price) ? null : req.body.price;
        const sDetail = {
            id_bed: id_bed,
            id_service: id_service,
            quantity: quantity,
            price: price,
        }
        const rs = await serviceDetail.updateServiceDetail(sDetail);
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const deleteServiceDetail = async (req, res) => {
    try {
        const id = req.body.id;
        const rs = await serviceDetail.deleteServiceDetail(id);
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}



module.exports = {
    getServiceDetailByIDBed, insertServiceDetail, updateServiceDetail, deleteServiceDetail
}