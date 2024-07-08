import { createSlice } from "@reduxjs/toolkit";

export const baseFeature=createSlice({
    name:'base',
    initialState:{
        openLoadingScreen:false,
        openSideBar:true,
    },
    reducers:{
        setOpenLoadingScreen:(state,action)=>{
            state.openLoadingScreen=action.payload
        },
        setOpenSideBar:(state,action)=>{
            state.openSideBar=action.payload
        },
        toggleSideBar:(state)=>{
            state.openSideBar=!state.openSideBar
        }
    }
})

export const {
    setOpenLoadingScreen, setOpenSideBar, toggleSideBar

}=baseFeature.actions;

export default baseFeature.reducer;