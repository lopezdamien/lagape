import { Router } from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'
import { upload } from '../middleware/upload.js'

const router = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, '../../data/blog.json')
const UPLOADS_DIR = path.join(__dirname, '../../uploads/blog')

async function readData() {
  const raw = await fs.readFile(DATA_FILE, 'utf-8')
  return JSON.parse(raw)
}

async function writeData(data) {
  const tmp = DATA_FILE + '.tmp'
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8')
  await fs.rename(tmp, DATA_FILE)
}

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// GET /api/blog
router.get('/', async (req, res) => {
  try {
    const data = await readData()
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: 'Erreur lecture blog' })
  }
})

// GET /api/blog/:id
router.get('/:id', async (req, res) => {
  try {
    const data = await readData()
    const article = data.articles.find(a => a.id === req.params.id)
    if (!article) return res.status(404).json({ error: 'Article non trouvé' })
    res.json(article)
  } catch (e) {
    res.status(500).json({ error: 'Erreur lecture article' })
  }
})

// POST /api/blog
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const data = await readData()
    const article = {
      id: uuidv4(),
      titre: req.body.titre || '',
      slug: req.body.slug || slugify(req.body.titre || ''),
      contenu: req.body.contenu || '',
      imageFilename: req.file ? req.file.filename : null,
      publie: req.body.publie === 'true',
      datePublication: req.body.datePublication || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    }
    data.articles.push(article)
    await writeData(data)
    res.status(201).json(article)
  } catch (e) {
    res.status(500).json({ error: 'Erreur création article' })
  }
})

// PUT /api/blog/:id
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const data = await readData()
    const idx = data.articles.findIndex(a => a.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Article non trouvé' })
    const update = { ...data.articles[idx], ...req.body }
    if (req.body.publie !== undefined) update.publie = req.body.publie === 'true'
    if (req.file) {
      // supprimer ancienne image
      if (data.articles[idx].imageFilename) {
        await fs.unlink(path.join(UPLOADS_DIR, data.articles[idx].imageFilename)).catch(() => {})
      }
      update.imageFilename = req.file.filename
    }
    data.articles[idx] = update
    await writeData(data)
    res.json(data.articles[idx])
  } catch (e) {
    res.status(500).json({ error: 'Erreur mise à jour article' })
  }
})

// DELETE /api/blog/:id
router.delete('/:id', async (req, res) => {
  try {
    const data = await readData()
    const idx = data.articles.findIndex(a => a.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Article non trouvé' })
    const article = data.articles[idx]
    if (article.imageFilename) {
      await fs.unlink(path.join(UPLOADS_DIR, article.imageFilename)).catch(() => {})
    }
    data.articles.splice(idx, 1)
    await writeData(data)
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: 'Erreur suppression article' })
  }
})

export default router
