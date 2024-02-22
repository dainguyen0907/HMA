import { createSlice } from "@reduxjs/toolkit";

export const managerFeature = createSlice({
    name:'manager',
    initialState:{
        openModalSelectArea:false,
        areaID:-1,
    },
    reducers:{
        setOpenModalSelectArea:(state,action)=>{
            state.openModalSelectArea=action.payload
        },
        setAreaID:(state,action)=>{
            state.areaID=action.payload
        }
    }
})

export const {
    setOpenModalSelectArea, setAreaID
}=managerFeature.actions;

export default managerFeature.reducer;