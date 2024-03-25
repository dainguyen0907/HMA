import { validationResult } from "express-validator";
import { verifyJWT } from "../middlewares/jwt";
import receptionService from "../service/user_service";
import privilegeService from "../service/privilege_service";
import bcrypt from "bcrypt";
import base_controller from "../controller/base_controller"


const getUserPrivilege = async (req, res) => {
    try {
        const token = req.cookies.loginCode;
        const decoded = await verifyJWT(token);
        if (decoded.status) {
            const privilege_detail = await privilegeService.getPrivilegeByIDUser(decoded.decoded.reception_id);
            if (privilege_detail.status) {
                let privilege = [];
                privilege_detail.result.map((p) => {
                    privilege.push(p.id_privilege);
                });
                return res.status(200).json({ status: true, privilege: privilege });
            } else {
                return res.status(500).json(privilege_detail.msg);
            }

        } else {
            return res.status(500).json({ error_code: "Lỗi xác minh access token" });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const getAllReception = async (req, res) => {
    try {
        const allReception = await receptionService.getAllReception();
        if (allReception.status) {
            return res.status(200).json({ result: allReception.result });
        } else {
            return res.status(500).json({ error_code: allReception.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const deleteReception = async (req, res) => {
    try {
        const id_user = req.body.id;
        const rs = await receptionService.deleteReception(id_user);
        if (rs.status) {
            const message = "đã xoá người dùng có mã " + id_user;
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const insertReception = async (req, res) => {
    let account, password, name, email, phone;
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg })
    }
    try {
        account = req.body.account;
        password = req.body.password;
        name = req.body.name;
        email = req.body.email;
        phone = req.body.phone;
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALTROUND));
        const encryptPass = bcrypt.hashSync(password, salt);
        const reception = {
            account: account,
            password: encryptPass,
            name: name,
            email: email,
            phone: phone,
        }
        const rs = await receptionService.insertReception(reception);
        if (rs.status) {
            const message = "đã khởi tạo người dùng có mã " + rs.result.id;
            await base_controller.saveLog(req, res, message);
            return res.status(201).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const updateReception = async (req, res) => {
    let name, email, phone, status, id;
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg })
    }
    try {
        id = req.body.id;
        name = req.body.name;
        email = req.body.email;
        phone = req.body.phone;
        status = req.body.status;
        const reception = {
            id: id,
            name: name,
            email: email,
            phone: phone,
            status: status
        }
        const rs = await receptionService.updateReceptionInfor(reception);
        if (rs.status) {
            const message = "đã cập nhật thông tin người dùng có mã " + id;
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const updateReceptionPassword = async (req, res) => {
    try {
        const validate = validationResult(req);
        if (!validate.isEmpty()) {
            return res.status(400).json({ error_code: validate.errors[0].msg });
        }
        const password = req.body.password;
        const id = req.body.id;
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALTROUND))
        const encryptPass = bcrypt.hashSync(password, salt);
        const reception = {
            id: id,
            password: encryptPass,
        }
        const rs = await receptionService.updateReceptionPassword(reception);
        if (rs.status) {
            const message = "đã reset mật khẩu cho người dùng có mã " + id;
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const changeUserPassword = async (req, res) => {
    try {
        const token = req.cookies.loginCode;
        const decoded = await verifyJWT(token);
        if (!decoded.status)
            return res.status(500).json({ error_code: "Lỗi xác minh access token" });
        const id = decoded.decoded.reception_id;
        const validate = validationResult(req);
        if (validate != null) {
            return res.status(400).json({ error_code: validate.errors[0].msg });
        }
        const oldpassword = req.body.oldpassword;
        const newpassword = req.body.newpassword;
        const passwordChecking = await receptionService.checkPassword(id, oldpassword);
        if (!passwordChecking.status) {
            return res.status(400).json({ error_code: passwordChecking.msg });
        }
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALTROUND))
        const encryptPass = bcrypt.hashSync(newpassword, salt);
        const reception = {
            id: id,
            password: encryptPass,
        }
        const rs = await reception.updateReceptionPassword(reception);
        if (rs.status) {
            const message = "đã thay đổi mật khẩu";
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }

}


module.exports = {
    getUserPrivilege, getAllReception, deleteReception,
    insertReception, updateReception, updateReceptionPassword,
    changeUserPassword
};