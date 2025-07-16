import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import riderReducer from './riderSlice';
import smsAuthReducer from './smsAuthSlice';
import categoryReducer from './categorySlice';

import modalReducer from './modalSlice';

import cartReducer from './cartSlice';
import productReducer from './productSlice';
import userInfoReducer from './userInfoSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    rider: riderReducer,
    smsAuth: smsAuthReducer,
    cart: cartReducer,
    modal: modalReducer,
    product: productReducer,
    category: categoryReducer,
    userInfo: userInfoReducer,
  },
});

export default store;
