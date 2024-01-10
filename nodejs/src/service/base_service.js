import db from "../models/index";

const History=db.History;

export const saveHistory=async(content)=>{
    await History.create({
        content:content
    })
}

