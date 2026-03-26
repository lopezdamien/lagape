import { useState, useEffect, useRef } from 'react'
import Header from '../components/layout/Header'
import Button from '../components/ui/Button'

const API = '/api/siteconfig'
const UPLOADS = 'http://localhost:3001/uploads/siteconfig'

export default function Accueil() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [msg, setMsg] = useState(null)
  const photoInputRef = useRef()
  const logoInputRef = useRef()

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(data => { setConfig(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function notify(text, ok = true) {
    setMsg({ text, ok })
    setTimeout(() => setMsg(null), 3500)
  }

  async function handleUpload(type, e) {
    const file = e.target.files[0]
    if (!file) return
    
    const isLogo = type === 'logo'
    if (isLogo) setUploadingLogo(true); else setUploadingPhoto(true)

    const fd = new FormData()
    fd.append('photo', file)

    const endpoint = isLogo ? `${API}/logo` : `${API}/photo-accueil`
    
    try {
      const r = await fetch(endpoint, { method: 'POST', body: fd })
      const data = await r.json()
      if (r.ok) {
        if (isLogo) {
          setConfig(c => ({ ...c, logo: data.logo }))
        } else {
          setConfig(c => ({ ...c, photoAccueil: data.photoAccueil }))
        }
        notify(`${isLogo ? 'Logo' : 'Photo'} mis à jour avec succès ✦`)
      } else {
        notify(data.error || 'Erreur upload', false)
      }
    } catch {
      notify('Erreur de connexion', false)
    }
    
    if (isLogo) {
      setUploadingLogo(false)
      logoInputRef.current.value = ''
    } else {
      setUploadingPhoto(false)
      photoInputRef.current.value = ''
    }
  }

  async function handleDelete(type) {
    const isLogo = type === 'logo'
    if (!confirm(`Supprimer ${isLogo ? 'le logo' : 'la photo de présentation'} ?`)) return
    
    const endpoint = isLogo ? `${API}/logo` : `${API}/photo-accueil`

    try {
      const r = await fetch(endpoint, { method: 'DELETE' })
      if (r.ok) {
        if (isLogo) {
          setConfig(c => ({ ...c, logo: null }))
        } else {
          setConfig(c => ({ ...c, photoAccueil: null }))
        }
        notify(`${isLogo ? 'Logo' : 'Photo'} supprimé`)
      }
    } catch {
      notify('Erreur de connexion', false)
    }
  }

  const photoUrl = config?.photoAccueil ? `${UPLOADS}/${config.photoAccueil}` : null
  const logoUrl = config?.logo ? `${UPLOADS}/${config.logo}` : null

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

        {/* Section LOGO */}
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
            Logotype du site
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
            Ce logo apparaît dans la barre de navigation et le pied de page du site.
          </p>

          <div style={{
            width: '100%', height: '140px',
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
            ) : logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo du site"
                style={{ maxHeight: '80%', maxWidth: '80%', objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Aucun logo (texte par défaut)
                </span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={(e) => handleUpload('logo', e)}
              style={{ display: 'none' }}
              id="logo-upload-input"
            />
            <Button
              variant="primary"
              onClick={() => logoInputRef.current.click()}
              disabled={uploadingLogo}
            >
              {uploadingLogo ? 'Envoi en cours…' : logoUrl ? 'Changer le logo' : 'Ajouter un logo'}
            </Button>
            {logoUrl && (
              <Button variant="danger" onClick={() => handleDelete('logo')}>
                Supprimer
              </Button>
            )}
          </div>
          <p style={{ marginTop: '16px', fontSize: '0.68rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Formats recommandés : PNG (transparent) ou SVG.
          </p>
        </div>

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
              onChange={(e) => handleUpload('photo', e)}
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
              <Button variant="danger" onClick={() => handleDelete('photo')}>
                Supprimer
              </Button>
            )}
          </div>

          <p style={{
            marginTop: '16px', fontSize: '0.68rem', color: 'var(--text-muted)',
            fontStyle: 'italic',
          }}>
            Formats acceptés : JPG, PNG, WebP · Taille max : 10 Mo
          </p>
        </div>

      </div>
    </div>
  )
}
