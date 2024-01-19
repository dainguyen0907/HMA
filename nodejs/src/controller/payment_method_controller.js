import { validationResult } from "express-validator";
import paymentMethod from "../service/payment_method_service";

const getAllPaymentMethod=async(req,res)=>{
    try {
        const rs=await paymentMethod.getAllPaymentMethod();
        if(rs.status){
            return res.status(200).json({result:rs.result});
        }else{
            return res.status(500).json({error_code:rs.msg});
        }
    } catch (error) {
        return res.status(500).json({error_code:error});
    }
}

const insertPaymentMethod=async(req,res)=>{
    const validate=validationResult(req);
    if(!validate.isEmpty()){
        return res.status(400).json({error_code:validate.errors[0].msg});
    }
    let name;
    try {
        name=req.body.name;
    } catch (error) {
        return res.status(500).json({error_code:error})
    }
    const rs=await paymentMethod.insertPaymentMethod(name);
    if(rs.status){
        return res.status(201).json({result:rs.result});
    }else{
        return rs.status(500).json({error_code:rs.msg});
    }
}

const updatePaymentMethod=async(req,res)=>{
    let name, id;
    try {
        id=req.body.id;
        name=req.body.name;
    } catch (error) {
        return res.status(500).json({error_code:error})
    }
    const payment={id:id,name:name};
    const rs=await paymentMethod.updatePaymentMethod(payment);
    if(rs.status){
        return res.status(200).json({result:rs.result});
    }else{
        return rs.status(500).json({error_code:rs.msg});
    }
}

const deletePaymentMethod=async(req,res)=>{
    try {
        const id=req.body.id;
        const rs=await paymentMethod.deletePaymentMethod(id);
        if(rs.status){
            return res.status(200).json({result:rs.result});
        }else{
            return rs.status(500).json({error_code:rs.msg});
        }
    } catch (error) {
        return res.status(500).json({error_code:error})
    }
}


module.exports={
    getAllPaymentMethod, insertPaymentMethod, updatePaymentMethod, deletePaymentMethod
}