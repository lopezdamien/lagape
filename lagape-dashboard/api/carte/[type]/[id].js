import { kvGet, kvSet } from '../../_redis.js'
import { checkAuth } from '../../_auth.js'

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => { body += chunk.toString() })
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}) } catch { resolve({}) }
    })
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!checkAuth(req, res)) return

  const { type, id } = req.query

  try {
    const data = (await kvGet('carte')) || { plats: [], formules: [], vins: [] }
    const collection = data[type] || []
    const idx = collection.findIndex(i => i.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Non trouvé' })

    if (req.method === 'PUT') {
      const body = await parseBody(req)
      data[type][idx] = { ...collection[idx], ...body }
      await kvSet('carte', data)
      return res.json(data[type][idx])
    }

    if (req.method === 'DELETE') {
      data[type].splice(idx, 1)
      await kvSet('carte', data)
      return res.json({ success: true })
    }

    res.status(405).json({ error: 'Méthode non supportée' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
