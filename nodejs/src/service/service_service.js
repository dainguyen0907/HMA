import db from "../models/index";

const Service = db.Service;

const getAllService = async () => {
    try {
        const service = await Service.findAll();
        return { status: true, result: service };
    } catch (error) {
        return { status: false, msg: error };
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
        return { status: false, msg: error }
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
        return { status: false, msg: error }
    }
}

const deleteService =async(id)=>{
    try {
        await Service.destroy({
            where:{
                id:id
            }
        })
    } catch (error) {
        return {status:false, msg:error}
    }
}

module.exports = {
    getAllService, insertService, updateService, deleteService
}