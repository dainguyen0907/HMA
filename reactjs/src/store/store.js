import { combineReducers, configureStore } from "@reduxjs/toolkit";
import receptionFeature from "../redux_features/receptionFeature";
import floorFeature from "../redux_features/floorFeature";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import managerFeature from "../redux_features/managerFeature";


const persistConfig={
    key:'root',
    storage,
    blacklist:['floor','manager']
}

const rootReducer=combineReducers({
    reception: receptionFeature,
    floor:floorFeature,
    manager:managerFeature
})

const persistedReducer=persistReducer(persistConfig,rootReducer);
export const store=configureStore({
    reducer:persistedReducer,
});

export const persistor = persistStore(store);