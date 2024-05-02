import db from "../models/index";


const Room = db.Room;
const Floor=db.Floor;
const Bed=db.Bed;

Room.belongsTo(Floor,{foreignKey:'id_floor'});
Room.hasMany(Bed,{foreignKey:'id_room'});

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
        return { status: false, msg: "DB: Lỗi khi khởi tạo dữ liệu" }
    }
}

const updateRoom = async (room) => {
    try {
         await Room.update({
            room_name: room.name,
            room_bed_quantity:room.bed_quantity,
            room_status:room.status,
            room_note:room.note
        },{
            where:{
                id:room.id,
            }
        })
        return { status: true, result:"Cập nhật thành công" }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi cập nhật dữ liệu" }
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
        return {status:false,msg: "DB: Lỗi khi xoá dữ liệu"}
    }
}

const getAllRoom=async()=>{
    try{
        const result=await Room.findAll({
            order:[
                ['id','ASC']
            ]
        });
        return {status: true, result: result};
    }catch(error){
        return {status:false, msg:"DB: Lỗi khi truy vấn dữ liệu Phòng"}
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
            order:[
                ['id','ASC']
            ],
        });
        return{ status:true,result:result};
    }catch(error){
        return {status:false,msg: "DB: Lỗi khi truy vấn dữ liệu Phòng"}
    }
}

const getAvaiableRoomByAreaID=async(id)=>{
    try{
        const result=await Room.findAll({
            include:[{
                model:Floor,
                where:{
                    id_area:id
                }
            }],
            where:{
                room_status:true
            },
            order:[
                ['id','ASC']
            ],
        });
        return{ status:true,result:result};
    }catch(error){
        return {status:false,msg: "DB: Lỗi khi truy vấn dữ liệu"}
    }
}

const getRoomByFloorID=async(id)=>{
    try{
        const result=await Room.findAll({
            where:{
                id_floor:id
            },
            order:[
                ['id','ASC']
            ],
            raw:true,
            nest:true
        });
        return{ status:true,result:result};
    }catch(error){
        return {status:false,msg: "DB: Lỗi khi truy vấn dữ liệu"}
    }
}

const getRoomByID=async(id_room)=>{
    return await Room.findOne({
        where:{id:id_room},
        include:[Floor],
    })
}

const checkRoomStatus=async(id_room)=>{
    const room =await getRoomByID(id_room);
    return room.room_status;
}

const getRoomInUsed=async(id_area)=>{
    try{
        const result=await Room.findAll({
            include:[{
                    model:Bed,
                    where:{
                        bed_status:true
                    }
                },{
                    model:Floor,
                    where:{
                        id_area:id_area
                    }
                }
            ],
            order:[
                ['id','ASC']
            ],
        });
        return{ status:true,result:result};
    }catch(error){
        return {status:false,msg: "DB: Lỗi khi truy vấn dữ liệu"}
    }
}



module.exports = { insertRoom ,updateRoom, deleteRoom, getRoomByAreaID, getAllRoom,
     getRoomByFloorID, getRoomByID, checkRoomStatus, getRoomInUsed, getAvaiableRoomByAreaID}
