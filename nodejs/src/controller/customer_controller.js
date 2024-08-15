import { validationResult } from "express-validator";
import customerService from "../service/customer_service";
import bedService from "../service/bed_service";
import base_controller from "../controller/base_controller"
import invoiceService from "../service/invoice_service";
import moment from "moment";

const getAllCustomer = async (req, res) => {
    try {
        const rs = await customerService.getAllCustomer();
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}


const getCustomerByCourseAndCompany = async (req, res) => {
    try {
        const id_course = parseInt(req.query.course);
        const id_company = parseInt(req.query.company);
        let rs;
        if (id_company === -1 && id_course === -1) {
            rs = await customerService.getAllCustomerDetail();
        } else if (id_company === -1 && id_course !== -1) {
            rs = await customerService.getCustomerDetailByIDCourse(id_course)
        } else if (id_company !== -1 && id_course === -1) {
            rs = await customerService.getCustomerDetailByIDCompany(id_company)
        } else {
            rs = await customerService.getCustomerByIDCourseAndIDCompany(id_course, id_company);
        }
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const getCustomerInUsedByCourseAndCompany = async (req, res) => {
    try {
        const id_course = parseInt(req.query.course);
        const id_company = parseInt(req.query.company);
        const dayFrom = moment(req.query.startdate, "DD/MM/YYYY");
        const dayTo = moment(req.query.enddate, "DD/MM/YYYY").set('hour', 23).set('minute', 59).set('second', 59);
        let rs;
        if (id_company === -1 && id_course === -1) {
            rs = await customerService.getCustomerInUsed(dayFrom, dayTo);
        } else if (id_company === -1 && id_course !== -1) {
            rs = await customerService.getCustomerInUsedByIDCourse(id_course, dayFrom, dayTo)
        } else if (id_company !== -1 && id_course === -1) {
            rs = await customerService.getCustomerInUsedByIDCompany(id_company, dayFrom, dayTo)
        } else {
            rs = await customerService.getCustomerInUsedByIDCourseAndIDCompany(id_course, id_company, dayFrom, dayTo);
        }
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const getRoomlessCustomerByCourseAndCompany = async (req, res) => {
    try {
        const id_course = parseInt(req.query.course);
        const id_company = parseInt(req.query.company);
        let rs;
        if (id_company === -1 && id_course === -1) {
            rs = await customerService.getAllRoomlessCustomer();
        } else if (id_company === -1 && id_course !== -1) {
            rs = await customerService.getRoomlessCustomerByIDCourse(id_course)
        } else if (id_company !== -1 && id_course === -1) {
            rs = await customerService.getRoomlessCustomerByIDCompany(id_company)
        } else {
            rs = await customerService.getRoomlessCustomerByIDCourseAndIDCompany(id_course, id_company);
        }
        console.log(rs.result)
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const getAvaiableCustomerByCourseAndCompany = async (req, res) => {
    try {
        const id_course = req.query.course;
        const id_company = req.query.company;
        const rs = await customerService.getAvaiableCustomerByIDCourseAndIDCompany(id_course, id_company);
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const getCustomerListByCourseAndCompany = async (req, res) => {
    try {
        const id_course = req.query.course;
        const id_company = req.query.company;
        const checkin_date = req.query.checkin ? moment(req.query.checkin) : new moment();
        const rs = await customerService.getCustomerListByCourseAndCompany(id_course, id_company, checkin_date);
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const insertCustomer = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    try {
        const customer = {
            name: req.body.name?.slice(0, 50),
            gender: req.body.gender,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone?.slice(0, 15),
            identification: req.body.identification?.slice(0, 15),
            company: req.body.company,
            course: req.body.course,
        }
        const rs = await customerService.insertCustomer(customer);
        if (rs.status) {
            const message = "đã khởi tạo khách hàng mới có mã " + rs.result.id;
            await base_controller.saveLog(req, res, message);
            return res.status(201).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const insertCustomerList = async (req, res) => {
    try {
        const customerList = req.body.customers;
        if (customerList.length > 0) {
            let error_list = [];
            for (let i = 0; i < customerList.length; i++) {
                const customer = {
                    name: customerList[i].customer_name?.slice(0, 50),
                    gender: customerList[i].customer_gender,
                    email: "",
                    address: "",
                    phone: String(customerList[i].customer_phone)?.slice(0, 12),
                    identification: String(customerList[i].customer_identification)?.slice(0, 12),
                    company: customerList[i].id_company,
                    course: customerList[i].id_course,
                }
                const findExstingCustomerResult = await customerService.findExistingCustomer(customer);
                if (!findExstingCustomerResult.status) {
                    error_list.push('Khách hàng ' + customerList[i].customer_name + ' thêm thất bại vì gặp lỗi khi kiểm tra thông tin');
                    continue;
                }
                if (findExstingCustomerResult.status && findExstingCustomerResult.result) {
                    error_list.push('Khách hàng ' + customerList[i].customer_name + ' thêm thất bại vì đã tồn tại');
                    continue;
                }
                if (customer.name.length <= 0) {
                    error_list.push('Khách hàng ' + customerList[i].customer_name + ' thêm thất bại vì không có tên');
                    continue;
                }
                if (customer.company === -1) {
                    error_list.push('Khách hàng ' + customerList[i].customer_name + ' thêm thất bại vì không có công ty');
                    continue;
                }
                if (customer.course === -1) {
                    error_list.push('Khách hàng ' + customerList[i].customer_name + ' thêm thất bại vì không có khoá học');
                    continue;
                }
                const rs = await customerService.insertCustomer(customer);
                if (!rs.status) {
                    error_list.push('Khách hàng ' + customerList[i].customer_name + ' thêm thất bại vì ' + rs.msg);
                }
            }
            const message = "đã thêm một danh sách khách hàng";
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: error_list });

        }

    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const updateCustomer = async (req, res) => {
    try {
        const customer = {
            id: req.body.id,
            name: req.body.name?.slice(0, 50),
            gender: req.body.gender,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone?.slice(0, 15),
            identification: req.body.identification?.slice(0, 15),
            company: req.body.company,
            course: req.body.course,
            status: req.body.status
        }
        const rs = await customerService.updateCustomer(customer);
        if (rs.status) {
            const message = "đã cập nhật thông tin khách hàng có mã " + customer.id;
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const updateCustomerList = async (req, res) => {
    try {
        const customerList = req.body.customer_list ? req.body.customer_list : [];
        let errorList = [];
        for (let i = 0; i < customerList.length; i++) {
            const customer = {
                id: customerList[i].id,
                name: customerList[i].customer_name?.slice(0, 50),
                gender: customerList[i].customer_gender,
                email: customerList[i].customer_email,
                address: customerList[i].customer_address,
                phone: customerList[i].customer_phone?.slice(0, 15),
                identification: customerList[i].customer_identification?.slice(0, 15),
                company: customerList[i].id_company,
                course: customerList[i].id_course,
                status: customerList[i].customer_status
            }
            const rs = await customerService.updateCustomer(customer);
            if (!rs.status) {
                errorList.push('Lỗi cập nhật khách hàng id=' + customer.id + ': ' + rs.msg);
            }
        }
        const message = "đã cập nhật thông tin danh sách khách hàng";
        await base_controller.saveLog(req, res, message);
        if (errorList.length === 0) {
            return res.status(200).json({ status: true, error_code: [] });
        } else {
            return res.status(200).json({ status: false, error_code: errorList });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const deleteOneCustomer = async (id) => {
    try {
        const count_bed = await bedService.countCustomerBed(id);
        const count_invoice = await invoiceService.countCustomerInvoice(id);
        if (count_bed.status && count_invoice.status && count_bed.result === 0 && count_invoice.result === 0) {
            const rs = await customerService.deleteCustomer(id);
            if (rs.status) {
                return { status: true, result: rs.result }
            } else {
                return { status: false, msg: rs.msg }
            }
        } else {
            return { status: false, msg: "Không thể xoá khách hàng có id=" + id + " vì đã thao tác trong hệ thống." }
        }
    } catch (error) {
        return { status: false, msg: 'Ctrl: Xảy ra lỗi khi xoá khách hàng có id=' + id }
    }
}

const deleteCustomer = async (req, res) => {
    try {
        const id = req.body.id;
        const deleteResult = await deleteOneCustomer(id);
        if (deleteResult.status) {
            const message = "đã xoá khách hàng có mã " + id;
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: deleteResult.result });
        } else {
            return res.status(500).json({ error_code: deleteResult.msg });
        }

    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}


const deleteCustomerList = async (req, res) => {
    try {
        const customerList = req.body.customer_list || [];
        let errorList = [];
        for (let i = 0; i < customerList.length; i++) {
            const deleteResult = await deleteOneCustomer(customerList[i]);
            if (!deleteResult.status) {
                errorList.push(deleteResult.msg);
            }
        }
        const message = "đã xoá một danh sách khách hàng có mã: " + customerList.join(',');
        await base_controller.saveLog(req, res, message);
        if (errorList.length === 0) {
            return res.status(200).json({ status: true, error_code: [] });
        } else {
            return res.status(200).json({ status: false, error_code: errorList });
        }
    } catch (error) {
        return res.status(500).json({error_code: "Ctrl: "+error.message})
    }
}

module.exports = {
    insertCustomer, insertCustomerList,
    updateCustomer, updateCustomerList,
    deleteCustomer, deleteCustomerList,
    getAllCustomer, getCustomerByCourseAndCompany, getAvaiableCustomerByCourseAndCompany, getCustomerInUsedByCourseAndCompany, getCustomerListByCourseAndCompany, getRoomlessCustomerByCourseAndCompany
}