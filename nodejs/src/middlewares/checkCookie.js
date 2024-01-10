import { verifyJWT } from './jwt';
export const checkCookieExp = async (req, res, next) => {
    const token = req.cookies.loginCode;
    if (!token) {
        return res.status(401).json({error_code:"Không tìm thấy access token"});
    }
    const verify = await verifyJWT(token);
    if (!verify.status)
    {
        return res.status(401).json({error_code:"Không thể xác thực access token"});
    } 
    return next();
}

