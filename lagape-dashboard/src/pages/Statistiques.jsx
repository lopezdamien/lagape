import { useState } from 'react'
import Header from '../components/layout/Header'

// ─── Données mockées — seront remplacées par l'API Google Analytics 4 ───────
const MOCK = {
  periode: '7 derniers jours',
  kpis: [
    { label: 'Utilisateurs', value: '—', delta: null, icon: '◎', color: 'var(--or)' },
    { label: 'Sessions', value: '—', delta: null, icon: '✦', color: 'var(--argent)' },
    { label: 'Durée moy.', value: '—', delta: null, icon: '◈', color: 'var(--or-clair)' },
    { label: 'Taux rebond', value: '—', delta: null, icon: '❧', color: 'var(--or)' },
  ],
  topPages: [
    { page: '/index.html — Accueil', sessions: '—' },
    { page: '/menu.html — La Carte', sessions: '—' },
    { page: '/reservation.html — Réservation', sessions: '—' },
    { page: '/histoire.html — Notre Histoire', sessions: '—' },
    { page: '/galerie.html — Galerie', sessions: '—' },
  ],
  sources: [
    { label: 'Direct', value: 0, color: 'var(--or)' },
    { label: 'Recherche organique', value: 0, color: 'var(--argent)' },
    { label: 'Réseaux sociaux', value: 0, color: 'var(--or-clair)' },
    { label: 'Référencement', value: 0, color: '#6eb5c9' },
  ],
  appareils: [
    { label: 'Mobile', value: 0, color: 'var(--or)' },
    { label: 'Desktop', value: 0, color: 'var(--argent)' },
    { label: 'Tablette', value: 0, color: 'var(--or-clair)' },
  ],
  paysTop: [
    { pays: 'Suisse', sessions: '—' },
    { pays: 'France', sessions: '—' },
    { pays: 'Belgique', sessions: '—' },
  ],
  motsCles: [
    { query: "restaurant bistronomique genève", clics: '—', impressions: '—', position: '—' },
    { query: "l'agape genève", clics: '—', impressions: '—', position: '—' },
    { query: "bib gourmand genève", clics: '—', impressions: '—', position: '—' },
    { query: "restaurant gastronomique genève", clics: '—', impressions: '—', position: '—' },
    { query: "traiteur genève", clics: '—', impressions: '—', position: '—' },
  ],
}

const PERIODES = ['7 derniers jours', '30 derniers jours', '90 derniers jours']

