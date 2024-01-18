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
            price_name: "Giá mặc định " + rs.result.bed_type_name,
            price_hour: price_hour,
            price_day: price_day,
            price_week: price_week,
            price_month: price_month
        }
        await price_service.insertPrice(price);
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
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: error })
    }
}

const updateBedType = async (req, res) => {
    let name, id;
    try {
        name = req.body.name==""?null:req.body.name;
        id = req.do.id;
    } catch (error) {
        return res.status(500).json({ error_code: error });
    }
    const bedtype = { id: id, name: id };
    const rs = await bedType_service.updateBedType(bedtype);
    if (rs.status) {
        return res.status(200).json({ result: rs.result });
    } else {
        return res.status(500).json({ error_code: rs.msg });
    }
}

module.exports = { getAllBedType, insertBedType, updateBedType, deleteBedType }