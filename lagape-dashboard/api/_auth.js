import { createHmac } from 'crypto'

const SECRET = process.env.DASHBOARD_SECRET || 'lagape-secret-fallback'

export function makeToken() {
  const expires = Date.now() + 30 * 24 * 60 * 60 * 1000
  const sig = createHmac('sha256', SECRET).update(String(expires)).digest('hex')
  return `${expires}.${sig}`
}

export function verifyToken(token) {
  if (!token) return false
  const [expires, sig] = (token || '').split('.')
  if (!expires || !sig) return false
  if (Date.now() > parseInt(expires, 10)) return false
  const expected = createHmac('sha256', SECRET).update(expires).digest('hex')
  return sig === expected
}

export function checkAuth(req, res) {
  const auth = req.headers.authorization || ''
  const token = auth.replace('Bearer ', '')
  if (!verifyToken(token)) {
    res.status(401).json({ error: 'Non autorisé' })
    return false
  }
  return true
}
