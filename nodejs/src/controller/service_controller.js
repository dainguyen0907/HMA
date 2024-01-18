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
    try {
        name=req.body.name;
        price=req.body.price;
    } catch (error) {
        return res.status(500).json(error)
    }
    const service={name:name,price:price};
    const rs=await service_.insertService(service);
    if(rs.status){
        return res.status(201).json({result:rs.result});
    }else{
        return res.status(500).json({error_code:rs.msg})
    }
}

const updateService=async(req,res)=>{
    let name,price,id;
    try {
        name=req.body.name==""?null:req.body.name;
        price=req.body.price==""?null:req.body.price;
        id=req.bosy.id;
    } catch (error) {
        return res.status(500).json(error)
    }
    const service={name:name,price:price,id:id};
    const rs=await service_.updateService(service);
    if(rs.status){
        return res.status(201).json({result:rs.result});
    }else{
        return res.status(500).json({error_code:rs.msg})
    }
}

module.exports={
    getAllService, deleteService, insertService, updateService
}