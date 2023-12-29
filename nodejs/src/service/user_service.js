import db from "../models/index";
import bcrypt from "bcrypt";

const User = db.Reception;

const checkLogin = async (account, password) => {
    const user = await User.findOne({
        where: {
            reception_account: account
        }
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

module.exports = { checkLogin }