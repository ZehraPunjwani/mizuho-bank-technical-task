import { createSlice } from '@reduxjs/toolkit'
import TIME_SERIES_INTRADAY_IBM_1MIN from '../data/TIME_SERIES_INTRADAY_IBM_1MIN.json';
import TIME_SERIES_INTRADAY_IBM_5MIN from '../data/TIME_SERIES_INTRADAY_IBM_5MIN.json';
import TIME_SERIES_INTRADAY_IBM_15MIN from '../data/TIME_SERIES_INTRADAY_IBM_15MIN.json';
import TIME_SERIES_INTRADAY_IBM_30MIN from '../data/TIME_SERIES_INTRADAY_IBM_30MIN.json';

const intradaySlice = createSlice({
  name: 'intraday',
  initialState: {
    timeSeriesIntraDayData: {
      TIME_SERIES_INTRADAY_IBM_1MIN: TIME_SERIES_INTRADAY_IBM_1MIN,
      TIME_SERIES_INTRADAY_IBM_5MIN: TIME_SERIES_INTRADAY_IBM_5MIN,
      TIME_SERIES_INTRADAY_IBM_15MIN: TIME_SERIES_INTRADAY_IBM_15MIN,
      TIME_SERIES_INTRADAY_IBM_30MIN: TIME_SERIES_INTRADAY_IBM_30MIN
    },
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
