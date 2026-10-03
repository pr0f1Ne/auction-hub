import { redis } from '../config/redis'
import { randomUUID } from 'crypto'

export async function acquireLock(key: string, ttlSeconds = 5): Promise<string | null> {
  const token = randomUUID()
  const result = await redis.set(key, token, 'EX', ttlSeconds, 'NX')
  return result === 'OK' ? token : null
}

export async function releaseLock(key: string, token: string): Promise<void> {
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `
  await redis.eval(script, 1, key, token)
}