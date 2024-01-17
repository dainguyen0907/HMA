import db from "../models/index";

const Price = db.Price;

const getPriceByIdBedType = async (id) => {
    try {
        const price = await Price.findAll({
            where: {
                id_bed_type: id
            },
            raw: true,
            nest: true
        });
        return { status: true, result: price }
    } catch (error) {
        return { status: false, msg: error }
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
        return { status: false, msg: error }
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
        return { status: false, msg: error }
    }
}

const deletePrice = async (id)=>{
    try {
        await Price.destroy({
            where:{id:id}
        });
        return {status:true,result:"Cập nhật thành công"}
    } catch (error) {
        return { status: false, msg: error }
    }
}

module.exports = {
    getPriceByIdBedType, insertPrice, updatePrice, deletePrice
}