import area_service from "../service/area_service";
import room_service from "../service/room_service";

const insertNewArea = async (req, res) => {
    let area_name = "";
    let area_floor = 0;
    let area_room = 0;
    try {
        area_name = req.body.area_name;
        area_floor = parseInt(req.body.area_floor);
        area_room = parseInt(req.body.area_room);
    } catch (err) {
        return res.status(400).json("Thông tin khởi tạo không hợp lệ");
    }
    if (area_name == "" || area_floor == "" || area_room == "") {
        return res.status(400).json("Thông tin khởi tạo rỗng");
    }
    if (area_room % area_floor > 0) {
        return res.status(400).json("Số phòng phải chia hết cho số tầng");
    }
    const newarea = {
        area_name: area_name,
        area_floor: area_floor,
        area_room: area_room
    }
    const result = await area_service.insertArea(newarea);
    if (result && result.status) {
        const floor = result.area.area_floor_quantity;
        const ave_room = result.area.area_room_quantity / floor;
        for (let i = 1; i <= floor; i++) {
            const floor = {
                id_area: result.area.id,
                floor_name: "Tầng " + i + " " +result.area.area_name
            }
            const new_floor=await area_service.insertFloor(floor);
            if(new_floor&&new_floor.status)
            {
                for(let r=1;r<= ave_room;r++)
                {
                    const room={
                        id_floor:new_floor.floor.id,
                        room_name: "Phòng "+(i*100+r),
                        room_bed_quantity:0,
                        room_status:false
                    }
                    const newroom=await room_service.insertRoom(room);
                }
            }
        }
        return res.status(201).json({ newarea: result.area });
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

module.exports = { insertNewArea, getAllArea }