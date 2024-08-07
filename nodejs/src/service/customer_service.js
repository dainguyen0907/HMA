
import { Op, where } from "sequelize";
import db from "../models/index";


const Customer = db.Customer;
const Company = db.Company;
const Course = db.Course;
const Bed = db.Bed;
const Room = db.Room;
const Price = db.Price;

Customer.belongsTo(Company, { foreignKey: 'id_company' });
Customer.belongsTo(Course, { foreignKey: 'id_course' });
Customer.hasMany(Bed, { foreignKey: 'id_customer' });
Bed.belongsTo(Room, { foreignKey: 'id_room' });
Bed.belongsTo(Price, { foreignKey: 'id_price' });

const getAllCustomer = async () => {
    try {
        const customer = await Customer.findAll({
            raw: true,
            nest: true,
            order: [
                ['id', 'ASC']
            ],
        });
        return { status: true, result: customer }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}


const getCustomerByIDCompany = async (id_company) => {
    try {
        const customers = await Customer.findAll({
            raw: true,
            nest: true,
            where: {
                id_company: id_company
            }
        })
        return { status: true, result: customers }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getCustomerByIDCourse = async (id_course) => {
    try {
        const customers = await Customer.findAll({
            raw: true,
            nest: true,
            where: {
                id_course: id_course
            }
        })
        return { status: true, result: customers }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}


const getCustomerByIDCourseAndIDCompany = async (id_course, id_company) => {
    try {
        const customers = await Customer.findAll({
            include: [
                Course, Company, {
                    model: Bed,
                    include: [Room, Price],
                }
            ],
            where: {
                id_course: id_course,
                id_company: id_company,
            }
        })
        return { status: true, result: customers }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getCustomerListByCourseAndCompany = async (id_course, id_company, checkin_date) => {
    try {
        const currentBed = await Bed.findAll({
            attributes: ['id', 'id_customer'],
            where: {
                [Op.and]: {
                    bed_checkin: {
                        [Op.lte]: checkin_date
                    },
                    bed_checkout: {
                        [Op.gte]: checkin_date
                    },
                    bed_status: true,
                }
            }
        })
        const customers = await Customer.findAll({
            include: [Bed],
            where: {
                id_course: id_course,
                id_company: id_company,
            }
        })
        let result = [];
        if (currentBed.length === 0)
            result = customers
        else
            customers.forEach((value, index) => {
                if (value.Beds === null)
                    result.push(value)
                else {
                    let countDifferentItem = 0;
                    for (let i = 0; i < currentBed.length; i++) {
                        if (value.id === currentBed[i].id_customer)
                            break;
                        countDifferentItem += 1;
                    }
                    if (countDifferentItem === currentBed.length) {
                        result.push(value);
                    }
                }
            })
        return { status: true, result: result }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getCustomerDetailByIDCourse = async (id_course) => {
    try {
        const customers = await Customer.findAll({
            include: [
                Course, Company, {
                    model: Bed,
                    include: [Room, Price],
                }
            ],
            where: {
                id_course: id_course,
            }
        })
        return { status: true, result: customers }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getCustomerDetailByIDCompany = async (id_company) => {
    try {
        const customers = await Customer.findAll({
            include: [
                Course, Company, {
                    model: Bed,
                    include: [Room, Price],
                }
            ],
            where: {
                id_company: id_company,
            }
        })
        return { status: true, result: customers }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getAllCustomerDetail = async () => {
    try {
        const customers = await Customer.findAll({
            include: [
                Course, Company, {
                    model: Bed,
                    include: [Room, Price],
                }
            ],
        })
        return { status: true, result: customers }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getCustomerInUsedByIDCourseAndIDCompany = async (id_course, id_company, start_date, end_date) => {
    try {
        const customers = await Customer.findAll({
            include: [
                Course, Company, {
                    model: Bed,
                    include: [Room, Price],
                    where: {
                        bed_checkin: {
                            [Op.between]: [start_date, end_date]
                        }
                    }
                }
            ],
            where: {
                id_course: id_course,
                id_company: id_company,
            }
        })
        return { status: true, result: customers }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getCustomerInUsedByIDCourse = async (id_course, start_date, end_date) => {
    try {
        const customers = await Customer.findAll({
            include: [
                Course, Company, {
                    model: Bed,
                    include: [Room, Price],
                    where: {
                        bed_checkin: {
                            [Op.between]: [start_date, end_date]
                        }
                    }
                }
            ],
            where: {
                id_course: id_course,
            }
        })
        return { status: true, result: customers }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getCustomerInUsedByIDCompany = async (id_company, start_date, end_date) => {
    try {
        const customers = await Customer.findAll({
            include: [
                Course, Company, {
                    model: Bed,
                    include: [Room, Price],
                    where: {
                        bed_checkin: {
                            [Op.between]: [start_date, end_date]
                        }
                    }
                }
            ],
            where: {
                id_company: id_company,
            }
        })
        return { status: true, result: customers }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getCustomerInUsed = async (start_date, end_date) => {
    try {
        const customers = await Customer.findAll({
            include: [
                Course, Company, {
                    model: Bed,
                    include: [Room, Price],
                    where: {
                        bed_checkin: {
                            [Op.between]: [start_date, end_date]
                        }
                    }
                }
            ],
        })
        return { status: true, result: customers }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getRoomlessCustomerByIDCourseAndIDCompany = async (id_course, id_company) => {
    try {
        const customers = await Customer.findAll({
            include: [
                Course, Company, {
                    model: Bed,
                    include: [Room, Price]
                }
            ],
            where: {
                id_course: id_course,
                id_company: id_company,
            }
        });
        const filterResult= customers.filter(value=>value.Beds.length===0);
        return { status: true, result: filterResult }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getRoomlessCustomerByIDCourse = async (id_course) => {
    try {
        const customers = await Customer.findAll({
            include: [
                Course, Company, {
                    model: Bed,
                    include: [Room, Price],
                }
            ],
            where: {
                id_course: id_course,
            }
        })
        const filterResult= customers.filter(value=>value.Beds.length===0);
        return { status: true, result: filterResult }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getRoomlessCustomerByIDCompany = async (id_company) => {
    try {
        const customers = await Customer.findAll({
            include: [
                Course, Company, {
                    model: Bed,
                    include: [Room, Price]
                }
            ],
            where: {
                id_company: id_company,
            }
        })
        const filterResult= customers.filter(value=>value.Beds.length===0);
        return { status: true, result: filterResult }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getAllRoomlessCustomer = async () => {
    try {
        const customers = await Customer.findAll({
            include: [
                Course, Company, {
                    model: Bed,
                    include: [Room, Price],
                }
            ],
        })
        const filterResult= customers.filter(value=>value.Beds.length===0);
        return { status: true, result: filterResult }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getAvaiableCustomerByIDCourseAndIDCompany = async (id_course, id_company) => {
    try {
        let customers = [];
        if (parseInt(id_course) === -1 && parseInt(id_company) === -1) {
            customers = await Customer.findAll({
                where: {
                    id_course: id_course,
                    id_company: id_company,
                }
            })
        } else {
            const customerList = await Customer.findAll({
                where: {
                    id_course: id_course,
                    id_company: id_company,
                },
                include: [{
                    model: Bed
                }]
            })
            customerList.forEach(value => {
                if (!value.Bed) {
                    customers.push(value)
                }
            })
        }
        return { status: true, result: customers }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getCustomerByCourseAndCompanyList = async (id_course, idCompanyList) => {
    try {
        const searchResult = await Customer.findAll({
            where: {
                id_course: id_course,
                id_company: {
                    [Op.in]: idCompanyList
                }
            }
        });
        return { status: true, result: searchResult }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu khách hàng' }
    }
}

const findExistingCustomer = async (customer) => {
    try {
        const searchResult = await Customer.findOne({
            where: {
                customer_name: customer.name,
                customer_identification: customer.identification,
                id_company: customer.company,
                id_course: customer.course
            }
        })
        return { status: true, result: searchResult }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu Khách hàng' }
    }
}

const insertCustomer = async (customer) => {
    try {
        const rs = await Customer.create({
            id_company: customer.company,
            id_course: customer.course,
            customer_name: customer.name,
            customer_gender: customer.gender,
            customer_email: customer.email,
            customer_address: customer.address,
            customer_phone: customer.phone,
            customer_identification: customer.identification,
            customer_status: true
        });
        return { status: true, result: rs }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi khởi tạo dữ liệu" }
    }
}

const updateCustomer = async (customer) => {
    try {
        await Customer.update({
            id_company: customer.company,
            id_course: customer.course,
            customer_name: customer.name,
            customer_gender: customer.gender,
            customer_email: customer.email,
            customer_address: customer.address,
            customer_phone: customer.phone,
            customer_identification: customer.identification,
            customer_status: customer.status
        }, {
            where: { id: customer.id }
        });
        return { status: true, result: "Cập nhật Khách hàng thành công" }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi cập nhật dữ liệu" }
    }
}

const deleteCustomer = async (id) => {
    try {
        await Customer.destroy({
            where: { id: id }
        });
        return { status: true, result: "Xoá thành công" }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi xoá dữ liệu" }
    }
}


module.exports = {
    insertCustomer, 
    updateCustomer, 
    deleteCustomer, 
    getAllCustomer, getCustomerByIDCompany, getCustomerByIDCourse, getCustomerByIDCourseAndIDCompany, getAvaiableCustomerByIDCourseAndIDCompany, getCustomerByCourseAndCompanyList, getCustomerInUsedByIDCourseAndIDCompany, getCustomerInUsedByIDCompany, getCustomerInUsedByIDCourse, getCustomerInUsed,
    getCustomerDetailByIDCompany, getCustomerDetailByIDCourse, getAllCustomerDetail, findExistingCustomer, getCustomerListByCourseAndCompany, getRoomlessCustomerByIDCompany, getRoomlessCustomerByIDCourse, getRoomlessCustomerByIDCourseAndIDCompany, getAllRoomlessCustomer
}