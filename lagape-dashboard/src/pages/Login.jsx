import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const r = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await r.json()
      if (r.ok) {
        login(data.token)
      } else {
        setError(data.error || 'Mot de passe incorrect')
      }
    } catch {
      setError('Erreur de connexion')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bleu-nuit)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '0 24px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '2.2rem',
            fontWeight: 400,
            color: 'var(--or-clair)',
            letterSpacing: '0.12em',
            marginBottom: '6px',
          }}>
            L'AGAPE
          </div>
          <div style={{
            fontSize: '0.58rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--texte-gris)',
          }}>
            Administration
          </div>
        </div>

        {/* Form */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          padding: '36px 32px',
        }}>
          <div style={{
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--or)',
            marginBottom: '24px',
          }}>
            Connexion
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.58rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'var(--texte-gris)',
                marginBottom: '8px',
              }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(30,51,83,0.6)',
                  border: error ? '1px solid var(--danger)' : '1px solid var(--border)',
                  color: 'var(--texte-clair)',
                  fontSize: '0.9rem',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 300,
                  outline: 'none',
                  transition: 'border 0.2s',
                }}
                onFocus={e => { if (!error) e.target.style.borderColor = 'var(--or)' }}
                onBlur={e => { if (!error) e.target.style.borderColor = 'var(--border)' }}
              />
              {error && (
                <div style={{
                  marginTop: '8px',
                  fontSize: '0.72rem',
                  color: 'var(--danger)',
                }}>
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: loading ? 'transparent' : 'var(--or)',
                border: '1px solid var(--or)',
                color: loading ? 'var(--or)' : 'var(--bleu-nuit)',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 500,
                cursor: loading ? 'default' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Connexion…' : 'Entrer'}
            </button>
          </form>
        </div>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '0.6rem',
          letterSpacing: '0.15em',
          color: 'var(--texte-gris)',
        }}>
          ↗ <a href="https://lagape.vercel.app" target="_blank" rel="noreferrer"
            style={{ color: 'var(--texte-gris)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--or)'}
            onMouseLeave={e => e.target.style.color = 'var(--texte-gris)'}
          >
            Voir le site
          </a>
        </div>
      </div>
    </div>
  )
}
