import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import carteRouter from './routes/carte.js'
import galerieRouter from './routes/galerie.js'
import blogRouter from './routes/blog.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api/carte', carteRouter)
app.use('/api/galerie', galerieRouter)
app.use('/api/blog', blogRouter)

app.listen(PORT, () => {
  console.log(`✦ L'AGAPE API — http://localhost:${PORT}`)
})
