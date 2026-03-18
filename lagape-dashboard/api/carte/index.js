import { kvGet } from '../_redis.js'

const DEFAULT = { plats: [], formules: [], vins: [] }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non supportée' })

  try {
    const data = (await kvGet('carte')) || DEFAULT
    return res.json(data)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
