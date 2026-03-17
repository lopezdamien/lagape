export default function Header({ title, subtitle, actions }) {
  return (
    <div style={{
      height: 'var(--header-height)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      background: 'var(--bleu-nuit)',
      position: 'sticky',
      top: 0,
      zIndex: 5,
    }}>
      <div>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.3rem',
          fontWeight: 400,
          color: 'var(--blanc-casse)',
          letterSpacing: '0.04em',
        }}>{title}</div>
        {subtitle && (
          <div style={{
            fontSize: '0.62rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--texte-gris)',
            marginTop: '2px',
          }}>{subtitle}</div>
        )}
      </div>
      {actions && <div style={{ display: 'flex', gap: '12px' }}>{actions}</div>}
    </div>
  )
}
