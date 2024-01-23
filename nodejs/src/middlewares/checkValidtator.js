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

let validateArea=()=>{
    return[
        body('area_name','Tên khu vực không được bỏ trống').not().isEmpty(),
        body('area_floor','Số tầng phải là ký tự số').custom((value)=>{
            return !isNaN(parseInt(value))
        }),
        body('area_room','Số phòng phải là ký tự số').custom((value)=>{
            return !isNaN(parseInt(value))
        }),
        body('area_room','Số phòng phải chia hết cho số tầng').custom((value,{req})=>{
            return parseInt(value)%parseInt(req.body.area_floor)===0 
        })
    ]
}

let validateService=()=>{
    return [
        body('name','Tên dịch vụ không được bỏ trống').not().isEmpty(),
        body('name','Tên dịch vụ phải từ 8 đến 30 ký tự').isLength({max:30,min:8}),
        body('price','Đơn giá phải là ký tự số').custom((value)=>{
            return !isNaN(parseInt(value));
        })
    ]
}

module.exports={
    validateNewReception,validatePassword,validateUserPassword, validateArea, validateService
}