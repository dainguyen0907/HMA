import { validationResult } from "express-validator";
import priceService from "../service/price_service";
import bedTypeService from "../service/bedType_service";

const getPriceByBedType = async (req, res) => {
    try {
        const id = req.query.id;
        const rs = await priceService.getPriceByIdBedType(id);
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const getPriceByID = async (req, res) => {
    try {
        const id = req.query.id;
        const rs = await priceService.getPriceById(id);
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}


const insertPrice = async (req, res) => {
    let id_bed, name, hour, day, week, month;
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg })
    }
    try {
        id_bed = req.body.id_bed;
        name = req.body.name;
        hour = req.body.hour;
        day = req.body.day;
        week = req.body.week;
        month = req.body.month;
        const price = {
            id_bed_type: id_bed,
            name: name,
            price_hour: hour,
            price_day: day,
            price_week: week,
            price_month: month,
        }
        const newprice = await priceService.insertPrice(price);
        if (newprice.status) {
            return res.status(201).json({ result: newprice.result });
        } else {
            return res.status(500).json({ error_code: msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const updatePrice = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg })
    }
    let id, name, hour, day, week, month;
    try {
        id = req.body.id;
        name = req.body.name;
        hour = req.body.hour;
        day = req.body.day;
        week = req.body.week;
        month = req.body.month;
        const price = {
            id: id,
            name: name,
            price_hour: hour,
            price_day: day,
            price_week: week,
            price_month: month,
        }
        console.log(price);
        const newprice = await priceService.updatePrice(price);
        if (newprice.status) {
            return res.status(200).json({ result: newprice.result });
        } else {
            return res.status(500).json({ error_code: msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const deletePrice = async (req, res) => {
    try {
        const id = req.body.id;
        const bedtype = await bedTypeService.findBedTypeByDefaultPrice(id);
        if (bedtype) {
            return res.status(400).json({ error_code: "Không thể xoá đơn giá mặc định" });
        } else {
            const rs = await priceService.deletePrice(id);
            if (rs.status) {
                return res.status(200).json({ result: rs.result });
            } else {
                return res.status(500).json({ error_code: rs.msg })
            }
        }

    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}


module.exports = {
    getPriceByBedType, insertPrice, updatePrice, deletePrice, getPriceByID
}