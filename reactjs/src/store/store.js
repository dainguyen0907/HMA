import { combineReducers, configureStore } from "@reduxjs/toolkit";
import receptionFeature from "../redux_features/receptionFeature";
import floorFeature from "../redux_features/floorFeature";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";


const persistConfig={
    key:'root',
    storage,
    blacklist:['floor']
}

const rootReducer=combineReducers({
    reception: receptionFeature,
    floor:floorFeature,
})

const persistedReducer=persistReducer(persistConfig,rootReducer);
export const store=configureStore({
    reducer:persistedReducer,
});

export const persistor = persistStore(store);