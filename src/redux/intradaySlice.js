import { createSlice } from '@reduxjs/toolkit'

const intradaySlice = createSlice({
  name: 'intraday',
  initialState: [],
  reducers: {
    stockSymbol(state, action) {
      state.push({
        symbol: action.payload.stockSymbol,
      })
    },
  }
})

export const { stockSymbol } = intradaySlice.actions

export default intradaySlice.reducer
