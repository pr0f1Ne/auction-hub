import { createServer } from 'http'
import { createApp } from './app'
import { env } from './config/env'
import { prisma } from './config/database'
import { redis } from './config/redis'
import { initSocket } from './sockets'

async function bootstrap() {
  const app = createApp()
  const httpServer = createServer(app)

  try {
    await prisma.$connect()
    console.log('✅ PostgreSQL connected')
  } catch (err) {
    console.error('❌ PostgreSQL error:', err)
    process.exit(1)
  }

  initSocket(httpServer)

  httpServer.listen(env.PORT, () => {
    console.log(`🚀 Server running at http://localhost:${env.PORT}`)
    console.log(`📊 Environment: ${env.NODE_ENV}`)
  })

  const shutdown = async () => {
    console.log('\n🛑 Shutting down...')
    await prisma.$disconnect()
    redis.disconnect()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

bootstrap().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})