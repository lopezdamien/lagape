import { Router } from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'

const router = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, '../../data/histoire.json')
const UPLOADS_DIR = path.join(__dirname, '../../uploads/histoire')

const DEFAULT = {
  equipe: [
    { id: 'jeremy',  nom: 'Jérémy Verqueire', role: 'Chef de cuisine',       photo: null },
    { id: 'clement', nom: 'Clément Thellier',  role: 'Gérant du restaurant',  photo: null },
    { id: 'valentin',nom: 'Valentin Guido',    role: 'Service & sommellerie', photo: null },
    { id: 'damien',  nom: 'Damien Lopez',       role: 'Gérant du restaurant',  photo: null },
  ],
  presse: [
    { id: 'michelin',   label: 'Michelin',       url: 'https://guide.michelin.com/ch/fr/geneve-region/geneve/restaurant/l-agape-1197107' },
    { id: 'gaultmillau',label: 'Gault & Millau', url: 'https://www.gaultmillau.ch/fr/restaurants/lagape-522268' },
    { id: 'bilan',      label: 'Bilan',           url: 'https://www.bilan.ch/opinions/edouard-amoiel/lagape-bistrot-spontane' },
    { id: 'amoiel',     label: 'Amoiel',          url: 'https://amoiel.ch/chronique/lagape-le-plaisir-en-six-actes/' },
  ],
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${req.params.memberId}-${Date.now()}${ext}`)
  },
})
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype))
  },
  limits: { fileSize: 10 * 1024 * 1024 },
})

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT))
  }
}

async function writeData(data) {
  const tmp = DATA_FILE + '.tmp'
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8')
  await fs.rename(tmp, DATA_FILE)
}

// GET /api/histoire
router.get('/', async (req, res) => {
  try {
    res.json(await readData())
  } catch {
    res.status(500).json({ error: 'Erreur lecture' })
  }
})

// POST /api/histoire/photo/:memberId
router.post('/photo/:memberId', upload.single('photo'), async (req, res) => {
  try {
    const data = await readData()
    const membre = data.equipe.find(m => m.id === req.params.memberId)
    if (!membre) return res.status(404).json({ error: 'Membre introuvable' })

    if (membre.photo) {
      await fs.unlink(path.join(UPLOADS_DIR, membre.photo)).catch(() => {})
    }
    membre.photo = req.file ? req.file.filename : null
    await writeData(data)
    res.json({ photo: membre.photo })
  } catch {
    res.status(500).json({ error: 'Erreur upload' })
  }
})

// DELETE /api/histoire/photo/:memberId
router.delete('/photo/:memberId', async (req, res) => {
  try {
    const data = await readData()
    const membre = data.equipe.find(m => m.id === req.params.memberId)
    if (!membre) return res.status(404).json({ error: 'Membre introuvable' })

    if (membre.photo) {
      await fs.unlink(path.join(UPLOADS_DIR, membre.photo)).catch(() => {})
      membre.photo = null
      await writeData(data)
    }
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Erreur suppression' })
  }
})

// PUT /api/histoire/presse
router.put('/presse', async (req, res) => {
  try {
    const data = await readData()
    const { presse } = req.body
    if (!Array.isArray(presse)) return res.status(400).json({ error: 'Format invalide' })
    data.presse = presse
    await writeData(data)
    res.json({ presse: data.presse })
  } catch {
    res.status(500).json({ error: 'Erreur sauvegarde' })
  }
})

export default router
