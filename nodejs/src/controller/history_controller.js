import {getHistory} from "../service/base_service";
import moment from "moment";

const getAllHistory = async (req, res) => {
    try {
        const from=moment(req.query.from,"DD/MM/YYYY");
        const to=moment(req.query.to,"DD/MM/YYYY").set('hour',23).set('minute',59).set('second',59);
        const history = await getHistory(from, to);
        if (history.status) {
            return res.status(200).json({ result: history.result });
        } else {
            return res.status(500).json({ error_code: history.msg });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({error_code:'Ctrl: Xảy ra lỗi khi xử lý dữ liệu'});
    }

}

module.exports = { getAllHistory }