import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware'
import * as authController from '../controllers/auth.controller'
import * as auctionController from '../controllers/auction.controller'
import { auctionRoute } from './auction.route'

const router = Router()

// Auth
router.post('/auth/register', authController.register)
router.post('/auth/login', authController.login)
router.get('/auth/me', authenticate, authController.me)

// Auctions
router.get('/auctions', auctionController.listAuctions)
router.get('/auctions/:id', auctionController.getAuction)
router.get('/auctions/:id/bids', auctionController.getBids)
router.post('/auctions/:id/bids', authenticate, auctionController.placeBid)
router.use('/auctions', auctionRoute)

export { router }