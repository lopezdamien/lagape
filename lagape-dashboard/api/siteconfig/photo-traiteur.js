import { kvGet, kvSet } from '../_redis.js'
import { put, del as deleteBlob } from '@vercel/blob'
import formidable from 'formidable'
import { promises as fs } from 'fs'
import { checkAuth } from '../_auth.js'

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ maxFileSize: 10 * 1024 * 1024, uploadDir: '/tmp', keepExtensions: true })
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const configKey = 'siteconfig'

  try {
    if (req.method === 'POST') {
      if (!checkAuth(req, res)) return
      const { files } = await parseForm(req)
      const data = (await kvGet(configKey)) || {}

      if (files.photo) {
        const file = Array.isArray(files.photo) ? files.photo[0] : files.photo
        const buffer = await fs.readFile(file.filepath)
        const name = file.originalFilename || 'photo-traiteur.jpg'

        if (data.photoTraiteur) {
          await deleteBlob(data.photoTraiteur).catch(() => {})
        }

        const blob = await put(`siteconfig/${Date.now()}-${name}`, buffer, {
          access: 'public',
          contentType: file.mimetype,
        })

        data.photoTraiteur = blob.url
        await fs.unlink(file.filepath).catch(() => {})
      }

      await kvSet(configKey, data)
      return res.json({ photoTraiteur: data.photoTraiteur })
    }

    if (req.method === 'DELETE') {
      if (!checkAuth(req, res)) return
      const data = (await kvGet(configKey)) || {}

      if (data.photoTraiteur) {
        await deleteBlob(data.photoTraiteur).catch(() => {})
        data.photoTraiteur = null
        await kvSet(configKey, data)
      }

      return res.json({ success: true })
    }

    res.status(405).json({ error: 'Méthode non supportée' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
