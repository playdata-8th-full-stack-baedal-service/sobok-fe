import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import riderReducer from './riderSlice';
import smsAuthReducer from './smsAuthSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    rider: riderReducer,
    smsAuth: smsAuthReducer,
  },
});

export default store;
