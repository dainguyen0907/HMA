import { validationResult } from "express-validator";
import priceService from "../service/price_service";

const getPriceByBedType = async (req, res) => {
    try {
        const id = req.query.id;
        const rs =await priceService.getPriceByIdBedType(id);
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: error })
    }
}


const insertPrice = async (req, res) => {
    let id_bed, name, hour, day, week, month;
    try {
        id_bed = req.body.id_bed;
        name = req.body.name;
        hour = req.body.hour;
        day = req.body.day;
        week = req.body.week;
        month = req.body.month;
    } catch (error) {
        return res.status(500).json({ error_code: error })
    }
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg })
    }
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
}

const updatePrice = async (req, res) => {
    let id, name, hour, day, week, month;
    try {
        id = req.body.id;
        name = req.body.name==""?null:req.body.name;
        hour = req.body.hour?null:req.body.hour;
        day = req.body.day?null:req.body.day;
        week = req.body.week?null:req.body.week;
        month = req.body.month?null:req.body.month;
    } catch (error) {
        return res.status(500).json({ error_code: error })
    }
    const price = {
        id: id,
        name: name,
        price_hour: hour,
        price_day: day,
        price_week: week,
        price_month: month,
    }
    const newprice = await priceService.updatePrice(price);
    if (newprice.status) {
        return res.status(200).json({ result: newprice.result });
    } else {
        return res.status(500).json({ error_code: msg })
    }
}

const deletePrice = async (req, res) => {
    try {
        const id = req.body.id;
        const rs = await priceService.deletePrice(id);
        if (rs.status) {
            return res.status(200).json({ result: newprice.result });
        } else {
            return res.status(500).json({ error_code: msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: error })
    }
}


module.exports = {
    getPriceByBedType, insertPrice, updatePrice, deletePrice
}