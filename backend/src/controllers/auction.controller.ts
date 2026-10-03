import { z } from 'zod'
import { auctionService } from '../services/auction.service'
import { bidService } from '../services/bid.service'
import { asyncHandler } from '../utils/asyncHandler'
import { AuthRequest } from '../middlewares/auth.middleware'

export const listAuctions = asyncHandler(async (req, res) => {
  const result = await auctionService.list({
    status: req.query.status as string,
    sellerId: req.query.sellerId as string,
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  })
  res.json(result)
})

export const getAuction = asyncHandler(async (req, res) => {
  const auction = await auctionService.getById(req.params.id)
  res.json(auction)
})

const placeBidSchema = z.object({ amount: z.number().positive() })

export const placeBid = asyncHandler(async (req: AuthRequest, res) => {
  const { amount } = placeBidSchema.parse(req.body)
  const bid = await bidService.placeBid(req.params.id, req.user!.userId, amount)
  res.status(201).json(bid)
})

export const getBids = asyncHandler(async (req, res) => {
  const bids = await bidService.getHistory(req.params.id)
  res.json(bids)
})