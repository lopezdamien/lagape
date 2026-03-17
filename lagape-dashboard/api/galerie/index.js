import { kv } from '@vercel/kv'
import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import formidable from 'formidable'
import { promises as fs } from 'fs'

const DEFAULT = { photos: [] }

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const data = (await kv.get('galerie')) || DEFAULT
      return res.json(data)
    }

    if (req.method === 'POST') {
      const { fields, files } = await parseForm(req)
      let url = null

      if (files.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image
        const buffer = await fs.readFile(file.filepath)
        const name = file.originalFilename || 'photo.jpg'
        const blob = await put(`galerie/${Date.now()}-${name}`, buffer, {
          access: 'public',
          contentType: file.mimetype,
        })
        url = blob.url
        await fs.unlink(file.filepath).catch(() => {})
      }

      const data = (await kv.get('galerie')) || DEFAULT
      const photo = {
        id: uuidv4(),
        url,
        caption: field(fields.caption),
        categorie: field(fields.categorie) || 'ambiance',
        ordre: data.photos.length + 1,
        createdAt: new Date().toISOString(),
      }
      data.photos.push(photo)
      await kv.set('galerie', data)
      return res.status(201).json(photo)
    }

    res.status(405).json({ error: 'Méthode non supportée' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
