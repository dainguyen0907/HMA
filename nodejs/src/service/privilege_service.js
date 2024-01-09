import db from "../models/index"

const Privilege=db.Privilege;
const PrivilegeDetail=db.Privilege_detail;

const checkPrivilegeByIDReceptionAndIDPrivilege=async(reception_id,privilege_id)=>{
    const privilege_detail=await PrivilegeDetail.findOne({
        where:{
            id_user: reception_id,
        id_privilege: privilege_id
        }
    });
    console.log(privilege_detail);
    if(privilege_detail===null){
        return false;
    }else{
        return true;
    }
}

module.exports={checkPrivilegeByIDReceptionAndIDPrivilege}
