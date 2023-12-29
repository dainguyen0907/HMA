import  Express from "express";
import {login} from "../controller/login_controller";

const routes=Express.Router();

const initAPIRouter=(app)=>{
    routes.post('/api/login',login);
    return app.use('/',routes);
}

export default initAPIRouter;