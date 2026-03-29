import { Router } from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'

const router = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, '../../data/carte.json')

async function readData() {
  const raw = await fs.readFile(DATA_FILE, 'utf-8')
  return JSON.parse(raw)
}

async function writeData(data) {
  const tmp = DATA_FILE + '.tmp'
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8')
  await fs.rename(tmp, DATA_FILE)
}

// GET /api/carte
router.get('/', async (req, res) => {
  try {
    const data = await readData()
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: 'Erreur lecture carte' })
  }
})

// POST /api/carte/plats
router.post('/plats', async (req, res) => {
  try {
    const data = await readData()
    const plat = { id: uuidv4(), ...req.body, ordre: data.plats.length + 1 }
    data.plats.push(plat)
    await writeData(data)
    res.status(201).json(plat)
  } catch (e) {
    res.status(500).json({ error: 'Erreur création plat' })
  }
})

// PUT /api/carte/plats/:id
router.put('/plats/:id', async (req, res) => {
  try {
    const data = await readData()
    const idx = data.plats.findIndex(p => p.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Plat non trouvé' })
    data.plats[idx] = { ...data.plats[idx], ...req.body }
    await writeData(data)
    res.json(data.plats[idx])
  } catch (e) {
    res.status(500).json({ error: 'Erreur mise à jour plat' })
  }
})

// DELETE /api/carte/plats/:id
router.delete('/plats/:id', async (req, res) => {
  try {
    const data = await readData()
    const idx = data.plats.findIndex(p => p.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Plat non trouvé' })
    data.plats.splice(idx, 1)
    await writeData(data)
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: 'Erreur suppression plat' })
  }
})

// POST /api/carte/formules
router.post('/formules', async (req, res) => {
  try {
    const data = await readData()
    const formule = { id: uuidv4(), ...req.body, ordre: data.formules.length + 1 }
    data.formules.push(formule)
    await writeData(data)
    res.status(201).json(formule)
  } catch (e) {
    res.status(500).json({ error: 'Erreur création formule' })
  }
})

// PUT /api/carte/formules/:id
router.put('/formules/:id', async (req, res) => {
  try {
    const data = await readData()
    const idx = data.formules.findIndex(f => f.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Formule non trouvée' })
    data.formules[idx] = { ...data.formules[idx], ...req.body }
    await writeData(data)
    res.json(data.formules[idx])
  } catch (e) {
    res.status(500).json({ error: 'Erreur mise à jour formule' })
  }
})

// DELETE /api/carte/formules/:id
router.delete('/formules/:id', async (req, res) => {
  try {
    const data = await readData()
    const idx = data.formules.findIndex(f => f.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Formule non trouvée' })
    data.formules.splice(idx, 1)
    await writeData(data)
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: 'Erreur suppression formule' })
  }
})

// POST /api/carte/vins
router.post('/vins', async (req, res) => {
  try {
    const data = await readData()
    const vin = { id: uuidv4(), ...req.body, ordre: data.vins.length + 1 }
    data.vins.push(vin)
    await writeData(data)
    res.status(201).json(vin)
  } catch (e) {
    res.status(500).json({ error: 'Erreur création vin' })
  }
})

// PUT /api/carte/vins/:id
router.put('/vins/:id', async (req, res) => {
  try {
    const data = await readData()
    const idx = data.vins.findIndex(v => v.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Vin non trouvé' })
    data.vins[idx] = { ...data.vins[idx], ...req.body }
    await writeData(data)
    res.json(data.vins[idx])
  } catch (e) {
    res.status(500).json({ error: 'Erreur mise à jour vin' })
  }
})

// DELETE /api/carte/vins/:id
router.delete('/vins/:id', async (req, res) => {
  try {
    const data = await readData()
    const idx = data.vins.findIndex(v => v.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Vin non trouvé' })
    data.vins.splice(idx, 1)
    await writeData(data)
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: 'Erreur suppression vin' })
  }
})

export default router
