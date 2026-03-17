import { kv } from '@vercel/kv'
import { v4 as uuidv4 } from 'uuid'

const DEFAULT = { plats: [], formules: [], vins: [] }

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  // params = [] | ['plats'] | ['plats', 'uuid']
  const params = req.query.params || []
  const [type, id] = params

  try {
    const data = (await kv.get('carte')) || DEFAULT

    // GET /api/carte
    if (req.method === 'GET' && !type) {
      return res.json(data)
    }

    // POST /api/carte/:type
    if (req.method === 'POST' && type && !id) {
      const body = await parseBody(req)
      const collection = data[type] || []
      const item = { id: uuidv4(), ...body, ordre: collection.length + 1 }
      if (type === 'plats') item.actif = true
      data[type] = [...collection, item]
      await kv.set('carte', data)
      return res.status(201).json(item)
    }

    // PUT /api/carte/:type/:id
    if (req.method === 'PUT' && type && id) {
      const body = await parseBody(req)
      const collection = data[type] || []
      const idx = collection.findIndex(i => i.id === id)
      if (idx === -1) return res.status(404).json({ error: 'Non trouvé' })
      data[type][idx] = { ...collection[idx], ...body }
      await kv.set('carte', data)
      return res.json(data[type][idx])
    }

    // DELETE /api/carte/:type/:id
    if (req.method === 'DELETE' && type && id) {
      const collection = data[type] || []
      const idx = collection.findIndex(i => i.id === id)
      if (idx === -1) return res.status(404).json({ error: 'Non trouvé' })
      data[type].splice(idx, 1)
      await kv.set('carte', data)
      return res.json({ success: true })
    }

    res.status(405).json({ error: 'Méthode non supportée' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
