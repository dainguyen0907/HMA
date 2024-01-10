import db from "../models/index";
import {saveHistory} from "./base_service";

const Room = db.Room;

const insertRoom = async (room, user_id) => {
    try {
        const newroom = await Room.create({
            id_floor: room.id_floor,
            room_name: room.room_name,
            room_bed_quantity:room.room_bed_quantity,
            room_status: room.room_status
        })
        saveHistory("Người dùng có mã "+user_id+" đã thêm một phòng mới có mã "+newroom.id)
        return { status: true, result:newroom }
    } catch (error) {
        return { status: false, msg: "Lỗi tạo phòng mới" }
    }
}

const updateRoom = async (id_room,room_name,room_bed_quantity,room_status,user_id) => {
    try {
        const newroom = await Room.update({
            room_name: room_name,
            room_bed_quantity:room_bed_quantity,
            room_status: room_status
        },{
            where:{
                id:id_room,
            }
        })
        saveHistory("Người dùng có mã "+user_id+" đã cập nhật thông tin phòng có mã "+newroom.id)
        return { status: true, result:newroom }
    } catch (error) {
        return { status: false, msg: "Lỗi tạo phòng mới" }
    }
}

const deleteRoomByID=async (id_room,user_id)=>{
    try{
        await Room.destroy({
            where:{
                id:id_room
            }
        })
        saveHistory("Người dùng có mã "+user_id+" đã xoá phòng có mã "+id_room)
    }catch(error){
        return {status:false,msg:"Lỗi xoá phòng"}
    }
}

module.exports = { insertRoom ,updateRoom, deleteRoomByID }
