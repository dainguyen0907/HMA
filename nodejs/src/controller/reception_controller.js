import {verifyJWT} from "../middlewares/jwt";
import {getPrivilegeByIDUser} from "../service/user_service";

const decodedAccessToken =async(req,res)=>{
    const token=req.cookies.loginCode;
    const decoded=await verifyJWT(token);
    if(decoded.status)
    {
        const privilege_detail=await getPrivilegeByIDUser(decoded.decoded.reception_id);
        let privilege=[];
        privilege_detail.map((p)=>{
            privilege.push(p.id_privilege);
        });
        return res.status(200).json({status:true,privilege:privilege});
    }else{
        return res.status(500);
    }
    
}

module.exports={decodedAccessToken};