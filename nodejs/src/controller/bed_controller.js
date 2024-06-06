import { validationResult } from "express-validator";
import bed_service from "../service/bed_service";
import room_service from "../service/room_service";
import base_controller from "../controller/base_controller"
import service_detail_controller from "../service/service_detail_service";
import customer_service from "../service/customer_service";
import course_service from "../service/course_service";

const countBedInUsedByRoomID = async (req, res) => {
    try {
        const id = req.query.id;
        const count = await bed_service.countBedInUsedByRoomID(id);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const getBedInRoom = async (req, res) => {
    try {
        const id = req.query.id;
        const count = await bed_service.getBedInRoom(id);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const getBedByID = async (req, res) => {
    try {
        const id = req.query.id;
        const count = await bed_service.getBedByID(id);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const getBedInInvoice = async (req, res) => {
    try {
        const id = req.query.id;
        const count = await bed_service.getBedInInvoice(id);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const getRevenueBed = async (req, res) => {
    try {
        const from=req.query.from;
        const to=req.query.to;
        const dayFrom = from.split('/')[2]+'-'+from.split('/')[1]+'-'+from.split('/')[0];
        const dayTo = to.split('/')[2]+'-'+to.split('/')[1]+'-'+to.split('/')[0];
        const count = await bed_service.getRevenueBed(dayFrom,dayTo);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const getRevenueBedInArea = async (req, res) => {
    try {
        const from=req.query.from;
        const to=req.query.to;
        const id=req.query.id;
        const dayFrom = from.split('/')[2]+'-'+from.split('/')[1]+'-'+from.split('/')[0];
        const dayTo = to.split('/')[2]+'-'+to.split('/')[1]+'-'+to.split('/')[0];
        const count = await bed_service.getRevenueBedInArea(dayFrom,dayTo,id);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const insertBed = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    let newBed;
    try {
        newBed = {
            id_room: req.body.id_room,
            id_bed_type: req.body.id_bed_type,
            id_customer: req.body.id_customer,
            bed_checkin: req.body.bed_checkin,
            bed_checkout: req.body.bed_checkout,
            bed_deposit: req.body.bed_deposit
        }
        const rs = await bed_service.insertBed(newBed)
        if (rs.status) {
            const message = "đã khởi tạo một giường mới";
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ error_code: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const updateBed = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    let newBed;
    try {
        newBed = {
            id: req.body.id,
            id_bed_type: req.body.id_bed_type,
            id_price:req.body.id_price,
            bed_checkin: req.body.bed_checkin,
            bed_checkout: req.body.bed_checkout,
            bed_deposit: req.body.bed_deposit === "" ? 0 : req.body.bed_deposit
        }
        const rs = await bed_service.updateBed(newBed)
        if (rs.status) {
            const message = "đã thao tác trên giường có mã là " + req.body.id;
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ error_code: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const insertBeds = async (req, res) => {
    const arrayBed = req.body.array_bed;
    const id_room = req.body.id_room;
    try {
        arrayBed.forEach(async (element) => {
            if(!element.id||!id_room){
                return res.status(400).json({error_code:'Xảy ra lỗi! Vui lòng kiểm tra lại dữ liệu nhập'})
            }
            let newBed = {
                id_room: id_room,
                id_bed_type: element.id_bed_type,
                id_customer: element.id,
                bed_checkin: element.bed_checkin,
                bed_checkout: element.bed_checkout,
                bed_deposit: element.bed_deposit == "" ? 0 : element.bed_deposit,
            }
            const rs = await bed_service.insertBed(newBed);
            if (!rs.status) {
                return res.status(500).json({ error_code: rs.msg });
            }
        });
        const message = "đã khởi tạo "+arrayBed.length+" giường mới trong phòng có mã "+id_room;
        await base_controller.saveLog(req, res, message);
        return res.status(200).json({ result: "Thêm thành công" });
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const changeRoom = async (req, res) => {
    try {
        const id_bed = req.body.id_bed;
        const id_room = req.body.id_room;
        const old_room=req.body.id_old_room;
        const checkRoom = await room_service.checkRoomStatus(id_room);
        if (checkRoom) {
            const result = await bed_service.changeRoom({ id_bed, id_room });
            if (result.status) {
                const message = "đã đổi giường có mã " +id_bed+ " từ phòng có mã "+old_room+" sang phòng có mã "+id_room;
                await base_controller.saveLog(req, res, message);
                return res.status(200).json({ result: result.result })
            } else {
                return res.status(500).json({ error_code: result.msg });
            }
        } else {
            return res.status(400).json({ error_code: "Không thể chuyển vào phòng đang sữa chữa." });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const getUnpaidBedByIDCourseAndIDCompany=async(req,res)=>{
    try {
        const id_course=req.query.course;
        const id_company=req.query.company;
        const searchResult=await bed_service.getUnpaidBedByIDCourseAndIDCompany(id_course,id_company);
        if(searchResult.status){
            return res.status(200).json({result:searchResult.result});
        }else{
            return res.status(500).json({error_code:searchResult.msg});
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const deleteBed=async(req,res)=>{
    try {
        const id=req.body.id;
        const findService=await service_detail_controller.getServiceDetailByIDBed(id);
        if(findService.status&&findService.result.length===0){
            const deleteBed=await bed_service.deleteBed(id);
            if(deleteBed.status){
                const message = "đã xoá giường có mã " +id;
                await base_controller.saveLog(req, res, message);
                return res.status(200).json({result:deleteBed.result});
            }else{
                return res.status(500).json({error_code:deleteBed.msg})
            }
        }else{
            return res.status(500).json({error_code:"Không thể xoá giường đang sử dụng dịch vụ."})
        }
    } catch (error) {
        return res.status(500).json({error_code:"Ctrl: Xảy ra lỗi trong quá trình xử lý dữ liệu"});
    }
}

const checkoutBedByCompanyAndCourse=async(req,res)=>{
    try {
        const id_course=req.body.id_course;
        const idCompanyList=req.body.idCompanyList;
        const searchCustomerResult=await customer_service.getCustomerByCourseAndCompanyList(id_course,idCompanyList);
        let idCustomerList=[];
        if(searchCustomerResult.status){
            for(let i=0;i<searchCustomerResult.result.length;i++)
                idCustomerList.push(searchCustomerResult.result[i].id)
        }else{
            return res.status(500).json({error_code:searchCustomerResult.msg})
        }
        const updateBedResult=await bed_service.checkoutForCustomerList(idCustomerList);
        if(updateBedResult.status){
            await course_service.checkAndUpdateCourseStatus(id_course);
            return res.status(200).json({result:'Checkout thành công'});
        }
        else{
            return res.status(500).json({error_code:updateBedResult.msg})
        }
    } catch (error) {
        return res.status(500).json({error_code:'Ctrl: Xảy ra lỗi trong quá trình xử lý thông tin'});
    }
}

const getUnpaidBedByCourseAndCompany=async(req,res)=>{
    try {
        const id_course=req.query.course?parseInt(req.query.course):-1;
        const id_company=req.query.company?parseInt(req.query.company):-1;
        let searchResult;
        if(id_course===-1&&id_company===-1){
            searchResult=await bed_service.getAllUnpaidBed();
        }else if(id_course===-1&& id_company!==-1){
            searchResult=await bed_service.getUnpaidBedByCompany(id_company);
        }else if(id_course!==-1&& id_company===-1){
            searchResult= await bed_service.getUnpaidBedByCourse(id_course)
        }else{
            searchResult= await bed_service.getUnpaidBedByCompanyAndCourse(id_company,id_course);
        }
        if(searchResult.status){
            return res.status(200).json({result:searchResult.result});
        }else{
            return res.status(500).json({error_code:searchResult.msg})
        }
    } catch (error) {
        return res.status(500).json({error_code:'Ctrl: Xảy ra lỗi trong quá trình xử lý thông tin'})
    }
}

module.exports = {
    countBedInUsedByRoomID, insertBed, insertBeds, getBedInRoom, updateBed,
    changeRoom, getBedByID, getBedInInvoice,deleteBed, getRevenueBed, getRevenueBedInArea,
    getUnpaidBedByIDCourseAndIDCompany, checkoutBedByCompanyAndCourse, getUnpaidBedByCourseAndCompany
}