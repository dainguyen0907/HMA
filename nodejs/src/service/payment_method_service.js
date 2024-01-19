import db from "../models/payment_method";

const paymentMethod=db.Payment_method;

const getAllPaymentMethod=async()=>{
    try{
        const pm=await paymentMethod.findAll({
            raw:true,
            nest:true,
        });
        return {status:true,result:pm}
    }catch(error){
        return {status:false,msg:error}
    }
}

const insertPaymentMethod=async(payment_name)=>{
    try {
        const newPayment=await paymentMethod.create({
            payment_method_name:payment_name
        });
        return {status:true,result:newPayment}
    } catch (error) {
        return {status:false,msg:error}
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
        return {status:false,msg:error}
    }
}

const deletePaymentMethod=async(id)=>{
    try {
        await paymentMethod.destroy({
            id:id
        });
        return {status:true,result:"Xoá thành công"}
    } catch (error) {
        return {status:false,msg:error}
    }
}

module.exports={
    getAllPaymentMethod, insertPaymentMethod, updatePaymentMethod, deletePaymentMethod
}