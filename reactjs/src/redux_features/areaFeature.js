import { createSlice } from "@reduxjs/toolkit";

export const areaFeature=createSlice({
    name:'area',
    initialState:{
        openAreaModal:false,
        areaUpdateSuccess:0,
        areaSelection:null,
    },
    reducers:{
        setOpenAreaModal:(state,action)=>{
            state.openAreaModal=action.payload
        },
        setAreaUpdateSuccess:(state)=>{
            state.areaUpdateSuccess+=1
        },
        setAreaSelection:(state,action)=>{
            state.areaSelection=action.payload
        }
    }
});

export const {
    setAreaSelection, setOpenAreaModal,setAreaUpdateSuccess
}=areaFeature.actions;

export default areaFeature.reducer;