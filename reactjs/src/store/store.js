import { combineReducers, configureStore } from "@reduxjs/toolkit";
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
import baseFeature from "../redux_features/baseFeature";
import personalFeature from "../redux_features/personalFeature";
import companyFeature from "../redux_features/companyFeature";
import courseFeature from "../redux_features/courseFeature";
import formFeature from "../redux_features/formFeature";
import invoiceCreationFeature from "../redux_features/invoiceCreationFeature";
import customerStatisticFeature from "../redux_features/customerStatisticFeature";


const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, receptionFeature);
const rootReducer = combineReducers({
    reception: persistedReducer,
    floor: floorFeature,
    invoice: invoiceFeature,
    account: accountFeature,
    bedType: bedTypeFeature,
    service: serviceFeature,
    price: priceFeature,
    area: areaFeature,
    customer: customerFeature,
    revenue: revenueFeature,
    base: baseFeature,
    personal: personalFeature,
    company: companyFeature,
    course: courseFeature,
    form: formFeature,
    invoice_creation:invoiceCreationFeature,
    customer_statistic:customerStatisticFeature,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    }),
});

export const persistor = persistStore(store);