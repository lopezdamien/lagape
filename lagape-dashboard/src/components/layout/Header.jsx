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
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.6rem',
          fontWeight: 400,
          color: '#ffffff',
          letterSpacing: '0.04em',
        }}>{title}</div>
        {subtitle && (
          <div style={{
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            fontWeight: 400,
          }}>{subtitle}</div>
        )}
      </div>
      {actions && <div style={{ display: 'flex', gap: '12px' }}>{actions}</div>}
    </div>
  )
}
