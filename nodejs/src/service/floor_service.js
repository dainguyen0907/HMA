import db from "../models/index";

const Floor=db.Floor;
const Room=db.Room;

Floor.hasMany(Room,{foreignKey:'id_floor'});

const getFloorByID=async(id_floor)=>{
    return await Floor.findOne({where:{id:id_floor},raw:true,nest:true});
}
const getAllFloorByIDArea=async(id_area)=>{
    try{
        const floors=await Floor.findAll({
            where:{
                id_area:id_area
            },
            include:[Room],
            order:[
                ['id','ASC']
            ],
        });
        return {status:true,result:floors}
    }catch(error){
        return {status:false, msg: "DB: "+error.message}
    }
}

const updateFloor=async(floor)=>{
    try{
        await Floor.update({
            floor_name:floor.name,
        },{
            where:{
                id:floor.id
            }
        });
        return {status:true,result:"Cập nhật thành công"}
    }catch(error){
        return {status:false, msg: "DB: "+error.message}
    }
}

const deleteFloor=async(id)=>{
    try{
        await Floor.destroy({
            where:{
                id:id
            }
        });
        return {status:true,result:"Xoá thành công"}
    }catch(error){
        return {status:false, msg: "DB: "+error.message}
    }
}

module.exports={getAllFloorByIDArea,updateFloor,deleteFloor, getFloorByID}