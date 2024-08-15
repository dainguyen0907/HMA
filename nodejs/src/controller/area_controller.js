import { validationResult } from "express-validator";
import area_service from "../service/area_service";
import room_service from "../service/room_service";
import floor_service from "../service/floor_service";
import base_controller from "../controller/base_controller"

const insertNewArea = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    let area_name = "";
    let area_floor = 0;
    let area_room = 0;
    try {
        area_name = req.body.area_name;
        area_floor = parseInt(req.body.area_floor);
        area_room = parseInt(req.body.area_room);

        const newarea = {
            area_name: area_name,
            area_floor: area_floor,
            area_room: area_room
        }
        const result = await area_service.insertArea(newarea);
        if (result && result.status) {
            const floor = result.result.area_floor_quantity;
            const ave_room = result.result.area_room_quantity / floor;
            for (let i = 1; i <= floor; i++) {
                const floor = {
                    id_area: result.result.id,
                    floor_name: "Tầng " + i + " " + result.result.area_name
                }
                const new_floor = await area_service.insertFloor(floor);
                if (new_floor && new_floor.status) {
                    for (let r = 1; r <= ave_room; r++) {
                        const room = {
                            id_floor: new_floor.result.id,
                            name: "Phòng " + (i * 100 + r),
                            bed_quantity: 4,
                            status: true
                        }
                        const nroom = await room_service.insertRoom(room);
                        if (!nroom.status) {
                            return res.status(500).json({ error_code: nroom.msg })
                        }
                    }
                } else {
                    return res.status(500).json({ error_code: new_floor.msg })
                }
            }
            const message = "đã khởi tạo khu vực " + result.result.area_name + " có mã là " + result.result.id;
            await base_controller.saveLog(req, res, message)
            return res.status(201).json({ result: result.result });
        } else {
            return res.status(500).json({ error_code: result.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const getAllArea = async (req, res) => {
    try {
        const areas = await area_service.getAllArea();
        if (areas.status) {
            return res.status(200).json({ result: areas.result });
        } else {
            return res.status(500).json({ error_code: areas.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }

}

const updateArea = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    try {
        let id_area = req.body.id_area;
        let area_name = "";
        let area_floor = 0;
        let area_room = 0;
        area_name = req.body.area_name;
        area_floor = parseInt(req.body.area_floor);
        area_room = parseInt(req.body.area_room);
        const result = await area_service.updateArea(id_area, area_name, area_floor, area_room);
        if (result.status) {
            const message = "đã cập nhật thông tin khu vực có mã là " + id_area;
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: result.result })
        } else {
            return res.status(500).json({ error_code: result.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const deleteArea = async (req, res) => {
    try {
        const id = parseInt(req.body.id_area);
        const checkFloor = await floor_service.getAllFloorByIDArea(id);
        if (checkFloor.status) {
            if (checkFloor.result.length > 0) {
                return res.status(400).json({ error_code: 'Không thể xoá khu vực này' })
            } else {
                const result = await area_service.deleteAreaID(id);
                if (result.status) {
                    const message = "đã xoá khu vực có mã là " + id;
                    await base_controller.saveLog(req, res, message);
                    return res.status(200).json({ result: result.result });
                } else {
                    return res.status(500).json({ result: result.msg });
                }
            }
        } else {
            return res.status(500).json({ error_code: checkFloor.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

module.exports = { 
    insertNewArea,
    updateArea, 
    deleteArea, 
    getAllArea,  
}