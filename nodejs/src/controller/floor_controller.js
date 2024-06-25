import { validationResult } from "express-validator";
import floorService from "../service/floor_service";
import roomService from "../service/room_service";
import areaService from "../service/area_service";
import base_controller from "../controller/base_controller"

const updateFloor = async (req, res) => {
    try {
        const validate = validationResult(req);
        if (!validate.isEmpty()) {
            return res.status(400).json({ error_code: validate.errors[0].msg });
        }
        const id = req.body.id;
        const name = req.body.name.slice(0,50);
        const newfloor = {
            name: name,
            id: id
        }
        const rs = await floorService.updateFloor(newfloor);
        if (rs.status) {
            const message = "đã cập nhật thông tin tầng có mã " + id;
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const deleteFloor = async (req, res) => {
    try {
        const id = req.body.id;
        const floor = await floorService.getFloorByID(id);
        if (floor == null) {
            return res.status(400).json({ error_code: 'Không tồn tại dữ liệu này' });
        }
        const dataSearch = await roomService.getRoomByFloorID(id);
        if (dataSearch.status) {
            if (dataSearch.result.length > 0) {
                return res.status(400).json({ error_code: "Không thể xoá tầng đã có phòng" });
            } else {
                const rs = await floorService.deleteFloor(id);
                if (rs.status) {
                    const changeFloor = await areaService.changeFloorInArea(floor.id_area, false, 1);
                    if(!changeFloor.status){
                        return res.status(500).json({ error_code: changeFloor.msg });
                    }
                    const message = "đã xoá tầng có mã " + id;
                    await base_controller.saveLog(req, res, message);
                    return res.status(200).json({ result: rs.result });
                } else {
                    
                }
            }
        } else {
            return res.status(500).json({ error_code: dataSearch.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const getAllFloorByIdArea = async (req, res) => {
    try {
        const id = req.query.id;
        const rs = await floorService.getAllFloorByIDArea(id);
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

module.exports = { 
    updateFloor, 
    deleteFloor, 
    getAllFloorByIdArea }