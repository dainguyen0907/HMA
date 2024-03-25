import  Express  from "express";
import initAPIRouter from "./routes/initApiRouter";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

require('dotenv').config();

const app=Express();

const PORT=process.env.PORT||8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','http://10.168.3.153:3000');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials',true);
    next();
});

initAPIRouter(app);

app.listen(PORT,()=>{
    console.log('Khởi tạo backend trên port',PORT)
})