import service_ from "../service/service_service";

const getAllService=async(req,res)=>{
    const ser= await service_.getAllService();
    if(ser.status){
        return res.status(200).json({result:ser.result});
    }else{
        return res.status(500).json({error_code:ser.msg});
    }
}

const deleteService =async(req,res)=>{
    const id=req.body.id;
    const ser=await service_.deleteService(id);
    if(ser.status){
        return res.status(200).json({result:ser.result});
    }else{
        return res.status(500).json({error_code:ser.msg});
    }
}

const insertService =async(req,res)=>{
    let name,price;
    
}

module.exports={
    getAllService, deleteService
}