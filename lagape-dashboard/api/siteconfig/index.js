import { kvGet } from '../_redis.js'

const DEFAULT = { photoAccueil: null }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const configKey = 'siteconfig'

  try {
    if (req.method === 'GET') {
      const data = (await kvGet(configKey)) || DEFAULT
      return res.json(data)
    }
    res.status(405).json({ error: 'Méthode non supportée' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
