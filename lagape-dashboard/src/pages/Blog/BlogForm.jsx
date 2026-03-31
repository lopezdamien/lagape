import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Button from '../../components/ui/Button'
import { toast } from '../../components/ui/Toast'
import { apiFetch } from '../../lib/api'

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function BlogForm({ isMobile, onMenuClick }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [form, setForm] = useState({
    titre: '', slug: '', contenu: '',
    datePublication: new Date().toISOString().split('T')[0],
    publie: false,
  })

  useEffect(() => {
    if (isEdit) {
      fetch(`/api/blog/${id}`).then(r => r.json()).then(a => {
        setForm({
          titre: a.titre || '', slug: a.slug || '',
          contenu: a.contenu || '',
          datePublication: a.datePublication || '',
          publie: a.publie || false,
        })
        if (a.imageFilename) setImagePreview(`/uploads/blog/${a.imageFilename}`)
      })
    }
  }, [id])

  function set(key, value) {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'titre' && !isEdit) next.slug = slugify(value)
      return next
    })
  }

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
    if (imageFile) fd.append('image', imageFile)
    const url = isEdit ? `/api/blog/${id}` : '/api/blog'
    const method = isEdit ? 'PUT' : 'POST'
    const r = await apiFetch(url, { method, body: fd })
    setLoading(false)
    if (r.ok) {
      toast(isEdit ? 'Article modifié' : 'Article créé')
      navigate('/blog')
    } else {
      toast('Erreur lors de l\'enregistrement', 'error')
    }
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: 'rgba(30,51,83,0.5)', border: '1px solid var(--border)',
    color: 'var(--texte-clair)', fontSize: '0.85rem', outline: 'none',
    fontFamily: 'Montserrat, sans-serif', fontWeight: 300, transition: 'border 0.2s',
  }
  const labelStyle = { display: 'block', fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--or)', marginBottom: '8px' }

  return (
    <div>
      <Header
        title={isEdit ? 'Modifier l\'article' : 'Nouvel article'}
        subtitle="Blog"
        actions={<Button variant="subtle" onClick={() => navigate('/blog')}>← Retour</Button>}
        isMobile={isMobile} onMenuClick={onMenuClick}
      />

      <div style={{ padding: isMobile ? '16px' : '40px', maxWidth: '760px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
            <div>
              <label style={labelStyle}>Titre</label>
              <input type="text" value={form.titre} onChange={e => set('titre', e.target.value)}
                placeholder="Titre de l'article" style={inputStyle} required
                onFocus={e => e.target.style.borderColor = 'var(--or)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Slug (URL)</label>
              <input type="text" value={form.slug} onChange={e => set('slug', e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--or)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={labelStyle}>Contenu</label>
            <textarea
              rows={12} value={form.contenu} onChange={e => set('contenu', e.target.value)}
              placeholder="Rédigez votre article ici…"
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.8 }}
              onFocus={e => e.target.style.borderColor = 'var(--or)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
            <div>
              <label style={labelStyle}>Image de couverture</label>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile}
                style={{ ...inputStyle, padding: '8px 14px' }} />
              {imagePreview && (
                <img src={imagePreview} alt="" style={{ marginTop: '10px', height: '120px', width: '100%', objectFit: 'cover' }} />
              )}
            </div>
            <div>
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Date de publication</label>
                <input type="date" value={form.datePublication} onChange={e => set('datePublication', e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--or)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div>
                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.publie} onChange={e => set('publie', e.target.checked)} style={{ accentColor: 'var(--or)' }} />
                  Publier l'article
                </label>
                <p style={{ fontSize: '0.7rem', color: 'var(--texte-gris)', marginTop: '6px' }}>
                  Non coché = brouillon (non visible sur le site)
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer l\'article'}
            </Button>
            <Button variant="subtle" type="button" onClick={() => navigate('/blog')}>Annuler</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
