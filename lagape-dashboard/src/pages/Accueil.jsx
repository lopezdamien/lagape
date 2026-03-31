import { useState, useEffect, useRef } from 'react'
import Header from '../components/layout/Header'
import Button from '../components/ui/Button'
import { apiFetch } from '../lib/api'

const API = '/api/siteconfig'
const UPLOADS = 'http://localhost:3001/uploads/siteconfig'

export default function Accueil() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [msg, setMsg] = useState(null)
  const photoInputRef = useRef()

  useEffect(() => {
    apiFetch(API)
      .then(r => r.json())
      .then(data => { setConfig(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function notify(text, ok = true) {
    setMsg({ text, ok })
    setTimeout(() => setMsg(null), 3500)
  }

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    
    setUploadingPhoto(true)

    const fd = new FormData()
    fd.append('photo', file)

    try {
      const r = await apiFetch(`${API}/photo-accueil`, { method: 'POST', body: fd })
      const data = await r.json()
      if (r.ok) {
        setConfig(c => ({ ...c, photoAccueil: data.photoAccueil }))
        notify('Photo mise à jour avec succès ✦')
      } else {
        notify(data.error || 'Erreur upload', false)
      }
    } catch {
      notify('Erreur de connexion', false)
    }
    
    setUploadingPhoto(false)
    photoInputRef.current.value = ''
  }

  async function handleDelete() {
    if (!confirm('Supprimer la photo de présentation ?')) return
    try {
      const r = await apiFetch(`${API}/photo-accueil`, { method: 'DELETE' })
      if (r.ok) {
        setConfig(c => ({ ...c, photoAccueil: null }))
        notify('Photo supprimée')
      }
    } catch {
      notify('Erreur de connexion', false)
    }
  }

  const photoUrl = config?.photoAccueil 
    ? (config.photoAccueil.startsWith('http') ? config.photoAccueil : `${UPLOADS}/${config.photoAccueil}`) 
    : null

  return (
    <div>
      <Header title="Page d'accueil" subtitle="L'AGAPE · Gestion" />
      <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

        {/* Toast */}
        {msg && (
          <div style={{
            position: 'fixed', top: '80px', right: '32px', zIndex: 999,
            background: msg.ok ? 'var(--blue-paon)' : 'rgba(192,57,43,0.9)',
            border: `1px solid ${msg.ok ? 'var(--or)' : 'rgba(231,76,60,0.4)'}`,
            color: msg.ok ? 'var(--or)' : '#f5b7b1',
            padding: '14px 24px',
            fontSize: '0.75rem', letterSpacing: '0.12em',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            {msg.text}
          </div>
        )}

        {/* Section photo de présentation */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          padding: '36px',
          maxWidth: '680px',
        }}>
          <p style={{
            fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--or)', marginBottom: '6px', fontWeight: 500,
          }}>
            Photo de présentation
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
            Cette photo apparaît dans la section « Notre philosophie » de la page d'accueil du site.
          </p>

          {/* Aperçu */}
          <div style={{
            width: '100%', aspectRatio: '4/3',
            background: 'rgba(0,43,60,0.6)',
            border: '1px solid var(--border)',
            marginBottom: '24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', position: 'relative',
          }}>
            {loading ? (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.2em' }}>
                Chargement…
              </span>
            ) : photoUrl ? (
              <img
                src={photoUrl}
                alt="Photo d'accueil"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>✦</div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Aucune photo
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
              style={{ display: 'none' }}
              id="photo-upload-input"
            />
            <Button
              variant="primary"
              onClick={() => photoInputRef.current.click()}
              disabled={uploadingPhoto}
            >
              {uploadingPhoto ? 'Envoi en cours…' : photoUrl ? 'Changer la photo' : 'Ajouter une photo'}
            </Button>
            {photoUrl && (
              <Button variant="danger" onClick={handleDelete}>
                Supprimer
              </Button>
            )}
          </div>

          <p style={{
            marginTop: '16px', fontSize: '0.68rem', color: 'var(--text-muted)',
                      }}>
            Formats acceptés : JPG, PNG, WebP · Taille max : 10 Mo
          </p>
        </div>

      </div>
    </div>
  )
}
