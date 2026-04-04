import { useState, useEffect, useRef } from 'react'
import Header from '../components/layout/Header'
import Button from '../components/ui/Button'
import { apiFetch } from '../lib/api'

const API = '/api/histoire'
const UPLOADS = 'http://localhost:3001/uploads/histoire'

function photoUrl(photo) {
  if (!photo) return null
  return photo.startsWith('http') ? photo : `${UPLOADS}/${photo}`
}

export default function Histoire({ isMobile, onMenuClick }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState({})
  const [savingPresse, setSavingPresse] = useState(false)
  const [presse, setPresse] = useState([])
  const [msg, setMsg] = useState(null)
  const inputRefs = useRef({})

  useEffect(() => {
    apiFetch(API)
      .then(r => r.json())
      .then(d => {
        setData(d)
        setPresse(d.presse || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function notify(text, ok = true) {
    setMsg({ text, ok })
    setTimeout(() => setMsg(null), 3500)
  }

  async function handleUploadPhoto(memberId, e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(u => ({ ...u, [memberId]: true }))
    const fd = new FormData()
    fd.append('photo', file)
    try {
      const r = await apiFetch(`${API}/photo/${memberId}`, { method: 'POST', body: fd })
      const res = await r.json()
      if (r.ok) {
        setData(d => ({
          ...d,
          equipe: d.equipe.map(m => m.id === memberId ? { ...m, photo: res.photo } : m),
        }))
        notify('Photo mise à jour ✦')
      } else {
        notify(res.error || 'Erreur upload', false)
      }
    } catch {
      notify('Erreur de connexion', false)
    }
    setUploading(u => ({ ...u, [memberId]: false }))
    if (inputRefs.current[memberId]) inputRefs.current[memberId].value = ''
  }

  async function handleDeletePhoto(memberId) {
    if (!confirm('Supprimer la photo ?')) return
    try {
      const r = await apiFetch(`${API}/photo/${memberId}`, { method: 'DELETE' })
      if (r.ok) {
        setData(d => ({
          ...d,
          equipe: d.equipe.map(m => m.id === memberId ? { ...m, photo: null } : m),
        }))
        notify('Photo supprimée')
      }
    } catch {
      notify('Erreur de connexion', false)
    }
  }

  async function handleSavePresse() {
    setSavingPresse(true)
    try {
      const fd = new FormData()
      fd.append('presse', JSON.stringify(presse))
      const r = await apiFetch(`${API}/presse`, { method: 'PUT', body: fd })
      if (r.ok) {
        notify('Liens presse sauvegardés ✦')
      } else {
        notify('Erreur sauvegarde', false)
      }
    } catch {
      notify('Erreur de connexion', false)
    }
    setSavingPresse(false)
  }

  const inputStyle = {
    background: 'rgba(0,43,60,0.5)',
    border: '1px solid var(--border)',
    color: 'var(--text-main)',
    padding: '9px 12px',
    fontSize: '0.78rem',
    fontFamily: 'Barlow, sans-serif',
    outline: 'none',
    width: '100%',
  }

  const card = {
    background: 'var(--card-bg)',
    border: '1px solid var(--border)',
    padding: isMobile ? '24px' : '36px',
    maxWidth: '780px',
  }

  const label = {
    fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase',
    color: 'var(--or)', marginBottom: '6px', fontWeight: 500,
  }

  return (
    <div>
      <Header title="Page Histoire" subtitle="L'AGAPE · Gestion" isMobile={isMobile} onMenuClick={onMenuClick} />
      <div style={{ padding: isMobile ? '16px' : '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {msg && (
          <div style={{
            position: 'fixed', top: '80px', right: '32px', zIndex: 999,
            background: msg.ok ? 'var(--blue-paon)' : 'rgba(192,57,43,0.9)',
            border: `1px solid ${msg.ok ? 'var(--or)' : 'rgba(231,76,60,0.4)'}`,
            color: msg.ok ? 'var(--or)' : '#f5b7b1',
            padding: '14px 24px', fontSize: '0.75rem', letterSpacing: '0.12em',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            {msg.text}
          </div>
        )}

        {/* ── ÉQUIPE ── */}
        <div style={card}>
          <p style={label}>Photos de l'équipe</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '32px' }}>
            Ces photos apparaissent dans la section « Notre équipe » de la page Histoire.
          </p>

          {loading ? (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chargement…</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
              gap: '20px',
            }}>
              {(data?.equipe || []).map(membre => {
                const url = photoUrl(membre.photo)
                return (
                  <div key={membre.id}>
                    {/* Aperçu */}
                    <div style={{
                      aspectRatio: '1/1',
                      background: 'rgba(0,43,60,0.6)',
                      border: '1px solid var(--border)',
                      marginBottom: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', position: 'relative',
                    }}>
                      {url ? (
                        <img src={url} alt={membre.nom} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <span style={{ fontSize: '1.4rem', color: 'var(--text-muted)' }}>✦</span>
                      )}
                    </div>

                    {/* Nom & rôle */}
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 500, marginBottom: '2px' }}>
                      {membre.nom}
                    </p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '0.05em' }}>
                      {membre.role}
                    </p>

                    {/* Actions */}
                    <input
                      ref={el => inputRefs.current[membre.id] = el}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={e => handleUploadPhoto(membre.id, e)}
                      style={{ display: 'none' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <Button
                        variant="primary"
                        onClick={() => inputRefs.current[membre.id]?.click()}
                        disabled={uploading[membre.id]}
                        style={{ fontSize: '0.6rem', padding: '8px 12px' }}
                      >
                        {uploading[membre.id] ? 'Envoi…' : url ? 'Changer' : 'Ajouter'}
                      </Button>
                      {url && (
                        <Button
                          variant="danger"
                          onClick={() => handleDeletePhoto(membre.id)}
                          style={{ fontSize: '0.6rem', padding: '8px 12px' }}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <p style={{ marginTop: '20px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            Formats acceptés : JPG, PNG, WebP · Taille max : 10 Mo
          </p>
        </div>

        {/* ── LIENS PRESSE ── */}
        <div style={card}>
          <p style={label}>Liens presse</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
            Ces liens apparaissent dans la section « Ils parlent de nous » de la page Histoire.
          </p>

          {loading ? (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chargement…</p>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {/* En-têtes colonnes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 32px', gap: '10px' }}>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Intitulé</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>URL</span>
                  <span />
                </div>

                {presse.map((item, idx) => (
                  <div key={item.id || idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 32px', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={item.label}
                      placeholder="Nom du média"
                      onChange={e => {
                        const updated = [...presse]
                        updated[idx] = { ...updated[idx], label: e.target.value }
                        setPresse(updated)
                      }}
                      style={inputStyle}
                    />
                    <input
                      type="url"
                      value={item.url}
                      placeholder="https://..."
                      onChange={e => {
                        const updated = [...presse]
                        updated[idx] = { ...updated[idx], url: e.target.value }
                        setPresse(updated)
                      }}
                      style={inputStyle}
                    />
                    <button
                      onClick={() => setPresse(p => p.filter((_, i) => i !== idx))}
                      title="Supprimer"
                      style={{
                        background: 'none', border: '1px solid rgba(192,57,43,0.4)',
                        color: 'rgba(231,76,60,0.7)', cursor: 'pointer',
                        width: '32px', height: '32px', fontSize: '0.8rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,57,43,0.15)'; e.currentTarget.style.color = '#e74c3c' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(231,76,60,0.7)' }}
                    >✕</button>
                  </div>
                ))}
              </div>

              {/* Ajouter un lien */}
              <button
                onClick={() => setPresse(p => [...p, { id: `lien-${Date.now()}`, label: '', url: '' }])}
                style={{
                  background: 'none', border: '1px dashed rgba(201,169,110,0.35)',
                  color: 'var(--or)', cursor: 'pointer', padding: '9px 20px',
                  fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                  fontFamily: 'Barlow, sans-serif', marginBottom: '20px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--or)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.35)'}
              >
                + Ajouter un lien
              </button>

              <Button variant="primary" onClick={handleSavePresse} disabled={savingPresse}>
                {savingPresse ? 'Sauvegarde…' : 'Sauvegarder les liens'}
              </Button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
