import  Express from "express";

import {login} from "../controller/login_controller";
import reception_controller from "../controller/reception_controller";
import privilege_controller from "../controller/privilege_controller";
import area from "../controller/area_controller";
import service_controller from "../controller/service_controller";
import bedType_controller from "../controller/bed_type_controller";
import price_controller from "../controller/price_controller";
import room_controller from "../controller/room_controller";
import floor_controller from "../controller/floor_controller";
import service_detail_controller from "../controller/service_detail_controller";
import payment_method_controller from "../controller/payment_method_controller";
import invoice_controller from "../controller/invoice_controller";
import customer_controller from "../controller/customer_controller";
import bed_controller from "../controller/bed_controller";

import {checkCookieExp} from "../middlewares/checkCookie";
import checkPrivilege from "../middlewares/checkPrivilege";

import validator from "../middlewares/checkValidtator";

const routes=Express.Router();

const initAPIRouter=(app)=>{
    routes.post('/api/login',login);
    routes.get('/api/privilege/getUserPrivilege',[checkCookieExp],reception_controller.getUserPrivilege);
    routes.get('/api/privilege/getAll',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],privilege_controller.getAllPrivilege);

    routes.post('/api/area/insertArea',[checkCookieExp,checkPrivilege.checkPrivilegeForArea, validator.validateArea()],area.insertNewArea);
    routes.post('/api/area/updateArea',[checkCookieExp,checkPrivilege.checkPrivilegeForArea, validator.validateUpdateArea()],area.updateArea);
    routes.post('/api/area/deleteArea',[checkCookieExp,checkPrivilege.checkPrivilegeForArea],area.deleteArea);
    routes.get('/api/area/getAll',[checkCookieExp,checkPrivilege.checkPrivilegeForArea],area.getAllArea);

    routes.post('/api/floor/updateFloor',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom,validator.validateFloor()],floor_controller.updateFloor);
    routes.post('/api/floor/deleteFloor',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],floor_controller.deleteFloor);
    routes.get('/api/floor/getFloorByIDArea',[checkCookieExp],floor_controller.getAllFloorByIdArea);

    routes.post('/api/room/insertRoom',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom,validator.validateRoom()],room_controller.insertNewRoom);
    routes.post('/api/room/updateRoom',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom,validator.validateRoom()],room_controller.updateRoom);
    routes.post('/api/room/deleteRoom',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],room_controller.deleteRoom);
    routes.get('/api/room/getRoomByIDArea',[checkCookieExp],room_controller.getRoomByAreaID);
    routes.get('/api/room/countRoomByIDArea',[checkCookieExp],room_controller.countRoomByAreaID);
    routes.get('/api/room/getRoomByIDFloor',[checkCookieExp],room_controller.getRoomByFloorID);

    routes.post('/api/bedtype/insertBedType',[checkCookieExp,checkPrivilege.checkPrivilegeForBed,validator.validateInitBedType()],bedType_controller.insertBedType);
    routes.post('/api/bedtype/updateBedType',[checkCookieExp,checkPrivilege.checkPrivilegeForBed,validator.validateUpdateBedType()],bedType_controller.updateBedType);
    routes.post('/api/bedtype/deleteBedType',[checkCookieExp,checkPrivilege.checkPrivilegeForBed],bedType_controller.deleteBedType);
    routes.get('/api/bedtype/getAll',[checkCookieExp],bedType_controller.getAllBedType);

    routes.post('/api/price/insertPrice',[checkCookieExp,checkPrivilege.checkPrivilegeForBed,validator.validatePrice()],price_controller.insertPrice);
    routes.post('/api/price/updatePrice',[checkCookieExp,checkPrivilege.checkPrivilegeForBed,validator.validatePrice()],price_controller.updatePrice);
    routes.post('/api/price/deletePrice',[checkCookieExp,checkPrivilege.checkPrivilegeForBed],price_controller.deletePrice);
    routes.get('/api/price/getPriceByIDBedType',[checkCookieExp],price_controller.getPriceByBedType);
    routes.get('/api/price/getPriceByID',[checkCookieExp],price_controller.getPriceByID);

    routes.post('/api/service/insertService',[checkCookieExp,checkPrivilege.checkPrivilegeForService, validator.validateService()],service_controller.insertService);
    routes.post('/api/service/updateService',[checkCookieExp,checkPrivilege.checkPrivilegeForService, validator.validateService()],service_controller.updateService);
    routes.post('/api/service/deleteService',[checkCookieExp,checkPrivilege.checkPrivilegeForService],service_controller.deleteService);
    routes.get('/api/service/getAll',[checkCookieExp],service_controller.getAllService);

    routes.post('/api/servicedetail/insertServiceDetail',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],service_detail_controller.insertServiceDetail);
    routes.post('/api/servicedetail/updateServiceDetail',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],service_detail_controller.updateServiceDetail);
    routes.post('/api/servicedetail/deleteServiceDetail',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],service_detail_controller.deleteServiceDetail);
    routes.get('/api/servicedetail/getServiceDetailByIDBed',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],service_detail_controller.getServiceDetailByIDBed);

    routes.post('/api/paymentmethod/insertPaymentMethod',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],payment_method_controller.insertPaymentMethod);
    routes.post('/api/paymentmethod/updatePaymentMethod',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],payment_method_controller.updatePaymentMethod);
    routes.post('/api/paymentmethod/deletePaymentMethod',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],payment_method_controller.deletePaymentMethod);
    routes.get('/api/paymentmethod/getAll',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],payment_method_controller.getAllPaymentMethod);

    routes.post('/api/customer/insertCustomer',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer,validator.validateCustomer()],customer_controller.insertCustomer);
    routes.post('/api/customer/updateCustomer',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer,validator.validateCustomer()],customer_controller.updateCustomer);
    routes.post('/api/customer/deleteCustomer',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer],customer_controller.deleteCustomer);
    routes.get('/api/customer/getAll',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer],customer_controller.getAllCustomer);

    routes.post('/api/invoice/insertInvoice',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],invoice_controller.insertInvoice);
    routes.post('/api/invoice/updateInvoice',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],invoice_controller.updateInvoice);
    routes.post('/api/invoice/deleteInvoice',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],invoice_controller.deleteInvoice);
    routes.get('/api/invoice/getAll',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],invoice_controller.getAllInvoice);

    routes.post('/api/reception/insertReception',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting,validator.validateNewReception()],reception_controller.insertReception);
    routes.post('/api/reception/updateReception',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],reception_controller.updateReception);
    routes.post('/api/reception/deleteReception',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],reception_controller.deleteReception);
    routes.post('/api/reception/resetPassword',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting,validator.validatePassword()],reception_controller.updateReceptionPassword);
    routes.post('/api/reception/changePassword',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting,validator.validateUserPassword()],reception_controller.changeUserPassword);
    routes.get('/api/reception/getAll',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],reception_controller.getAllReception);

    routes.post('/api/privilegedetail/insertPrivilegeDetail',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],privilege_controller.insertPrivilegeDetail);
    routes.post('/api/privilegedetail/deletePrivilegeDetail',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],privilege_controller.deletePrivilegeDetail);
    routes.get('/api/privilegedetail/getPrivilegeByIDUser',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],privilege_controller.getPrivilegeByIDUser);

    routes.get('/api/bed/countBedInUsedByRoomID',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],bed_controller.countBedInUsedByRoomID);
    return app.use('/',routes);
}

export default initAPIRouter;