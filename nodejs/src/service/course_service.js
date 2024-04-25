import db from "../models/index";

const Course = db.Course;

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
    getAllCourse, insertCourse, updateCourse, deleteCourse, getEnableCourse
}