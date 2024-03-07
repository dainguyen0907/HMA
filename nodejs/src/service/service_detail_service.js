import db from "../models/index";

const serviceDetail = db.Service_detail;
const service=db.Service;

serviceDetail.belongsTo(service,{foreignKey:'id_service'});

const getServiceDetailByIDBed = async (id) => {
    try {
        const sd = await serviceDetail.findAll({
            include:[service],
            where: {
                id_bed: id
            },
            order:[
                ['id','ASC']
            ],
        });
        return { status: true, result: sd }
    } catch (error) {
        return { status: false, msg: "Lỗi khi cập nhật dữ liệu" }
    }
}

const insertServiceDetail = async (sDetail) => {
    try {
        const sdetail = await serviceDetail.create({
            id_bed: sDetail.id_bed,
            id_service: sDetail.id_service,
            service_quantity: sDetail.quantity,
            total_price: sDetail.price,
        })
        return { status: true, result: sdetail }
    } catch (error) {
        return { status: false, msg: "Lỗi khi cập nhật dữ liệu" }
    }
}

const updateServiceDetail = async (sDetail) => {
    try {
        await serviceDetail.update({
            service_quantity: sDetail.quantity,
            total_price: sDetail.price,
        }, {
            where: {
                id_bed: sDetail.id_bed,
                id_service: sDetail.id_service
            }
        })
        return { status: true, result: "Cập nhật thành công" }
    } catch (error) {
        return { status: false, msg: "Lỗi khi cập nhật dữ liệu" }
    }
}

const deleteServiceDetail = async (id) => {
    try {
        await serviceDetail.destroy({
            where: {
                id: id
            }
        })
    } catch (error) {
        return { status: false, msg: "Lỗi khi cập nhật dữ liệu" }
    }
}

module.exports = {
    getServiceDetailByIDBed, insertServiceDetail, deleteServiceDetail,updateServiceDetail
}