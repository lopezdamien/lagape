export default function Header({ title, subtitle, actions, onMenuClick, isMobile }) {
  return (
    <div style={{
      height: 'var(--header-height)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '0 16px' : '0 40px',
      background: 'var(--bg-dark)',
      position: 'sticky',
      top: 0,
      zIndex: 5,
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        {isMobile && (
          <button
            onClick={onMenuClick}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--texte-clair)', fontSize: '1.2rem',
              padding: '4px', flexShrink: 0, lineHeight: 1,
            }}
            aria-label="Menu"
          >
            ☰
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', minWidth: 0 }}>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: isMobile ? '1.3rem' : '1.6rem',
            fontWeight: 400,
            color: '#ffffff',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>{title}</div>
          {subtitle && !isMobile && (
            <div style={{
              fontSize: '0.6rem', letterSpacing: '0.25em',
              textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 400,
            }}>{subtitle}</div>
          )}
        </div>
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {actions}
        </div>
      )}
    </div>
  )
}
