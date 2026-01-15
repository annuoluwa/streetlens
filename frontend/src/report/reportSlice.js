import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const initialState = {
  reports: [],
  loading: false,
  error: null,
};

export const fetchReports = createAsyncThunk(
  'reports/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/reports', { params });
      const payload = response.data;
      if (Array.isArray(payload)) {
        return payload;
      }
      if (Array.isArray(payload?.data)) {
        return payload.data;
      }
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch reports'
      );
    }
  }
);

export const addReport = createAsyncThunk(
  'reports/add',
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await api.post('/reports', reportData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create report'
      );
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload || [];
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch reports';
      })
      .addCase(addReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReport.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.reports = [action.payload, ...(state.reports || [])];
        }
      })
      .addCase(addReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create report';
      });
  },
});

export default reportSlice.reducer;
