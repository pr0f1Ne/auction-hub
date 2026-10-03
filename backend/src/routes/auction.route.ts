import { Router } from 'express'
import { auctionService } from '../services/auction.service'

const auctionRoute = Router()

// Lấy danh sách đấu giá
auctionRoute.get('/', async (req, res, next) => {
  try {
    const status = req.query.status as string | undefined
    const sellerId = req.query.sellerId as string | undefined
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20

    const result = await auctionService.list({ status, sellerId, page, limit })
    res.json({ success: true, data: result })
  } catch (error) {
    next(error) // Đẩy lỗi về errorHandler trong app.ts
  }
})

// Xem chi tiết một phiên đấu giá
auctionRoute.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const auction = await auctionService.getById(id)
    res.json({ success: true, data: auction })
  } catch (error) {
    next(error)
  }
})

// Đặt giá (Bid) - TODO: Thêm middleware check Auth sau
auctionRoute.post('/:id/bids', async (req, res, next) => {
  try {
    const auctionId = req.params.id
    const { amount, bidderId } = req.body
    
    // bidderId hiện tại lấy từ body để test, thực tế sẽ lấy từ req.user.id (JWT)
    if (!amount || !bidderId) {
      res.status(400).json({ success: false, error: 'Thiếu amount hoặc bidderId' })
      return
    }

    const newBid = await auctionService.placeBid(auctionId, bidderId, amount)
    
    res.json({ success: true, data: newBid })
  } catch (error) {
    next(error)
  }
})

export { auctionRoute }