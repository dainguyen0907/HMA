import db from "../models/index";

const Bed=db.Bed;


const countBedInUsedByRoomID=async(id_room)=>{
    try{
        const countBed=await Bed.count({
            where:{
                id_room:id_room,
                bed_status:false,
            }
        })
        return {status:true,result:countBed}
    }catch(error){
        console.log(error)
        return {status:false,msg:'Lỗi khi truy vấn dữ liệu'};
    }
}

module.exports={
    countBedInUsedByRoomID
}