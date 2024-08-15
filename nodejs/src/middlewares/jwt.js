import Jwt from "jsonwebtoken";
require('dotenv').config();

const secrectKey=process.env.JWTKEY;
const createJWT=(payload)=>{
    let token=null;
    try{
        token=Jwt.sign(payload,secrectKey,{algorithm:'HS256',expiresIn:10*60*60});
    }catch(err){
        return {status:false,msg:err.message};
    }
    return {status:true,token:token};
}

const verifyJWT=(token)=>{
    let decoded=null;
    try{
        decoded=Jwt.verify(token,secrectKey,{algorithms:'HS256'});
    }catch(err){
        return {status:false,msg:err.message};
    }
    return {status:true,decoded:decoded};
}

module.exports={createJWT,verifyJWT};