import {verifyJWT} from "../middlewares/jwt";

const decodedAccessToken =async(req,res)=>{
    const token=req.cookies.loginCode;
    const decoded=await verifyJWT(token);
    if(decoded.status)
    {
        return res.status(200).json(decoded);
    }else{
        return res.status(500);
    }
    
}

module.exports={decodedAccessToken};