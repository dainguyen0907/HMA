import { createSlice } from "@reduxjs/toolkit";

export const personalFeature=createSlice({
    name:'personal',
    initialState:{
        openPersonalAccountModal:false,
        personalUpdateSuccess:0,
    },
    reducers:{
        setOpenPersonalAccountModal:(state,action)=>{
            state.openPersonalAccountModal=action.payload
        },
        setPersonalUpdateSuccess:(state)=>{
            state.personalUpdateSuccess+=1
        }
    }
});

export const {setOpenPersonalAccountModal,setPersonalUpdateSuccess}=personalFeature.actions;

export default personalFeature.reducer;