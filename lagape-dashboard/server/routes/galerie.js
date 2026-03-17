import { Router } from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'
import { upload } from '../middleware/upload.js'

const router = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, '../../data/galerie.json')
const UPLOADS_DIR = path.join(__dirname, '../../uploads/galerie')

async function readData() {
  const raw = await fs.readFile(DATA_FILE, 'utf-8')
  return JSON.parse(raw)
}

async function writeData(data) {
  const tmp = DATA_FILE + '.tmp'
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8')
  await fs.rename(tmp, DATA_FILE)
}

// GET /api/galerie
router.get('/', async (req, res) => {
  try {
    const data = await readData()
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: 'Erreur lecture galerie' })
  }
})

// POST /api/galerie (upload)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const data = await readData()
    const photo = {
      id: uuidv4(),
      filename: req.file ? req.file.filename : null,
      caption: req.body.caption || '',
      categorie: req.body.categorie || 'ambiance',
      ordre: data.photos.length + 1,
      createdAt: new Date().toISOString()
    }
    data.photos.push(photo)
    await writeData(data)
    res.status(201).json(photo)
  } catch (e) {
    res.status(500).json({ error: 'Erreur upload photo' })
  }
})

// PUT /api/galerie/:id (mise à jour caption/catégorie)
router.put('/:id', async (req, res) => {
  try {
    const data = await readData()
    const idx = data.photos.findIndex(p => p.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Photo non trouvée' })
    data.photos[idx] = { ...data.photos[idx], ...req.body }
    await writeData(data)
    res.json(data.photos[idx])
  } catch (e) {
    res.status(500).json({ error: 'Erreur mise à jour photo' })
  }
})

// DELETE /api/galerie/:id
router.delete('/:id', async (req, res) => {
  try {
    const data = await readData()
    const idx = data.photos.findIndex(p => p.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Photo non trouvée' })
    const photo = data.photos[idx]
    if (photo.filename) {
      const filepath = path.join(UPLOADS_DIR, photo.filename)
      await fs.unlink(filepath).catch(() => {})
    }
    data.photos.splice(idx, 1)
    await writeData(data)
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: 'Erreur suppression photo' })
  }
})

export default router
