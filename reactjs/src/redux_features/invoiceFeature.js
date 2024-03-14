import { createSlice } from "@reduxjs/toolkit";

export const invoiceFeature=createSlice({
    name:'invoice',
    initialState:{
        openModalPrintInvoice:false,
        openModalInvoicePayment:false,
        successUpdateInvoice:0,
        invoiceSelection:null
    },
    reducers:{
        setOpenModalPrintInvoice:(state,action)=>{
            state.openModalPrintInvoice=action.payload
        },
        setSuccessUpdateInvoice:(state)=>{
            state.successUpdateInvoice+=1
        },
        setInvoiceSelection:(state,action)=>{
            state.invoiceSelection=action.payload
        },
        setOpenModalInvoicePayment:(state,action)=>{
            state.openModalInvoicePayment=action.payload
        },
    }
});

export const {setOpenModalPrintInvoice, successUpdateInvoice, setInvoiceSelection,
setOpenModalInvoicePayment}=invoiceFeature.actions;

export default invoiceFeature.reducer;