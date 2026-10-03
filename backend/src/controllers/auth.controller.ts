import { Response } from 'express'
import { z } from 'zod'
import { authService } from '../services/auth.service'
import { asyncHandler } from '../utils/asyncHandler'
import { AuthRequest } from '../middlewares/auth.middleware'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const register = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body)
  const result = await authService.register(data)
  res.status(201).json(result)
})

export const login = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body)
  const result = await authService.login(data.email, data.password)
  res.json(result)
})

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.me(req.user!.userId)
  res.json(user)
})