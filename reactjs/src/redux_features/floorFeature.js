import { createSlice } from "@reduxjs/toolkit";

export const floorFeatures =createSlice({
    name:'floor',
    initialState:{
        openModalChangeName:false,
        openModalInsertRoom:false,
        openModalSelectArea:false,
        openModalUpdateRoom:false,
        openModalCheckIn:false,
        openModalCheckOut:false,
        openModalChangeRoom:false,
        openModalSinglePayment:false,
        roomPriceTable:[],
        servicePriceTable:[],
        floorMenuAnchor:null,
        roomMenuAnchor:null,
        floorUpdateSuccess:0,
        roomUpdateSuccess:0,
        areaID:-1,
        areaName:'Chọn khu vực',
        floorID:-1,
        floorName:"",
        roomID:-1,
        bedID:-1,
        roomName:"",
        bedInRoomStatus:-1,
        roomBedQuantity:0,
        roomStatus:false,
    },
    reducers:{
        setOpenModalChangeName:(state,action)=>{
            state.openModalChangeName=action.payload
        },
        setOpenModalInsertRoom:(state,action)=>{
            state.openModalInsertRoom=action.payload
        },
        setOpenModalSelectArea:(state,action)=>{
            state.openModalSelectArea=action.payload
        },
        setOpenModalUpdateRoom:(state,action)=>{
            state.openModalUpdateRoom=action.payload
        },
        setOpenModalCheckIn:(state,action)=>{
            state.openModalCheckIn=action.payload
        },
        setOpenModalCheckOut:(state,action)=>{
            state.openModalCheckOut=action.payload
        },
        setOpenModalChangeRoom:(state,action)=>{
            state.openModalChangeRoom=action.payload
        },
        setOpenModalSinglePayment:(state,action)=>{
            state.openModalSinglePayment=action.payload
        },
        setFloorMenuAnchor:(state,action)=>{
            if(state.floorMenuAnchor===null&&action.payload!==null){
                state.floorMenuAnchor={
                mouseX:action.payload.X + 2,
                mouseY:action.payload.Y - 6,
                }
            }else{
                state.floorMenuAnchor=null
            }
        },
        setRoomMenuAnchor:(state,action)=>{
            if(state.roomMenuAnchor===null&&action.payload!==null){
                state.roomMenuAnchor={
                mouseX:action.payload.X + 2,
                mouseY:action.payload.Y - 6,
                }
            }else{
                state.roomMenuAnchor=null
            }
        },
        setRoomPriceTable:(state,action)=>{
            state.roomPriceTable=action.payload
        },
        setServicePriceTable:(state,action)=>{
            state.servicePriceTable=action.payload
        },
        setAreaID:(state,action)=>{
            state.areaID=action.payload
        },
        setAreaName:(state,action)=>{
            state.areaName=action.payload
        },
        setFloorID:(state,action)=>{
            state.floorID=action.payload
        },
        setBedID:(state,action)=>{
            state.bedID=action.payload
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
        },
        setFloorUpdateSuccess:(state)=>{
            state.floorUpdateSuccess+=1
        },
        setRoomUpdateSuccess:(state)=>{
            state.roomUpdateSuccess+=1
        },
        setRoomStatus:(state,action)=>{
            state.roomStatus=action.payload;
        },
        setBedInRoomStatus:(state,action)=>{
            state.bedInRoomStatus=action.payload
        },
    }
})

export const {
    setOpenModalChangeName,setFloorMenuAnchor,setOpenModalInsertRoom,
    setFloorID, setFloorName,setRoomBedQuantity,setRoomID,setRoomName,
    setOpenModalSelectArea, setAreaID, setRoomMenuAnchor, setOpenModalUpdateRoom,
    setFloorUpdateSuccess,setRoomUpdateSuccess, setAreaName, setRoomStatus, 
    setBedInRoomStatus, setOpenModalCheckIn, setOpenModalCheckOut, setOpenModalChangeRoom,
    setBedID, setOpenModalSinglePayment, setRoomPriceTable, setServicePriceTable
}=floorFeatures.actions;

export default floorFeatures.reducer;