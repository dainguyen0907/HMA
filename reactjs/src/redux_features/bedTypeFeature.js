import { createSlice } from "@reduxjs/toolkit";

export const bedTypeFeature=createSlice({
    name:'bedType',
    initialState:{
        bedTypeUpdateSuccess:0,
        openBedTypeCreateModal:false,
        openBedTypeUpdateModal:false,
        bedTypeSelection:null,
    },
    reducers:{
        setOpenBedTypeCreateModal:(state,action)=>{
            state.openBedTypeCreateModal=action.payload
        },
        setOpenBedTypeUpdateModal:(state,action)=>{
            state.openBedTypeUpdateModal=action.payload
        },
        setBedTypeSelection:(state,action)=>{
            state.bedTypeSelection=action.payload
        },
        setBedTypeUpdateSuccess:(state)=>{
            state.bedTypeUpdateSuccess+=1
        }
    }
});

export const { setOpenBedTypeCreateModal, setOpenBedTypeUpdateModal, setBedTypeSelection, setBedTypeUpdateSuccess}=bedTypeFeature.actions;

export default bedTypeFeature.reducer;