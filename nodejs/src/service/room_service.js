import db from "../models/index";

const Room = db.Room;

const insertRoom = async (room) => {
    try {
        const newroom = await Room.create({
            id_floor: room.id_floor,
            room_name: room.room_name,
            room_bed_quantity:room.room_bed_quantity,
            room_status: room.room_status
        })
        return { status: true, room:newroom }
    } catch (error) {
        console.log(error)
        return { status: false, msg: "Lỗi tạo phòng mới" }
    }
}

module.exports = { insertRoom }
