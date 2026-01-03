import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = `${process.env.REACT_APP_API_URL}/api/auth`;
// Initial state
const initialState = {
	user: null,
	token: null,
	loading: false,
	error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
	'user/login',
	async (credentials, { rejectWithValue }) => {
		try {
			const res = await axios.post(`${URL}/login`, credentials);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response?.data?.message || 'Login failed');
		}
	}
);

// Async thunk for register
export const registerUser = createAsyncThunk(
	'user/register',
	async (userData, { rejectWithValue }) => {
		try {
			const res = await axios.post(`${URL}/register`, userData);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response?.data?.message || 'Registration failed');
		}
	}
);

// Slice
const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logout: (state) => {
			state.user = null;
			state.token = null;
			state.error = null;
			localStorage.removeItem('user');
			localStorage.removeItem('token');
		},
		setUser: (state, action) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
		},
	},
	extraReducers: (builder) => {
		builder
			// Login
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
				localStorage.setItem('user', JSON.stringify(action.payload.user));
				localStorage.setItem('token', action.payload.token);
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Register
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
				localStorage.setItem('user', JSON.stringify(action.payload.user));
				localStorage.setItem('token', action.payload.token);
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;
