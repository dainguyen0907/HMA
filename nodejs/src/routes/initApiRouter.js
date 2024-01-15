import  Express from "express";
import {login} from "../controller/login_controller";
import reception_controller from "../controller/reception_controller";
import privilege_controller from "../controller/privilege_controller";
import {checkCookieExp} from "../middlewares/checkCookie";
import checkPrivilege from "../middlewares/checkPrivilege";
import area from "../controller/area_controller";
import validator from "../middlewares/checkValidtator";

const routes=Express.Router();

const initAPIRouter=(app)=>{
    routes.post('/api/login',login);
    routes.get('/api/privilege/getUserPrivilege',[checkCookieExp],reception_controller.getUserPrivilege);
    routes.get('/api/privilege/getAll',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],privilege_controller.getAllPrivilege);

    routes.post('/api/area/insertArea',[checkCookieExp,checkPrivilege.checkPrivilegeForArea],area.insertNewArea);
    routes.post('/api/area/updateArea',[checkCookieExp,checkPrivilege.checkPrivilegeForArea],area.updateArea);
    routes.post('/api/area/deleteArea',[checkCookieExp,checkPrivilege.checkPrivilegeForArea],area.deleteArea);
    routes.get('/api/area/getAll',[checkCookieExp,checkPrivilege.checkPrivilegeForArea],area.getAllArea);

    routes.post('/api/room/insertRoom');
    routes.post('/api/room/updateRoom');
    routes.post('/api/room/deleteRoom');
    routes.get('/api/room/getAll');
    routes.get('/api/getRoomByIDArea');

    routes.post('/api/bedtype/insertBedType');
    routes.post('/api/bedtype/updateBedType');
    routes.post('/api/bedtype/deleteBedType');
    routes.get('/api/bedtype/getAll');

    routes.post('/api/price/insertPrice');
    routes.post('/api/price/updatePrice');
    routes.post('/api/price/deletePrice');
    routes.get('/api/price/getAll');

    routes.post('/api/service/insertService');
    routes.post('/api/service/updateService');
    routes.post('/api/service/deleteService');
    routes.get('/api/service/getAll');

    routes.post('/api/servicedetail/insertServiceDetail');
    routes.post('/api/servicedetail/updateServiceDetail');
    routes.post('/api/servicedetail/deleteServiceDetail');
    routes.get('/api/servicedetail/getServiceDetailByIDBed');

    routes.post('/api/paymentmethod/insertPaymentMethod');
    routes.post('/api/paymentmethod/updatePaymentMethod');
    routes.post('/api/paymentmethod/deletePaymentMethod');
    routes.get('/api/paymentmethod/getAll');

    routes.post('/api/customer/insertCustomer');
    routes.post('/api/customer/updateCustomer');
    routes.post('/api/customer/deleteCustomer');
    routes.get('/api/customer/getAll');

    routes.post('/api/invoice/insertInvoice');
    routes.post('/api/invoice/updateInvoice');
    routes.post('/api/invoice/deleteInvoice');
    routes.get('/api/invoice/getAll');

    routes.post('/api/reception/insertReception',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting,validator.validateNewReception()],reception_controller.insertReception);
    routes.post('/api/reception/updateReception');
    routes.post('/api/reception/deleteReception');
    routes.get('/api/reception/getAll',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],reception_controller.getAllReception);

    routes.post('/api/privilegedetail/insertPrivilegeDetail',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],privilege_controller.insertPrivilegeDetail);
    routes.post('/api/privilegedetail/deletePrivilegeDetail',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],privilege_controller.deletePrivilegeDetail);
    routes.get('/api/privilegedetail/getPrivilegeByIDUser',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],privilege_controller.getPrivilegeByIDUser);

    return app.use('/',routes);
}

export default initAPIRouter;