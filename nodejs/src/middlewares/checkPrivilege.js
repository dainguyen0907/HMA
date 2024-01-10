import privilegeService from "../service/privilege_service";

const checkPrivilege = (req, res, next, id_privilege) => {
    const token = req.cookies.loginCode;
    if (!token) {
        return res.status(401).json({ error_code: "Không tìm thấy access token" });
    }
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const reception_id = tokenData.reception_id;
    privilegeService.checkPrivilegeByIDReceptionAndIDPrivilege(reception_id, id_privilege)
        .then((result) => {
            if (result) return next();
            else return res.status(403).json({ error_code: "Người dùng không có quyền truy cập" });
        })
}
const checkPrivilegeForArea = (req, res, next) => {
    return checkPrivilege(req, res, next, 2)
}
const checkPrivilegeForRoom = (req, res, next) => {
    return checkPrivilege(req, res, next, 1)
}
const checkPrivilegeForBed = (req, res, next) => {
    return checkPrivilege(req, res, next, 3)
}
const checkPrivilegeForService = (req, res, next) => {
    return checkPrivilege(req, res, next, 4)
}
const checkPrivilegeForCustomer = (req, res, next) => {
    return checkPrivilege(req, res, next, 5)
}
const checkPrivilegeForSetting = (req, res, next) => {
    return checkPrivilege(req, res, next, 6)
}

module.exports = { 
    checkPrivilegeForArea,checkPrivilegeForBed,
    checkPrivilegeForCustomer,checkPrivilegeForRoom,
    checkPrivilegeForService,checkPrivilegeForSetting }