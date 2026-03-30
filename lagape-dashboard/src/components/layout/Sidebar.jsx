import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { to: '/', label: 'Tableau de bord', icon: '◈', end: true },
  { to: '/accueil', label: "Page d'accueil", icon: '⌂' },
  { to: '/carte', label: 'La Carte', icon: '❧' },
  { to: '/galerie', label: 'Galerie', icon: '✦' },
  { to: '/blog', label: 'Blog', icon: '◎' },
]

export default function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #003548 0%, #002b3c 100%)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 10,
    }}>
      {/* Accent doré en haut */}
      <div style={{ height: '2px', background: 'linear-gradient(to right, transparent, var(--or), transparent)' }} />

      {/* Logo */}
      <div style={{
        padding: '30px 28px 26px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: '2px',
        }}>L'AGAPE</div>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '0.72rem',
          letterSpacing: '0.12em',
          color: 'var(--or)',
          fontStyle: 'italic',
          opacity: 0.85,
        }}>Administration</div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '16px 0', flex: 1 }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 28px',
              fontSize: '0.68rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: isActive ? 'var(--or)' : 'var(--grey-cloud)',
              background: isActive ? 'rgba(201,169,110,0.08)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--or)' : '2px solid transparent',
              transition: 'all 0.2s',
              textDecoration: 'none',
              fontWeight: isActive ? 500 : 300,
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.color = 'var(--grey-cloud)'
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <span style={{ fontSize: '0.85rem', opacity: 0.75, width: '16px', textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Divider décoratif */}
      <div style={{
        margin: '0 28px',
        height: '1px',
        background: 'linear-gradient(to right, var(--or), transparent)',
        opacity: 0.2,
      }} />

      {/* Footer sidebar */}
      <div style={{
        padding: '20px 28px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}>
        <a
          href="https://lagape.vercel.app"
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--or)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          ↗ Voir le site
        </a>
        <button
          onClick={logout}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'color 0.2s',
            fontFamily: 'Barlow, sans-serif',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          ⎋ Déconnexion
        </button>
      </div>
    </aside>
  )
}
