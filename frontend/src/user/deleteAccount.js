import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/users/me');
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Account deletion failed');
    }
  }
);
