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
      background: 'linear-gradient(165deg, #002b3c 0%, #00374D 50%, #002b3c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '0 24px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '2.8rem',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            lineHeight: 1,
            marginBottom: '10px',
          }}>
            L'AGAPE
          </div>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '0.9rem',
            letterSpacing: '0.15em',
            color: 'var(--or)',
            fontStyle: 'italic',
            marginBottom: '20px',
          }}>
            Administration
          </div>
          <div style={{
            width: '50px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, var(--or), transparent)',
            margin: '0 auto',
          }} />
        </div>

        {/* Form */}
        <div style={{
          background: 'rgba(0,55,77,0.6)',
          border: '1px solid rgba(209,217,225,0.1)',
          padding: '40px 36px',
          position: 'relative',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
        }}>
          {/* Inner border doré */}
          <div style={{
            position: 'absolute',
            inset: '8px',
            border: '1px solid rgba(201,169,110,0.1)',
            pointerEvents: 'none',
          }} />

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.58rem',
                letterSpacing: '0.3em',
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
                  background: 'rgba(0,43,60,0.6)',
                  border: error ? '1px solid var(--danger)' : '1px solid rgba(209,217,225,0.12)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontFamily: 'Barlow, sans-serif',
                  fontWeight: 300,
                  outline: 'none',
                  transition: 'border 0.2s',
                  letterSpacing: '0.08em',
                }}
                onFocus={e => { if (!error) e.target.style.borderColor = 'rgba(201,169,110,0.5)' }}
                onBlur={e => { if (!error) e.target.style.borderColor = 'rgba(209,217,225,0.12)' }}
              />
              {error && (
                <div style={{
                  marginTop: '8px',
                  fontSize: '0.7rem',
                  color: 'var(--danger)',
                  letterSpacing: '0.05em',
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
                fontSize: '0.68rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                fontFamily: 'Barlow, sans-serif',
                fontWeight: 600,
                cursor: loading ? 'default' : 'pointer',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--or-clair)' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--or)' }}
            >
              {loading ? 'Connexion…' : 'Entrer'}
            </button>
          </form>
        </div>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '0.58rem',
          letterSpacing: '0.22em',
          color: 'var(--text-muted)',
        }}>
          <a href="https://lagape.vercel.app" target="_blank" rel="noreferrer"
            style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--or)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >
            ↗ Voir le site
          </a>
        </div>
      </div>
    </div>
  )
}
