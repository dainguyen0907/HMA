import { validationResult } from "express-validator";
import courseService from "../service/course_service";
import customerService from "../service/customer_service";
import baseController from "./base_controller";

const getAllCourse = async (req,res)=>{
    try {
        const coursesSearching=await courseService.getAllCourse();
        if (coursesSearching.status){
            return res.status(200).json({result:coursesSearching.result});
        }else{
            return res.status(500).json({error_code:coursesSearching.msg});
        }
    } catch (error) {
        return res.status(500).json({error_code:"Ctrl: Xảy ra lỗi trong quá trình xử lý thông tin"})
    }
}

const insertCourse = async (req,res)=>{
    try {
        const validation=validationResult(req);
        if(!validation.isEmpty()){
            return res.status(400).json({error_code:validation.error[0].msg});
        }
        const course={
            name:req.body.name,
            start_date:req.body.start_date,
            end_date:req.body.end_date
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
        return res.status(500).json({error_code:"Ctrl: Xảy ra lỗi trong quá trình khởi tạo Khoá học"})
    }
}

const updateCourse = async (req,res)=>{
    try {
        const validation=validationResult(req);
        if(!validation.isEmpty()){
            return res.status(400).json({error_code:validation.error[0].msg});
        }
        const course={
            name:req.body.name,
            start_date:req.body.start_date,
            end_date:req.body.end_date,
            id:req.body.id
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
        return res.status(500).json({error_code:"Ctrl: Xảy ra lỗi trong quá trình cập nhật Khoá học"})
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
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi trong quá trình xoá Công ty" })
    }
}

module.exports={
    getAllCourse, insertCourse, updateCourse, deleteCourse
}