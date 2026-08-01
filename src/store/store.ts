import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; 


import { authApi } from '../features/auth/authApi';
import { shopApi } from '../features/shop/shopApi';
import { storeCateApi } from '../features/store-api/store-api';
import { productApi } from '../lib/store/productdetail/productApi';
import { sessionApi } from '../features/auth/sessionApi';
import { userApi } from '../features/user/userApi';
import { cartApi } from '@/features/cart/cartApi';
import { checkoutApi } from '@/features/checkout/checkoutApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [checkoutApi.reducerPath]: checkoutApi.reducer,
      [cartApi.reducerPath]: cartApi.reducer, 
      [authApi.reducerPath]: authApi.reducer,
      [shopApi.reducerPath]: shopApi.reducer,
      [storeCateApi.reducerPath]: storeCateApi.reducer,
      [productApi.reducerPath]: productApi.reducer,
      [sessionApi.reducerPath]: sessionApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware().concat(
        checkoutApi.middleware,
        cartApi.middleware,
        authApi.middleware, 
        shopApi.middleware, 
        storeCateApi.middleware,
        productApi.middleware,
        sessionApi.middleware,
        userApi.middleware
      )
  }) 
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']