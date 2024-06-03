import privilegeService from "../service/privilege_service";

const checkPrivilege = (req, res, next, id_privilege, privilige) => {
    const token = req.cookies.loginCode;
    if (!token) {
        return res.status(401).json({ error_code: "Không tìm thấy access token" });
    }
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const reception_id = tokenData.reception_id;
    privilegeService.checkPrivilegeByIDReceptionAndIDPrivilege(reception_id, id_privilege)
        .then((result) => {
            if (result) return next();
            else return res.status(403).json({ error_code: "Người dùng không có quyền truy cập quyền " + privilige });
        })
}
const checkPrivilegeForArea = (req, res, next) => {
    return checkPrivilege(req, res, next, 2, 'điều chỉnh khu vực')
}
const checkPrivilegeForRoom = (req, res, next) => {
    return checkPrivilege(req, res, next, 1, 'thao tác thanh toán')
}
const checkPrivilegeForBed = (req, res, next) => {
    return checkPrivilege(req, res, next, 3, 'điều chỉnh giường')
}
const checkPrivilegeForService = (req, res, next) => {
    return checkPrivilege(req, res, next, 4, 'điều chỉnh dịch vụ')
}
const checkPrivilegeForCustomer = (req, res, next) => {
    return checkPrivilege(req, res, next, 5, 'điều chỉnh khách hàng')
}
const checkPrivilegeForInvoice = (req, res, next) => {
    return checkPrivilege(req, res, next, 6, 'cập nhật hoá đơn')
}
const checkPrivilegeForSetting = (req, res, next) => {
    return checkPrivilege(req, res, next, 7, 'điều chỉnh hệ thống')
}

module.exports = {
    checkPrivilegeForArea, checkPrivilegeForBed,
    checkPrivilegeForCustomer, checkPrivilegeForRoom,
    checkPrivilegeForService, checkPrivilegeForSetting,
    checkPrivilegeForInvoice
}