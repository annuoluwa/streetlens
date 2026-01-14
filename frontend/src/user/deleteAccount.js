import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = `${process.env.REACT_APP_API_URL}/api/users`;

export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user;
      await axios.delete(`${URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Account deletion failed');
    }
  }
);
