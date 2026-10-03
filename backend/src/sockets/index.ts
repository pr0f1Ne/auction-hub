import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import { env } from '../config/env'
import { redis } from '../config/redis' // Đảm bảo export redis client từ đây

export function initSocket(httpServer: HttpServer) {
  // Khởi tạo Socket.io với cấu hình CORS khớp với Express
  const io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    }
  })

  // ==========================================
  // 1. Lắng nghe kết nối từ Client (Frontend)
  // ==========================================
  io.on('connection', (socket) => {
    console.log(`🟢 Client connected: ${socket.id}`)

    // Client gửi yêu cầu tham gia "phòng" khi vào xem chi tiết 1 phiên đấu giá
    socket.on('joinAuction', (auctionId: string) => {
      socket.join(`auction:${auctionId}`)
      console.log(`Client ${socket.id} joined room: auction:${auctionId}`)
    })

    // Client rời phòng khi thoát trang chi tiết
    socket.on('leaveAuction', (auctionId: string) => {
      socket.leave(`auction:${auctionId}`)
      console.log(`Client ${socket.id} left room: auction:${auctionId}`)
    })

    socket.on('disconnect', () => {
      console.log(`🔴 Client disconnected: ${socket.id}`)
    })
  })

  // ==========================================
  // 2. Tích hợp Redis Pub/Sub để phát sự kiện
  // ==========================================
  
  /* LƯU Ý QUAN TRỌNG: 
   * Theo giao thức của Redis, một client khi đang ở chế độ "Subscribe" thì 
   * KHÔNG THỂ gọi các lệnh bình thường (như publish, get, set). 
   * Do đó, ta phải tạo một bản sao (duplicate) của redis client chỉ để lắng nghe.
   */
  const subscriber = redis.duplicate()

  // Đăng ký lắng nghe kênh 'auction:bids'
  subscriber.subscribe('auction:bids', (err) => {
    if (err) {
      console.error('❌ Lỗi subscribe Redis:', err)
    } else {
      console.log(`📡 Đã subscribe vào kênh Redis Pub/Sub: auction:bids`)
    }
  })

  // Khi có dữ liệu mới được Publish vào kênh (từ auction.service.ts)
  subscriber.on('message', (channel, message) => {
    if (channel === 'auction:bids') {
      try {
        const newBid = JSON.parse(message)
        const roomName = `auction:${newBid.auctionId}`
        
        // Phát sự kiện 'newBid' chứa dữ liệu tới TẤT CẢ client đang trong phòng này
        io.to(roomName).emit('newBid', newBid)
        
      } catch (error) {
        console.error('Lỗi parse data từ Redis Pub/Sub:', error)
      }
    }
  })
}