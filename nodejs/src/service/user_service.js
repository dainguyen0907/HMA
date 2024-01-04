import db from "../models/index";
import bcrypt from "bcrypt";

const User = db.Reception;
const Privilege_detail=db.Privilege_detail;

Privilege_detail.belongsTo(User,{foreignKey:'id_user'});
User.hasMany(Privilege_detail,{foreignKey:'id_user'});

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

const getPrivilegeByIDUser=async(id)=>{
    const privilege= await Privilege_detail.findAll({
        where: {id_user:id},
        raw:true,
        nest:true
    });
    return privilege;
}

const getUserByID=async (id)=>{
    const user = await User.findByPk(id); 
    if(user!=null)
    {
        return {status:true,user:user};
    }else{
        return {status:false,msg:"Không tìm thấy người dùng"}
    }
}

module.exports = { checkLogin, getUserByID, getPrivilegeByIDUser }