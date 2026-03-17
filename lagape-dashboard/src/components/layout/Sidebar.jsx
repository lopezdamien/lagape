import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Tableau de bord', icon: '◈', end: true },
  { to: '/carte', label: 'La Carte', icon: '❧' },
  { to: '/galerie', label: 'Galerie', icon: '✦' },
  { to: '/blog', label: 'Blog', icon: '◎' },
]

export default function Sidebar() {
  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      minHeight: '100vh',
      background: 'var(--bleu-profond)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{
        padding: '32px 28px 28px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.7rem',
          fontWeight: 400,
          color: 'var(--or-clair)',
          letterSpacing: '0.1em',
          marginBottom: '4px',
        }}>L'AGAPE</div>
        <div style={{
          fontSize: '0.58rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--texte-gris)',
        }}>Administration</div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '20px 0', flex: 1 }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '13px 28px',
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: isActive ? 'var(--or)' : 'var(--texte-gris)',
              background: isActive ? 'rgba(201,169,110,0.07)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--or)' : '2px solid transparent',
              transition: 'all 0.2s',
              textDecoration: 'none',
            })}
          >
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Lien site vitrine */}
      <div style={{
        padding: '20px 28px',
        borderTop: '1px solid var(--border)',
      }}>
        <a
          href="http://localhost:8080"
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: '0.62rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--texte-gris)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--or)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--texte-gris)'}
        >
          ↗ Voir le site
        </a>
      </div>
    </aside>
  )
}
