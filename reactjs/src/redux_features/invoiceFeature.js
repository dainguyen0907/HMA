import { createSlice } from "@reduxjs/toolkit";

export const invoiceFeature=createSlice({
    name:'invoice',
    initialState:{
        openModalPrintInvoice:false,
        openModalInvoicePayment:false,
        openModalInvoiceHistory:false,
        successUpdateInvoice:0,
        invoiceSelection:null,
        invoiceId:-1,
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
        setInvoiceId:(state,action)=>{
            state.invoiceId=action.payload
        },
        setOpenModalInvoiceHistory:(state,action)=>{
            state.openModalInvoiceHistory=action.payload
        }
    }
});

export const {setOpenModalPrintInvoice, setSuccessUpdateInvoice, setInvoiceSelection,
setOpenModalInvoicePayment, setInvoiceId,setOpenModalInvoiceHistory
}=invoiceFeature.actions;

export default invoiceFeature.reducer;