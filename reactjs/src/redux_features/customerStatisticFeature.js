import { createSlice } from "@reduxjs/toolkit";

export const customerStatisticFeature=createSlice({
    name:'customerStatistic',
    initialState:{
        currentIndex:0,
        startSearchDate:new Date().toLocaleDateString(),
        endSearchDate:new Date().toLocaleDateString(),
        customerTable:[],
    },
    reducers:{
        setCurrentIndex:(state,action)=>{
            state.currentIndex=action.payload
        },
        setCustomerTable:(state,action)=>{
            state.customerTable=action.payload
        },
        setStartSearchDate:(state,action)=>{
            state.startSearchDate=action.payload
        },
        setEndSearchDate:(state,action)=>{
            state.endSearchDate=action.payload
        }
    }
});

export const { 
    setCurrentIndex, setCustomerTable, setEndSearchDate, setStartSearchDate
}=customerStatisticFeature.actions;
export default customerStatisticFeature.reducer;