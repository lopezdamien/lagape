const fs = require('fs');
const path = require('path');

const cssTarget1 = /footer\s*{\s*background:\s*rgba\(8,16,25,0\.98\);\s*border-top:\s*1px\s+solid\s+rgba\(184,196,208,0\.08\);\s*padding:\s*40px\s+60px\s+24px;\s*}\s*\.footer-bottom\s*{\s*display:\s*flex;\s*justify-content:\s*space-between;\s*align-items:\s*center;\s*font-size:\s*0\.68rem;\s*color:\s*var\(--texte-gris\);\s*}\s*\.footer-logo\s*{\s*font-family:\s*'Barlow\s+Condensed',\s*sans-serif;\s*font-size:\s*1\.4rem;\s*font-weight:\s*700;\s*color:\s*var\(--grey-cloud\);\s*letter-spacing:\s*0\.15em;\s*text-transform:\s*uppercase;\s*}/g;

const cssReplacement1 = `/* ── FOOTER ── */
    footer {
      background: rgba(8, 16, 25, 0.98);
      border-top: 1px solid rgba(184,196,208,0.08);
      padding: 80px 60px 40px;
    }
    .footer-grid {
      display: grid; grid-template-columns: 2fr 1fr 1fr;
      gap: 60px; margin-bottom: 60px;
    }
    .footer-logo {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 2.2rem; font-weight: 700; color: var(--blanc-casse);
      letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 8px;
    }
    .footer-tagline { font-size: 0.88rem; color: var(--argent); margin-bottom: 28px; font-weight: 300; letter-spacing: 0.02em; }
    .footer-social { display: flex; gap: 20px; }
    .footer-social a {
      color: var(--texte-gris); text-decoration: none; transition: all 0.3s ease;
      display: flex; align-items: center; justify-content: center;
    }
    .footer-social a:hover { color: var(--or); transform: translateY(-2px); }
    .footer-col-title {
      font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase;
      color: var(--or); margin-bottom: 24px; font-weight: 600;
    }
    .footer-links { list-style: none; }
    .footer-links li { margin-bottom: 14px; }
    .footer-links a {
      font-size: 0.85rem; color: var(--argent); text-decoration: none; transition: color 0.3s;
      font-weight: 300; letter-spacing: 0.03em;
    }
    .footer-links a:hover { color: var(--blanc-casse); }
    .footer-bottom {
      border-top: 1px solid rgba(184,196,208,0.08);
      padding-top: 32px;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 0.72rem; color: rgba(184,196,208,0.4); font-weight: 300; letter-spacing: 0.05em;
    }`;

const cssTarget2 = /footer\s*{\s*padding:\s*30px\s+24px\s+20px;\s*}\s*\.footer-bottom\s*{\s*flex-direction:\s*column;\s*gap:\s*8px;\s*text-align:\s*center;\s*}/g;
const cssReplacement2 = `.footer-grid { grid-template-columns: 1fr; gap: 30px; }
      .footer-bottom { flex-direction: column; gap: 10px; text-align: center; }
      footer { padding: 40px 24px 24px; }`;

const htmlTarget = /<footer>\s*<div class="footer-bottom">\s*<div style="font-family: 'Barlow Condensed', sans-serif; font-size: 1\.5rem; font-weight: 700; color: var\(--grey-cloud\); letter-spacing: 0\.1em; text-transform: uppercase;">L'AGAPE<\/div>\s*<span>11 Rue Caroline, 1227 Genève · \+41 22 343 12 98<\/span>\s*<span>© 2026<\/span>\s*<\/div>\s*<\/footer>/g;

const htmlReplacement = `<footer>
    <div class="footer-grid">
      <div>
        <div class="footer-logo">L'AGAPE</div>
        <p class="footer-tagline">Restaurant bistronomique à Genève</p>
        <div class="footer-social">
          <a href="https://www.instagram.com/lagape_geneve" target="_blank" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="https://www.facebook.com/lagapegeneve" target="_blank" aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="https://www.tripadvisor.com" target="_blank" aria-label="TripAdvisor">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.5 10a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"></path><path d="M14.5 10a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"></path><path d="M12 18a6 6 0 0 0 4.5-9.8L12 3 7.5 8.2A6 6 0 0 0 12 18z"></path></svg>
          </a>
        </div>
      </div>
      <div>
        <p class="footer-col-title">Navigation</p>
        <ul class="footer-links">
          <li><a href="index.html">Accueil</a></li>
          <li><a href="menu.html">La Carte</a></li>
          <li><a href="histoire.html">Notre Histoire</a></li>
          <li><a href="galerie.html">Galerie</a></li>
          <li><a href="reservation.html">Réservation</a></li>
        </ul>
      </div>
      <div>
        <p class="footer-col-title">Réserver</p>
        <ul class="footer-links">
          <li><a href="reservation.html">En ligne via TheFork</a></li>
          <li><a href="tel:+41223431298">Par téléphone</a></li>
          <li><a href="mailto:contact@lagape.ch">Par email</a></li>
          <li><a href="mailto:contact@lagape.ch">Service traiteur</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 L'AGAPE — Rue Caroline, 11 · 1227 Les Acacias</span>
    </div>
  </footer>`;

const files = ['menu.html', 'histoire.html', 'galerie.html', 'reservation.html'];

for (const file of files) {
  const p = path.join(__dirname, file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    let original = content;
    
    content = content.replace(cssTarget1, cssReplacement1);
    content = content.replace(cssTarget2, cssReplacement2);
    content = content.replace(htmlTarget, htmlReplacement);
    
    if (content !== original) {
      fs.writeFileSync(p, content, 'utf8');
      console.log(`Updated ${file}`);
    } else {
      console.log(`No match in ${file} or already updated.`);
    }
  }
}
