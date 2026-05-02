import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'

export default function Dashboard({ isMobile, onMenuClick }) {
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
    { label: 'Carte', value: stats.plats, unit: 'items', icon: '❧', to: '/carte', color: 'var(--or)' },
    { label: 'Galerie', value: stats.photos, unit: 'photos', icon: '✦', to: '/galerie', color: 'var(--argent)' },
    { label: 'Blog', value: stats.articles, unit: 'articles', icon: '◎', to: '/blog', color: 'var(--or-clair)' },
  ]

  return (
    <div>
      <Header title="Tableau de bord" isMobile={isMobile} onMenuClick={onMenuClick} />
      <div style={{ padding: isMobile ? '24px 16px' : '48px 40px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {cards.map(card => (
            <Link key={card.to} to={card.to} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(0,55,77,0.35)',
                border: '1px solid var(--border)',
                borderTop: `2px solid ${card.color}`,
                padding: '32px 32px 28px',
                transition: 'all 0.25s',
                position: 'relative',
                overflow: 'hidden',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(0,55,77,0.6)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(0,55,77,0.35)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.58rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {card.label}
                  </span>
                  <span style={{ fontSize: '1rem', color: card.color, opacity: 0.6 }}>{card.icon}</span>
                </div>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '3.2rem', fontWeight: 300, color: '#ffffff', lineHeight: 1 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '8px', letterSpacing: '0.08em' }}>{card.unit}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Accès rapides */}
        <div>
          <p style={{ fontSize: '0.58rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--or)', marginBottom: '20px', fontWeight: 500 }}>
            Actions rapides
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: '+ Ajouter un plat', to: '/carte/nouveau' },
              { label: '+ Uploader une photo', to: '/galerie' },
              { label: '+ Écrire un article', to: '/blog/nouveau' },
            ].map(a => (
              <Link key={a.to} to={a.to} style={{
                padding: '11px 22px',
                border: '1px solid rgba(201,169,110,0.25)',
                color: 'var(--or)',
                fontSize: '0.65rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                transition: 'all 0.2s',
                textDecoration: 'none',
                fontWeight: 400,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--or)'; e.currentTarget.style.color = 'var(--bg-dark)' }}
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
