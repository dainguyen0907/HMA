import room_service from "../service/room_service";

const insertNewRoom=async(req,res)=>{
    let room_name="";
    let floor_id=0;
    let room_bed_quantity=0;
    const userID=getUserId(req,res);
    try {
        room_name = req.body.room_name;
        floor_id = parseInt(req.body.room_id);
        room_bed_quantity = parseInt(req.body.room_bed_quantity);
    } catch (err) {
        return res.status(400).json({error_code:"Thông tin khởi tạo không hợp lệ"});
    }
    if(room_name==""||isNaN(floor_id)||isNaN(room_bed_quantity)){
        return res.status(400).json({error_code:"Thông tin khởi tạo rỗng"});
    }
    const newroom={ 
        id_floor:id_floor,
        room_name: room_name,
        room_bed_quantity:room_bed_quantity,
        room_status:false}
    const room=await room_service.insertRoom(newroom,userID);
    if(room.status){
        return res.status(201).json({result:room.result});
    }else{
        return res.status(500).json({ error_code: room.msg})
    }
}



module.exports={insertNewRoom}