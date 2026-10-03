import { baseApi } from './baseApi'
import type { User } from '@/types'

interface LoginRequest { email: string; password: string }
interface AuthResponse { user: User; token: string }

// injectEndpoints, không có reducerPath
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, {
      email: string
      password: string
      fullName: string
    }>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    me: builder.query<User, void>({
      query: () => '/auth/me',
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useMeQuery } = authApi