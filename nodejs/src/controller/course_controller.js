import { validationResult } from "express-validator";
import courseService from "../service/course_service";
import customerService from "../service/customer_service";
import baseController from "./base_controller";
import moment from "moment";

const getAllCourse = async (req,res)=>{
    try {
        const coursesSearching=await courseService.getAllCourse();
        if (coursesSearching.status){
            return res.status(200).json({result:coursesSearching.result});
        }else{
            return res.status(500).json({error_code:coursesSearching.msg});
        }
    } catch (error) {
        return res.status(500).json({error_code: "Ctrl: "+error.message})
    }
}

const getCoursesStartedDuringThePeriod=async(req,res)=>{
    try {
        const dayFrom=moment(req.query.startdate,"DD/MM/YYYY");
        const dayTo=moment(req.query.enddate,"DD/MM/YYYY").set('hour',23).set('minute',59).set('second',59);
        const searchResult=await courseService.getCoursesStartedDuringThePeriod(dayFrom,dayTo);
        if(searchResult.status){
            return res.status(200).json({result:searchResult.result});
        }else{
            return res.status(500).json({error_code:searchResult.msg});
        }
    } catch (error) {
        return res.status(500).json({error_code: "Ctrl: "+error.message})
    }
}

const getEnableCourse = async (req,res)=>{
    try {
        const coursesSearching=await courseService.getEnableCourse();
        if (coursesSearching.status){
            return res.status(200).json({result:coursesSearching.result});
        }else{
            return res.status(500).json({error_code:coursesSearching.msg});
        }
    } catch (error) {
        return res.status(500).json({error_code: "Ctrl: "+error.message})
    }
}

const getDisableCourse = async (req,res)=>{
    try {
        const coursesSearching=await courseService.getDisableCourse();
        if (coursesSearching.status){
            return res.status(200).json({result:coursesSearching.result});
        }else{
            return res.status(500).json({error_code:coursesSearching.msg});
        }
    } catch (error) {
        return res.status(500).json({error_code: "Ctrl: "+error.message})
    }
}

const insertCourse = async (req,res)=>{
    try {
        const validation=validationResult(req);
        if(!validation.isEmpty()){
            return res.status(400).json({error_code:validation.error[0].msg});
        }
        const course={
            name:req.body.name?.slice(0,100),
            start_date:req.body.start_date,
            end_date:req.body.end_date,
            status:req.body.status
        }
        const newCourse= await courseService.insertCourse(course);
        if(newCourse.status){
            const message = "đã khởi tạo Khoá học " + newCourse.result.id + "." + newCourse.result.course_name;
            await baseController.saveLog(req, res, message);
            return res.status(201).json({result:newCourse.result});
        }else{
            return res.status(500).json({ error_code: newCourse.msg});
        }
    } catch (error) {
        return res.status(500).json({error_code: "Ctrl: "+error.message})
    }
}

const updateCourse = async (req,res)=>{
    try {
        const validation=validationResult(req);
        if(!validation.isEmpty()){
            return res.status(400).json({error_code:validation.error[0].msg});
        }
        const course={
            name:req.body.name?.slice(0,100),
            start_date:req.body.start_date,
            end_date:req.body.end_date,
            id:req.body.id,
            status:req.body.status
        }
        const courseUpdate= await courseService.updateCourse(course);
        if(courseUpdate.status){
            const message = "đã cập nhật Khoá học có id là " + course.id;
            await baseController.saveLog(req, res, message);
            return res.status(200).json({result:courseUpdate.result});
        }else{
            return res.status(500).json({ error_code: courseUpdate.msg});
        }
    } catch (error) {
        return res.status(500).json({error_code: "Ctrl: "+error.message})
    }
}

const updateStatusForCourseList=async(req,res)=>{
    try {
        const idCourseList=req.body.idList;
        const status=req.body.status;
        if(!Array.isArray(idCourseList)){
            return res.status(400).json({error_code:'Request body không hợp lệ!'});
        }
        let error_list=[];
        for(let i=0;i<idCourseList.length;i++){
            const updateResult=await courseService.updateStatusCourse({id:idCourseList[i],status:status});
            if(!updateResult.status)
                error_list.push('Khoá học có id '+idCourseList[i]+' cập nhật thất bại vì '+updateResult.msg);
        }
        return res.status(200).json({result:error_list});
    } catch (error) {
        return res.status(500).json({error_code: "Ctrl: "+error.message})
    }
}

const deleteCourse = async (req, res) => {
    try {
        const id = req.body.id;
        const customerSearching = await customerService.getCustomerByIDCourse(id);
        if (customerSearching.status) {
            if(customerSearching.result.length>0)
            {
                return res.status(400).json({ error_code: "Không thể xoá khoá học đã có khách hàng" });
            }
            const courseDelete = await courseService.deleteCourse(id);
            if (courseDelete.status) {
                const message = "đã xoá khoá học có id là " + id;
                await baseController.saveLog(req, res, message);
                return res.status(200).json({ result: courseDelete.result });
            } else {
                return res.status(500).json({ error_code: courseDelete.msg });
            }
        } else {
            return res.status(500).json({ error_code: customerSearching.msg })
        }
    } catch (error) {
        return res.status(500).json({error_code: "Ctrl: "+error.message })
    }
}

module.exports={
    getAllCourse, getEnableCourse, getDisableCourse, getCoursesStartedDuringThePeriod,
    insertCourse, 
    updateCourse, updateStatusForCourseList,
    deleteCourse,
}