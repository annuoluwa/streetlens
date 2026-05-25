import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for API requests
const API_BASE = process.env.REACT_APP_API_URL || '';
const URL = `${API_BASE}/api/auth`;

const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${URL}/login`, credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.response?.data?.error || 'Login failed'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${URL}/register`, userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.response?.data?.error || 'Registration failed'
      );
    }
  }
);

export const refreshUser = createAsyncThunk(
  'user/refresh',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user;
      if (!token) return rejectWithValue('No token');
      const res = await axios.get(`${URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue('Refresh failed');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ oldPassword, newPassword }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user;

      const res = await axios.post(
        `${URL}/reset-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.response?.data?.error || 'Password reset failed'
      );
    }
  }
);

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
    markEmailVerified: (state) => {
      if (state.user) {
        state.user.email_verified = true;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
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
      })

      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setUser, markEmailVerified } = userSlice.actions;
export default userSlice.reducer;
