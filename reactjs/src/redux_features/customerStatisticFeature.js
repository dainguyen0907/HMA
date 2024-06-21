import { createSlice } from "@reduxjs/toolkit";

export const customerStatisticFeature=createSlice({
    name:'customerStatistic',
    initialState:{
        currentIndex:0,
        startSearchDate:new Date().toLocaleDateString(),
        endSearchDate:new Date().toLocaleDateString(),
        customerTable:[],
        countUpdateSuccess:0,
        openBedUpdateModal:false,
        bedSelection:null,
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
        },
        setCountUpdateSuccess:(state)=>{
            state.countUpdateSuccess+=1
        },
        setOpenBedUpdateModal:(state,action)=>{
            state.openBedUpdateModal=action.payload
        },
        setBedSelection:(state,action)=>{
            state.bedSelection=action.payload
        }
    }
});

export const { 
    setCurrentIndex, setCustomerTable, setEndSearchDate, setStartSearchDate,
    setCountUpdateSuccess, setOpenBedUpdateModal, setBedSelection
}=customerStatisticFeature.actions;
export default customerStatisticFeature.reducer;