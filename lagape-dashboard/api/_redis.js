import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  lazyConnect: false,
  tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined,
})

export async function kvGet(key) {
  const val = await redis.get(key)
  if (!val) return null
  return JSON.parse(val)
}

export async function kvSet(key, value) {
  await redis.set(key, JSON.stringify(value))
}

export default redis
