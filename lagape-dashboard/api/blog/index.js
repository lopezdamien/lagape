import { kv } from '@vercel/kv'
import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import formidable from 'formidable'
import { promises as fs } from 'fs'

const DEFAULT = { articles: [] }

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
  return Array.isArray(val) ? val[0] : val || ''
}

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const data = (await kv.get('blog')) || DEFAULT
      return res.json(data)
    }

    if (req.method === 'POST') {
      const { fields, files } = await parseForm(req)
      let imageUrl = null

      if (files.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image
        const buffer = await fs.readFile(file.filepath)
        const name = file.originalFilename || 'image.jpg'
        const blob = await put(`blog/${Date.now()}-${name}`, buffer, {
          access: 'public',
          contentType: file.mimetype,
        })
        imageUrl = blob.url
        await fs.unlink(file.filepath).catch(() => {})
      }

      const data = (await kv.get('blog')) || DEFAULT
      const titre = field(fields.titre)
      const article = {
        id: uuidv4(),
        titre,
        slug: field(fields.slug) || slugify(titre),
        contenu: field(fields.contenu),
        imageUrl,
        publie: field(fields.publie) === 'true',
        datePublication: field(fields.datePublication) || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      }
      data.articles.push(article)
      await kv.set('blog', data)
      return res.status(201).json(article)
    }

    res.status(405).json({ error: 'Méthode non supportée' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
