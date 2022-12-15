import { configureStore } from '@reduxjs/toolkit'
import intradayReducer from './intradaySlice'

export const store = configureStore({
    reducer: {
        intraday: intradayReducer,
    }
})
