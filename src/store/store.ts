import { telegramWebAppApi } from '@/features/auth/telegramWebAppApi';
import { facebookWebAppApi } from '@/features/auth/facebookWebAppApi';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice'; 


import { authApi } from '../features/auth/authApi';
import { shopApi } from '../features/shop/shopApi';
import { storeCateApi } from '../features/store-api/store-api';
import { productApi } from '../lib/store/productdetail/productApi';
import { sessionApi } from '../features/auth/sessionApi';
import { userApi } from '../features/user/userApi';
import { cartApi } from '@/features/cart/cartApi';
import { checkoutApi } from '@/features/checkout/checkoutApi';
import { businessRegisterApi } from '@/features/business-registration/businessApi';
import { menuApi } from '@/lib/store/detailstore/detailstore';
import { bannerApi } from '@/features/banner/bannerApi';

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [telegramWebAppApi.reducerPath]: telegramWebAppApi.reducer,
      [facebookWebAppApi.reducerPath]: facebookWebAppApi.reducer,
      auth: authReducer,
      [checkoutApi.reducerPath]: checkoutApi.reducer,
      [cartApi.reducerPath]: cartApi.reducer, 
      [authApi.reducerPath]: authApi.reducer,
      [shopApi.reducerPath]: shopApi.reducer,
      [storeCateApi.reducerPath]: storeCateApi.reducer,
      [productApi.reducerPath]: productApi.reducer,
      [sessionApi.reducerPath]: sessionApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [businessRegisterApi.reducerPath]: businessRegisterApi.reducer,
      [menuApi.reducerPath]: menuApi.reducer,
      [bannerApi.reducerPath]: bannerApi.reducer,
    },
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware().concat(
        telegramWebAppApi.middleware,
        facebookWebAppApi.middleware,
        checkoutApi.middleware,
        cartApi.middleware,
        authApi.middleware, 
        shopApi.middleware, 
        storeCateApi.middleware,
        productApi.middleware,
        sessionApi.middleware,
        userApi.middleware,
        businessRegisterApi.middleware,
        menuApi.middleware,
        bannerApi.middleware
      )
  })

  // Lets an API opt into re-reading when the tab is looked at again or the
  // connection comes back. Without this the flags on `storeCateApi` are inert.
  setupListeners(store.dispatch)

  return store
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']