import { Router } from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'

const router = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, '../../data/siteconfig.json')
const UPLOADS_DIR = path.join(__dirname, '../../uploads/siteconfig')

// Multer config for siteconfig uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `photo-accueil-${Date.now()}${ext}`)
  }
})
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    cb(null, allowed.includes(file.mimetype))
  },
  limits: { fileSize: 10 * 1024 * 1024 }
})

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { photoAccueil: null }
  }
}

async function writeData(data) {
  const tmp = DATA_FILE + '.tmp'
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8')
  await fs.rename(tmp, DATA_FILE)
}

// GET /api/siteconfig
router.get('/', async (req, res) => {
  try {
    const data = await readData()
    res.json(data)
  } catch {
    res.status(500).json({ error: 'Erreur lecture config' })
  }
})

// POST /api/siteconfig/photo-accueil 
router.post('/photo-accueil', upload.single('photo'), async (req, res) => {
  try {
    const data = await readData()
    if (data.photoAccueil) {
      const old = path.join(UPLOADS_DIR, data.photoAccueil)
      await fs.unlink(old).catch(() => {})
    }
    data.photoAccueil = req.file ? req.file.filename : null
    await writeData(data)
    res.json({ photoAccueil: data.photoAccueil })
  } catch {
    res.status(500).json({ error: 'Erreur upload photo accueil' })
  }
})

// DELETE /api/siteconfig/photo-accueil
router.delete('/photo-accueil', async (req, res) => {
  try {
    const data = await readData()
    if (data.photoAccueil) {
      const filepath = path.join(UPLOADS_DIR, data.photoAccueil)
      await fs.unlink(filepath).catch(() => {})
      data.photoAccueil = null
      await writeData(data)
    }
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Erreur suppression photo' })
  }
})

// --- Photo traiteur ---

const storageTraiteur = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `photo-traiteur-${Date.now()}${ext}`)
  }
})
const uploadTraiteur = multer({
  storage: storageTraiteur,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    cb(null, allowed.includes(file.mimetype))
  },
  limits: { fileSize: 10 * 1024 * 1024 }
})

// POST /api/siteconfig/photo-traiteur
router.post('/photo-traiteur', uploadTraiteur.single('photo'), async (req, res) => {
  try {
    const data = await readData()
    if (data.photoTraiteur) {
      const old = path.join(UPLOADS_DIR, data.photoTraiteur)
      await fs.unlink(old).catch(() => {})
    }
    data.photoTraiteur = req.file ? req.file.filename : null
    await writeData(data)
    res.json({ photoTraiteur: data.photoTraiteur })
  } catch {
    res.status(500).json({ error: 'Erreur upload photo traiteur' })
  }
})

// DELETE /api/siteconfig/photo-traiteur
router.delete('/photo-traiteur', async (req, res) => {
  try {
    const data = await readData()
    if (data.photoTraiteur) {
      const filepath = path.join(UPLOADS_DIR, data.photoTraiteur)
      await fs.unlink(filepath).catch(() => {})
      data.photoTraiteur = null
      await writeData(data)
    }
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Erreur suppression photo traiteur' })
  }
})

export default router
