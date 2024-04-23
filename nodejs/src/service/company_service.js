import { raw } from "body-parser";
import db from "../models/index";
import { where } from "sequelize";

const Company=db.Company;

const getAllCompany=async()=>{
    try {
        const companies=await Company.findAll({
            raw:true,
            nest:true,
            order:[
                ['id','ASC']
            ]
        });
        return {status:true, result:companies}
    } catch (error) {
        return {status:false, msg:"DB: Xảy ra lỗi khi truy vấn Công ty."}
    }
}

const insertCompany=async(company)=>{
    try {
        const newCompany=await Company.create({
            company_name:company.name,
            company_phone:company.phone,
            company_email:company.email,
            company_address:company.address
        })
        return {status:true, result:newCompany}
    } catch (error) {
        return {status:false, msg:'DB: Xảy ra lỗi khi khởi tạo Công ty.'}
    }
}

const updateCompany=async(company)=>{
    try {
        await Company.update({
            company_name:company.name,
            company_phone:company.phone,
            company_email:company.email,
            company_address:company.address
        },{
            where:{
                id:company.id
            }
        })
        return {status:true, result:"Cập nhật Công ty thành công"}
    } catch (error) {
        return {status:false,msg:'DB: Xảy ra lỗi khi cập nhật Công ty.'}
    }
}

const deleteCompany=async(id)=>{
    try {
        await Company.destroy({
            where:{
                id:id
            }
        })
        return {status:true, result:"Xoá Công ty thành công"}
    } catch (error) {
        return {status:false,msg:'DB: Xảy ra lỗi khi xoá Công ty.'}
    }
}

module.exports={getAllCompany, insertCompany, updateCompany, deleteCompany}