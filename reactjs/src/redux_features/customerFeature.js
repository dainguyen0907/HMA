import { createSlice } from "@reduxjs/toolkit";

export const customerFeature=createSlice({
    name:'customer',
    initialState:{
        openCustomerModal:false,
        openCustomerImportFileModal:false,
        openCustomerListModal:false,
        openCustomerImportFileStatusModal:false,
        customerUpdateSuccess:0,
        customerImportFileErrorList:[],
        customerSelection:null,
        customerList:[],
    },
    reducers:{
        setOpenCustomerModal:(state,action)=>{
            state.openCustomerModal=action.payload
        },
        setOpenCustomerImportFileModal:(state,action)=>{
            state.openCustomerImportFileModal=action.payload
        },
        setOpenCustomerImportFileStatusModal:(state,action)=>{
            state.openCustomerImportFileStatusModal=action.payload
        },
        setOpenCustomerListModal:(state,action)=>{
            state.openCustomerListModal=action.payload
        },
        setCustomerImportFileErrorList:(state,action)=>{
            state.customerImportFileErrorList=action.payload
        },
        setCustomerUpdateSuccess:(state)=>{
            state.customerUpdateSuccess+=1
        },
        setCustomerSelection:(state,action)=>{
            state.customerSelection=action.payload
        },
        setCustomerList:(state,action)=>{
            state.customerList=action.payload
        }
    }
});

export const { 
    setCustomerSelection, setCustomerUpdateSuccess, setOpenCustomerModal, setOpenCustomerImportFileModal,
    setOpenCustomerImportFileStatusModal, setCustomerImportFileErrorList, setOpenCustomerListModal, setCustomerList

}=customerFeature.actions;

export default customerFeature.reducer;