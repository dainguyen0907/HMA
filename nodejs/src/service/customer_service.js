import db from "../models/index";

const Customer = db.Customer;

const getAllCustomer = async () => {
    try {
        const customer = await Customer.findAll({
            raw: true,
            nest: true
        });
        return { status: true, result: customer }
    } catch (error) {
        return { status: false, msg: "Lỗi khi cập nhật dữ liệu" }
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
            customer_student_check:customer.student_check,
            customer_dob: customer.dob,
            customer_student_code: customer.student_code,
            customer_class: customer.classroom,
            customer_pob: customer.pob,
            customer_status: true
        });
        return { status: true, result: rs }
    } catch (error) {
        return { status: false, msg: "Lỗi khi cập nhật dữ liệu" }
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
            customer_student_check:customer.student_check,
            customer_dob: customer.dob,
            customer_student_code: customer.student_code,
            customer_class: customer.classroom,
            customer_pob: customer.pob,
            customer_status: customer.status
        },{
            where:{id:customer.id}
        });
        return { status: true, result: "Cập nhật thành công" }
    } catch (error) {
        console.log(error)
        return { status: false, msg: "Lỗi khi cập nhật dữ liệu" }
    }
}

const deleteCustomer=async(id)=>{
    try {
        await Customer.destroy({
            where:{id:id}
        });
        return {status:true,result:"Xoá thành công"}
    } catch (error) {
        return {status:false,msg: "Lỗi khi cập nhật dữ liệu"}
    }
}

module.exports = {
    insertCustomer, updateCustomer, deleteCustomer, getAllCustomer
}