import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/store'

export const baseApi = createApi({
  reducerPath: 'api',   // ← Chỉ có 1 reducerPath
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Auction', 'Bid', 'Order', 'Notification', 'User'],
  endpoints: () => ({}),
})