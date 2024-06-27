import db from "../models/index";
import { Op, where } from "sequelize";

const Bed = db.Bed;
const Customer = db.Customer;
const BedType = db.Bed_type;
const Room = db.Room;
const Price = db.Price;
const Floor = db.Floor;
const Course = db.Course;
const Company = db.Company;

Bed.belongsTo(Customer, { foreignKey: 'id_customer' });
Bed.belongsTo(BedType, { foreignKey: 'id_bed_type' });
Bed.belongsTo(Room, { foreignKey: 'id_room' });
BedType.belongsTo(Price, { foreignKey: 'bed_type_default_price' })
Bed.belongsTo(Price, { foreignKey: 'id_price' });
Room.belongsTo(Floor, { foreignKey: 'id_floor' });
Customer.belongsTo(Course, { foreignKey: 'id_course' });
Customer.belongsTo(Company, { foreignKey: 'id_company' });


const countBedInUsedByRoomID = async (id_room) => {
    try {
        const countBed = await Bed.count({
            where: {
                id_room: id_room,
                bed_status: true,
                [Op.or]: {
                    bed_checkout: {
                        [Op.lte]: new Date().toLocaleString()
                    },
                    [Op.and]: {
                        bed_checkin: {
                            [Op.lte]: new Date().toLocaleString()
                        },
                        bed_checkout: {
                            [Op.gte]: new Date().toLocaleString()
                        }
                    }
                }

            }
        })
        return { status: true, result: countBed }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' };
    }
}

