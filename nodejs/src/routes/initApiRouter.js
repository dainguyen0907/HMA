import  Express from "express";
import {login} from "../controller/login_controller";
import {decodedAccessToken} from "../controller/reception_controller";
import {checkCookieExp} from "../middlewares/checkCookie";
import {checkPrivilegeForArea} from "../middlewares/checkPrivilege";
import area from "../controller/area_controller";

const routes=Express.Router();

const initAPIRouter=(app)=>{
    routes.post('/api/login',login);

    routes.get('/api/privilege/getUserPrivilege',[checkCookieExp],decodedAccessToken);

    routes.post('/api/area/insertArea',[checkCookieExp,checkPrivilegeForArea],area.insertNewArea);
    routes.get('/api/area/getAll',[checkCookieExp,checkPrivilegeForArea],area.getAllArea);


    return app.use('/',routes);
}

export default initAPIRouter;