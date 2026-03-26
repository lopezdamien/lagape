export default function Header({ title, subtitle, actions }) {
  return (
    <div style={{
      height: 'var(--header-height)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      background: 'var(--bg-dark)',
      position: 'sticky',
      top: 0,
      zIndex: 5,
    }}>
      <div>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: '1.4rem',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>{title}</div>
        {subtitle && (
          <div style={{
            fontSize: '0.62rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginTop: '2px',
            fontWeight: 400,
          }}>{subtitle}</div>
        )}
      </div>
      {actions && <div style={{ display: 'flex', gap: '12px' }}>{actions}</div>}
    </div>
  )
}
