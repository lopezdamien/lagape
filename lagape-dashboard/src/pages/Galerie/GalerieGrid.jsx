import { useEffect, useState, useRef } from 'react'
import Header from '../../components/layout/Header'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { toast } from '../../components/ui/Toast'
import { apiFetch } from '../../lib/api'

const CATS = [
  { value: 'tout', label: 'Tout' },
  { value: 'ambiance', label: 'Ambiance' },
  { value: 'cuisine', label: 'Cuisine' },
  { value: 'plats', label: 'Les plats' },
  { value: 'equipe', label: "L'équipe" },
]

const CAT_LABELS = { ambiance: 'Ambiance', cuisine: 'Cuisine', plats: 'Plats', equipe: 'Équipe' }

export default function GalerieGrid() {
  const [photos, setPhotos] = useState([])
  const [filter, setFilter] = useState('tout')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadForm, setUploadForm] = useState({ caption: '', categorie: 'ambiance', file: null, preview: null })
  const fileRef = useRef()

  async function loadPhotos() {
    const r = await fetch('/api/galerie')
    const data = await r.json()
    setPhotos(data.photos || [])
  }

  useEffect(() => { loadPhotos() }, [])

  async function handleDelete() {
    const r = await apiFetch(`/api/galerie/${deleteTarget.id}`, { method: 'DELETE' })
    if (r.ok) { toast('Photo supprimée'); loadPhotos() }
    else toast('Erreur suppression', 'error')
    setDeleteTarget(null)
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploadForm(prev => ({ ...prev, file, preview: URL.createObjectURL(file) }))
  }

  function compressImage(file, maxPx = 1600, quality = 0.82) {
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        let { width, height } = img
        if (width > maxPx || height > maxPx) {
          if (width > height) { height = Math.round(height * maxPx / width); width = maxPx }
          else { width = Math.round(width * maxPx / height); height = maxPx }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width; canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        canvas.toBlob(blob => resolve(new File([blob], file.name, { type: 'image/jpeg' })), 'image/jpeg', quality)
      }
      img.src = url
    })
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!uploadForm.file) { toast('Sélectionnez une image', 'error'); return }
    setUploading(true)
    const compressed = await compressImage(uploadForm.file)
    const fd = new FormData()
    fd.append('image', compressed)
    fd.append('caption', uploadForm.caption)
    fd.append('categorie', uploadForm.categorie)
    const r = await apiFetch('/api/galerie', { method: 'POST', body: fd })
    setUploading(false)
    if (r.ok) {
      const newPhoto = await r.json()
      setPhotos(prev => [...prev, newPhoto])
      toast('Photo ajoutée')
      setShowUpload(false)
      setUploadForm({ caption: '', categorie: 'ambiance', file: null, preview: null })
      if (fileRef.current) fileRef.current.value = ''
    } else {
      const errBody = await r.json().catch(() => ({}))
      console.error('Upload error', r.status, errBody)
      toast(`Erreur ${r.status} : ${errBody.error || 'upload échoué'}`, 'error')
    }
  }

  const visible = filter === 'tout' ? photos : photos.filter(p => p.categorie === filter)
  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'rgba(30,51,83,0.5)', border: '1px solid var(--border)',
    color: 'var(--texte-clair)', fontSize: '0.82rem',
    fontFamily: 'Montserrat, sans-serif', fontWeight: 300, outline: 'none',
  }
  const labelStyle = { display: 'block', fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--or)', marginBottom: '7px' }

  return (
    <div>
      <Header
        title="Galerie"
        subtitle="Photos du restaurant"
        actions={<Button onClick={() => setShowUpload(true)}>+ Ajouter une photo</Button>}
      />

      {/* Filtres */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bleu-profond)', padding: '0 40px', position: 'sticky', top: 'var(--header-height)', zIndex: 4 }}>
        {CATS.map(c => (
          <button key={c.value} onClick={() => setFilter(c.value)} style={{
            padding: '14px 22px', background: 'none', border: 'none',
            borderBottom: filter === c.value ? '2px solid var(--or)' : '2px solid transparent',
            color: filter === c.value ? 'var(--or)' : 'var(--texte-gris)',
            fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
          }}>{c.label} {c.value !== 'tout' && `(${photos.filter(p => p.categorie === c.value).length})`}</button>
        ))}
      </div>

      {/* Formulaire upload */}
      {showUpload && (
        <div style={{ margin: '24px 40px', padding: '28px 32px', background: 'var(--card-bg)', border: '1px solid var(--border-or)' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'var(--blanc-casse)', marginBottom: '20px' }}>
            Ajouter une photo
          </div>
          <form onSubmit={handleUpload}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Image</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  style={{ ...inputStyle, padding: '8px 14px' }}
                />
                {uploadForm.preview && (
                  <img src={uploadForm.preview} alt="" style={{ marginTop: '10px', height: '100px', objectFit: 'cover', width: '100%' }} />
                )}
              </div>
              <div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Légende</label>
                  <input type="text" value={uploadForm.caption} onChange={e => setUploadForm(p => ({ ...p, caption: e.target.value }))} style={inputStyle} placeholder="ex: Saint-Jacques poêlées" />
                </div>
                <div>
                  <label style={labelStyle}>Catégorie</label>
                  <select value={uploadForm.categorie} onChange={e => setUploadForm(p => ({ ...p, categorie: e.target.value }))} style={{ ...inputStyle, background: 'var(--bleu-moyen)' }}>
                    {CATS.filter(c => c.value !== 'tout').map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button type="submit" disabled={uploading}>{uploading ? 'Upload…' : 'Ajouter'}</Button>
              <Button variant="subtle" type="button" onClick={() => setShowUpload(false)}>Annuler</Button>
            </div>
          </form>
        </div>
      )}

      {/* Grille */}
      <div style={{ padding: '24px 40px 60px' }}>
        {visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--texte-gris)', fontSize: '0.8rem' }}>
            Aucune photo dans cette catégorie.
          </div>
        ) : (
          <div style={{ columns: 3, columnGap: '14px' }}>
            {visible.map(photo => (
              <div key={photo.id} style={{ breakInside: 'avoid', marginBottom: '14px', position: 'relative', background: 'var(--bleu-moyen)', overflow: 'hidden', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.querySelector('.overlay').style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.querySelector('.overlay').style.opacity = '0'}
              >
                {photo.url || photo.filename ? (
                  <img src={photo.url || `/uploads/galerie/${photo.filename}`} alt={photo.caption} style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', color: 'var(--texte-gris)', fontSize: '0.85rem' }}>
                    · {photo.caption} ·
                  </div>
                )}
                <div className="overlay" style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(13,27,42,0.9) 0%, rgba(13,27,42,0.3) 50%, transparent 100%)',
                  opacity: 0, transition: 'opacity 0.3s',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '14px',
                }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--texte-clair)', marginBottom: '4px' }}>{photo.caption}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--or)' }}>
                      {CAT_LABELS[photo.categorie]}
                    </span>
                    <Button variant="danger" size="sm" onClick={() => setDeleteTarget(photo)}>Suppr.</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer cette photo ?"
        message={`"${deleteTarget?.caption}" sera définitivement supprimée.`}
        confirmLabel="Supprimer"
      />
    </div>
  )
}
