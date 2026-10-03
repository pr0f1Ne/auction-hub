import { baseApi } from './baseApi'
import type { Auction, Bid } from '@/types'

// ✅ ĐÚNG
export const auctionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuctions: builder.query<Auction[], { status?: string; page?: number }>({
      query: (params) => ({ url: '/auctions', params }),
      providesTags: ['Auction'],
    }),
    getAuction: builder.query<Auction, string>({
      query: (id) => `/auctions/${id}`,
      providesTags: (_, __, id) => [{ type: 'Auction', id }],
    }),
    placeBid: builder.mutation<Bid, { auctionId: string; amount: number }>({
      query: ({ auctionId, amount }) => ({
        url: `/auctions/${auctionId}/bids`,
        method: 'POST',
        body: { amount },
      }),
      invalidatesTags: (_, __, { auctionId }) => [
        { type: 'Auction', id: auctionId },
      ],
    }),
  }),
})

export const {
  useGetAuctionsQuery,
  useGetAuctionQuery,
  usePlaceBidMutation,
} = auctionApi