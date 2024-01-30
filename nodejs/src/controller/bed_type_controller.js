import { validationResult } from "express-validator";
import bedType_service from "../service/bedType_service";
import price_service from "../service/price_service";

const getAllBedType = async (req, res) => {
    const bedtype = await bedType_service.getAllBedType();
    if (bedtype) {
        return res.status(200).json({ result: bedtype.result });
    } else {
        return res.status(500).json({ error_code: bedtype.msg });
    }
}

const insertBedType = async (req, res) => {
    const validate=validationResult(req);
    if(!validate.isEmpty()){
        return res.status(400).json({error_code:validate.errors[0].msg});
    }
    let name, price_day, price_hour, price_month, price_week;
    try {
        name = req.body.name;
        price_day = isNaN(parseInt(req.body.price_day)) ? 0 : parseInt(req.body.price_day);
        price_week = isNaN(parseInt(req.body.price_week)) ? 0 : parseInt(req.body.price_week);
        price_hour = isNaN(parseInt(req.body.price_hour)) ? 0 : parseInt(req.body.price_hour);
        price_month = isNaN(parseInt(req.body.price_month)) ? 0 : parseInt(req.body.price_month);
    } catch (error) {
        return res.status(500).json({ error_code: error });
    }
    const rs = await bedType_service.insertBedType(name);
    if (rs.status) {
        const price = {
            id_bed_type: rs.result.id,
            name: "Giá mặc định " + rs.result.bed_type_name,
            price_hour: price_hour,
            price_day: price_day,
            price_week: price_week,
            price_month: price_month
        }
        const np=await price_service.insertPrice(price);
        if(np.status){
           await bedType_service.updateBedType({name:rs.result.bed_type_name,default:np.result.id, id:rs.result.id});
        }
        return res.status(201).json({ result: rs.result });
    } else {
        return res.status(500).json({ error_code: rs.msg });
    }
}

const deleteBedType = async (req, res) => {
    try {
        const id = req.body.id;
        const rs = await bedType_service.deleteBedType(id);
        if (rs.status) {
            await price_service.deletePriceByIdBedType(id);
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: error })
    }
}

const updateBedType = async (req, res) => {
    const validate=validationResult(req);
    if(!validate.isEmpty()){
        return res.status(400).json({error_code:validate.errors[0].msg});
    }
    let name, id, default_price;
    try {
        name = req.body.name;
        default_price=req.body.default_price;
        id = req.body.id;
    } catch (error) {
        return res.status(500).json({ error_code: error });
    }
    const bedtype = { id: id, name: name ,default:default_price};
    const rs = await bedType_service.updateBedType(bedtype);
    if (rs.status) {
        return res.status(200).json({ result: rs.result });
    } else {
        return res.status(500).json({ error_code: rs.msg });
    }
}

module.exports = { getAllBedType, insertBedType, updateBedType, deleteBedType }