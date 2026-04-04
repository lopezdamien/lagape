import { kvGet, kvSet } from '../_redis.js'
import { put } from '@vercel/blob'
import formidable from 'formidable'
import { promises as fs } from 'fs'
import { checkAuth } from '../_auth.js'

const DEFAULT = {
  equipe: [
    { id: 'jeremy',  nom: 'Jérémy Verqueire', role: 'Chef de cuisine',       photo: null },
    { id: 'clement', nom: 'Clément Thellier',  role: 'Gérant du restaurant',  photo: null },
    { id: 'valentin',nom: 'Valentin Guido',    role: 'Service & sommellerie', photo: null },
    { id: 'damien',  nom: 'Damien Lopez',       role: 'Gérant du restaurant',  photo: null },
  ],
  presse: [
    { id: 'michelin',    label: 'Michelin',       url: 'https://guide.michelin.com/ch/fr/geneve-region/geneve/restaurant/l-agape-1197107' },
    { id: 'gaultmillau', label: 'Gault & Millau', url: 'https://www.gaultmillau.ch/fr/restaurants/lagape-522268' },
    { id: 'bilan',       label: 'Bilan',           url: 'https://www.bilan.ch/opinions/edouard-amoiel/lagape-bistrot-spontane' },
    { id: 'amoiel',      label: 'Amoiel',          url: 'https://amoiel.ch/chronique/lagape-le-plaisir-en-six-actes/' },
  ],
}

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ maxFileSize: 10 * 1024 * 1024, uploadDir: '/tmp', keepExtensions: true })
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const data = (await kvGet('histoire')) || JSON.parse(JSON.stringify(DEFAULT))

  // GET
  if (req.method === 'GET') return res.json(data)

  if (!checkAuth(req, res)) return

  // POST /api/histoire?action=photo&memberId=xxx  — upload photo membre
  if (req.method === 'POST') {
    const memberId = req.query.memberId
    const membre = data.equipe.find(m => m.id === memberId)
    if (!membre) return res.status(404).json({ error: 'Membre introuvable' })

    const { files } = await parseForm(req)
    const file = Array.isArray(files.photo) ? files.photo[0] : files.photo
    if (!file) return res.status(400).json({ error: 'Aucun fichier' })

    const buffer = await fs.readFile(file.filepath)
    const blob = await put(`histoire/${memberId}-${Date.now()}-${file.originalFilename || 'photo.jpg'}`, buffer, {
      access: 'public',
      contentType: file.mimetype,
    })
    membre.photo = blob.url
    await fs.unlink(file.filepath).catch(() => {})
    await kvSet('histoire', data)
    return res.json({ photo: membre.photo })
  }

  // DELETE /api/histoire?action=photo&memberId=xxx
  if (req.method === 'DELETE') {
    const memberId = req.query.memberId
    const membre = data.equipe.find(m => m.id === memberId)
    if (!membre) return res.status(404).json({ error: 'Membre introuvable' })
    membre.photo = null
    await kvSet('histoire', data)
    return res.json({ success: true })
  }

  // PUT /api/histoire  — update presse links
  if (req.method === 'PUT') {
    const { fields } = await parseForm(req)
    const raw = Array.isArray(fields.presse) ? fields.presse[0] : fields.presse
    if (!raw) return res.status(400).json({ error: 'Données manquantes' })
    data.presse = JSON.parse(raw)
    await kvSet('histoire', data)
    return res.json({ presse: data.presse })
  }

  res.status(405).json({ error: 'Méthode non supportée' })
}
