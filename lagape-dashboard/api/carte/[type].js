import { kvGet, kvSet } from '../_redis.js'
import { v4 as uuidv4 } from 'uuid'
import { checkAuth } from '../_auth.js'

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
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!checkAuth(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non supportée' })

  const { type } = req.query

  try {
    const body = await parseBody(req)
    const data = (await kvGet('carte')) || DEFAULT
    const collection = data[type] || []
    const item = { id: uuidv4(), ...body, ordre: collection.length + 1 }
    if (type === 'plats') item.actif = true
    data[type] = [...collection, item]
    await kvSet('carte', data)
    return res.status(201).json(item)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
