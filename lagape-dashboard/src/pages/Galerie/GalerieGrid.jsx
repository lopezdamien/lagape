import { useEffect, useState, useRef } from 'react'
import Header from '../../components/layout/Header'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { toast } from '../../components/ui/Toast'
import { apiFetch } from '../../lib/api'

const CATS = [
  { value: 'ambiance', label: 'Ambiance' },
  { value: 'plats', label: 'Mets' },
  { value: 'cuisine', label: 'Cuisine' },
  { value: 'vins', label: 'Vins' },
  { value: 'equipe', label: "L'équipe" },
]

const CAT_LABELS = { ambiance: 'Ambiance', plats: 'Mets', cuisine: 'Cuisine', vins: 'Vins', equipe: 'Équipe' }

export default function GalerieGrid({ isMobile, onMenuClick }) {
  const [photos, setPhotos] = useState([])
  const [filter, setFilter] = useState('ambiance')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadForm, setUploadForm] = useState({ caption: '', categorie: 'ambiance', file: null, preview: null })
  const [reorderMode, setReorderMode] = useState(false)
  const [orderChanged, setOrderChanged] = useState(false)
  const [saving, setSaving] = useState(false)
  const dragIdx = useRef(null)
  const dragOverIdx = useRef(null)
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

  // Drag & drop handlers (travaille sur photos triées visibles en mode tout, sinon sur le subset)
  function onDragStart(idx) {
    dragIdx.current = idx
  }

  function onDragOver(e, idx) {
    e.preventDefault()
    dragOverIdx.current = idx
  }

  function onDrop(visiblePhotos) {
    const from = dragIdx.current
    const to = dragOverIdx.current
    if (from === null || to === null || from === to) return
    const updated = [...visiblePhotos]
    const [moved] = updated.splice(from, 1)
    // Quand on tire vers l'avant, l'index cible se décale de -1 après le splice
    const insertAt = from < to ? to - 1 : to
    updated.splice(insertAt, 0, moved)

    // Reconstruire le tableau complet en remplaçant le subset filtré
    const others = photos.filter(p => p.categorie !== filter)
    setPhotos([...others, ...updated])
    setOrderChanged(true)
    dragIdx.current = null
    dragOverIdx.current = null
  }

  async function saveOrder() {
    setSaving(true)
    const order = photos.map(p => p.id)
    const r = await apiFetch('/api/galerie', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order }) })
    setSaving(false)
    if (r.ok) {
      toast('Ordre sauvegardé')
      setOrderChanged(false)
      setReorderMode(false)
      await loadPhotos() // Resync avec l'API pour confirmer ce qui a été sauvegardé
    } else {
      toast('Erreur lors de la sauvegarde', 'error')
    }
  }

  function cancelReorder() {
    loadPhotos()
    setOrderChanged(false)
    setReorderMode(false)
  }

  const visible = photos.filter(p => p.categorie === filter)

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'rgba(30,51,83,0.5)', border: '1px solid var(--border)',
    color: 'var(--texte-clair)', fontSize: '0.82rem',
    fontFamily: 'Montserrat, sans-serif', fontWeight: 300, outline: 'none',
  }
  const labelStyle = {
    display: 'block', fontSize: '0.58rem', letterSpacing: '0.28em',
    textTransform: 'uppercase', color: 'var(--or)', marginBottom: '7px',
  }

  return (
    <div>
      <Header
        title="Galerie"
        subtitle="Photos du restaurant"
        isMobile={isMobile} onMenuClick={onMenuClick}
        actions={
          <div style={{ display: 'flex', gap: '10px' }}>
            {reorderMode ? (
              <>
                {orderChanged && <Button onClick={saveOrder} disabled={saving}>{saving ? 'Sauvegarde…' : 'Enregistrer l\'ordre'}</Button>}
                <Button variant="subtle" onClick={cancelReorder}>Annuler</Button>
              </>
            ) : (
              <>
                <Button variant="subtle" onClick={() => { setReorderMode(true); setShowUpload(false) }}>⠿ Réorganiser</Button>
                <Button onClick={() => setShowUpload(true)}>+ Ajouter une photo</Button>
              </>
            )}
          </div>
        }
      />

      {/* Filtres (masqués en mode réorganisation) */}
      {!reorderMode && (
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bleu-profond)', padding: isMobile ? '0 4px' : '0 40px', position: 'sticky', top: 'var(--header-height)', zIndex: 4, overflowX: 'auto' }}>
          {CATS.map(c => (
            <button key={c.value} onClick={() => setFilter(c.value)} style={{
              padding: '14px 22px', background: 'none', border: 'none',
              borderBottom: filter === c.value ? '2px solid var(--or)' : '2px solid transparent',
              color: filter === c.value ? 'var(--or)' : 'var(--texte-gris)',
              fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
            }}>{c.label} ({photos.filter(p => p.categorie === c.value).length})</button>
          ))}
        </div>
      )}

      {/* Bandeau mode réorganisation */}
      {reorderMode && (
        <div style={{ padding: '12px 40px', background: 'rgba(201,169,110,0.08)', borderBottom: '1px solid var(--border-or)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--or)' }}>
            Mode réorganisation
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--texte-gris)' }}>— Glissez les photos pour modifier leur ordre</span>
        </div>
      )}

      {/* Formulaire upload */}
      {showUpload && !reorderMode && (
        <div style={{ margin: isMobile ? '16px' : '24px 40px', padding: isMobile ? '20px 16px' : '28px 32px', background: 'var(--card-bg)', border: '1px solid var(--border-or)' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem', color: 'var(--blanc-casse)', marginBottom: '20px' }}>
            Ajouter une photo
          </div>
          <form onSubmit={handleUpload}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
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

      {/* Grille Instagram */}
      <div style={{ padding: isMobile ? '8px 0 40px' : '24px 40px 60px' }}>
        {visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--texte-gris)', fontSize: '0.8rem' }}>
            Aucune photo dans cette catégorie.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '4px' }}>
            {visible.map((photo, idx) => (
              <GridItem
                key={photo.id}
                photo={photo}
                idx={idx}
                reorderMode={reorderMode}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={() => onDrop(visible)}
                onDelete={() => setDeleteTarget(photo)}
              />
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

function GridItem({ photo, idx, reorderMode, onDragStart, onDragOver, onDrop, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const CAT_LABELS = { ambiance: 'Ambiance', plats: 'Mets', cuisine: 'Cuisine', vins: 'Vins', equipe: 'Équipe' }
  const imgSrc = photo.url || (photo.filename ? `/uploads/galerie/${photo.filename}` : null)

  return (
    <div
      draggable={reorderMode}
      onDragStart={() => onDragStart(idx)}
      onDragOver={e => { onDragOver(e, idx); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={() => { onDrop(); setDragOver(false) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        background: 'var(--bleu-moyen)',
        overflow: 'hidden',
        cursor: reorderMode ? 'grab' : 'default',
        outline: dragOver ? '2px solid var(--or)' : 'none',
        outlineOffset: '-2px',
        opacity: reorderMode && dragOver ? 0.6 : 1,
        transition: 'opacity 0.15s, outline 0.15s',
      }}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={photo.caption}
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s', transform: hovered && !reorderMode ? 'scale(1.04)' : 'scale(1)' }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif', color: 'var(--texte-gris)', fontSize: '0.85rem' }}>
          · {photo.caption} ·
        </div>
      )}

      {/* Overlay infos (mode normal) */}
      {!reorderMode && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,27,42,0.92) 0%, rgba(13,27,42,0.3) 50%, transparent 100%)',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.25s',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '12px',
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--texte-clair)', marginBottom: '6px', lineHeight: 1.3 }}>{photo.caption}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--or)' }}>
              {CAT_LABELS[photo.categorie]}
            </span>
            <button
              onClick={onDelete}
              style={{
                background: 'rgba(180,30,30,0.85)', border: 'none', color: '#fff',
                fontSize: '0.6rem', letterSpacing: '0.1em', padding: '4px 8px',
                cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase',
              }}
            >
              Suppr.
            </button>
          </div>
        </div>
      )}

      {/* Indicateur de glissement (mode réorganisation) */}
      {reorderMode && (
        <div style={{
          position: 'absolute', inset: 0,
          background: hovered ? 'rgba(13,27,42,0.45)' : 'transparent',
          transition: 'background 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {hovered && (
            <div style={{ fontSize: '1.6rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>⠿</div>
          )}
        </div>
      )}
    </div>
  )
}
