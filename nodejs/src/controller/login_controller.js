import { createJWT } from "../middlewares/jwt";
import user_service from "../service/user_service";

const login = async (req, res) => {
    try {
        const account = req.body.account;
        const password = req.body.password;
        if (account == null || password == null)
            return res.status(500).json({ error_code: "Lỗi truyền dữ liệu" })
        const result = await user_service.checkLogin(account, password);
        if (result.status) {
            const user = result.user;
            const payload = {
                reception_id: user.id,
            }
            const jwt = createJWT(payload);
            if (jwt.status) {
                return res.status(200).json({ status: true, login_code: jwt.token, user_name: user.reception_name, id_user:user.id});
            }
            return res.status(500).json({ error_code: "Lỗi khởi tạo JWT" });
        }
        else
            return res.status(200).json({ status: false, error_code: result.msg });
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }

}

module.exports = { login }