import db from "../models/index";

const Area = db.Area;
const Floor = db.Floor;

const insertArea = async (newarea) => {
    try {
        const area = await Area.create({
            area_name: newarea.area_name,
            area_floor_quantity: newarea.area_floor,
            area_room_quantity: newarea.area_room
        })
        return { status: true, area: area }
    } catch (error) {
        return { status: false, msg: "Lỗi tạo mới khu vực" }
    }
}
const insertFloor = async (floor) => {
    try {
        const newfloor = await Floor.create({
            id_area: floor.id_area,
            floor_name: floor.floor_name
        })
        return { status: true, floor: newfloor }
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
        return {status:true,result:area};
    } catch (error) {
        return {status:false,msg:"Lỗi truy vấn khu vực"}
    }
}

module.exports = { insertArea, insertFloor, getAllArea }
