import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import { env } from './config/env'
import { router } from './routes'
import { errorHandler } from './middlewares/error.middleware'


export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
  app.use(compression())
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))

  if (env.NODE_ENV === 'development') app.use(morgan('dev'))

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  app.use('/api', router)

  app.use((_req, res) => res.status(404).json({ error: 'Not found' }))
  app.use(errorHandler)

  return app
}