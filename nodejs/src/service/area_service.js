import db from "../models/index";

const Area = db.Area;

const insertArea = (newarea) => {
    Area.create({
        area_name: newarea.area_name,
        area_floor_quantity: newarea.area_floor,
        area_room_quantity: newarea.area_room
    }).then(function(item){
        return {status:true,area:item}
    }).catch(function(error){
        return {status:false,msg:"Lỗi khởi tạo khu vực"}
    })
}

module.exports = { insertArea }
