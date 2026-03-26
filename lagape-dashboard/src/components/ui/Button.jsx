export default function Button({ children, variant = 'primary', size = 'md', onClick, type = 'button', disabled, style: extraStyle }) {
  const base = {
    fontFamily: 'Barlow, sans-serif',
    fontWeight: 500,
    fontSize: size === 'sm' ? '0.62rem' : '0.68rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.25s',
    padding: size === 'sm' ? '8px 18px' : '12px 28px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    ...extraStyle,
  }

  const variants = {
    primary: {
      background: 'var(--or)',
      color: 'var(--bg-dark)',
      border: 'none',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--or)',
      border: '1px solid var(--or)',
    },
    subtle: {
      background: 'transparent',
      color: 'var(--grey-cloud)',
      border: '1px solid var(--border)',
    },
    danger: {
      background: 'transparent',
      color: '#e74c3c',
      border: '1px solid rgba(231,76,60,0.3)',
    },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={e => {
        if (disabled) return
        if (variant === 'primary') e.currentTarget.style.background = 'var(--or-clair)'
        if (variant === 'ghost') { e.currentTarget.style.background = 'var(--or)'; e.currentTarget.style.color = 'var(--bg-dark)' }
        if (variant === 'subtle') e.currentTarget.style.borderColor = 'var(--grey-cloud)'
        if (variant === 'danger') { e.currentTarget.style.background = 'rgba(231,76,60,0.1)' }
      }}
      onMouseLeave={e => {
        if (disabled) return
        if (variant === 'primary') e.currentTarget.style.background = 'var(--or)'
        if (variant === 'ghost') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--or)' }
        if (variant === 'subtle') e.currentTarget.style.borderColor = 'var(--border)'
        if (variant === 'danger') { e.currentTarget.style.background = 'transparent' }
      }}
    >
      {children}
    </button>
  )
}
