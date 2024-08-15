import { validationResult } from "express-validator";
import priceService from "../service/price_service";
import bedTypeService from "../service/bedType_service";
import bedService from "../service/bed_service";
import base_controller from "../controller/base_controller"

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
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
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
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
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
        name = req.body.name?.slice(0,50);
        hour = isNaN(parseInt(req.body.hour)) ? 0 : parseInt(req.body.hour);;
        day = isNaN(parseInt(req.body.day)) ? 0 : parseInt(req.body.day);
        week = 0;
        month = 0;
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
            const message = "đã khởi tạo đơn giá mới có mã " + newprice.result.id;
            await base_controller.saveLog(req, res, message);
            return res.status(201).json({ result: newprice.result });
        } else {
            return res.status(500).json({ error_code: newprice.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
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
        name = req.body.name?.slice(0,50);
        hour = isNaN(parseInt(req.body.hour)) ? 0 : parseInt(req.body.hour);;
        day = isNaN(parseInt(req.body.day)) ? 0 : parseInt(req.body.day);
        week = 0;
        month = 0;
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
            const message = "đã cập nhật đơn giá có mã " + id;
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: newprice.result });
        } else {
            return res.status(500).json({ error_code: newprice.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const deletePrice = async (req, res) => {
    try {
        const id = req.body.id;
        const bedtype = await bedTypeService.findBedTypeByDefaultPrice(id);
        const bed=await bedService.getBedByIDPrice(id);
        if (bedtype.status&&bedtype.result) {
            return res.status(400).json({ error_code: "Không thể xoá đơn giá mặc định" });
        }else if(bed.result&&bed.result.length>0){
            return res.status(400).json({ error_code: "Không thể xoá đơn giá đã áp dụng" });
        } else {
            const rs = await priceService.deletePrice(id);
            if (rs.status) {
                const message = "đã xoá đơn giá mới có mã " + id;
                await base_controller.saveLog(req, res, message);
                return res.status(200).json({ result: rs.result });
            } else {
                return res.status(500).json({ error_code: rs.msg })
            }
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}


module.exports = {
    getPriceByBedType, getPriceByID,
    insertPrice, 
    updatePrice, 
    deletePrice, 
}