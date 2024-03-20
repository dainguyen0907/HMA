import privilegeService from "../service/privilege_service";

const getAllPrivilege = async (req, res) => {
    const privilege = await privilegeService.getAllPrivilege();
    if (privilege.status) {
        return res.status(200).json({ result: privilege.result })
    } else {
        return res.status(500).json({ error_code: privilege.msg })
    }
}

const insertPrivilegeDetail = async (req, res) => {
    const id_user = req.body.id_user;
    const id_privilege = req.body.id_privilege;
    const pd = await privilegeService.insertPrivilegeDetail(id_privilege, id_user);
    if (pd.status) {
        return res.status(200).json({ result: pd.result })
    } else {
        return res.status(500).json({ error_code: pd.msg })
    }
}

const deletePrivilegeDetail = async (req, res) => {
    try {
        const id_user = req.body.id_user;
        const id_privilege = req.body.id_privilege;
        const rs = await privilegeService.deletePrivilegeDetail(id_privilege, id_user);
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: error })
    }
}

const getPrivilegeByIDUser = async (req, res) => {
    const id_user = req.query.user;
    const privilege_detail = await getPrivilegeByIDUser(id_user);
    if (privilege_detail.status) {
        let privilege = [];
        privilege_detail.result.map((p) => {
            privilege.push(p.id_privilege);
        });
        return res.status(200).json({ status: true, privilege: privilege });
    } else {
        return res.status(500).json(privilege_detail.msg);
    }
}

const updatePrivilegeDetail = async (req, res) => {
    try {
        const id_user = req.body.id;
        const array_privilege = req.body.privilege;
        if (array_privilege && array_privilege.length > 0) {
            const deleteDetails = await privilegeService.deletePrivilegeDetailByUser(id_user);
            if (deleteDetails.status)
                for (let i = 0; i < array_privilege.length; i++) {
                    await privilegeService.insertPrivilegeDetail(array_privilege[i], id_user);
                    if(i===array_privilege.length-1)
                    return res.status(200).json({ result: "Cập nhật thành công" })
                };
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Có lỗi khi cập nhật thông tin" })
    }
}

module.exports = {
    getAllPrivilege, insertPrivilegeDetail,
    deletePrivilegeDetail, getPrivilegeByIDUser, updatePrivilegeDetail
};