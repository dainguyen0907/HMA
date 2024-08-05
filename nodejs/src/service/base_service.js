import db from "../models/index";
import { Op } from "sequelize";

const History = db.History;

export const saveHistory = async (content) => {
    try {
        await History.create({
            content: content
        })
    } catch (error) {

    }
}

export const getHistory = async (from, to) => {
    try {
        const history = await History.findAll({
            where: {
                createdAt: {
                    [Op.between]: [from, to],
                },
            },
            nest: true,
            raw: true
        })
        return { status: true, result: history }
    } catch (error) {
        return { status: false, msg: 'DB: Xảy ra lỗi trong quá trình truy vấn' }
    }
}

