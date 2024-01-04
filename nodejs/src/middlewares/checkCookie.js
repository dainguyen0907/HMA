import { verifyJWT } from './jwt';
export const checkCookieExp = async (req, res, next) => {
    const token = req.cookies.loginCode;
    if (!token) {
        return res.status(401).json({error_code:"Không tìm thấy access token"});
    }
    const verify = await verifyJWT(token);
    if (!verify.status)
    {
        console.log(verify.status)
        return res.status(401).json({error_code:"Không thể xác thực access token"});
    }    
    const datacode = token.split(".")[1];
    const data = JSON.parse(atob(datacode));
    if (Date.now() > new Date(data.exp * 1000)) {
        return res.status(401).json({error_code:"Token đã hết hạn"});
    } else
    return next();
}

