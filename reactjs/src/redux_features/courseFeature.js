import { createSlice } from "@reduxjs/toolkit";

const courseFeature=createSlice({
    name:'course',
    initialState:{
        courseName:'',
        courseStartDate:new Date(),
        courseEndDate:new Date(),
        openCourseModal:false,
        courseUpdateSuccess:0,
    },
    reducers:{
        setCourseName:(state,action)=>{
            state.courseName=action.payload
        },
        setCourseStartDate:(state,action)=>{
            state.courseStartDate=action.payload
        },
        setCourseEndDate:(state,action)=>{
            state.courseEndDate=action.payload
        },
        setOpenCourseModal:(state,action)=>{
            state.openCourseModal=action.payload
        },
        setCourseUpdateSuccess:(state)=>{
            state.courseUpdateSuccess+=1
        },
    }
});

export const {
    setCourseEndDate, setCourseName, setCourseStartDate, setCourseUpdateSuccess, setOpenCourseModal 
}=courseFeature.actions;

export default courseFeature.reducer;