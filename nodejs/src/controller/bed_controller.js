import bed_service from "../service/bed_service";

const countBedInUsedByRoomID = async (req, res) => {
    try {
        const id = req.query.id;
        const count= await bed_service.countBedInUsedByRoomID(id);
        if(count.status){
            return res.status(200).json({result:count.result});
        }else{
            return res.status(500).json({error_code:count.msg});
        }
    } catch (error) {
        return res.status(500).json({ error_code: error });
    }
}

module.exports={
    countBedInUsedByRoomID
}