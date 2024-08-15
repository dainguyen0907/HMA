import db from "../models/index";

const Service = db.Service;

const getAllService = async () => {
    try {
        const service = await Service.findAll({
            raw: true,
            nest: true,
            order:[
                ['id','ASC']
            ],
        });
        return { status: true, result: service };
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const insertService = async (service) => {
    try {
        const newservice = await Service.create({
            service_name: service.name,
            service_price: service.price,
        })
        return { status: true, result: newservice }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const updateService = async (service)=>{
    try {
        await Service.update({
            service_name: service.name,
            service_price: service.price,
        },{
            where:{
                id:service.id
            }
        })
        return { status: true, result: "Cập nhật thành công" }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const deleteService =async(id)=>{
    try {
        await Service.destroy({
            where:{
                id:id
            }
        })
        return { status: true, result: "Xoá thành công" }
    } catch (error) {
        return {status:false, msg: "DB: "+error.message}
    }
}

module.exports = {
    getAllService, insertService, updateService, deleteService
}