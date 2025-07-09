import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import riderReducer from './riderSlice';
import smsAuthReducer from './smsAuthSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    rider: riderReducer,
    smsAuth: smsAuthReducer,
    cart: cartReducer,
  },
});

export default store;
