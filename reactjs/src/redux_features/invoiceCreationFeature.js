import { createSlice } from "@reduxjs/toolkit";

export const invoiceCreationFeature=createSlice({
    name:'invoice_creation',
    initialState:{
        openUpdateBedModal:false,
        bedSelection:null,
        bedSelectionList:[],
        countUpdateSuccess:0,
        openConfirmInvoiceCreationModal:false,
    },
    reducers:{
        setOpenUpdateBedModal:(state,action)=>{
            state.openUpdateBedModal=action.payload
        },
        setBedSelection:(state,action)=>{
            state.bedSelection=action.payload
        },
        setCountUpdateSuccess:(state)=>{
            state.countUpdateSuccess+=1
        },
        setOpenConfirmInvoiceCreationModal:(state,action)=>{
            state.openConfirmInvoiceCreationModal=action.payload
        },
        setBedSelectionList:(state,action)=>{
            state.bedSelectionList=action.payload
        }
    }
});

export const {
    setOpenUpdateBedModal, setBedSelection, setCountUpdateSuccess,
    setOpenConfirmInvoiceCreationModal, setBedSelectionList
}=invoiceCreationFeature.actions;
export default invoiceCreationFeature.reducer;