import { createSlice } from "@reduxjs/toolkit";

export const customerStatisticFeature=createSlice({
    name:'customerStatistic',
    initialState:{
        currentIndex:0,
        startSearchDate:new Date().toLocaleDateString('vi-VI'),
        endSearchDate:new Date().toLocaleDateString('vi-VI'),
        idCompany:-1,
        course_name:'Tất cả khoá học',
        idCourse:-1,
        company_name:'Tất cả công ty',
        customerTable:[],
        countUpdateSuccess:0,
        openBedUpdateModal:false,
        bedSelection:null,
    },
    reducers:{
        setCurrentIndex:(state,action)=>{
            state.currentIndex=action.payload
        },
        setCustomerTable:(state,action)=>{
            state.customerTable=action.payload
        },
        setStartSearchDate:(state,action)=>{
            state.startSearchDate=action.payload
        },
        setEndSearchDate:(state,action)=>{
            state.endSearchDate=action.payload
        },
        setIdCompany:(state,action)=>{
            state.idCompany=action.payload
        },
        setCompanyNameTitle:(state,action)=>{
            state.company_name=action.payload
        },
        setIdCourse:(state,action)=>{
            state.idCourse=action.payload
        },
        setCourseNameTitle:(state,action)=>{
            state.course_name=action.payload
        },
        setCountUpdateSuccess:(state)=>{
            state.countUpdateSuccess+=1
        },
        setOpenBedUpdateModal:(state,action)=>{
            state.openBedUpdateModal=action.payload
        },
        setBedSelection:(state,action)=>{
            state.bedSelection=action.payload
        }
    }
});

export const { 
    setCurrentIndex, setCustomerTable, setEndSearchDate, setStartSearchDate,
    setCountUpdateSuccess, setOpenBedUpdateModal, setBedSelection, setIdCompany, setIdCourse,
    setCompanyNameTitle, setCourseNameTitle
}=customerStatisticFeature.actions;
export default customerStatisticFeature.reducer;