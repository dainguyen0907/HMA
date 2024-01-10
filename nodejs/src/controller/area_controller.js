import area_service from "../service/area_service";
import room_service from "../service/room_service";
import { getUserId } from "./base_controller";

const insertNewArea = async (req, res) => {
    let area_name = "";
    let area_floor = 0;
    let area_room = 0;
    const userID=getUserId(req,res);
    try {
        area_name = req.body.area_name;
        area_floor = parseInt(req.body.area_floor);
        area_room = parseInt(req.body.area_room);
    } catch (err) {
        return res.status(400).json({error_code:"Thông tin khởi tạo không hợp lệ"});
    }
    if (area_name == "" || isNaN(area_floor) || isNaN(area_room))  {
        return res.status(400).json({error_code:"Thông tin khởi tạo rỗng"});
    }
    if (area_room % area_floor > 0) {
        return res.status(400).json({error_code:"Số phòng phải chia hết cho số tầng"});
    }
    const newarea = {
        area_name: area_name,
        area_floor: area_floor,
        area_room: area_room
    }
    const result = await area_service.insertArea(newarea,userID);
    if (result && result.status) {
        const floor = result.result.area_floor_quantity;
        const ave_room = result.result.area_room_quantity / floor;
        for (let i = 1; i <= floor; i++) {
            const floor = {
                id_area: result.result.id,
                floor_name: "Tầng " + i + " " +result.result.area_name
            }
            const new_floor=await area_service.insertFloor(floor,userID);
            if(new_floor&&new_floor.status)
            {
                for(let r=1;r<= ave_room;r++)
                {
                    const room={
                        id_floor:new_floor.result.id,
                        room_name: "Phòng "+(i*100+r),
                        room_bed_quantity:0,
                        room_status:false
                    }
                    const newroom=await room_service.insertRoom(room,userID);
                }
            }
        }
        return res.status(201).json({ result: result.result });
    } else {
        return res.status(500).json({ error_code: result.msg })
    }
}

const getAllArea = async (req,res)=>{
    const areas=await area_service.getAllArea();
    if(areas.status){
        return res.status(200).json(areas.result);
    }else{
        return res.status(500).json(areas.msg);
    }
}

const updateArea=async(req,res)=>{
    let id_area=0;
    let area_name = null;
    let area_room = null;
    const userID=getUserId(req,res);
    try {
        id_area=req.body.id_area;
        area_name = req.body.area_name==""?null:req.body.area_name;
        area_room = parseInt(req.body.area_room)==NaN?null:parseInt(req.body.area_room);
    } catch (err) {
        return res.status(400).json({error_code:"Thông tin cập nhật không hợp lệ"});
    }
    console.log(id_area+","+area_name+area_room+userID)
    const result=await area_service.updateArea(id_area,area_name,null,area_room,userID);
    if(result.status){
        return res.status(200).json({result:result.result})
    }
}

const deleteArea=async(req,res)=>{
    const id=parseInt(req.body.id_area);
    const userID=getUserId(req,res);
    if(isNaN(id)){
        return res.status(400).json({error_code:"Thông tin cập nhật không hợp lệ"});
    }
    const result=await area_service.deleteAreaID(id,userID);
    if(result.status){
        return res.status(200).json(result.result);
    }else{
        return res.status(500).json(result.msg);
    }
}

module.exports = { insertNewArea, getAllArea, updateArea, deleteArea }