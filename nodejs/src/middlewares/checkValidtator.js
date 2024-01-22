import {body} from "express-validator";

let validateNewReception=()=>{
    return [
        body('account','Tên đăng nhập không được bỏ trống').not().isEmpty(),
        body('account','Tên đăng nhập từ 10 đến 50 ký tự').isLength({min:10,max:50}),
        body('password','Mật khẩu không được bỏ trống').not().isEmpty(),
        body('password','Mật khẩu phải từ 8 ký tự').isLength({min:8}),
        body('name','tên người dùng không bỏ trống').not().isEmpty(),
    ]
}

let validatePassword=()=>{
    return [
        body('password','Mật khẩu không được bỏ trống').not().isEmpty(),
        body('password','Mật khẩu phải từ 8 ký tự').isLength({min:8}),
        body('repassword','Xác nhận mật khẩu chưa chính xác').custom((value,{req})=>{
            return value===req.body.password;   
        })
    ]
}

let validateUserPassword=()=>{
    return [
        body('oldpassword','Mật khẩu cũ không được bỏ trống').not().isEmpty(),
        body('newpassword','Mật khẩu mới không được bỏ trống').not().isEmpty(),
        body('newpassword','Mật khẩu mới phải từ 8 ký tự').isLength({min:8}),
        body('repassword','Xác nhận mật khẩu chưa chính xác').custom((value,{req})=>{
            return value===req.body.newpassword;   
        })
    ]
}



module.exports={
    validateNewReception,validatePassword,validateUserPassword
}