import room_service from "../service/room_service";

const insertNewRoom=async(req,res)=>{
    let room_name="";
    let floor_id=0;
    let room_bed_quantity=0;
    try {
        room_name = req.body.room_name;
        floor_id = parseInt(req.body.room_id);
        room_bed_quantity = parseInt(req.body.room_bed_quantity);
    } catch (err) {
        return res.status(400).json("Thông tin khởi tạo không hợp lệ");
    }
    if(room_name==""){
        return res.status(400).json("Thông tin khởi tạo rỗng");
    }
}

module.exports={}