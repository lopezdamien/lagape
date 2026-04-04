import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '../../uploads')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const type = req.baseUrl.includes('galerie') ? 'galerie' : 'blog'
    cb(null, path.join(uploadsDir, type))
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase()
    const base = path.basename(file.originalname, ext)
      .toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40)
    cb(null, `${Date.now()}-${base}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  cb(null, allowed.includes(file.mimetype))
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })
