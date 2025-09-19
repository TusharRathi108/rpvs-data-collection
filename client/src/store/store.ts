//* package imports
import { configureStore } from "@reduxjs/toolkit";

//* file imports
import authReducer from "@/store/slices/auth-slice";
import baseApi from "@/store/services/api";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
