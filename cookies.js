(function () {
  const COOKIE_KEY = 'lagape_cookies'

  // GA4 — remplacer G-XXXXXXXXXX par le vrai ID une fois connecté
  const GA_ID = 'G-XXXXXXXXXX'

  function loadGA() {
    if (document.getElementById('ga-script')) return
    const s = document.createElement('script')
    s.id = 'ga-script'
    s.async = true
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID
    document.head.appendChild(s)
    window.dataLayer = window.dataLayer || []
    function gtag() { dataLayer.push(arguments) }
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', GA_ID, { anonymize_ip: true })
  }

  function accept() {
    localStorage.setItem(COOKIE_KEY, 'accepted')
    hideBanner()
    loadGA()
  }

  function refuse() {
    localStorage.setItem(COOKIE_KEY, 'refused')
    hideBanner()
  }

  function hideBanner() {
    const banner = document.getElementById('cookie-banner')
    if (banner) {
      banner.style.transform = 'translateY(120%)'
      banner.style.opacity = '0'
      setTimeout(() => banner.remove(), 400)
    }
  }

  function showBanner() {
    const banner = document.createElement('div')
    banner.id = 'cookie-banner'
    banner.innerHTML = `
      <div style="
        position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(0);
        z-index: 9999; width: calc(100% - 48px); max-width: 680px;
        background: #002b3c;
        border: 1px solid rgba(201,169,110,0.4);
        border-bottom: 2px solid #c9a96e;
        padding: 20px 28px;
        display: flex; align-items: center; justify-content: space-between; gap: 24px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.5);
        transition: transform 0.4s ease, opacity 0.4s ease;
        flex-wrap: wrap;
      ">
        <p style="
          margin: 0; font-family: 'Barlow', sans-serif; font-size: 0.78rem;
          color: #b8c4d0; line-height: 1.6; flex: 1; min-width: 200px;
        ">
          Nous utilisons des cookies pour analyser la fréquentation du site et améliorer votre expérience.
        </p>
        <div style="display: flex; gap: 10px; flex-shrink: 0;">
          <button id="cookie-refuse" style="
            padding: 9px 20px; font-size: 0.6rem; letter-spacing: 0.18em;
            text-transform: uppercase; border: 1px solid rgba(184,196,208,0.25);
            background: transparent; color: #b8c4d0; cursor: pointer;
            font-family: 'Barlow', sans-serif; transition: all 0.2s;
          ">Refuser</button>
          <button id="cookie-accept" style="
            padding: 9px 20px; font-size: 0.6rem; letter-spacing: 0.18em;
            text-transform: uppercase; border: 1px solid #c9a96e;
            background: #c9a96e; color: #002b3c; cursor: pointer;
            font-family: 'Barlow', sans-serif; font-weight: 600; transition: all 0.2s;
          ">Accepter</button>
        </div>
      </div>
    `
    document.body.appendChild(banner)

    document.getElementById('cookie-accept').addEventListener('click', accept)
    document.getElementById('cookie-refuse').addEventListener('click', refuse)

    // Hover effects
    const btnRefuse = document.getElementById('cookie-refuse')
    const btnAccept = document.getElementById('cookie-accept')
    btnRefuse.addEventListener('mouseenter', () => { btnRefuse.style.color = '#ffffff'; btnRefuse.style.borderColor = 'rgba(184,196,208,0.6)' })
    btnRefuse.addEventListener('mouseleave', () => { btnRefuse.style.color = '#b8c4d0'; btnRefuse.style.borderColor = 'rgba(184,196,208,0.25)' })
    btnAccept.addEventListener('mouseenter', () => { btnAccept.style.background = '#e8d5b0' })
    btnAccept.addEventListener('mouseleave', () => { btnAccept.style.background = '#c9a96e' })
  }

  // Au chargement
  window.addEventListener('DOMContentLoaded', function () {
    const choice = localStorage.getItem(COOKIE_KEY)
    if (choice === 'accepted') {
      loadGA()
    } else if (!choice) {
      showBanner()
    }
  })
})()
