import { useState, useEffect } from 'react'

let toastCallback = null

export function useToast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    toastCallback = (message, type = 'success') => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
    }
    return () => { toastCallback = null }
  }, [])

  return toasts
}

export function toast(message, type = 'success') {
  if (toastCallback) toastCallback(message, type)
}

export function ToastContainer({ toasts }) {
  return (
    <div style={{
      position: 'fixed', bottom: '28px', right: '28px',
      display: 'flex', flexDirection: 'column', gap: '10px',
      zIndex: 200,
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding: '14px 20px',
          background: t.type === 'error' ? 'rgba(192,57,43,0.95)' : 'rgba(30,51,83,0.98)',
          border: `1px solid ${t.type === 'error' ? 'rgba(231,76,60,0.4)' : 'var(--border-or)'}`,
          color: t.type === 'error' ? '#fff' : 'var(--or-clair)',
          fontSize: '0.78rem',
          letterSpacing: '0.05em',
          minWidth: '260px',
          animation: 'slideIn 0.3s ease',
        }}>
          {t.message}
        </div>
      ))}
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  )
}
