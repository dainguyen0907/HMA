import { createSlice } from "@reduxjs/toolkit";

export const companyFeature=createSlice({
    name:'company',
    initialState:{
        companyName:"",
        companyPhone:"",
        companyEmail:"",
        companyAddress:"",
        updateCompanySuccess:0,
        openCompanyModal:false,
        companySelection:null,
    },
    reducers:{
        setCompanyName:(state,action)=>{
            state.companyName=action.payload
        },
        setCompanyPhone:(state,action)=>{
            state.companyPhone=action.payload
        },
        setCompanyEmail:(state,action)=>{
            state.companyEmail=action.payload
        },
        setCompanyAddress:(state,action)=>{
            state.companyAddress=action.payload
        },
        setUpdateCompanySuccess:(state)=>{
            state.updateCompanySuccess+=1
        },
        setOpenCompanyModal:(state,action)=>{
            state.openCompanyModal=action.payload
        },
        setCompanySelection:(state,action)=>{
            state.companySelection=action.payload
        }
    }
});

export const {
    setCompanyName, setCompanyAddress,setCompanyEmail,setCompanyPhone, setUpdateCompanySuccess, setOpenCompanyModal,
    setCompanySelection
}=companyFeature.actions;

export default companyFeature.reducer;