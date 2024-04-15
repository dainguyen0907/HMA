import Express from "express";
import initAPIRouter from "./routes/initApiRouter";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const cors = require('cors');
require('dotenv').config();

const app = Express();

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

const whitelist = [process.env.REACT_APP];
const corsOptionDelegate = (req, callback) => {
    let corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {
            origin: true,
            methods: 'GET,PUT,POST,DELETE',
            allowedHeaders: 'X-Requested-With,content-type',
            credentials: true,
            optionsSuccessStatus: 200
        }
    } else {
        corsOptions={
            origin:false
        }
    }
    callback(null,corsOptions);
}

app.use(cors(corsOptionDelegate));

initAPIRouter(app);

app.listen(PORT, () => {
    console.log('Khởi tạo backend trên port', PORT)
})