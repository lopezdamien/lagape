import Button from './Button'

export default function Modal({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirmer', variant = 'danger' }) {
  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(8,16,25,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bleu-profond)',
          border: '1px solid var(--border)',
          padding: '36px 40px',
          maxWidth: '440px',
          width: '100%',
        }}
      >
        <div style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '1.3rem',
          fontWeight: 400,
          color: 'var(--blanc-casse)',
          marginBottom: '12px',
        }}>{title}</div>
        <p style={{ fontSize: '0.84rem', color: 'var(--argent)', marginBottom: '28px', lineHeight: 1.7 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="subtle" size="sm" onClick={onClose}>Annuler</Button>
          <Button variant={variant} size="sm" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}
