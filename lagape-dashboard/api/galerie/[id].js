import { kv } from '@vercel/kv'

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { id } = req.query

  try {
    const data = (await kv.get('galerie')) || { photos: [] }
    const idx = data.photos.findIndex(p => p.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Photo non trouvée' })

    if (req.method === 'PUT') {
      const body = await parseBody(req)
      data.photos[idx] = { ...data.photos[idx], ...body }
      await kv.set('galerie', data)
      return res.json(data.photos[idx])
    }

    if (req.method === 'DELETE') {
      data.photos.splice(idx, 1)
      await kv.set('galerie', data)
      return res.json({ success: true })
    }

    res.status(405).json({ error: 'Méthode non supportée' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
