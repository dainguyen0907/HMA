import { check, validationResult } from "express-validator";
import bed_service from "../service/bed_service";
import room_service from "../service/room_service";

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
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const getBedInRoom = async (req, res) => {
    try {
        const id = req.query.id;
        const count = await bed_service.getBedInRoom(id);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const getBedByID = async (req, res) => {
    try {
        const id = req.query.id;
        const count = await bed_service.getBedByID(id);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const getBedInInvoice = async (req, res) => {
    try {
        const id = req.query.id;
        const count = await bed_service.getBedInInvoice(id);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
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
        const rs = await bed_service.insertBed(newBed)
        if (rs.status) {
            return res.status(200).json({ error_code: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const updateBed = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    let newBed;
    try {
        newBed = {
            id: req.body.id,
            id_bed_type: req.body.id_bed_type,
            bed_checkin: req.body.bed_checkin,
            bed_checkout: req.body.bed_checkout,
            bed_deposit: req.body.bed_deposit === "" ? 0 : req.body.bed_deposit
        }
        const rs = await bed_service.updateBed(newBed)
        if (rs.status) {
            return res.status(200).json({ error_code: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
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
                bed_deposit: element.bed_deposit == "" ? 0 : element.bed_deposit,
            }
            const rs = await bed_service.insertBed(newBed);
            if (!rs.status) {
                return res.status(500).json({ error_code: rs.msg });
            }
        });
        return res.status(200).json({ result: "Thêm thành công" });
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const changeRoom = async (req, res) => {
    try {
        const id_bed = req.body.id_bed;
        const id_room = req.body.id_room;
        const checkRoom = await room_service.checkRoomStatus(id_room);
        if (checkRoom) {
            const result = await bed_service.changeRoom({ id_bed, id_room });
            if (result.status) {
                return res.status(200).json({ result: result.result })
            } else {
                return res.status(500).json({ error_code: result.msg });
            }
        } else {
            return res.status(400).json({ error_code: "Không thể chuyển vào phòng đang sữa chữa." });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}


module.exports = {
    countBedInUsedByRoomID, insertBed, insertBeds, getBedInRoom, updateBed,
    changeRoom, getBedByID, getBedInInvoice
}