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
  { value: 'desserts', label: 'Fromages & Desserts' },
]

const VIN_CATS = [
  { value: 'blancs', label: 'Vins blancs' },
  { value: 'rouges', label: 'Vins rouges' },
  { value: 'champagnes', label: 'Champagnes & Pétillants' },
]

const DEFAULTS = {
  formules: { label: '', nom: '', detail: '', prix: '' },
  plats: { categorie: 'entrees', nom: '', description: '', prix: '', accueil: false },
  vins: { categorieVin: 'blancs', nom: '', region: '', prixVerre: '', prixBouteille: '' },
}

export default function CarteForm({ isMobile, onMenuClick }) {
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

  function setStep(i, value) {
    const steps = [...(form.steps || [])]
    steps[i] = { ...steps[i], desc: value }
    set('steps', steps)
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

  const sectionTitleStyle = {
    fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase',
    color: 'var(--text-muted)', marginBottom: '20px', paddingBottom: '10px',
    borderBottom: '1px solid var(--border)',
  }

  const field = (label, key, opts = {}) => (
    <div style={{ marginBottom: '20px' }}>
      <label style={labelStyle}>{label}</label>
      {opts.textarea ? (
        <textarea
          rows={opts.rows || 3}
          value={form[key] || ''}
          onChange={e => set(key, e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder={opts.placeholder}
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

  const arrayField = (label, key, hint) => (
    <div style={{ marginBottom: '20px' }}>
      <label style={labelStyle}>{label}</label>
      <textarea
        rows={3}
        value={(form[key] || []).join('\n')}
        onChange={e => set(key, e.target.value.split('\n'))}
        style={{ ...inputStyle, resize: 'vertical' }}
        placeholder={hint}
        onFocus={e => e.target.style.borderColor = 'var(--or)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
      <p style={{ marginTop: '5px', fontSize: '0.6rem', color: 'var(--text-muted)', }}>
        {hint}
      </p>
    </div>
  )

  const formulaTitle = form.type === 'semaine' ? 'Menu de la semaine'
    : form.type === 'agapes' ? 'Le Menu des Agapes'
    : form.type === 'rossini' ? 'Menu Rossini'
    : null

  return (
    <div>
      <Header
        title={isEdit ? `Modifier — ${formulaTitle || TYPE_LABELS[type]}` : 'Nouvel élément'}
        subtitle="Carte"
        actions={<Button variant="subtle" onClick={() => navigate('/carte')}>← Retour</Button>}
        isMobile={isMobile} onMenuClick={onMenuClick}
      />
      <div style={{ padding: isMobile ? '16px' : '40px', maxWidth: '660px' }}>

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

          {/* ── FORMULES ── */}
          {formType === 'formules' && (
            <>
              {/* Menu de la semaine */}
              {form.type === 'semaine' && (
                <>
                  <p style={sectionTitleStyle}>Menu de la semaine — Champs éditables</p>
                  {field('Dates', 'dates', { placeholder: 'ex: DU 31/03 AU 03/04' })}
                  {field('Entrée', 'entree', { placeholder: "Nom de l'entrée" })}
                  {field('Plat', 'plat', { placeholder: 'Nom du plat', textarea: true, rows: 2 })}
                  {field('Dessert', 'dessert', { placeholder: 'ex: Mousse au chocolat ou Assiette de fromages' })}
                  <p style={{ ...sectionTitleStyle, marginTop: '28px' }}>Tarifs</p>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '14px' }}>
                    {field('E + P + D (CHF)', 'prixComplet', { placeholder: '40' })}
                    {field('E + P (CHF)', 'prixSansDessert', { placeholder: '35' })}
                    {field('Plat seul (CHF)', 'prixPlat', { placeholder: '25' })}
                  </div>
                </>
              )}

              {/* Le Menu des Agapes */}
              {form.type === 'agapes' && (
                <>
                  <p style={sectionTitleStyle}>Le Menu des Agapes — Étapes du menu</p>
                  {(form.steps || []).map((step, i) => (
                    <div key={i} style={{ marginBottom: '18px' }}>
                      <label style={{ ...labelStyle, color: 'var(--argent)' }}>{step.label}</label>
                      <textarea
                        rows={2}
                        value={step.desc || ''}
                        onChange={e => setStep(i, e.target.value)}
                        style={{ ...inputStyle, resize: 'vertical' }}
                        onFocus={e => e.target.style.borderColor = 'var(--or)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                    </div>
                  ))}
                  <p style={{ ...sectionTitleStyle, marginTop: '28px' }}>Prix & Accords</p>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '14px' }}>
                    {field('Prix / pers. (CHF)', 'prix', { placeholder: '89' })}
                    {field('Accord 2 verres (CHF)', 'accord2', { placeholder: '23' })}
                    {field('Accord 4 verres (CHF)', 'accord4', { placeholder: '45' })}
                  </div>
                </>
              )}

              {/* Menu Rossini */}
              {form.type === 'rossini' && (
                <>
                  <p style={sectionTitleStyle}>Menu Rossini — Choix proposés</p>
                  {arrayField('Foie Gras', 'foieGras', 'Un choix par ligne')}
                  {arrayField('Sauces', 'sauces', 'Une sauce par ligne')}
                  {arrayField('Garnitures', 'garnitures', 'Une garniture par ligne')}
                  {field('Prix (CHF)', 'prix', { placeholder: '79' })}
                </>
              )}

              {/* Formule générique (création manuelle) */}
              {!form.type && (
                <>
                  {field('Label', 'label', { placeholder: 'ex: Formule déjeuner' })}
                  {field('Nom', 'nom', { placeholder: 'ex: Le Menu du Marché' })}
                  {field('Détail', 'detail', { placeholder: 'ex: Entrée + Plat + Dessert' })}
                  {field('Prix (CHF)', 'prix', { placeholder: '42', type: 'text' })}
                </>
              )}
            </>
          )}

          {/* ── PLATS ── */}
          {formType === 'plats' && (
            <>
              {field('Catégorie', 'categorie', { select: true, options: PLAT_CATS })}
              {field('Nom du plat', 'nom', { placeholder: 'ex: Saint-Jacques poêlées' })}
              {field('Description', 'description', { textarea: true, placeholder: 'Ingrédients et préparation' })}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.accueil === true}
                    onChange={e => set('accueil', e.target.checked)}
                    style={{ accentColor: 'var(--or)' }}
                  />
                  Visible sur la page d'accueil
                </label>
              </div>
              {form.accueil === true && (
                <div style={{ marginBottom: '20px', borderLeft: '2px solid var(--or)', paddingLeft: '14px', marginLeft: '6px' }}>
                  <label style={labelStyle}>Description page d'accueil</label>
                  <textarea
                    rows={2}
                    value={form.descriptionAccueil || ''}
                    onChange={e => set('descriptionAccueil', e.target.value)}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'var(--or)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <p style={{ marginTop: '6px', fontSize: '0.62rem', color: 'var(--text-muted)', }}>
                    Version courte affichée sur la page d'accueil.
                  </p>
                </div>
              )}
              {field('Prix (CHF)', 'prix', { placeholder: '32', type: 'text' })}
            </>
          )}

          {/* ── VINS ── */}
          {formType === 'vins' && (
            <>
              {field('Catégorie', 'categorieVin', { select: true, options: VIN_CATS })}
              {field('Nom du vin', 'nom', { placeholder: 'ex: Château Léoville Barton — Saint-Julien' })}
              {field('Région & millésime', 'region', { placeholder: 'ex: Bordeaux, France · 2018' })}
              {field('Prix au verre (CHF)', 'prixVerre', { placeholder: '22', type: 'text' })}
              {field('Prix bouteille (CHF)', 'prixBouteille', { placeholder: '120', type: 'text' })}
            </>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
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
