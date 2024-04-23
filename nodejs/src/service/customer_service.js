import db from "../models/index";

const Customer = db.Customer;

const getAllCustomer = async () => {
    try {
        const customer = await Customer.findAll({
            raw: true,
            nest: true,
            order:[
                ['id','ASC']
            ],
        });
        return { status: true, result: customer }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu" }
    }
}


const insertCustomer = async (customer) => {
    try {
        const rs = await Customer.create({
            customer_name: customer.name,
            customer_gender: customer.gender,
            customer_email: customer.email,
            customer_address: customer.address,
            customer_phone: customer.phone,
            customer_identification: customer.identification,
            customer_status: true
        });
        return { status: true, result: rs }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi khởi tạo dữ liệu" }
    }
}

const updateCustomer=async(customer)=>{
    try {
        await Customer.update({
            customer_name: customer.name,
            customer_gender: customer.gender,
            customer_email: customer.email,
            customer_address: customer.address,
            customer_phone: customer.phone,
            customer_identification: customer.identification,
            customer_status: customer.status
        },{
            where:{id:customer.id}
        });
        return { status: true, result: "Cập nhật Khách hàng thành công" }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi cập nhật dữ liệu" }
    }
}

const deleteCustomer=async(id)=>{
    try {
        await Customer.destroy({
            where:{id:id}
        });
        return {status:true,result:"Xoá thành công"}
    } catch (error) {
        return {status:false,msg: "DB: Lỗi khi xoá dữ liệu"}
    }
}

module.exports = {
    insertCustomer, updateCustomer, deleteCustomer, getAllCustomer,
}