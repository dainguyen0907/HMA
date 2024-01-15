import db from "../models/index";
import bcrypt from "bcrypt";

const User = db.Reception;


const checkLogin = async (account, password) => {
    const user = await User.findOne({
        where: {
            reception_account: account
        },
        raw: true,
        nest: true,
    });
    if (user != null) {
        if (user.reception_status != true) {
            return { status: false, msg: "Tài khoản đã bị khoá đăng nhập" };
        }
        const match = await bcrypt.compare(password, user.reception_password);
        if (match) {
            return { status: true, user: user };
        }
        else {
            return { status: false, msg: "Mật khẩu không chính xác" };
        }
    }
    else {
        return { status: false, msg: "Tên đăng nhập không tồn tại" };
    }
}

const getAllReception = async () => {
    try {
        const allReception = await User.findAll();
        return { status: true, result: allReception }
    } catch (error) {
        return { status: false, msg: error }
    }
}

const deleteReception = async (id_user) => {
    try {
        await User.destroy({
            where: {
                id: id_user
            }
        })
        return { status: true, result: "Xoá thành công" }
    } catch (error) {
        return { status: false, msg: error }
    }
}

const insertReception = async (reception) => {
    try {
        const newReception = await User.create({
            reception_account: reception.account,
            reception_password:reception.password,
            reception_name: reception.name,
            reception_email: reception.email,
            reception_phone: reception.phone,
            reception_status: true
        });
        return {status:true,result:newReception}
    } catch (error) {
        return { status: false, msg: error }
    }
}


module.exports = {
    checkLogin, getAllReception, deleteReception,insertReception
}