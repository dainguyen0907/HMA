import db from "../models/index";

const Price = db.Price;
const BedType=db.Bed_type;

Price.belongsTo(BedType,{foreignKey:'id_bed_type'});

const getPriceByIdBedType = async (id) => {
    try {
        const price = await Price.findAll({
            where: {
                id_bed_type: id
            },
            raw: true,
            nest: true,
            include:[BedType],
            order:[
                ['id','ASC']
            ],
        });
        return { status: true, result: price }
    } catch (error) {
        
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu" }
    }
}

const getPriceById= async (id_price) => {
    try {
        const price = await Price.findOne({
            where: {
                id: id_price
            },
            raw: true,
            nest: true
        });
        return { status: true, result: price }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu" }
    }
}

const getDefaultPriceById= async (id_bed_type) => {
    try {
        const defaultPrice=await BedType.findOne({
            where:{
                id:id_bed_type
            }
        })
        const price = await Price.findOne({
            where: {
                id: defaultPrice.bed_type_default_price
            },
            raw: true,
            nest: true
        });
        return { status: true, result: price }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu" }
    }
}


const insertPrice = async (price) => {
    try {
        const newprice = await Price.create({
            id_bed_type: price.id_bed_type,
            price_name: price.name,
            price_hour: price.price_hour,
            price_day: price.price_day,
            price_week: price.price_week,
            price_month: price.price_month
        })
        return {status:true,result:newprice}
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi khởi tạo dữ liệu" }
    }
}

const updatePrice = async (price) => {
    try {
        await Price.update({
            price_name: price.name,
            price_hour: price.price_hour,
            price_day: price.price_day,
            price_week: price.price_week,
            price_month: price.price_month
        },{
            where:{id:price.id}
        })
        return {status:true,result:"Cập nhật thành công"}
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi cập nhật dữ liệu" }
    }
}

const deletePrice = async (id)=>{
    try {
        await Price.destroy({
            where:{id:id}
        });
        return {status:true,result:"Cập nhật thành công"}
    } catch (error) {
        return { status: false, msg: "Lỗi khi cập nhật dữ liệu" }
    }
}

const deletePriceByIdBedType=async(id_bed_type)=>{
    try {
        await Price.destroy({
            where:{id_bed_type:id_bed_type}
        });
        return {status:true,result:"Cập nhật thành công"}
    } catch (error) {
        return { status: false, msg: "Lỗi khi cập nhật dữ liệu" }
    }
}

module.exports = {
    getPriceByIdBedType, insertPrice, updatePrice, deletePrice,
     deletePriceByIdBedType, getPriceById, getDefaultPriceById
}