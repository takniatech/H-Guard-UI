import type { LoginRequest, LoginResponse } from 'src/interfaces/auth';

import { baseApi } from './baseApi';


export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    updatePassword: builder.mutation<void, {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }>({
      query: (credentials) => ({
        url: '/auth/update-password',
        method: 'PUT',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation, useUpdatePasswordMutation } = authApi;
