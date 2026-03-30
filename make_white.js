const fs = require('fs');
const filepath = 'menu.html';
let content = fs.readFileSync(filepath, 'utf8');

const lightThemeCSS = `
  <style id="light-theme-overrides">
    /* ───────────────────────────────────────────────────────── */
    /* SURCHARGES THÈME CLAIR (FOND BLANC) POUR LA PAGE LA CARTE */
    /* ───────────────────────────────────────────────────────── */
    
    body { background: #fdfdfc; color: var(--bg-dark); }
    
    /* Navigation */
    nav { background: rgba(253, 253, 252, 0.98) !important; border-bottom: 1px solid rgba(0, 43, 60, 0.08) !important; }
    .nav-logo, .nav-links a { color: var(--bg-dark) !important; }
    .nav-links a:hover, .nav-links a.active { color: var(--or) !important; }
    .nav-burger span { background: var(--bg-dark) !important; }
    
    .mobile-overlay { background: #fdfdfc !important; }
    .mobile-overlay-logo, .mobile-nav-list a { color: var(--bg-dark) !important; }
    .mobile-social-row a { color: var(--bg-dark) !important; }

    /* Page Header */
    .page-header { background: linear-gradient(170deg, #f4f6f8 0%, #ffffff 60%, #f4f6f8 100%) !important; }
    .page-title { color: var(--bg-dark) !important; }
    .page-desc { color: var(--blue-paon) !important; }
    .page-divider { background: linear-gradient(to right, transparent, rgba(0,43,60,0.2), transparent) !important; }
    .page-header::before { background: radial-gradient(ellipse at 50% 80%, rgba(0,43,60,0.03) 0%, transparent 60%) !important; }

    /* Menu Navigation Tabs */
    .menu-tabs { background: #ffffff !important; border-bottom: 1px solid rgba(0,43,60,0.1) !important; }
    .menu-tab { color: var(--blue-paon) !important; }
    .menu-tab:hover { color: var(--bg-dark) !important; }
    .menu-tab.active { color: var(--or) !important; border-bottom-color: var(--or) !important; }

    /* Menu Sections & Plats */
    .menu-section { border-bottom: 1px solid rgba(0,43,60,0.08) !important; }
    .menu-section-title { color: var(--bg-dark) !important; }
    .menu-section-subtitle { color: var(--blue-paon) !important; }

    .plat { border-bottom: 1px solid rgba(0,43,60,0.05) !important; }
    .plat-name { color: var(--bg-dark) !important; font-weight: 500 !important; }
    .plat-desc { color: var(--blue-paon) !important; }
    .plat-dots { border-bottom: 1px dotted rgba(0,43,60,0.15) !important; }

    /* Vins */
    .vin-cat-title { color: var(--bg-dark) !important; border-bottom: 1px solid rgba(0,43,60,0.1) !important; }
    .vin { border-bottom: 1px solid rgba(0,43,60,0.05) !important; }
    .vin-name { color: var(--bg-dark) !important; font-weight: 400 !important; }
    .vin-region { color: var(--blue-paon) !important; }
    .vin-prix { color: var(--bg-dark) !important; }
    .vin-prix span { color: var(--blue-paon) !important; }

    /* Custom Formules */
    .menu-semaine { background: #ffffff !important; border: 1px solid rgba(201,169,110,0.4) !important; box-shadow: 0 10px 40px rgba(0,0,0,0.03) !important; }
    .semaine-prices p { color: var(--bg-dark) !important; }
    .semaine-prices .notice { color: var(--blue-paon) !important; }
    .semaine-step-plat { color: var(--bg-dark) !important; font-weight: 500 !important; }
    .semaine-step-plat span.ou { color: var(--blue-paon) !important; }

    .menu-agapes { background: #fdfdfc !important; border-top: 1px solid rgba(0,43,60,0.1) !important; border-bottom: 1px solid rgba(0,43,60,0.1) !important; }
    .agapes-step-title { color: var(--bg-dark) !important; font-weight: 700 !important; }
    .agapes-step-desc { color: var(--blue-paon) !important; }
    .accord-row { color: var(--bg-dark) !important; font-weight: 400 !important; }
    .accord-row span.glasses { color: var(--blue-paon) !important; }
    .agapes-accords { border-top: 1px dashed rgba(0,43,60,0.15) !important; }

    .rossini-title { color: var(--bg-dark) !important; }
    .rossini-box { background: #ffffff !important; border: 1px solid rgba(201,169,110,0.5) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.04) !important; }
    .rossini-box::after { border: 1px solid rgba(201,169,110,0.2) !important; }
    .rbox-item { color: var(--bg-dark) !important; font-weight: 500 !important; }
    .choice-label { color: var(--bg-dark) !important; font-weight: 700 !important; }
    .c-item { color: var(--blue-paon) !important; }
    .choice-group { border-top: 1px solid rgba(0,43,60,0.1) !important; }

    .menu-note { background: #f4f6f8 !important; border: 1px solid rgba(0,43,60,0.08) !important; color: var(--blue-paon) !important; }
  </style>
</head>
`;

if (!content.includes('id="light-theme-overrides"')) {
  // Replace the closing </head> with the new style block + </head>
  content = content.replace('</head>', lightThemeCSS);
  fs.writeFileSync(filepath, content, 'utf8');
}
