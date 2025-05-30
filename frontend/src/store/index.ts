import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import orderReducer from './orderSlice';
import productReducer from './productSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: orderReducer,
    products: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;