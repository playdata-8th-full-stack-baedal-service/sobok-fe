import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import riderReducer from './riderSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    rider: riderReducer,
  },
});

export default store;
