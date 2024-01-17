import db from "../models/index";

const BedType=db.Bed_type;

const getAllBedType=async()=>{
    try {
        const bt=await BedType.findAll({
            raw: true,
            nest: true
        });
        return {status:true,result:bt}
    } catch (error) {
        return {status:false,msg:error}
    }
}

const deleteBedType=async(id)=>{
    try {
        await BedType.destroy({
            where:{
                id:id
            }
        })
        return {status:true,result:"Xoá thành công"}
    } catch (error) {
        return {status:false,msg:error}
    }
}

const insertBedType=async(name)=>{
    try {
        const rs=await BedType.create({
            bed_type_name:name
        });
        return {status:true,result:rs};
    } catch (error) {
        return {status:false,msg:error};
    }
}

const updateBedType=async(bedType)=>{
    try {
        const rs=await BedType.update({
            bed_type_name:bedType.name
        },{
            where:{id:bedType.id}
        });
        return {status:true,result:"Cập nhật thành công"};
    } catch (error) {
        return {status:false,msg:error};
    }
}

module.exports={getAllBedType,insertBedType,updateBedType,deleteBedType}