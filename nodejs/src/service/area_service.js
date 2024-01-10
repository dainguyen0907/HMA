import db from "../models/index";
import { saveHistory } from "./base_service";

const Area = db.Area;
const Floor = db.Floor;

const insertArea = async (newarea,user_id) => {
    try {
        const area = await Area.create({
            area_name: newarea.area_name,
            area_floor_quantity: newarea.area_floor,
            area_room_quantity: newarea.area_room
        })
        saveHistory("Người dùng có mã "+user_id+" đã thêm một khu vực mới có mã "+area.id)
        return { status: true, result: area }
    } catch (error) {
        return { status: false, msg: "Lỗi tạo mới khu vực" }
    }
}
const insertFloor = async (floor,user_id) => {
    try {
        const newfloor = await Floor.create({
            id_area: floor.id_area,
            floor_name: floor.floor_name
        })
        saveHistory("Người dùng có mã "+user_id+" đã thêm một tầng mới có mã "+newfloor.id)
        return { status: true, result: newfloor }
    } catch (error) {
        return { status: false, msg: "Lỗi tạo tầng mới" }
    }
}

const getAllArea = async () => {
    try {
        const area = await Area.findAll({
            raw: true,
            nest: true
        });
        return { status: true, result: area };
    } catch (error) {
        return { status: false, msg: "Lỗi truy vấn khu vực" }
    }
}

const updateArea = async (id_area, area_name, area_floor, area_room,user_id) => {
    try {
        await Area.update({
            area_name: area_name,
            area_floor_quantity: area_floor,
            area_room_quantity: area_room,
        }, {
            where: {
                id: id_area,
            }
        })
        saveHistory("Người dùng có mã "+user_id+" đã cập nhật thông tin khu vực có mã "+id_area)
        return { status: true, result: "Cập nhật thành công" }
    } catch (error) {
        return { status: false, msg: "Lỗi cập nhật tầng mới" }
    }
}

const deleteAreaID =async (id_area,user_id)=>{
    try{
        await Area.destroy({where:{id:id_area}});
        await Floor.destroy({where:{id_area:id_area}});
        saveHistory("Người dùng có mã "+user_id+" đã xoá khu vực có mã "+id_area)
        return {status:true, result:"Xoá thành công"}
    }catch(error){
        return {status:false,msg:"Lỗi xoá khu vực"}
    }
}

module.exports = { insertArea, insertFloor, 
    getAllArea, updateArea, deleteAreaID }
