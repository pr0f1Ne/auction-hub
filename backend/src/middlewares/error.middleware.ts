import { Request, Response, NextFunction } from 'express'
import { logger } from '../config/logger'
import { ZodError } from 'zod'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors,
    })
  }

  logger.error(err.message, { stack: err.stack })

  res.status(500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  })
}