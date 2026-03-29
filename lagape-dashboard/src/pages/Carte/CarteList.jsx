import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { toast } from '../../components/ui/Toast'
import { apiFetch } from '../../lib/api'

const TABS = [
  { id: 'formules', label: 'Formules' },
  { id: 'entrees', label: 'Entrées' },
  { id: 'plats', label: 'Plats' },
  { id: 'desserts', label: 'Fromages & Desserts' },
  { id: 'vins', label: 'Vins' },
]

const VIN_CATS = { blancs: 'Vins blancs', rouges: 'Vins rouges', champagnes: 'Champagnes & Pétillants' }

export default function CarteList() {
  const [data, setData] = useState(null)
  const [activeTab, setActiveTab] = useState('entrees')
  const [deleteTarget, setDeleteTarget] = useState(null)

  async function loadData() {
    const r = await fetch('/api/carte')
    setData(await r.json())
  }

  useEffect(() => { loadData() }, [])

  async function handleDelete() {
    const { type, id } = deleteTarget
    const r = await apiFetch(`/api/carte/${type}/${id}`, { method: 'DELETE' })
    if (r.ok) {
      toast('Supprimé avec succès')
      loadData()
    } else {
      toast('Erreur lors de la suppression', 'error')
    }
    setDeleteTarget(null)
  }

  const row = (item, type) => (
    <div key={item.id} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 24px', borderBottom: '1px solid var(--border)',
      background: 'transparent', transition: 'background 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,51,83,0.3)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', color: 'var(--blanc-casse)', marginBottom: '3px' }}>
          {item.nom || item.name}
          {item.accueil === true && (
            <span style={{ marginLeft: '10px', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--or)', border: '1px solid rgba(201,169,110,0.3)', padding: '2px 8px', background: 'rgba(201,169,110,0.1)' }}>
              Accueil
            </span>
          )}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--texte-gris)', fontStyle: 'italic' }}>
          {item.description || item.detail || item.region}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ color: 'var(--or)', fontSize: '0.88rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
          {item.prix ? `CHF ${item.prix}.—` : ''}
          {item.prixBouteille ? `CHF ${item.prixBouteille}.— / bout.` : ''}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/carte/${type}/${item.id}`}>
            <Button variant="subtle" size="sm">Modifier</Button>
          </Link>
          <Button variant="danger" size="sm" onClick={() => setDeleteTarget({ type, id: item.id, nom: item.nom || item.name })}>
            Suppr.
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <Header
        title="La Carte"
        subtitle="Gestion des plats, formules et vins"
        actions={<Link to="/carte/nouveau"><Button>+ Nouveau</Button></Link>}
      />

      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: '1px solid var(--border)',
        background: 'var(--bleu-profond)', padding: '0 40px',
        position: 'sticky', top: 'var(--header-height)', zIndex: 4,
      }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '16px 24px', background: 'none', border: 'none',
            borderBottom: activeTab === tab.id ? '2px solid var(--or)' : '2px solid transparent',
            color: activeTab === tab.id ? 'var(--or)' : 'var(--texte-gris)',
            fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Montserrat, sans-serif',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 40px 40px' }}>
        {!data && (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--texte-gris)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            Chargement…
          </div>
        )}

        {data && activeTab === 'formules' && (
          <div>
            {data.formules?.map(f => row(f, 'formules'))}
            {data.formules?.length === 0 && <Empty />}
          </div>
        )}

        {data && ['entrees', 'plats', 'desserts'].includes(activeTab) && (
          <div>
            {data.plats?.filter(p => p.categorie === activeTab).map(p => row(p, 'plats'))}
            {data.plats?.filter(p => p.categorie === activeTab).length === 0 && <Empty />}
          </div>
        )}

        {data && activeTab === 'vins' && (
          <div>
            {Object.entries(VIN_CATS).map(([cat, label]) => (
              <div key={cat}>
                <div style={{
                  padding: '20px 24px 10px',
                  fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase',
                  color: 'var(--argent)', borderBottom: '1px solid var(--border)',
                  marginTop: '20px',
                }}>
                  {label}
                </div>
                {data.vins?.filter(v => v.categorieVin === cat).map(v => row(v, 'vins'))}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer cet élément ?"
        message={`"${deleteTarget?.nom}" sera définitivement supprimé de la carte.`}
        confirmLabel="Supprimer"
      />
    </div>
  )
}

function Empty() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', color: 'var(--texte-gris)', fontSize: '0.8rem' }}>
      Aucun élément dans cette catégorie.
    </div>
  )
}
