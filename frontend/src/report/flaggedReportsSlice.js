import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch flagged reports count
export const fetchFlaggedReportsCount = createAsyncThunk(
  'flaggedReports/fetchCount',
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:8000/api/reports?admin_flagged=true', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data ? res.data.data.length : 0;
    } catch (err) {
      return rejectWithValue('Failed to fetch flagged reports count');
    }
  }
);

const flaggedReportsSlice = createSlice({
  name: 'flaggedReports',
  initialState: {
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlaggedReportsCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlaggedReportsCount.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload;
      })
      .addCase(fetchFlaggedReportsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default flaggedReportsSlice.reducer;
