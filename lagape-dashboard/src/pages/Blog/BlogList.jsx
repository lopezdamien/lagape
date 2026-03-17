import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { toast } from '../../components/ui/Toast'

export default function BlogList() {
  const [articles, setArticles] = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null)

  async function loadArticles() {
    const r = await fetch('/api/blog')
    const data = await r.json()
    setArticles(data.articles || [])
  }

  useEffect(() => { loadArticles() }, [])

  async function handleDelete() {
    const r = await fetch(`/api/blog/${deleteTarget.id}`, { method: 'DELETE' })
    if (r.ok) { toast('Article supprimé'); loadArticles() }
    else toast('Erreur suppression', 'error')
    setDeleteTarget(null)
  }

  async function togglePublie(article) {
    const fd = new FormData()
    fd.append('publie', String(!article.publie))
    const r = await fetch(`/api/blog/${article.id}`, { method: 'PUT', body: fd })
    if (r.ok) { toast(article.publie ? 'Dépublié' : 'Publié'); loadArticles() }
    else toast('Erreur', 'error')
  }

  return (
    <div>
      <Header
        title="Blog"
        subtitle="Articles et actualités"
        actions={<Link to="/blog/nouveau"><Button>+ Nouvel article</Button></Link>}
      />

      <div style={{ padding: '32px 40px' }}>
        {articles.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 40px',
            border: '1px solid var(--border)',
            background: 'var(--card-bg)',
          }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--blanc-casse)', marginBottom: '12px' }}>
              Aucun article pour l'instant
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--texte-gris)', marginBottom: '24px' }}>
              Partagez les actualités et coulisses de L'AGAPE.
            </p>
            <Link to="/blog/nouveau">
              <Button>Écrire le premier article</Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {articles.map(article => (
              <div key={article.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 24px', background: 'var(--card-bg)',
                borderLeft: `3px solid ${article.publie ? 'var(--or)' : 'var(--border)'}`,
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,51,83,0.7)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--card-bg)'}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.1rem', color: 'var(--blanc-casse)', marginBottom: '4px',
                  }}>
                    {article.titre || '(Sans titre)'}
                    <span style={{
                      marginLeft: '12px', fontSize: '0.58rem', letterSpacing: '0.2em',
                      textTransform: 'uppercase', padding: '3px 8px',
                      background: article.publie ? 'rgba(201,169,110,0.12)' : 'transparent',
                      border: `1px solid ${article.publie ? 'var(--or)' : 'var(--border)'}`,
                      color: article.publie ? 'var(--or)' : 'var(--texte-gris)',
                    }}>
                      {article.publie ? 'Publié' : 'Brouillon'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--texte-gris)' }}>
                    {article.datePublication} · {article.contenu?.slice(0, 80)}{article.contenu?.length > 80 ? '…' : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '20px' }}>
                  <Button variant="subtle" size="sm" onClick={() => togglePublie(article)}>
                    {article.publie ? 'Dépublier' : 'Publier'}
                  </Button>
                  <Link to={`/blog/${article.id}`}>
                    <Button variant="ghost" size="sm">Modifier</Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => setDeleteTarget(article)}>Suppr.</Button>
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
        title="Supprimer cet article ?"
        message={`"${deleteTarget?.titre}" sera définitivement supprimé.`}
        confirmLabel="Supprimer"
      />
    </div>
  )
}
