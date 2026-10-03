import { prisma } from '../config/database'
import { hashPassword, verifyPassword } from '../utils/password'
import { signToken } from '../utils/jwt'

export class AuthService {
  async register(data: { email: string; password: string; fullName: string }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    })
    if (existing) throw new Error('Email đã được đăng ký')

    const passwordHash = await hashPassword(data.password)
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        fullName: data.fullName,
        role: 'bidder',
      },
      select: {
        id: true, email: true, fullName: true,
        avatarUrl: true, role: true, isVerified: true,
      },
    })

    const token = signToken({ userId: user.id, email: user.email, role: user.role })
    return { user, token }
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })
    if (!user) throw new Error('Email hoặc mật khẩu không đúng')

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) throw new Error('Email hoặc mật khẩu không đúng')

    const token = signToken({ userId: user.id, email: user.email, role: user.role })
    const { passwordHash: _, ...userSafe } = user
    return { user: userSafe, token }
  }

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, fullName: true,
        avatarUrl: true, role: true, isVerified: true,
      },
    })
    if (!user) throw new Error('User not found')
    return user
  }
}

export const authService = new AuthService()