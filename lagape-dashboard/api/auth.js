import { makeToken } from './_auth.js'

const PASSWORD = process.env.DASHBOARD_PASSWORD || 'admin'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  let body = ''
  await new Promise(resolve => { req.on('data', c => { body += c }); req.on('end', resolve) })

  const { password } = JSON.parse(body || '{}')
  if (!password || password !== PASSWORD) {
    return res.status(401).json({ error: 'Mot de passe incorrect' })
  }

  return res.json({ token: makeToken() })
}
