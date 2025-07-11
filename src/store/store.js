import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import riderReducer from './riderSlice';
import smsAuthReducer from './smsAuthSlice';

import modalReducer from './modalSlice';

import cartReducer from './cartSlice';
import productReducer from './productSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    rider: riderReducer,
    smsAuth: smsAuthReducer,
    cart: cartReducer,
    modal: modalReducer, 
    product: productReducer,
  },
});

export default store;
