import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { createHmac } from 'crypto'
import carteRouter from './routes/carte.js'
import galerieRouter from './routes/galerie.js'
import blogRouter from './routes/blog.js'
import siteconfigRouter from './routes/siteconfig.js'
import histoireRouter from './routes/histoire.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3001

const SECRET = process.env.DASHBOARD_SECRET || 'lagape-secret-fallback'
const PASSWORD = process.env.DASHBOARD_PASSWORD || 'admin'

function makeToken() {
  const expires = Date.now() + 30 * 24 * 60 * 60 * 1000
  const sig = createHmac('sha256', SECRET).update(String(expires)).digest('hex')
  return `${expires}.${sig}`
}

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Route auth (nécessaire en local — équivalent de api/auth.js sur Vercel)
app.post('/api/auth', (req, res) => {
  const { password } = req.body || {}
  if (!password || password !== PASSWORD) {
    return res.status(401).json({ error: 'Mot de passe incorrect' })
  }
  return res.json({ token: makeToken() })
})

app.use('/api/carte', carteRouter)
app.use('/api/galerie', galerieRouter)
app.use('/api/blog', blogRouter)
app.use('/api/siteconfig', siteconfigRouter)
app.use('/api/histoire', histoireRouter)

app.listen(PORT, () => {
  console.log(`✦ L'AGAPE API — http://localhost:${PORT}`)
})
