import  Express from "express";

import {login} from "../controller/login_controller";
import reception_controller from "../controller/reception_controller";
import privilege_controller from "../controller/privilege_controller";
import area from "../controller/area_controller";
import service_controller from "../controller/service_controller";
import bedType_controller from "../controller/bed_type_controller";
import price_controller from "../controller/price_controller";
import room_controller from "../controller/room_controller";

import {checkCookieExp} from "../middlewares/checkCookie";
import checkPrivilege from "../middlewares/checkPrivilege";

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

    routes.post('/api/room/insertRoom',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],room_controller.insertNewRoom);
    routes.post('/api/room/updateRoom',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],room_controller.updateRoom);
    routes.post('/api/room/deleteRoom',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],room_controller.deleteRoom);
    routes.get('/api/getRoomByIDArea',[checkCookieExp],room_controller.getRoomByAreaID);

    routes.post('/api/bedtype/insertBedType',[checkCookieExp,checkPrivilege.checkPrivilegeForBed],bedType_controller.insertBedType);
    routes.post('/api/bedtype/updateBedType',[checkCookieExp,checkPrivilege.checkPrivilegeForBed],bedType_controller.updateBedType);
    routes.post('/api/bedtype/deleteBedType',[checkCookieExp,checkPrivilege.checkPrivilegeForBed],bedType_controller.deleteBedType);
    routes.get('/api/bedtype/getAll',[checkCookieExp],bedType_controller.getAllBedType);

    routes.post('/api/price/insertPrice',[checkCookieExp,checkPrivilege.checkPrivilegeForBed],price_controller.insertPrice);
    routes.post('/api/price/updatePrice',[checkCookieExp,checkPrivilege.checkPrivilegeForBed],price_controller.updatePrice);
    routes.post('/api/price/deletePrice',[checkCookieExp,checkPrivilege.checkPrivilegeForBed],price_controller.deletePrice);
    routes.get('/api/price/getPriceByIDBedType',[checkCookieExp],price_controller.getPriceByBedType);

    routes.post('/api/service/insertService',[checkCookieExp,checkPrivilege.checkPrivilegeForService],service_controller.insertService);
    routes.post('/api/service/updateService',[checkCookieExp,checkPrivilege.checkPrivilegeForService],service_controller.updateService);
    routes.post('/api/service/deleteService',[checkCookieExp,checkPrivilege.checkPrivilegeForService],service_controller.deleteService);
    routes.get('/api/service/getAll',[checkCookieExp],service_controller.getAllService);

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
    routes.post('/api/reception/updateReception',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],reception_controller.updateReception);
    routes.post('/api/reception/deleteReception',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],reception_controller.deleteReception);
    routes.post('/api/reception/resetPassword',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting,validator.validatePassword()],reception_controller.updateReceptionPassword);
    routes.post('/api/reception/changePassword',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting,validator.validateUserPassword()],reception_controller.changeUserPassword);
    routes.get('/api/reception/getAll',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],reception_controller.getAllReception);

    routes.post('/api/privilegedetail/insertPrivilegeDetail',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],privilege_controller.insertPrivilegeDetail);
    routes.post('/api/privilegedetail/deletePrivilegeDetail',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],privilege_controller.deletePrivilegeDetail);
    routes.get('/api/privilegedetail/getPrivilegeByIDUser',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],privilege_controller.getPrivilegeByIDUser);

    return app.use('/',routes);
}

export default initAPIRouter;