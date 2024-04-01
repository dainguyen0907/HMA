import {  combineReducers, configureStore } from "@reduxjs/toolkit";
import receptionFeature from "../redux_features/receptionFeature";
import floorFeature from "../redux_features/floorFeature";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import invoiceFeature from "../redux_features/invoiceFeature";
import accountFeature from "../redux_features/accountFeature";
import bedTypeFeature from "../redux_features/bedTypeFeature";
import serviceFeature from "../redux_features/serviceFeature";
import priceFeature from "../redux_features/priceFeature";
import areaFeature from "../redux_features/areaFeature";
import customerFeature from "../redux_features/customerFeature";
import revenueFeature from "../redux_features/revenueFeature";
import  baseFeature  from "../redux_features/baseFeature";


const persistConfig={
    key:'root',
    storage,
    blacklist:['floor','invoice','account','bedType','service',
    'price','area','customer','revenue','base']
}

const rootReducer=combineReducers({
    reception: receptionFeature,
    floor:floorFeature,
    invoice:invoiceFeature,
    account:accountFeature,
    bedType:bedTypeFeature,
    service:serviceFeature,
    price:priceFeature,
    area:areaFeature,
    customer:customerFeature,
    revenue:revenueFeature,
    base:baseFeature,
})

const persistedReducer=persistReducer(persistConfig,rootReducer);
export const store=configureStore({
    reducer:persistedReducer,
    middleware:getDefaultMiddleware=>getDefaultMiddleware({
        serializableCheck:false
    }),
});

export const persistor = persistStore(store);