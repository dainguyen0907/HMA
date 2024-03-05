import { validationResult } from "express-validator";
import bed_service from "../service/bed_service";

const countBedInUsedByRoomID = async (req, res) => {
    try {
        const id = req.query.id;
        const count = await bed_service.countBedInUsedByRoomID(id);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: error });
    }
}

const getBedInRoom=async(req,res)=>{
    try {
        const id = req.query.id;
        const count = await bed_service.getBedInRoom(id);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: error });
    }
}

const insertBed = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    let newBed;
    try {
        newBed = {
            id_room: req.body.id_room,
            id_bed_type: req.body.id_bed_type,
            id_customer: req.body.id_customer,
            bed_checkin: req.body.bed_checkin,
            bed_checkout: req.body.bed_checkout,
            bed_deposit: req.body.bed_deposit
        }
    } catch (error) {
        return res.status(500).json({ error_code: error });
    }
    const rs = await bed_service.insertBed(newBed)
    if (rs.status) {
        return res.status(200).json({ error_code: rs.result });
    } else {
        return res.status(500).json({ error_code: rs.msg });
    }
}

const insertBeds = async (req, res) => {
    const arrayBed = req.body.array_bed;
    const id_room = req.body.id_room;
    try {
        arrayBed.forEach(async (element) => {
            let newBed = {
                id_room: id_room,
                id_bed_type: element.id_bed_type,
                id_customer: element.id,
                bed_checkin: element.bed_checkin,
                bed_checkout: element.bed_checkout,
                bed_deposit: element.bed_deposit==""?0:element.bed_deposit,
            }
            const rs = await bed_service.insertBed(newBed);
            if (!rs.status) {
                return res.status(500).json({ error_code: rs.msg });
            }
        });
        return res.status(200).json({result:"Thêm thành công"});
    } catch (error) {
        return res.status(500).json({ error_code: error });
    }
}

module.exports = {
    countBedInUsedByRoomID, insertBed, insertBeds, getBedInRoom
}