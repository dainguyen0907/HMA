import db from "../models/index";

const Bed=db.Bed;
const Customer=db.Customer;
const BedType=db.Bed_type;
const Room=db.Room;
const Price=db.Price;

Bed.belongsTo(Customer,{foreignKey:'id_customer'});
Bed.belongsTo(BedType,{foreignKey:'id_bed_type'});
Bed.belongsTo(Room,{foreignKey:'id_room'});
BedType.belongsTo(Price,{foreignKey:'bed_type_default_price'});


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
        return {status:false,msg:'DB: Lỗi khi truy vấn dữ liệu'};
    }
}

const getBedInRoom=async(id_room)=>{
    try{
        const findBed=await Bed.findAll({
            include:[Customer,Room,{
                model:BedType,
                include:[Price]
            }],
            where:{
                id_room:id_room,
                bed_status:true,
            }
        })
        return {status:true,result:findBed}
    }catch(error){
        return {status:false,msg:'DB: Lỗi khi truy vấn dữ liệu'};
    }
}

const countBedInRoom=async(id_room)=>{
    try{
        const findBed=await Bed.count({
            where:{id_room:id_room}
        })
        return {status:true,result:findBed}
    }catch(error){
        return {status:false,msg:'DB: Lỗi khi truy vấn dữ liệu'};
    }
}

const getBedInInvoice=async(id_invoice)=>{
    try{
        const findBed=await Bed.findAll({
            include:[Customer,Room,{
                model:BedType,
                include:[Price]
            }],
            where:{
                id_invoice:id_invoice,
            }
        })
        return {status:true,result:findBed}
    }catch(error){
        return {status:false,msg:'DB: Lỗi khi truy vấn dữ liệu'};
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
        return {status:false,msg: "DB: Lỗi khi khởi tạo dữ liệu"};
    }
}

const updateBed=async(bed)=>{
    try {
        await Bed.update({
            id_bed_type:bed.id_bed_type,
            bed_checkin:bed.bed_checkin,
            bed_checkout:bed.bed_checkout,
            bed_deposit:bed.bed_deposit,
        },{
            where:{
                id:bed.id
            }
        });
        return {status:true,result:"Cập nhật thành công"};
    } catch (error) {
        return {status:false,msg: "DB: Lỗi khi cập nhật dữ liệu"};
    }
}

const updateBedStatus=async(bed)=>{
    try {
        await Bed.update({
            bed_status:bed.bed_status,
            id_invoice:bed.id_invoice,
        },{
            where:{
                id:bed.id
            }
        });
        return {status:true,result:"Cập nhật thành công"};
    } catch (error) {
        return {status:false,msg: "DB: Lỗi khi cập nhật dữ liệu"};
    }
}

const updateBedStatusByInvoice=async(bed)=>{
    try {
        await Bed.update({
            bed_status:bed.bed_status,
        },{
            where:{
                id_invoice:bed.id_invoice,
            }
        });
        return {status:true,result:"Cập nhật thành công"};
    } catch (error) {
        return {status:false,msg: "DB: Lỗi khi cập nhật dữ liệu"};
    }
}

const changeRoom=async(bed)=>{
    try {
        await Bed.update({
            id_room:bed.id_room
        },{
            where:{
                id:bed.id_bed
            }
        });
        return {status:true,result:"Cập nhật thành công"};
    } catch (error) {
        return {status:false,msg: "DB: Lỗi khi cập nhật dữ liệu"};
    }
}

const getBedByID=async(id)=>{
    try{
        const findBed=await Bed.findOne({
            include:[Customer,BedType],
            where:{
                id:id
            }
        })
        return {status:true,result:findBed}
    }catch(error){
        return {status:false,msg:'DB: Lỗi khi truy vấn dữ liệu'};
    }
}

const countCustomerBed=async(id_customer)=>{
    try{
        const findBed=await Bed.count({
            where:{
                id_customer:id_customer
            }
        })
        return {status:true,result:findBed}
    }catch(error){
        return {status:false,msg:'DB: Lỗi khi truy vấn dữ liệu'};
    }
}

const deleteBed=async(id_bed)=>{
    try {
        await Bed.destroy({
            where:{
                id:id_bed
            }
        })
        return {status:true,result:'Xoá giường thành công'}
    } catch (error) {
        return {status:false,msg:'DB: Lỗi khi xoá dữ liệu.'};
    }
}

module.exports={
    countBedInUsedByRoomID, insertBed, getBedInRoom, updateBed, changeRoom,getBedByID,
    updateBedStatus, getBedInInvoice, updateBedStatusByInvoice, countBedInRoom,
    countCustomerBed, deleteBed
}