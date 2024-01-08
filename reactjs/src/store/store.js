import { combineReducers, configureStore } from "@reduxjs/toolkit";
import receptionFeature from "../redux_features/receptionFeature";
import { persistReducer, persistStore } from "redux-persist";
import session from "redux-persist/lib/storage/session";


const persistConfig={
    key:'root',
    storage:session,
}

const rootReducer=combineReducers({
    reception: receptionFeature
})

const persistedReducer=persistReducer(persistConfig,rootReducer);
export const store=configureStore({
    reducer:persistedReducer,
});

export const persistor = persistStore(store);