const getBedInRoom = async (id_room) => {
    try {
        const findBed = await Bed.findAll({
            include: [{
                model: Customer,
                include: [{
                    model: Company,
                    attributes: ['company_name']
                }, {
                    model: Course,
                    attributes: ['course_name']
                }]
            }, Room, Price, {
                model: BedType,
                include: [Price]
            }
            ],
            where: {
                id_room: id_room,
                bed_status: true,
                [Op.or]: {
                    bed_checkout: {
                        [Op.lte]: new Date().toLocaleString()
                    },
                    [Op.and]: {
                        bed_checkin: {
                            [Op.lte]: new Date().toLocaleString()
                        },
                        bed_checkout: {
                            [Op.gte]: new Date().toLocaleString()
                        }
                    }
                }
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' };
    }
}

const countBedInRoom = async (id_room) => {
    try {
        const findBed = await Bed.count({
            where: { id_room: id_room }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' };
    }
}

const getRevenueBed = async (dayFrom, dayTo) => {
    try {
        const countCheckin = await Bed.count({
            col: 'bed_checkout',
            where: {
                bed_checkout: {
                    [Op.between]: [dayFrom, dayTo]
                },
                bed_status: false,
            },
        });
        const countRoom = await Bed.count({
            col: 'id_room',
            distinct: true,
            where: {
                bed_checkout: {
                    [Op.between]: [dayFrom, dayTo]
                },
                bed_status: false,
            },
        })
        return { status: true, result: { countCheckin: countCheckin, countRoom: countRoom } }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' };
    }
}

const getRevenueBedInArea = async (dayFrom, dayTo, id_area) => {
    try {
        const countCheckin = await Room.count({
            include: [{
                model: Floor,
                where: {
                    id_area: id_area
                }
            }, {
                model: Bed,
                where: {
                    bed_checkout: {
                        [Op.between]: [dayFrom, dayTo]
                    },
                    bed_status: false,
                }
            }],
        })
        const countRoom = await await Room.count({
            col: 'id',
            distinct: true,
            include: [{
                model: Floor,
                where: {
                    id_area: id_area
                }
            }, {
                model: Bed,
                where: {
                    bed_checkout: {
                        [Op.between]: [dayFrom, dayTo]
                    },
                    bed_status: false
                }
            }]
        });

        return { status: true, result: { countCheckin: countCheckin, countRoom: countRoom } }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' };
    }
}

const getBedInInvoice = async (id_invoice) => {
    try {
        const findBed = await Bed.findAll({
            include: [Customer, Room, BedType, Price],
            where: {
                id_invoice: id_invoice,
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' };
    }
}

const insertBed = async (bed) => {
    try {
        const rs = await Bed.create({
            id_room: bed.id_room,
            id_customer: bed.id_customer,
            id_price: bed.id_price,
            id_bed_type: bed.id_bed_type,
            bed_checkin: bed.bed_checkin,
            bed_checkout: bed.bed_checkout,
            bed_status: true,
            bed_deposit: bed.bed_deposit,
            bed_lunch_break: bed.bed_lunch_break
        });
        return { status: true, result: rs };
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi khởi tạo dữ liệu" };
    }
}

const updateBed = async (bed) => {
    try {
        await Bed.update({
            id_bed_type: bed.id_bed_type,
            id_price: bed.id_price,
            bed_checkin: bed.bed_checkin,
            bed_checkout: bed.bed_checkout,
            bed_deposit: bed.bed_deposit,
            bed_lunch_break: bed.bed_lunch_break,
        }, {
            where: {
                id: bed.id
            }
        });
        return { status: true, result: "Cập nhật thành công" };
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi cập nhật dữ liệu" };
    }
}

const updateTimeInBed = async (bed) => {
    try {
        await Bed.update({
            bed_checkin: bed.bed_checkin,
            bed_checkout: bed.bed_checkout,
            bed_lunch_break: bed.bed_lunch_break,
        }, {
            where: {
                id: bed.id
            }
        })
        return { status: true, result: "Cập nhật thành công" }
    } catch (error) {
        return { status: false, msg: 'DB:Lỗi khi cập nhật dữ liệu' }
    }
}

const updateBedStatus = async (bed) => {
    try {
        await Bed.update({
            bed_status: bed.bed_status,
            id_invoice: bed.id_invoice,
            id_price: bed.id_price,
        }, {
            where: {
                id: bed.id
            }
        });
        return { status: true, result: "Cập nhật thành công" };
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi cập nhật dữ liệu" };
    }
}

const updateBedStatusByInvoice = async (bed) => {
    try {
        await Bed.update({
            bed_status: bed.bed_status,
            id_invoice: null,
        }, {
            where: {
                id_invoice: bed.id_invoice,
            }
        });
        return { status: true, result: "Cập nhật thành công" };
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi cập nhật dữ liệu" };
    }
}

const changeRoom = async (bed) => {
    try {
        await Bed.update({
            id_room: bed.id_room
        }, {
            where: {
                id: bed.id_bed
            }
        });
        return { status: true, result: "Cập nhật thành công" };
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi cập nhật dữ liệu" };
    }
}

const getBedByID = async (id) => {
    try {
        const findBed = await Bed.findOne({
            include: [Customer, BedType, Room],
            where: {
                id: id
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' };
    }
}

const getBedByIDPrice = async (id_price) => {
    try {
        const findBed = await Bed.findAll({
            where: {
                id_price: id_price
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' };
    }
}

const getBedByIDBedType = async (id_bed_type) => {
    try {
        const findBed = await Bed.findAll({
            where: {
                id_bed_type: id_bed_type
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' };
    }
}

const getUnpaidBedByIDCourseAndIDCompany = async (id_course, id_company) => {
    try {
        const findBed = await Bed.findAll({
            include: [{
                model: Customer,
                where: {
                    id_company: id_company,
                    id_course: id_course,
                }
            }],
            where: {
                bed_status: false
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' };
    }
}

const countCustomerBed = async (id_customer) => {
    try {
        const findBed = await Bed.count({
            where: {
                id_customer: id_customer
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' };
    }
}

const deleteBed = async (id_bed) => {
    try {
        await Bed.destroy({
            where: {
                id: id_bed
            }
        })
        return { status: true, result: 'Xoá giường thành công' }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi xoá dữ liệu.' };
    }
}

const checkoutSingleBed = async (id_bed) => {
    try {
        await Bed.update({
            bed_status: false,
        }, {
            where: {
                id: id_bed
            }
        })
        return { status: true, result: 'Cập nhật thành công' }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi cập nhật Giường' }
    }
}

const checkoutForCustomer = async (id_customer) => {
    try {
        await Bed.update({
            bed_status: false,
        }, {
            where: {
                id_customer: id_customer
            }
        })
        return { status: true, result: 'Cập nhật thành công' }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi cập nhật Giường' }
    }
}

const checkoutForCustomerList = async (idCustomerList) => {
    try {
        await Bed.update({
            bed_status: false,
        }, {
            where: {
                id_customer: {
                    [Op.in]: idCustomerList
                }
            }
        })
        return { status: true, result: 'Cập nhật thành công' }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi cập nhật Giường' }
    }
}

const getAllUnpaidBed = async () => {
    try {
        const findBed = await Bed.findAll({
            include: [Customer, BedType, Room, Price],
            where: {
                bed_status: false,
                id_invoice: null
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' };
    }
}

const getUnpaidBedByCompany = async (id_company) => {
    try {
        const findBed = await Bed.findAll({
            include: [{
                model: Customer,
                where: {
                    id_company: id_company
                }
            }, BedType, Room, Price],
            where: {
                bed_status: false,
                id_invoice: null
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' };
    }
}

const getUnpaidBedByCourse = async (id_course) => {
    try {
        const findBed = await Bed.findAll({
            include: [{
                model: Customer,
                where: {
                    id_course: id_course
                }
            }, BedType, Room, Price],
            where: {
                bed_status: false,
                id_invoice: null
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' };
    }
}

const getUnpaidBedByCompanyAndCourse = async (id_company, id_course) => {
    try {
        const findBed = await Bed.findAll({
            include: [{
                model: Customer,
                where: {
                    id_company: id_company,
                    id_course: id_course
                }
            }, BedType, Room, Price],
            where: {
                bed_status: false,
                id_invoice: null
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' };
    }
}

const countAvaiableBedInRoom = async (id_room) => {
    try {
        const roomInfor = await Room.findOne({
            where: {
                id: id_room,
            },
            attributes: ['room_bed_quantity']
        });
        if (roomInfor) {
            const countBedResult = await Bed.count({
                where: {
                    id_room: id_room,
                    bed_status: true,
                    [Op.or]: {
                        bed_checkout: {
                            [Op.lte]: new Date().toLocaleString()
                        },
                        [Op.and]: {
                            bed_checkin: {
                                [Op.lte]: new Date().toLocaleString()
                            },
                            bed_checkout: {
                                [Op.gte]: new Date().toLocaleString()
                            }
                        }
                    }
                }
            });
            const avaiableBed = parseInt(roomInfor.room_bed_quantity) - parseInt(countBedResult);
            return { status: true, result: avaiableBed }
        } else {
            return { status: true, result: 0 }
        }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi kiểm tra phòng hợp lệ!' }
    }
}

const getAllCheckoutedBed = async (start_date, end_date) => {
    try {
        const searchResult = await Bed.findAll({
            include: [{
                model: Customer,
                include: [{
                    model: Company,
                    attributes: ['company_name']
                }, {
                    model: Course,
                    attributes: ['course_name']
                }]
            }, Room, Price, BedType],
            where: {
                bed_status: false,
                bed_checkin: {
                    [Op.between]: [start_date, end_date]
                }
            }
        })
        return { status: true, result: searchResult }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' }
    }
}

const getCheckoutedBedByCourse = async (id_course, start_date, end_date) => {
    try {
        const searchResult = await Bed.findAll({
            include: [{
                model: Customer,
                include: [{
                    model: Company,
                    attributes: ['company_name']
                }, {
                    model: Course,
                    attributes: ['course_name']
                }],
                where: {
                    id_course: id_course
                }
            }, Room, Price, BedType],
            where: {
                bed_status: false,
                bed_checkin: {
                    [Op.between]: [start_date, end_date]
                }
            }
        })
        return { status: true, result: searchResult }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' }
    }
}

const getCheckoutedBedByCompany = async (id_company, start_date, end_date) => {
    try {
        const searchResult = await Bed.findAll({
            include: [{
                model: Customer,
                include: [{
                    model: Company,
                    attributes: ['company_name']
                }, {
                    model: Course,
                    attributes: ['course_name']
                }],
                where: {
                    id_company: id_company
                }
            }, Room, Price, BedType],
            where: {
                bed_status: false,
                bed_checkin: {
                    [Op.between]: [start_date, end_date]
                }
            }
        })
        return { status: true, result: searchResult }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' }
    }
}

const getCheckoutedBedByCourseAndCompany = async (id_course, id_company, start_date, end_date) => {
    try {
        const searchResult = await Bed.findAll({
            include: [{
                model: Customer,
                include: [{
                    model: Company,
                    attributes: ['company_name']
                }, {
                    model: Course,
                    attributes: ['course_name']
                }],
                where: {
                    id_course: id_course,
                    id_company: id_company
                }
            }, Room, Price, BedType],
            where: {
                bed_status: false,
                bed_checkin: {
                    [Op.between]: [start_date, end_date]
                }
            }
        })
        return { status: true, result: searchResult }
    } catch (error) {
        return { status: false, msg: 'DB: Lỗi khi truy vấn dữ liệu' }
    }
}

module.exports = {
    countBedInUsedByRoomID, insertBed, getBedInRoom, updateBed, updateTimeInBed, changeRoom, getBedByID,
    updateBedStatus, getBedInInvoice, updateBedStatusByInvoice, countBedInRoom,
    countCustomerBed, deleteBed, getRevenueBed, getRevenueBedInArea, getBedByIDPrice, getBedByIDBedType,
    getUnpaidBedByIDCourseAndIDCompany, getAllUnpaidBed, getUnpaidBedByCompany,
    getUnpaidBedByCourse, getUnpaidBedByCompanyAndCourse, countAvaiableBedInRoom, getAllCheckoutedBed,
    getCheckoutedBedByCompany, getCheckoutedBedByCourse, getCheckoutedBedByCourseAndCompany,
    checkoutForCustomerList, checkoutForCustomer, checkoutSingleBed
}