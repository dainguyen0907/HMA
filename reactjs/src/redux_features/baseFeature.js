import { createSlice } from "@reduxjs/toolkit";

export const baseFeature=createSlice({
    name:'base',
    initialState:{
        openLoadingScreen:false
    },
    reducers:{
        setOpenLoadingScreen:(state,action)=>{
            state.openLoadingScreen=action.payload
        }
    }
})

export const {setOpenLoadingScreen}=baseFeature.actions;

export default baseFeature.reducer;