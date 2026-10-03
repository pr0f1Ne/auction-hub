import { apiClient } from '../utils/axios';
import type { Auction} from '../types/auction';

export interface Bid {
  id: string;
  amount: string | number;
  bidTime: string;
  bidder: {
    id: string;
    fullName: string;
  };
}

export const auctionService = {
  getAuctionDetail: async (id: string): Promise<Auction> => {
    const response = await apiClient.get(`/auctions/${id}`);
    return response.data.data;
  },

  placeBid: async (auctionId: string, amount: number, bidderId: string) => {
    const response = await apiClient.post(`/auctions/${auctionId}/bids`, {
      amount,
      bidderId,
    });
    return response.data.data;
  },
};

export type { Auction };
