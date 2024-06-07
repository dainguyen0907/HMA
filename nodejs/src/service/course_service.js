import db from "../models/index";

const Course = db.Course;
const Customer=db.Customer;
const Bed=db.Bed;

Customer.hasOne(Bed,{foreignKey:'id_customer'});
Course.hasMany(Customer,{foreignKey:'id_course'});

const getAllCourse = async () => {
    try {
        const courses = await Course.findAll({
            nest: true,
            raw: true,
            order: [['id', 'ASC']]
        })
        return { status: true, result: courses }
    } catch (error) {
        return { status: false, msg: 'DB: Xảy ra lỗi khi truy vấn Khoá học' }
    }
}

const getEnableCourse = async () => {
    try {
        const courses = await Course.findAll({
            where:{
                course_status:true
            },
            nest: true,
            raw: true,
            order: [['id', 'ASC']]
        })
        return { status: true, result: courses }
    } catch (error) {
        return { status: false, msg: 'DB: Xảy ra lỗi khi truy vấn Khoá học' }
    }
}

const getDisableCourse = async () => {
    try {
        const courses = await Course.findAll({
            where:{
                course_status:false
            },
            nest: true,
            raw: true,
            order: [['id', 'ASC']]
        })
        return { status: true, result: courses }
    } catch (error) {
        return { status: false, msg: 'DB: Xảy ra lỗi khi truy vấn Khoá học' }
    }
}

const insertCourse = async (course) => {
    try {
        const newCourse = await Course.create({
            course_name: course.name,
            course_start_date: course.start_date,
            course_end_date: course.end_date,
            course_status:course.status
        })
        return { status: true, result: newCourse }
    } catch (error) {
        return { status: false, msg: 'DB: Xảy ra lỗi khi khởi tạo Khoá học' }
    }
}

const updateCourse = async (course) => {
    try {
        await Course.update({
            course_name: course.name,
            course_start_date: course.start_date,
            course_end_date: course.end_date,
            course_status:course.status
        }, {
            where: {
                id: course.id
            }
        })
        return { status: true, result: "Cập nhật Khoá học thành công" }
    } catch (error) {
        return { status: false, msg: 'DB: Xảy ra lỗi khi cập nhật Khoá học' }
    }
}

const updateStatusCourse =async (course)=>{
    try {
        await Course.update({
            course_status:course.status
        }, {
            where: {
                id: course.id
            }
        })
        return { status: true, result: "Cập nhật Khoá học thành công" }
    } catch (error) {
        return { status: false, msg: 'DB: Xảy ra lỗi khi cập nhật Khoá học' }
    }
}

const checkAndUpdateCourseStatus=async(id_course)=>{
    try {
        const countCheckoutedCustomer=await Customer.count({
            include:[{
                model:Bed,
                where:{
                    bed_status:false,
                },
                attribute:['id']
            }],
            where:{
                id_course:id_course
            }
        })
        const countCustomerInCourse=await Customer.count({
            where:{
                id_course:id_course
            }
        })
        if(countCheckoutedCustomer===countCustomerInCourse){
            await Course.update({
                course_status:false
            }, {
                where: {
                    id: id_course
                }
            })
        }
        return { status:true, msg: 'Kiểm tra và cập nhật khoá học thành công'}
    } catch (error) {
        return { status: false, msg: 'DB: Xảy ra lỗi khi cập nhật Khoá học' }
    }
}

const deleteCourse = async (id) => {
    try {
        await Course.destroy({
            where: {
                id: id
            }
        })
        return { status: true, result: "Xoá Khoá học thành công" }
    } catch (error) {
        return { status: false, msg: 'DB: Xảy ra lỗi khi xoá Khoá học' }
    }
}

module.exports = {
    getAllCourse, insertCourse, updateCourse, deleteCourse, getEnableCourse, updateStatusCourse,
    checkAndUpdateCourseStatus, getDisableCourse
}