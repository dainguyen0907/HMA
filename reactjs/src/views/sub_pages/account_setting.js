import { Button, Radio, Tooltip } from "flowbite-react";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, IconButton } from "@mui/material";
import { AccountCircle, AccountTree, AddCircleOutline, Clear, RestartAlt } from "@mui/icons-material";
import AccountCreateModal from "../../components/modal/account_create_modal";
import { setModalAction, setOpenCreateModal, setOpenPrivilegeModal, setOpenResetModal, setReceptionSelection, setUpdateSuccess } from "../../redux_features/accountFeature";
import AccountResetPassword from "../../components/modal/account_reset_password";
import AccountPrivilegeModal from "../../components/modal/account_privilege_modal";
import { setOpenLoadingScreen } from "../../redux_features/baseFeature";

export default function AccountSetting() {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const accountFeature = useSelector(state => state.account);

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'Mã số',
            size: '3'
        },
        {
            accessorKey: 'reception_account',
            header: 'Tài khoản',
            size: '10'
        },
        {
            header: 'Tên người dùng',
            accessorKey: 'reception_name'
        },
        {
            header: 'Trạng thái hoạt động',
            Cell: ({ renderValue, row }) => (
                <Box className="flex items-center gap-4">
                    <Radio className="ml-10" disabled checked={row.original.reception_status} />
                </Box>
            )
        }
    ], [])

    useEffect(() => {
        dispatch(setOpenLoadingScreen(true));
        axios.get(process.env.REACT_APP_BACKEND + 'api/reception/getAll', { withCredentials: true })
            .then(function (response) {
                setData(response.data.result);
                setIsLoading(false);
                dispatch(setOpenLoadingScreen(false));
            }).catch(function (error) {
                if (error.response) {
                    toast.error("Dữ liệu bảng: "+error.response.data.error_code);
                }
                dispatch(setOpenLoadingScreen(false));
            })
    }, [accountFeature.updateSuccess, dispatch])

    const onHandleCreate = () => {
        dispatch(setReceptionSelection(null));
        dispatch(setOpenCreateModal(true));
        dispatch(setModalAction('create'));
    }


    const onHandleUpdate = (receptionSelection) => {
        dispatch(setReceptionSelection(receptionSelection));
        dispatch(setOpenCreateModal(true));
        dispatch(setModalAction('update'));
    }

    const onHandleReset = (receptionSelection) => {
        dispatch(setReceptionSelection(receptionSelection));
        dispatch(setOpenResetModal(true));
    }

    const onHandlePrivilegeSetting = (receptionSelection) => {
        dispatch(setReceptionSelection(receptionSelection));
        dispatch(setOpenPrivilegeModal(true));
    }

    const onHandleDelete = (id) => {
        if (window.confirm('Bạn muốn xoá tài khoản này?')) {
            axios.post(process.env.REACT_APP_BACKEND + 'api/reception/deleteReception', {
                id: id
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setUpdateSuccess());
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        }
    }

    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="border-b-2 px-3 py-1 grid grid-cols-2 h-fit">
                    <div className="py-2">
                        <h1 className="font-bold text-blue-600">Danh sách tài khoản</h1>
                    </div>
                </div>
                <div className="w-full h-full">
                    <MaterialReactTable
                        data={data}
                        columns={columns}
                        enableRowActions={true}
                        positionActionsColumn="last"
                        localization={MRT_Localization_VI}
                        state={{ isLoading: isLoading }}
                        muiCircularProgressProps={{
                            color: 'secondary',
                            thickness: 5,
                            size: 55,
                        }}
                        muiSkeletonProps={{
                            animation: 'pulse',
                            height: 28,
                        }}
                        renderTopToolbarCustomActions={(table) => (
                            <div className="mr-auto">
                                <Button size="sm" outline gradientMonochrome="success" onClick={() => onHandleCreate()}>
                                    <AddCircleOutline /> Thêm tài khoản mới
                                </Button>
                            </div>
                        )}
                        renderRowActions={({ row, table }) => (
                            row.original.id !== 1 ?
                                <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                                    <Tooltip content="Reset mật khẩu">
                                        <IconButton color="success"
                                            onClick={() => onHandleReset(row.original)}>
                                            <RestartAlt />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip content="Cập nhật thông tin">
                                        <IconButton color="primary"
                                            onClick={() => onHandleUpdate(row.original)}>
                                            <AccountCircle />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip content="Phân quyền">
                                        <IconButton color="secondary"
                                            onClick={() => onHandlePrivilegeSetting(row.original)}>
                                            <AccountTree />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip content="Xoá người dùng">
                                        <IconButton color="error"
                                            onClick={() => onHandleDelete(row.original.id)}>
                                            <Clear />
                                        </IconButton>
                                    </Tooltip>
                                </Box> : null
                        )}
                    />
                    <AccountCreateModal />
                    <AccountResetPassword />
                    <AccountPrivilegeModal />
                </div>
            </div>
        </div>
    )
}