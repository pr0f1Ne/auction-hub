export interface Bid {
  id: string;
  amount: string | number;
  bidTime: string;
  bidder: {
    id: string;
    fullName: string;
  };
}

export interface Auction {
  id: string;
  currentPrice: string | number;
  minIncrement: string | number;
  endTime: string;
  status: string;
  item: {
    title: string;
    images: string[];
  };
  seller: {
    fullName: string;
  };
  bids: Bid[];
}