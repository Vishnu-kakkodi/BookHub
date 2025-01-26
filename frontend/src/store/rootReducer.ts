
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { userSlice } from './slices/userSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  [userSlice.reducerPath]: userSlice.reducer,
});

export default rootReducer; 