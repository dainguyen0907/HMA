import { validationResult } from "express-validator";
import floorService from "../service/floor_service";
import roomService from "../service/room_service";

const updateFloor =async (req, res) => {
    try {
        const validate = validationResult(req);
        if (!validate.isEmpty()) {
            return res.status(400).json({ error_code: validate.errors[0].msg });
        }
        const id=req.body.id;
        const name=req.body.name;
        const newfloor={
            name:name,
            id:id
        }
        const rs=await floorService.updateFloor(newfloor);
        if(rs.status){
            return res.status(200).json({result:rs.result});
        }else{
            return res.status(500).json({error_code:rs.msg});
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Đã xảy ra lỗi hệ thống" })
    }
}

const deleteFloor = async(req,res)=>{
    try{
        const id=req.body.id;
        const dataSearch=await roomService.getRoomByFloorID(id);
        if(dataSearch.status){
            if(dataSearch.result!=null){
                return res.status(400).json({error_code:"Không thể xoá tầng đã có phòng"});
            }else{
                const rs=await floorService.deleteFloor(id);
                if(rs.status){
                    return res.status(200).json({result:rs.result});
                }else{
                    return res.status(500).json({error_code:rs.msg});
                }
            }
        }else{
            return res.status(500).json({ error_code: dataSearch.msg })
        }
    }catch(error){
        return res.status(500).json({ error_code: "Đã xảy ra lỗi hệ thống" })
    }
}

const getAllFloorByIdArea=async(req,res)=>{
    try{
        const id=req.query.id;
        const rs=await floorService.getAllFloorByIDArea(id);
        if(rs.status){
            return res.status(200).json({result:rs.result});
        }else{
            return res.status(500).json({error_code:rs.msg});
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({error:"Đã xảy ra lỗi hệ thống"})
    }
}

module.exports={updateFloor,deleteFloor, getAllFloorByIdArea}