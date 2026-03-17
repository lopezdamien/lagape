import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'

export default function Dashboard() {
  const [stats, setStats] = useState({ plats: 0, photos: 0, articles: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/carte').then(r => r.json()),
      fetch('/api/galerie').then(r => r.json()),
      fetch('/api/blog').then(r => r.json()),
    ]).then(([carte, galerie, blog]) => {
      setStats({
        plats: (carte.plats?.length || 0) + (carte.formules?.length || 0) + (carte.vins?.length || 0),
        photos: galerie.photos?.length || 0,
        articles: blog.articles?.length || 0,
      })
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'La Carte', value: stats.plats, unit: 'items', icon: '❧', to: '/carte', color: 'var(--or)' },
    { label: 'Galerie', value: stats.photos, unit: 'photos', icon: '✦', to: '/galerie', color: 'var(--argent-clair)' },
    { label: 'Blog', value: stats.articles, unit: 'articles', icon: '◎', to: '/blog', color: 'var(--or-clair)' },
  ]

  return (
    <div>
      <Header title="Tableau de bord" subtitle="L'AGAPE · Administration" />
      <div style={{ padding: '40px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '50px' }}>
          {cards.map(card => (
            <Link key={card.to} to={card.to} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                padding: '28px 32px',
                borderTop: `2px solid ${card.color}`,
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,51,83,0.7)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--card-bg)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--texte-gris)' }}>
                    {card.label}
                  </span>
                  <span style={{ fontSize: '1.1rem', color: card.color, opacity: 0.7 }}>{card.icon}</span>
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.8rem', fontWeight: 300, color: 'var(--blanc-casse)', lineHeight: 1 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--texte-gris)', marginTop: '6px' }}>{card.unit}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Accès rapides */}
        <div style={{ marginBottom: '12px' }}>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--or)', marginBottom: '20px' }}>
            Actions rapides
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {[
              { label: 'Ajouter un plat', to: '/carte/nouveau' },
              { label: 'Uploader une photo', to: '/galerie' },
              { label: 'Écrire un article', to: '/blog/nouveau' },
            ].map(a => (
              <Link key={a.to} to={a.to} style={{
                padding: '11px 24px',
                border: '1px solid var(--border-or)',
                color: 'var(--or)',
                fontSize: '0.68rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                transition: 'all 0.2s',
                textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--or)'; e.currentTarget.style.color = 'var(--bleu-nuit)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--or)' }}
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
