import { createSlice } from "@reduxjs/toolkit";

export const priceFeature=createSlice({
    name:'price',
    initialState:{
        openPriceModal:false,
        openSelectBedTypeModal:false,
        priceUpdateSuccess:0,
        priceSelection:null,
        bedTypeSelection:null,
    },
    reducers:{
        setOpenPriceModal:(state,action)=>{
            state.openPriceModal=action.payload
        },
        setOpenSelectBedTypeModal:(state,action)=>{
            state.openSelectBedTypeModal=action.payload
        },
        setPriceUpdateSuccess:(state)=>{
            state.priceUpdateSuccess+=1
        },
        setPriceSelection:(state,action)=>{
            state.priceSelection=action.payload
        },
        setBedTypeSelection:(state,action)=>{
            state.bedTypeSelection=action.payload
        }
    }
});

export const { setOpenPriceModal, setPriceSelection, setPriceUpdateSuccess, setOpenSelectBedTypeModal, setBedTypeSelection}=priceFeature.actions;

export default priceFeature.reducer;