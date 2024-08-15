import React, { useEffect } from "react";
import SideBar from "../components/core_components/sideBar";
import Header from "../components/core_components/header";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setReceptionRole } from "../redux_features/receptionFeature";
import { toast } from "react-toastify";

export default function MasterPage({ children, cookie, removeCookie }) {
    const baseFeature = useSelector(state => state.base);
    const dispatch = useDispatch();
    useEffect(() => {
        if (cookie.loginCode) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/privilege/getUserPrivilege', { withCredentials: true })
                .then(function (res) {
                    if (res.status) {
                        dispatch(setReceptionRole(res.data.privilege));
                    }
                })
                .catch(function (err) {
                    if(err.response)
                        toast.error(err.response.data.error_code);
                    else
                        toast.error(err.message);
                })
        }
    }, [cookie.loginCode, dispatch])
    return (
        <div className="overflow-auto">
            <SideBar />
            <Header removeCookie={removeCookie} cookie={cookie} />
            <div className={`w-auto h-auto transition delay-150 mt-16 ${baseFeature.openSideBar ? 'ml-28' : ''}`}>
                {children ? children : ""}
            </div>
        </div>
    )
}