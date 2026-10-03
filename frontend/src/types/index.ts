export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  role: 'bidder' | 'seller' | 'admin'
  isVerified: boolean
}

export interface Auction {
  id: string
  itemId: string
  sellerId: string
  startingPrice: number
  currentPrice: number
  minIncrement: number
  startTime: string
  endTime: string
  status: 'pending' | 'active' | 'ended' | 'cancelled'
  itemTitle: string
  itemImages: string[]
  sellerName: string
  totalBids: number
}

export interface Bid {
  id: string
  auctionId: string
  bidderId: string
  amount: number
  bidTime: string
}