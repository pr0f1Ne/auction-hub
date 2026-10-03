import { prisma } from '../config/database'
import { redis } from '../config/redis'
import { acquireLock, releaseLock } from '../utils/redisLock'

export class BidService {
  async placeBid(auctionId: string, bidderId: string, amount: number) {
    const lockKey = `lock:auction:${auctionId}`
    const lockToken = await acquireLock(lockKey, 5)

    if (!lockToken) {
      throw new Error('Auction đang xử lý bid khác. Vui lòng thử lại.')
    }

    try {
      return await prisma.$transaction(async (tx) => {
        const auctions = await tx.$queryRaw<any[]>`
          SELECT * FROM auctions WHERE id = ${auctionId}::uuid FOR UPDATE
        `
        if (auctions.length === 0) throw new Error('Auction not found')
        const auction = auctions[0]

        if (auction.status !== 'active') throw new Error('Auction chưa hoạt động')
        if (auction.seller_id === bidderId) throw new Error('Người bán không thể bid')

        const now = new Date()
        if (now < new Date(auction.start_time)) throw new Error('Auction chưa bắt đầu')
        if (now > new Date(auction.end_time)) throw new Error('Auction đã kết thúc')

        const minBid = Number(auction.current_price) + Number(auction.min_increment)
        if (amount < minBid) {
          throw new Error(`Giá tối thiểu là ${minBid.toLocaleString('vi-VN')}đ`)
        }

        const bid = await tx.bid.create({
          data: { auctionId, bidderId, amount },
        })

        await tx.auction.update({
          where: { id: auctionId },
          data: { currentPrice: amount },
        })

        await redis.publish(
          `auction:${auctionId}:events`,
          JSON.stringify({
            type: 'BID_PLACED',
            auctionId,
            bid: { id: bid.id, amount: bid.amount, bidTime: bid.bidTime },
          })
        )

        return bid
      })
    } finally {
      await releaseLock(lockKey, lockToken)
    }
  }

  async getHistory(auctionId: string, limit = 50) {
    return prisma.bid.findMany({
      where: { auctionId },
      orderBy: { bidTime: 'desc' },
      take: limit,
      include: { bidder: { select: { id: true, fullName: true } } },
    })
  }
}

export const bidService = new BidService()