export default function Statistiques({ isMobile, onMenuClick }) {
  const [periode, setPeriode] = useState(PERIODES[0])
  const [gaConnected] = useState(false) // passera à true une fois GA4 connecté

  const p = isMobile ? '24px 16px' : '48px 40px'

  return (
    <div>
      <Header title="Statistiques" subtitle="Google Analytics 4" isMobile={isMobile} onMenuClick={onMenuClick} />
      <div style={{ padding: p }}>

        {/* Bandeau GA non connecté */}
        {!gaConnected && (
          <div style={{
            background: 'rgba(201,169,110,0.06)',
            border: '1px solid rgba(201,169,110,0.3)',
            borderLeft: '3px solid var(--or)',
            padding: '16px 24px',
            marginBottom: '36px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <span style={{ fontSize: '1rem', color: 'var(--or)' }}>◎</span>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--or)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '4px' }}>
                Google Analytics 4 non connecté
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Les données seront disponibles une fois la propriété GA4 configurée et les credentials ajoutés aux variables d'environnement Vercel.
              </p>
            </div>
          </div>
        )}

        {/* Sélecteur de période */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '36px', flexWrap: 'wrap' }}>
          {PERIODES.map(p => (
            <button
              key={p}
              onClick={() => setPeriode(p)}
              style={{
                padding: '8px 18px',
                fontSize: '0.62rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                border: `1px solid ${periode === p ? 'var(--or)' : 'var(--border)'}`,
                background: periode === p ? 'rgba(201,169,110,0.1)' : 'transparent',
                color: periode === p ? 'var(--or)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* KPIs principaux */}
        <p style={{ fontSize: '0.58rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--or)', marginBottom: '16px', fontWeight: 500 }}>
          Vue d'ensemble
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '40px',
        }}>
          {MOCK.kpis.map(kpi => (
            <div key={kpi.label} style={{
              background: 'rgba(0,55,77,0.35)',
              border: '1px solid var(--border)',
              borderTop: `2px solid ${kpi.color}`,
              padding: '28px 24px 24px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {kpi.label}
                </span>
                <span style={{ fontSize: '0.85rem', color: kpi.color, opacity: 0.6 }}>{kpi.icon}</span>
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.8rem', fontWeight: 300, color: '#ffffff', lineHeight: 1 }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '8px', letterSpacing: '0.08em' }}>
                En attente de données
              </div>
            </div>
          ))}
        </div>

        {/* Ligne 2 : Top pages + Sources */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '24px',
          marginBottom: '24px',
        }}>

          {/* Top pages */}
          <div style={{ background: 'rgba(0,55,77,0.35)', border: '1px solid var(--border)', padding: '28px' }}>
            <p style={{ fontSize: '0.58rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--or)', marginBottom: '24px', fontWeight: 500 }}>
              Pages les plus visitées
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {MOCK.topPages.map((row, i) => (
                <div key={row.page} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: i < MOCK.topPages.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', width: '16px', flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--grey-cloud)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.page}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '12px' }}>
                    {row.sessions}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sources de trafic */}
          <div style={{ background: 'rgba(0,55,77,0.35)', border: '1px solid var(--border)', padding: '28px' }}>
            <p style={{ fontSize: '0.58rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--or)', marginBottom: '24px', fontWeight: 500 }}>
              Sources de trafic
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {MOCK.sources.map(src => (
                <div key={src.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--grey-cloud)' }}>{src.label}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>—</span>
                  </div>
                  <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '0%', height: '100%', background: src.color, borderRadius: '2px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ligne 3 : Appareils + Géographie */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '24px',
        }}>

          {/* Appareils */}
          <div style={{ background: 'rgba(0,55,77,0.35)', border: '1px solid var(--border)', padding: '28px' }}>
            <p style={{ fontSize: '0.58rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--or)', marginBottom: '24px', fontWeight: 500 }}>
              Appareils
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {MOCK.appareils.map(a => (
                <div key={a.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--grey-cloud)' }}>{a.label}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>—</span>
                  </div>
                  <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '0%', height: '100%', background: a.color, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Géographie */}
          <div style={{ background: 'rgba(0,55,77,0.35)', border: '1px solid var(--border)', padding: '28px' }}>
            <p style={{ fontSize: '0.58rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--or)', marginBottom: '24px', fontWeight: 500 }}>
              Pays — Top 3
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {MOCK.paysTop.map((row, i) => (
                <div key={row.pays} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: i < MOCK.paysTop.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', width: '16px' }}>{i + 1}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--grey-cloud)' }}>{row.pays}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.sessions}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '20px', fontStyle: 'normal', opacity: 0.7 }}>
              ◎ Données disponibles après connexion GA4
            </p>
          </div>

        </div>

        {/* Ligne 4 : Mots-clés Search Console */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ background: 'rgba(0,55,77,0.35)', border: '1px solid var(--border)', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <p style={{ fontSize: '0.58rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--or)', fontWeight: 500 }}>
                Mots-clés de recherche
              </p>
              <span style={{ fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '4px 10px' }}>
                Google Search Console
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Requêtes Google ayant amené des visiteurs sur le site
            </p>

            {/* En-tête tableau */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 60px' : '1fr 80px 100px 80px',
              gap: '8px',
              padding: '8px 0',
              borderBottom: '1px solid var(--border)',
              marginBottom: '4px',
            }}>
              <span style={{ fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Requête</span>
              <span style={{ fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>Clics</span>
              {!isMobile && <span style={{ fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>Impressions</span>}
              {!isMobile && <span style={{ fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>Position</span>}
            </div>

            {MOCK.motsCles.map((row, i) => (
              <div key={row.query} style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 60px' : '1fr 80px 100px 80px',
                gap: '8px',
                padding: '12px 0',
                borderBottom: i < MOCK.motsCles.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--grey-cloud)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.query}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--or)', textAlign: 'right', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 300 }}>
                  {row.clics}
                </span>
                {!isMobile && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                    {row.impressions}
                  </span>
                )}
                {!isMobile && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--argent)', textAlign: 'right' }}>
                    {row.position}
                  </span>
                )}
              </div>
            ))}

            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '20px', opacity: 0.7 }}>
              ◎ Données disponibles après connexion à Google Search Console API
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
