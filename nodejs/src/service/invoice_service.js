import db from "../models/index";

const Invoice = db.Invoice;
const InvoiceDetail=db.invoice_detail;
const PaymentMethod=db.Payment_method;
const Customer=db.Customer;

Invoice.belongsTo(PaymentMethod,{foreignKey:'id_payment_method'});
Invoice.belongsTo(Customer,{foreignKey:'id_customer'});
Invoice.hasMany(InvoiceDetail,{foreignKey:'id_invoice'});

const getAllInvoice = async () => {
    try {
        const invoice = await Invoice.findAll({
            include:[PaymentMethod,Customer,InvoiceDetail],
            order:[
                ['id','ASC']
            ],
        });
        return { status: true, result: invoice }
    } catch (error) {
        return { status: false, msg: "Lỗi khi truy vấn dữ liệu" }
    }
}

const insertInvoice = async (invoice) => {
    try {
        const newInvoice = await Invoice.create({
            id_payment_method: invoice.id_payment,
            id_customer: invoice.id_customer,
            invoice_receipt_date: invoice.receipt_date,
            invoice_payment_date: invoice.payment_date,
            invoice_deposit: invoice.deposit,
            invoice_total_payment: invoice.total_payment,
            invoice_note: invoice.note,
        });
        return { status: true, result: newInvoice }
    } catch (error) {
        return { status: false, msg: "Lỗi khi khởi tạo dữ liệu" }
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
        },{
            where:{
                id:invoice.id
            }
        });
        return { status: true, result: "Cập nhật thành công" }
    } catch (error) {
        return { status: false, msg: "Lỗi khi cập nhật dữ liệu" }
    }
}

const deleteInvoice=async(id)=>{
    try {
        await Invoice.destroy({
            where:{id:id}
        })
        return { status: true, result: "Xoá thành công" }
    } catch (error) {
        return { status: false, msg: "Lỗi khi cập nhật dữ liệu" }
    }
}

const createInvoiceDetail=async(detail)=>{
    try {
        const newInvoice = await InvoiceDetail.create({
            id_invoice:detail.id_invoice,
            product_name:detail.product_name,
            product_value:detail.product_value,
            product_total_price:detail.product_total_price
        });
        return { status: true, result: newInvoice }
    } catch (error) {
        return { status: false, msg: "Lỗi khi cập nhật dữ liệu" }
    }
}

module.exports = {
    getAllInvoice, insertInvoice, updateInvoice, deleteInvoice, createInvoiceDetail
}