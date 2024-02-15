import { createSlice } from "@reduxjs/toolkit";

export const floorFeatures =createSlice({
    name:'floor',
    initialState:{
        openModalChangeName:false,
        openModalInsertRoom:false,
        floorMenuAnchor:null,
        floorID:-1,
        floorName:"",
        roomID:-1,
        roomName:"",
        roomBedQuantity:0,
    },
    reducers:{
        setOpenModalChangeName:(state,action)=>{
            state.openModalChangeName=action.payload
        },
        setOpenModalInsertRoom:(state,action)=>{
            state.openModalInsertRoom=action.payload
        },
        setFloorMenuAnchor:(state,action)=>{
            if(state.floorMenuAnchor===null&&action.payload!==null){
                state.floorMenuAnchor={
                mouseX:action.payload.clientX + 2,
                mouseY:action.payload.clientY - 6,
                }
            }else{
                state.floorMenuAnchor=null
            }
        },
        setFloorID:(state,action)=>{
            state.floorID=action.payload
        },
        setFloorName:(state,action)=>{
            state.floorName=action.payload
        },
        setRoomID:(state,action)=>{
            state.roomID=action.payload
        },
        setRoomName:(state,action)=>{
            state.roomName=action.payload
        },
        setRoomBedQuantity:(state,action)=>{
            state.roomBedQuantity=action.payload
        }
    }
})

export const {
    setOpenModalChangeName,setFloorMenuAnchor,setOpenModalInsertRoom,
    setFloorID, setFloorName,setRoomBedQuantity,setRoomID,setRoomName
}=floorFeatures.actions;

export default floorFeatures.reducer;