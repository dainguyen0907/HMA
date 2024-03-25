import {getHistory} from "../service/base_service";

const getAllHistory = async (req, res) => {
    try {
        const from=req.query.from;
        const to=req.query.to;
        const dayFrom = from.split('/')[2]+'/'+from.split('/')[1]+'/'+from.split('/')[0];
        const dayTo = to.split('/')[2]+'/'+to.split('/')[1]+'/'+to.split('/')[0];
        const history = await getHistory(dayFrom, dayTo);
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