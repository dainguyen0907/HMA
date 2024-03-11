import db from "../models/index";

const paymentMethod=db.Payment_method;

const getAllPaymentMethod=async()=>{
    try{
        const pm=await paymentMethod.findAll({
            raw:true,
            nest:true,
            order:[
                ['id','ASC']
            ],
        });
        return {status:true,result:pm}
    }catch(error){
        console.log(error);
        return {status:false,msg: "Lỗi khi truy vấn dữ liệu"}
    }
}

const insertPaymentMethod=async(payment_name)=>{
    try {
        const newPayment=await paymentMethod.create({
            payment_method_name:payment_name
        });
        return {status:true,result:newPayment}
    } catch (error) {
        return {status:false,msg: "Lỗi khi cập nhật dữ liệu"}
    }
}

const updatePaymentMethod=async(payment)=>{
    try {
        await paymentMethod.update({
            payment_method_name:payment.name
        },{
            where:{
                id:payment.id
            }
        });
        return {status:true,result:"Cập nhật thành công"}
    } catch (error) {
        return {status:false,msg: "Lỗi khi cập nhật dữ liệu"}
    }
}

const deletePaymentMethod=async(id)=>{
    try {
        await paymentMethod.destroy({
            id:id
        });
        return {status:true,result:"Xoá thành công"}
    } catch (error) {
        return {status:false,msg: "Lỗi khi cập nhật dữ liệu"}
    }
}

module.exports={
    getAllPaymentMethod, insertPaymentMethod, updatePaymentMethod, deletePaymentMethod
}