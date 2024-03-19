import {  combineReducers, configureStore } from "@reduxjs/toolkit";
import receptionFeature from "../redux_features/receptionFeature";
import floorFeature from "../redux_features/floorFeature";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import invoiceFeature from "../redux_features/invoiceFeature";
import accountFeature from "../redux_features/accountFeature";


const persistConfig={
    key:'root',
    storage,
    blacklist:['floor','invoice','account']
}

const rootReducer=combineReducers({
    reception: receptionFeature,
    floor:floorFeature,
    invoice:invoiceFeature,
    account:accountFeature,
})

const persistedReducer=persistReducer(persistConfig,rootReducer);
export const store=configureStore({
    reducer:persistedReducer,
    middleware:getDefaultMiddleware=>getDefaultMiddleware({
        serializableCheck:false
    }),
});

export const persistor = persistStore(store);