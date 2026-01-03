import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async thunks
export const fetchReports = createAsyncThunk('reports/fetchReports', async (_, thunkAPI) => {
	try {
		const response = await api.get('/reports');
		// The backend returns { page, limit, total, totalPages, data: [...] }
		return response.data.data || [];
	} catch (error) {
		return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
	}
});

export const addReport = createAsyncThunk('reports/addReport', async (reportData, thunkAPI) => {
	try {
		// Get token from user state
		const state = thunkAPI.getState();
		const token = state.user.token;
		const config = {
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
		};
		const response = await api.post('/reports', reportData, config);
		return response.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add report');
	}
});

const reportSlice = createSlice({
	name: 'reports',
	initialState: {
		reports: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Fetch reports
			.addCase(fetchReports.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchReports.fulfilled, (state, action) => {
				state.loading = false;
				state.reports = action.payload;
			})
			.addCase(fetchReports.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Add report
			.addCase(addReport.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addReport.fulfilled, (state, action) => {
				state.loading = false;
				if (!Array.isArray(state.reports)) {
					state.reports = [];
				}
				state.reports.unshift(action.payload);
			})
			.addCase(addReport.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default reportSlice.reducer;
