import { configureStore } from "@reduxjs/toolkit";
import receptionFeature from "../redux_features/receptionFeature";

export default configureStore({
    reducer:{
        reception: receptionFeature
    }
});