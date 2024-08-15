import React, { useState } from "react";
import background from "../assets/images/bg_body.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setReceptionID, setReceptionName } from "../redux_features/receptionFeature";

const bg = background;

export default function Login(props) {

    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const dispatch = useDispatch();

    const onHandleButton = (event) => {
        event.preventDefault();

        if (isProcessing)
            return;

        setIsProcessing(true);

        if (account.length === 0) {
            toast.error("Tên đăng nhập không được để trống!");
            setIsProcessing(false);
        } else if (password.length === 0) {
            toast.error("Mật khẩu không được để trống!");
            setIsProcessing(false);
        } else {
            const msg = toast.loading("Đăng nhập...")
            axios.post(process.env.REACT_APP_BACKEND + 'api/login', {
                account: account,
                password: password
            }).then(function (responsive) {
                if (responsive.data.status) {
                    dispatch(setReceptionName(responsive.data.user_name));
                    dispatch(setReceptionID(responsive.data.id_user));
                    props.setCookie('loginCode', responsive.data.login_code, { path: '/', maxAge: 3600 * 9.5 });
                    toast.update(msg, { render: "Đăng nhập thành công", type: "success", isLoading: false, autoClose: 1000, closeOnClick: true });
                } else {
                    toast.update(msg, { render: responsive.data.error_code, type: "error", isLoading: false, autoClose: 2000, closeOnClick: true });
                }
            }).catch(function (error) {
                if(error.response)
                    toast.update(msg, { render: error.response.data.error_code, type: "error", isLoading: false, autoClose: 2000, closeOnClick: true });
                else
                    toast.update(msg, { render: error.message, type: "error", isLoading: false, autoClose: 2000, closeOnClick: true });
            }).finally(function(){
                setIsProcessing(false);
            })
        }

    }

    return (
        <div className="w-screen h-screen flex" style={{ backgroundImage: `url(${bg})`, backgroundPosition: 'center' }}>
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 h-fit w-fit m-auto text-center px-4 py-4 ">
                <p><strong className="text-white font-sans">PHẦN MỀM QUẢN LÝ NHÀ NGHỈ</strong></p>
                <p><small className="text-white italic font-sans">HEPC MOTEL APPLICATION</small></p>
                <form onSubmit={(e) => onHandleButton(e)}>
                    <div className="relative my-2">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 448 512">
                                <path fill="#005af5" d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
                            </svg>
                        </div>
                        <input type="text" id="account" value={account} onChange={(e) => setAccount(e.target.value)} className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tài khoản" required></input>
                    </div>
                    <div className="relative my-2">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 512 512">
                                <path fill="#005af5" d="M328.5 0C227.312 0 145 82.312 145 183.5C145 193.625 145.906 203.938 147.719 214.312L15.531 346.531C5.5 356.531 0 369.844 0 384V473.5C0 494.719 17.281 512 38.5 512H125.5C146.719 512 164 494.719 164 473.5V454H183.5C204.719 454 222 436.719 222 415.5V396H250C260.281 396 269.938 392 277.219 384.719L297.688 364.281C411.875 384.312 512 294.812 512 183.5C512 82.312 429.688 0 328.5 0ZM295.719 314.812L282.531 311.5L246.062 348H174V406H116V464H48V384C48 382.688 48.531 381.406 49.469 380.469L200.5 229.469L197.188 216.281C194.406 205.156 193 194.125 193 183.5C193 108.781 253.781 48 328.5 48S464 108.781 464 183.5C464 268.844 385.125 337.125 295.719 314.812ZM368 112C350.326 112 336 126.326 336 144C336 161.672 350.326 176 368 176S400 161.672 400 144C400 126.326 385.674 112 368 112Z" />
                            </svg>
                        </div>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Mật khẩu" required></input>
                    </div>
                    <button type="submit" className="bg-white w-full border-spacing-1 rounded-3xl text-blue-600 p-2"><strong>ĐĂNG NHẬP</strong></button>
                </form>
            </div>
            <div className="fixed bottom-0 w-full text-center">
                <small>Devolopment by Nguyễn Quốc Đại</small>
            </div>
        </div>

    );
}