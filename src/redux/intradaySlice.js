import { createSlice } from '@reduxjs/toolkit'

const intradaySlice = createSlice({
  name: 'intraday',
  initialState: {
    intradayData: {
      data: [],
      error: null
    },
  },
  reducers: {
    setIntradayData(state, action) {
      return {
        ...state,
        intradayData: {
          ...state.intradayData,
          data: action.payload.response,
        }
      }
    },
    setIntradayError(state, action) {
      return {
        ...state,
        intradayData: {
          ...state.intradayData,
          error: action.payload.error,
        }
      }
    }
  }
})

export const { setIntradayData, setIntradayError } = intradaySlice.actions

export default intradaySlice.reducer
