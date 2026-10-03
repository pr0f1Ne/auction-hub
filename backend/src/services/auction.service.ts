import { prisma } from '../config/database'
import { redis } from '../config/redis'

export class AuctionService {
  async list(filters: { status?: string; sellerId?: string; page?: number; limit?: number }) {
    // ... (Giữ nguyên code cũ của bạn) ...
    const page = filters.page || 1
    const limit = filters.limit || 20

    const where: any = {}
    if (filters.status) where.status = filters.status
    if (filters.sellerId) where.sellerId = filters.sellerId

    const [auctions, total] = await Promise.all([
      prisma.auction.findMany({
        where,
        include: {
          item: true,
          seller: { select: { id: true, fullName: true, avatarUrl: true } },
          _count: { select: { bids: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auction.count({ where }),
    ])

    return { auctions, total, page, limit }
  }

  async getById(id: string) {
    // ... (Giữ nguyên code cũ của bạn) ...
    const auction = await prisma.auction.findUnique({
        where: { id },
        include: {
          item: true,
          seller: { select: { id: true, fullName: true, avatarUrl: true } },
          bids: {
            orderBy: { bidTime: 'desc' },
            take: 20,
            include: { bidder: { select: { id: true, fullName: true } } },
          },
          _count: { select: { bids: true } },
        },
      })
      if (!auction) throw new Error('Auction not found')
      return auction
  }

  // THÊM MỚI: Xử lý đặt giá (Bid)
  async placeBid(auctionId: string, bidderId: string, amount: number) {
    // 1. Dùng Transaction để tránh race condition khi có nhiều người bid cùng lúc
    return await prisma.$transaction(async (tx: { auction: { findUnique: (arg0: { where: { id: string; }; }) => any; update: (arg0: { where: { id: string; }; data: { currentPrice: number; }; }) => any; }; bid: { create: (arg0: { data: { auctionId: string; bidderId: string; amount: number; }; include: { bidder: { select: { id: boolean; fullName: boolean; }; }; }; }) => any; }; }) => {
      // Tìm phiên đấu giá, kiểm tra trạng thái
      const auction = await tx.auction.findUnique({ where: { id: auctionId } })
      
      if (!auction) throw new Error('Phiên đấu giá không tồn tại')
      if (auction.status !== 'active') throw new Error('Phiên đấu giá chưa bắt đầu hoặc đã kết thúc')
      if (auction.sellerId === bidderId) throw new Error('Người bán không thể tự đặt giá')
      if (new Date() > auction.endTime) throw new Error('Phiên đấu giá đã kết thúc')

      const currentPrice = Number(auction.currentPrice)
      const minIncrement = Number(auction.minIncrement)
      const validBidAmount = currentPrice + minIncrement

      // Kiểm tra giá bid có hợp lệ không
      if (amount < validBidAmount) {
        throw new Error(`Giá phải lớn hơn hoặc bằng ${validBidAmount}`)
      }

      // 2. Tạo record Bid mới
      const newBid = await tx.bid.create({
        data: {
          auctionId,
          bidderId,
          amount,
        },
        include: {
          bidder: { select: { id: true, fullName: true } }
        }
      })

      // 3. Cập nhật currentPrice của Auction
      await tx.auction.update({
        where: { id: auctionId },
        data: {
          currentPrice: amount,
          // Nếu có luật gia hạn thời gian (sniper protection) thì update endTime ở đây
        }
      })

      // 4. Publish sự kiện qua Redis để WebSocket server khác có thể lắng nghe
      // Channel name: "auction:bids"
      redis.publish('auction:bids', JSON.stringify(newBid))

      return newBid
    })
  }
}

export const auctionService = new AuctionService()