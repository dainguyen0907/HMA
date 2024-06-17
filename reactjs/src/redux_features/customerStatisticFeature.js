import { createSlice } from "@reduxjs/toolkit";

export const customerStatisticFeature=createSlice({
    name:'customerStatistic',
    initialState:{
        currentIndex:0,
    },
    reducers:{
        setCurrentIndex:(state,action)=>{
            state.currentIndex=action.payload
        }
    }
});

export const { setCurrentIndex }=customerStatisticFeature.actions;
export default customerStatisticFeature.reducer;