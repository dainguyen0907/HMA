import  Express from "express";
import {login} from "../controller/login_controller";
import reception_controller from "../controller/reception_controller";
import {checkCookieExp} from "../middlewares/checkCookie";
import checkPrivilege from "../middlewares/checkPrivilege";
import area from "../controller/area_controller";

const routes=Express.Router();

const initAPIRouter=(app)=>{
    routes.post('/api/login',login);
    routes.get('/api/privilege/getUserPrivilege',[checkCookieExp],reception_controller.getUserPrivilege);

    routes.post('/api/area/insertArea',[checkCookieExp,checkPrivilege.checkPrivilegeForArea],area.insertNewArea);
    routes.post('/api/area/updateArea',[checkCookieExp,checkPrivilege.checkPrivilegeForArea],area.updateArea);
    routes.post('/api/area/deleteArea',[checkCookieExp,checkPrivilege.checkPrivilegeForArea],area.deleteArea);
    routes.get('/api/area/getAll',[checkCookieExp,checkPrivilege.checkPrivilegeForArea],area.getAllArea);

    


    return app.use('/',routes);
}

export default initAPIRouter;