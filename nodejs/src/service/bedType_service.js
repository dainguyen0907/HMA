import db from "../models/index";

const BedType=db.Bed_type;
const Price=db.Price;

BedType.belongsTo(Price,{foreignKey:'bed_type_default_price'});


const getAllBedType=async()=>{
    try {
        const bt=await BedType.findAll({
            raw: true,
            nest: true,
            include:[Price],
            order:[
                ['id','ASC']
            ],
        });
        return {status:true,result:bt}
    } catch (error) {
        return {status:false,msg: "DB: Lỗi khi truy xuất dữ liệu"}
    }
}

const findBedTypeByDefaultPrice=async(defaultPrice)=>{
    try {
        const bt=await BedType.findOne({
            raw: true,
            nest: true,
            where:{
                bed_type_default_price:defaultPrice
            }
        });
        return {status:true,result:bt}
    } catch (error) {
        return {status:false,msg: "DB: Lỗi khi truy xuất dữ liệu"}
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
        return {status:false,msg: "DB: Lỗi khi xoá dữ liệu"}
    }
}

const insertBedType=async(name)=>{
    try {
        const rs=await BedType.create({
            bed_type_name:name,
            bed_type_default_price:null,
        });
        return {status:true,result:rs};
    } catch (error) {
        return {status:false,msg: "DB: Lỗi khi khởi tạo dữ liệu"};
    }
}

const updateBedType=async(bedType)=>{
    try {
        await BedType.update({
            bed_type_name:bedType.name,
            bed_type_default_price:bedType.default
        },{
            where:{id:bedType.id}
        });
        return {status:true,result:"Cập nhật thành công"};
    } catch (error) {
        return {status:false,msg: "DB: Lỗi khi cập nhật dữ liệu"};
    }
}

module.exports={getAllBedType,insertBedType,updateBedType,deleteBedType,
findBedTypeByDefaultPrice}