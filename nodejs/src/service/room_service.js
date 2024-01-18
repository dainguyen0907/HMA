import db from "../models/index";


const Room = db.Room;
const Floor=db.Floor;
Floor.hasMany(Room);
Room.belongsTo(Floor,{foreignKey:'id_floor'});


const insertRoom = async (room) => {
    try {
        const newroom = await Room.create({
            id_floor: room.id_floor,
            room_name: room.name,
            room_bed_quantity:room.bed_quantity,
            room_status: room.status
        })
        return { status: true, result:newroom }
    } catch (error) {
        return { status: false, msg: error }
    }
}

const updateRoom = async (room) => {
    try {
         await Room.update({
            room_name: room.name,
            room_bed_quantity:room.bed_quantity,
            room_status: room.status
        },{
            where:{
                id:room.id,
            }
        })
        return { status: true, result:"Cập nhật thành công" }
    } catch (error) {
        return { status: false, msg: error }
    }
}

const deleteRoom=async (id_room)=>{
    try{
        await Room.destroy({
            where:{
                id:id_room
            }
        })
        return {status:true,result:"Xoá thành công"}
    }catch(error){
        return {status:false,msg:error}
    }
}

const getRoomByAreaID=async(id)=>{
    try{
        const result=await Room.findAll({
            include:[{
                model:Floor,
                where:{
                    id_area:id
                }
            }],
            raw:true,
            nest:true
        });
        return{ status:true,result:result};
    }catch(error){
        return {status:false,msg:error}
    }
}

module.exports = { insertRoom ,updateRoom, deleteRoom, getRoomByAreaID }
