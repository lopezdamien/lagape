import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Button from '../../components/ui/Button'
import { toast } from '../../components/ui/Toast'
import { apiFetch } from '../../lib/api'

const TYPE_LABELS = { formules: 'Formule', plats: 'Plat', vins: 'Vin' }

const PLAT_CATS = [
  { value: 'entrees', label: 'Entrées' },
  { value: 'plats', label: 'Plats' },
  { value: 'desserts', label: 'Desserts' },
]

const VIN_CATS = [
  { value: 'blancs', label: 'Vins blancs' },
  { value: 'rouges', label: 'Vins rouges' },
  { value: 'champagnes', label: 'Champagnes & Pétillants' },
]

const DEFAULTS = {
  formules: { label: '', nom: '', detail: '', prix: '' },
  plats: { categorie: 'entrees', nom: '', description: '', prix: '', actif: true },
  vins: { categorieVin: 'blancs', nom: '', region: '', prixVerre: '', prixBouteille: '' },
}

export default function CarteForm() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [formType, setFormType] = useState(type || 'plats')
  const [form, setForm] = useState(DEFAULTS[type || 'plats'])
  const [loading, setLoading] = useState(false)
  const isEdit = !!id

  useEffect(() => {
    if (isEdit && type) {
      fetch('/api/carte').then(r => r.json()).then(data => {
        const arr = type === 'plats' ? data.plats : type === 'formules' ? data.formules : data.vins
        const item = arr?.find(x => x.id === id)
        if (item) setForm(item)
      })
    }
  }, [id, type])

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const url = isEdit ? `/api/carte/${formType}/${id}` : `/api/carte/${formType}`
    const method = isEdit ? 'PUT' : 'POST'
    const r = await apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (r.ok) {
      toast(isEdit ? 'Modifié avec succès' : 'Créé avec succès')
      navigate('/carte')
    } else {
      toast('Erreur lors de l\'enregistrement', 'error')
    }
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: 'rgba(30,51,83,0.5)', border: '1px solid var(--border)',
    color: 'var(--texte-clair)', fontSize: '0.85rem',
    outline: 'none', transition: 'border 0.2s',
    fontFamily: 'Montserrat, sans-serif', fontWeight: 300,
  }

  const labelStyle = {
    display: 'block', fontSize: '0.6rem', letterSpacing: '0.3em',
    textTransform: 'uppercase', color: 'var(--or)', marginBottom: '8px',
  }

  const field = (label, key, opts = {}) => (
    <div style={{ marginBottom: '22px' }}>
      <label style={labelStyle}>{label}</label>
      {opts.textarea ? (
        <textarea
          rows={3}
          value={form[key] || ''}
          onChange={e => set(key, e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={e => e.target.style.borderColor = 'var(--or)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      ) : opts.select ? (
        <select
          value={form[key] || ''}
          onChange={e => set(key, e.target.value)}
          style={{ ...inputStyle, background: 'var(--bleu-moyen)' }}
        >
          {opts.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input
          type={opts.type || 'text'}
          value={form[key] || ''}
          onChange={e => set(key, e.target.value)}
          placeholder={opts.placeholder}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'var(--or)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      )}
    </div>
  )

  return (
    <div>
      <Header
        title={isEdit ? `Modifier — ${TYPE_LABELS[type]}` : 'Nouvel élément'}
        subtitle="La Carte"
        actions={<Button variant="subtle" onClick={() => navigate('/carte')}>← Retour</Button>}
      />
      <div style={{ padding: '40px', maxWidth: '640px' }}>

        {/* Sélecteur de type (création seulement) */}
        {!isEdit && (
          <div style={{ marginBottom: '32px' }}>
            <label style={labelStyle}>Type d'élément</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {Object.entries(TYPE_LABELS).map(([t, l]) => (
                <button key={t} type="button" onClick={() => { setFormType(t); setForm(DEFAULTS[t]) }} style={{
                  padding: '9px 20px', background: 'none', fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer',
                  border: formType === t ? '1px solid var(--or)' : '1px solid var(--border)',
                  color: formType === t ? 'var(--or)' : 'var(--texte-gris)',
                  transition: 'all 0.2s',
                }}>{l}</button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {formType === 'formules' && (
            <>
              {field('Label', 'label', { placeholder: 'ex: Formule déjeuner' })}
              {field('Nom', 'nom', { placeholder: 'ex: Le Menu du Marché' })}
              {field('Détail', 'detail', { placeholder: 'ex: Entrée + Plat + Dessert' })}
              {field('Prix (CHF)', 'prix', { placeholder: '42', type: 'text' })}
            </>
          )}

          {formType === 'plats' && (
            <>
              {field('Catégorie', 'categorie', { select: true, options: PLAT_CATS })}
              {field('Nom du plat', 'nom', { placeholder: 'ex: Saint-Jacques poêlées' })}
              {field('Description', 'description', { textarea: true, placeholder: 'Ingrédients et préparation' })}
              {field('Prix (CHF)', 'prix', { placeholder: '32', type: 'text' })}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.actif !== false}
                    onChange={e => set('actif', e.target.checked)}
                    style={{ accentColor: 'var(--or)' }}
                  />
                  Visible sur la carte
                </label>
              </div>
            </>
          )}

          {formType === 'vins' && (
            <>
              {field('Catégorie', 'categorieVin', { select: true, options: VIN_CATS })}
              {field('Nom du vin', 'nom', { placeholder: 'ex: Château Léoville Barton — Saint-Julien' })}
              {field('Région & millésime', 'region', { placeholder: 'ex: Bordeaux, France · 2018' })}
              {field('Prix au verre (CHF)', 'prixVerre', { placeholder: '22', type: 'text' })}
              {field('Prix bouteille (CHF)', 'prixBouteille', { placeholder: '120', type: 'text' })}
            </>
          )}

          {/* Aperçu prix */}
          {(form.prix || form.prixBouteille) && (
            <div style={{
              marginBottom: '28px', padding: '14px 18px',
              background: 'rgba(201,169,110,0.06)', border: '1px solid var(--border-or)',
              fontSize: '0.78rem', color: 'var(--or)',
            }}>
              Aperçu : CHF {form.prix || form.prixBouteille}.—
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer'}
            </Button>
            <Button variant="subtle" type="button" onClick={() => navigate('/carte')}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
