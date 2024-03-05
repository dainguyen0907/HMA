import db from "../models/index";

const Bed=db.Bed;
const Customer=db.Customer;

Bed.belongsTo(Customer,{foreignKey:'id_customer'});


const countBedInUsedByRoomID=async(id_room)=>{
    try{
        const countBed=await Bed.count({
            where:{
                id_room:id_room,
                bed_status:true,
            }
        })
        return {status:true,result:countBed}
    }catch(error){
        console.log(error)
        return {status:false,msg:'Lỗi khi truy vấn dữ liệu'};
    }
}

const getBedInRoom=async(id_room)=>{
    try{
        const findBed=await Bed.findAll({
            include:[Customer],
            where:{
                id_room:id_room,
                bed_status:true,
            }
        })
        return {status:true,result:findBed}
    }catch(error){
        console.log(error)
        return {status:false,msg:'Lỗi khi truy vấn dữ liệu'};
    }
}

const insertBed=async(bed)=>{
    try {
        const rs=await Bed.create({
            id_room:bed.id_room,
            id_customer:bed.id_customer,
            id_bed_type:bed.id_bed_type,
            bed_checkin:bed.bed_checkin,
            bed_checkout:bed.bed_checkout,
            bed_status:true,
            bed_deposit:bed.bed_deposit,
        });
        return {status:true,result:rs};
    } catch (error) {
        console.log(error)
        return {status:false,msg: "Lỗi khi khởi tạo dữ liệu"};
    }
}

module.exports={
    countBedInUsedByRoomID, insertBed, getBedInRoom
}