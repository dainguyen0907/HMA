import { createSlice } from "@reduxjs/toolkit";

export const revenueFeature=createSlice({
    name:'revenue',
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

export const { setFromDate, setToDay, setCurrentIndex

}=revenueFeature.actions;

export default revenueFeature.reducer;