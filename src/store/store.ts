

import { authApi } from '@/features/auth/authApi'
import { storeApi } from '@/features/shop/shopApi'
import { storeCateApi } from '@/features/store-api/store-api'
import {configureStore} from '@reduxjs/toolkit'

// set up the store
export const makeStore = () => {
  return configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [storeApi.reducerPath] : storeApi.reducer,
      [storeCateApi.reducerPath]  :storeCateApi.reducer
    },
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware().concat(authApi.middleware, storeApi.middleware, storeCateApi.middleware)
    
  }) 
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']