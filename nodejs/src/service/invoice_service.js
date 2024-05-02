import db from "../models/index";
import { Op } from "sequelize";

const Invoice = db.Invoice;
const InvoiceDetail = db.invoice_detail;
const PaymentMethod = db.Payment_method;
const Customer = db.Customer;
const Bed = db.Bed;
const Room = db.Room;
const Floor = db.Floor;

Invoice.belongsTo(PaymentMethod, { foreignKey: 'id_payment_method' });
Invoice.belongsTo(Customer, { foreignKey: 'id_customer' });
Invoice.hasMany(InvoiceDetail, { foreignKey: 'id_invoice' });
Invoice.hasMany(Bed, { foreignKey: 'id_invoice' });
Room.hasMany(Bed, { foreignKey: 'id_room' });
Floor.hasMany(Room, { foreignKey: 'id_floor' });


const getAllInvoice = async () => {
    try {
        const invoice = await Invoice.findAll({
            include: [PaymentMethod, Customer, InvoiceDetail,
                {
                    model: Bed,
                    include: [Room]
                }],
            order: [
                ['id', 'ASC']
            ],
        });
        return { status: true, result: invoice }
    } catch (error) {
        console.log(error)
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu" }
    }
}

const getRevenueInvoice = async (dayFrom, dayTo) => {
    try {
        const countInvoice = await Invoice.count({
            where: {
                invoice_payment_date: {
                    [Op.between]: [dayFrom, dayTo]
                }
            },
            col: 'id',
            distinct: true
        });
        const sumPayment = await Invoice.sum('invoice_total_payment', {
            where: {
                invoice_payment_date: {
                    [Op.between]: [dayFrom, dayTo]
                }
            },
        });
        const data = await Invoice.findAll({
            include: [PaymentMethod, Customer, InvoiceDetail,
                { model: Bed, include: [Room] }],
            where: {
                invoice_payment_date: {
                    [Op.between]: [dayFrom, dayTo]
                }
            },
            order: [
                ['id', 'ASC']
            ],
        })
        return { status: true, result: { countInvoice: countInvoice, sumPayment: sumPayment, data: data } }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu" }
    }
}

const getRevenueInvoiceInArea = async (dayFrom, dayTo, id_area) => {
    try {
        let roomList = [];
        const rooms = await Room.findAll({
            attributes: ['id'],
            include: [{
                model: Floor,
                where: { id_area: id_area },
                attributes: []
            }],
            raw: true
        });
        rooms.forEach(element => {
            roomList.push(element.id);
        });
        const countInvoice = await Invoice.count({
            include: [{
                model: Bed,
                where: {
                    id_room: {
                        [Op.in]: roomList
                    }
                }
            }],
            where: {
                invoice_payment_date: {
                    [Op.between]: [dayFrom, dayTo]
                }
            },
            col: 'id',
            distinct: true,
        });
        let sumPayment = 0;
        const data = await Invoice.findAll({
            include: [PaymentMethod, Customer, InvoiceDetail, {
                model: Bed,
                where: {
                    id_room: {
                        [Op.in]: roomList
                    }
                },
                include: [Room]
            }],
            where: {
                invoice_payment_date: {
                    [Op.between]: [dayFrom, dayTo]
                }
            },
            order: [
                ['id', 'ASC']
            ],
        })
        data.forEach(element => {
            sumPayment += parseInt(element.invoice_total_payment);
        })
        return { status: true, result: { countInvoice: countInvoice, sumPayment: sumPayment, data: data } }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu" }
    }
}

const getRevenueInvoiceHaveService = async (dayFrom, dayTo) => {
    try {
        let invoiceList=[];
        const searchData = await Invoice.findAll({
            col:'id',
            include: [{
                model: InvoiceDetail,
                where: {
                    product_value: {
                        [Op.gt]: 0
                    }
                }
            }],
            where: {
                invoice_payment_date: {
                    [Op.between]: [dayFrom, dayTo]
                }
            },
        });
        searchData.forEach(element=>{
            invoiceList.push(element.id);
        })
        const data=await Invoice.findAll({
            include: [PaymentMethod, Customer, InvoiceDetail,
                { model: Bed, include: [Room] }],
            where: {
                id: {
                    [Op.in]: invoiceList
                }
            },
            order: [
                ['id', 'ASC']
            ],
        })
        return { status: true, result: data }
    } catch (error) {
        console.log(error)
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu" }
    }
}

const insertInvoice = async (invoice) => {
    try {
        const newInvoice = await Invoice.create({
            id_payment_method: invoice.id_payment,
            id_customer: invoice.id_customer,
            invoice_code:invoice.invoice_code,
            invoice_reception_name:invoice.reception,
            invoice_discount:invoice.discount,
            invoice_receipt_date: invoice.receipt_date,
            invoice_payment_date: invoice.payment_date,
            invoice_deposit: invoice.deposit,
            invoice_total_payment: invoice.total_payment,
            invoice_note: invoice.note,
        });
        return { status: true, result: newInvoice }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi khởi tạo dữ liệu" }
    }
}

const updateInvoice = async (invoice) => {
    try {
        await Invoice.update({
            id_payment_method: invoice.id_payment,
            invoice_receipt_date: invoice.receipt_date,
            invoice_payment_date: invoice.payment_date,
            invoice_deposit: invoice.deposit,
            invoice_total_payment: invoice.total_payment,
            invoice_note: invoice.note,
        }, {
            where: {
                id: invoice.id
            }
        });
        return { status: true, result: "Cập nhật thành công" }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi cập nhật dữ liệu" }
    }
}

const deleteInvoice = async (id) => {
    try {
        await Invoice.destroy({
            where: { id: id }
        })
        return { status: true, result: "Xoá thành công" }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi xoá dữ liệu" }
    }
}

const deleteInvoiceDetail = async (id_invoice) => {
    try {
        await InvoiceDetail.destroy({
            where: { id_invoice: id_invoice }
        })
        return { status: true, result: "Xoá thành công" }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi xoá dữ liệu" }
    }
}

const createInvoiceDetail = async (detail) => {
    try {
        const newInvoice = await InvoiceDetail.create({
            id_invoice: detail.id_invoice,
            product_name: detail.product_name,
            product_value: detail.product_value,
            product_total_price: detail.product_total_price
        });
        return { status: true, result: newInvoice }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi khởi tạo dữ liệu" }
    }
}

const countCustomerInvoice = async (id_customer) => {
    try {
        const count = await Invoice.count({
            where: {
                id_customer: id_customer
            }
        })
        return { status: true, result: count }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi khởi tạo dữ liệu" }
    }
}

module.exports = {
    getAllInvoice, insertInvoice, updateInvoice, deleteInvoice, createInvoiceDetail,
    deleteInvoiceDetail, countCustomerInvoice, getRevenueInvoice, getRevenueInvoiceInArea,
    getRevenueInvoiceHaveService
}