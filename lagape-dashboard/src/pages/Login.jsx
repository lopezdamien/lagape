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
      background: 'linear-gradient(165deg, #002b3c 0%, #00374D 40%, #004d6b 70%, #002b3c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '2.6rem',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            L'AGAPE
          </div>
          <div style={{
            fontSize: '0.62rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            fontWeight: 400,
          }}>
            Administration
          </div>
          {/* Divider doré */}
          <div style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, var(--or), transparent)',
            margin: '20px auto 0',
          }} />
        </div>

        {/* Form */}
        <div style={{
          background: 'var(--blue-paon)',
          border: '1px solid rgba(209, 217, 225, 0.1)',
          padding: '40px 36px',
          position: 'relative',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
        }}>
          {/* Inner border */}
          <div style={{
            position: 'absolute',
            inset: '10px',
            border: '1px solid rgba(201, 169, 110, 0.12)',
            pointerEvents: 'none',
          }} />

          <div style={{
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--or)',
            marginBottom: '28px',
            fontWeight: 500,
          }}>
            Connexion
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.6rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '10px',
                fontWeight: 400,
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
                  padding: '13px 16px',
                  background: 'rgba(0, 43, 60, 0.6)',
                  border: error ? '1px solid var(--danger)' : '1px solid rgba(209, 217, 225, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontFamily: 'Barlow, sans-serif',
                  fontWeight: 300,
                  outline: 'none',
                  transition: 'border 0.2s',
                }}
                onFocus={e => { if (!error) e.target.style.borderColor = 'var(--or)' }}
                onBlur={e => { if (!error) e.target.style.borderColor = 'rgba(209, 217, 225, 0.15)' }}
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
                padding: '14px',
                background: loading ? 'transparent' : 'var(--or)',
                border: '1px solid var(--or)',
                color: loading ? 'var(--or)' : 'var(--bg-dark)',
                fontSize: '0.72rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontFamily: 'Barlow, sans-serif',
                fontWeight: 600,
                cursor: loading ? 'default' : 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--or-clair)' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--or)' }}
            >
              {loading ? 'Connexion…' : 'Entrer'}
            </button>
          </form>
        </div>

        <div style={{
          marginTop: '28px',
          textAlign: 'center',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          color: 'var(--text-muted)',
        }}>
          ↗ <a href="https://lagape.vercel.app" target="_blank" rel="noreferrer"
            style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--or)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >
            Voir le site
          </a>
        </div>
      </div>
    </div>
  )
}
