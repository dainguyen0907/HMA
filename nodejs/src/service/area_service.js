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
        return { status: true, result: area }
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
        return { status: true, result: newfloor }
    } catch (error) {
        return { status: false, msg: "Lỗi tạo tầng mới" }
    }
}

const getAllArea = async () => {
    try {
        const area = await Area.findAll({
            raw: true,
            nest: true,
            order:[
                ['id','ASC']
            ],
        });
        return { status: true, result: area };
    } catch (error) {
        return { status: false, msg: "Lỗi truy vấn khu vực" }
    }
}

const updateArea = async (id_area, area_name, area_floor, area_room) => {
    try {
        await Area.update({
            area_name: area_name,
            area_floor_quantity: area_floor,
            area_room_quantity: area_room,
        }, {
            where: {
                id: id_area,
            }
        })
        return { status: true, result: "Cập nhật thành công" }
    } catch (error) {
        return { status: false, msg: "Lỗi khi cập nhật dữ liệu" }
    }
}

const deleteAreaID = async (id_area) => {
    try {
        await Area.destroy({ where: { id: id_area } });
        await Floor.destroy({ where: { id_area: id_area } });
        return { status: true, result: "Xoá thành công" }
    } catch (error) {
        return { status: false, msg: "Lỗi xoá khu vực" }
    }
}

const changeFloorInArea = async (id_area, action, quantity) => {
    try {
        if (action) {
            await Area.increment({area_floor_quantity:quantity},{where:{id:id_area}});
        }else{
            await Area.increment({area_floor_quantity:-quantity},{where:{id:id_area}});
        }
        return { status: true, result: "Cập nhật thành công" }
    } catch (error) {
        return { status: false, msg: "Lỗi khi cập nhật dữ liệu" }
    }
}

const changeRoomInArea = async (id_area, action, quantity) => {
    try {
        if (action) {
            await Area.increment({area_room_quantity:quantity},{where:{id:id_area}});
        }else{
            await Area.increment({area_room_quantity:-quantity},{where:{id:id_area}});
        }
        return { status: true, result: "Cập nhật thành công" }
    } catch (error) {
        return { status: false, msg: "Lỗi khi cập nhật dữ liệu" }
    }
}

module.exports = {
    insertArea, insertFloor, changeFloorInArea, changeRoomInArea,
    getAllArea, updateArea, deleteAreaID,
}
