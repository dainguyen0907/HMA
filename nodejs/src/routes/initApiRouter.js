import  Express from "express";
import {login} from "../controller/login_controller";
import {decodedAccessToken} from "../controller/reception_controller";

const routes=Express.Router();

const initAPIRouter=(app)=>{
    routes.post('/api/login',login);
    routes.get('/api/getReceptionInfo',decodedAccessToken);
    return app.use('/',routes);
}

export default initAPIRouter;