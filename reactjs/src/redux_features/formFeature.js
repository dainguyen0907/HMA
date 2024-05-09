import { createSlice } from "@reduxjs/toolkit";

export const formFeature=createSlice({
    name:'form',
    initialState:{
        fromDay:new Date().toLocaleDateString('vi-VI'),
        toDay:new Date().toLocaleDateString('vi-VI'),
        currentIndex:0,
    },
    reducers:{
        setFromDate:(state,action)=>{
            state.fromDay=action.payload
        },
        setToDay:(state,action)=>{
            state.toDay=action.payload
        },
        setCurrentIndex:(state,action)=>{
            state.currentIndex=action.payload
        }
    }
});

export const {
    setCurrentIndex, setFromDate, setToDay
}=formFeature.actions;

export default formFeature.reducer;