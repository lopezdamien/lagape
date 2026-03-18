import { kvGet, kvSet } from '../_redis.js'
import { put } from '@vercel/blob'
import formidable from 'formidable'
import { promises as fs } from 'fs'
import { checkAuth } from '../_auth.js'

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ maxFileSize: 5 * 1024 * 1024, uploadDir: '/tmp', keepExtensions: true })
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

function field(val) {
  return Array.isArray(val) ? val[0] : val
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { id } = req.query

  try {
    const data = (await kvGet('blog')) || { articles: [] }
    const idx = data.articles.findIndex(a => a.id === id)

    if (req.method === 'GET') {
      if (idx === -1) return res.status(404).json({ error: 'Article non trouvé' })
      return res.json(data.articles[idx])
    }

    if (req.method === 'PUT') {
      if (!checkAuth(req, res)) return
      if (idx === -1) return res.status(404).json({ error: 'Article non trouvé' })
      const { fields, files } = await parseForm(req)
      const update = { ...data.articles[idx] }

      if (field(fields.titre) !== undefined) update.titre = field(fields.titre)
      if (field(fields.contenu) !== undefined) update.contenu = field(fields.contenu)
      if (field(fields.slug) !== undefined) update.slug = field(fields.slug)
      if (field(fields.datePublication) !== undefined) update.datePublication = field(fields.datePublication)
      if (field(fields.publie) !== undefined) update.publie = field(fields.publie) === 'true'

      if (files.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image
        const buffer = await fs.readFile(file.filepath)
        const blob = await put(`blog/${Date.now()}-${file.originalFilename || 'image.jpg'}`, buffer, {
          access: 'public',
          contentType: file.mimetype,
        })
        update.imageUrl = blob.url
        await fs.unlink(file.filepath).catch(() => {})
      }

      data.articles[idx] = update
      await kvSet('blog', data)
      return res.json(data.articles[idx])
    }

    if (req.method === 'DELETE') {
      if (!checkAuth(req, res)) return
      if (idx === -1) return res.status(404).json({ error: 'Article non trouvé' })
      data.articles.splice(idx, 1)
      await kvSet('blog', data)
      return res.json({ success: true })
    }

    res.status(405).json({ error: 'Méthode non supportée' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
