// src/store.ts
import { configureStore } from '@reduxjs/toolkit';

import { baseApi } from './api/baseApi'; 
import { authApi } from "./api/authApi";
import authReducer from './features/auth/authSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
