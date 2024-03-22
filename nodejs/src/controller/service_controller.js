import { validationResult } from "express-validator";
import service_ from "../service/service_service";

const getAllService = async (req, res) => {
    try {
        const ser = await service_.getAllService();
        if (ser.status) {
            return res.status(200).json({ result: ser.result });
        } else {
            return res.status(500).json({ error_code: ser.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const deleteService = async (req, res) => {
    try {
        const id = req.body.id;
        const ser = await service_.deleteService(id);
        if (ser.status) {
            return res.status(200).json({ result: ser.result });
        } else {
            return res.status(500).json({ error_code: ser.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const insertService = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg })
    }
    let name, price;
    try {
        name = req.body.name;
        price = req.body.price;
        const service = { name: name, price: price };
        const rs = await service_.insertService(service);
        if (rs.status) {
            return res.status(201).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const updateService = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg })
    }
    let name, price, id;
    try {
        name = req.body.name;
        price = req.body.price;
        id = req.body.id;
        const service = { name: name, price: price, id: id };
        const rs = await service_.updateService(service);
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg })
        }
    } catch (error) {
        return res.status(500).json({error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu"})
    }
}

module.exports = {
    getAllService, deleteService, insertService, updateService
}