// src/features/auth/authSlice.ts
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LoginResponse } from 'src/interfaces/auth';

import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    message: '',
    store: null,
  } as LoginResponse,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return action.payload; 
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        token: '',
        user: null,
        message: '',
        store: null,
      };
    },
  },
});


export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
