import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import authReducer from './slices/authSlice';
import { userSlice } from './slices/userSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userSlice.reducerPath]: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware:any) =>
    getDefaultMiddleware().concat([
      userSlice.middleware,
    ]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// import { configureStore } from '@reduxjs/toolkit'
// import authReducer from './slices/authSlice'

// export const store = configureStore({
//   reducer: {
//     auth: authReducer
//   }
// })

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch

// src/store/index.ts

// import { configureStore } from '@reduxjs/toolkit'
// import authReducer from './slices/authSlice'

// export const store = configureStore({
//   reducer: {
//     auth: authReducer
//   }
// })

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch