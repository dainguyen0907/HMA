import { createSlice } from "@reduxjs/toolkit";

export const serviceFeature=createSlice({
    name:'serviceFeature',
    initialState:{
        openModalService:false,
        serviceSelection:null,
        serviceUpdateSuccess:0,
    },
    reducers:{
        setOpenModalService:(state,action)=>{
            state.openModalService=action.payload;
        },
        setServiceSelection:(state,action)=>{
            state.serviceSelection=action.payload;
        },
        setServiceUpdateSuccess:(state)=>{
            state.serviceUpdateSuccess+=1
        }
    }
});

export const {
    setOpenModalService, setServiceSelection, setServiceUpdateSuccess
}=serviceFeature.actions;

export default serviceFeature.reducer;