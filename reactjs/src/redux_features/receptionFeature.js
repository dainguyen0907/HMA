import { createSlice } from "@reduxjs/toolkit";

export const receptionFeature=createSlice({
    name:'reception',
    initialState:{
        reception_name:"",
        reception_role:[],
    },
    reducers:{
        setReceptionName:(state,action)=>{
            state.reception_name=action.payload
        },
        setReceptionRole:(state,action)=>{
            state.reception_role=action.payload
        },
    }
});

export const {setReceptionName,setReceptionRole}=receptionFeature.actions;

export default receptionFeature.reducer;