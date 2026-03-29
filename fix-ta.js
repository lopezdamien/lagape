const fs = require('fs');
const files = ['index.html','menu.html','histoire.html','galerie.html','reservation.html'];

const newSvg = `<a href="https://www.tripadvisor.com" target="_blank" aria-label="TripAdvisor">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 0 0 4.04 10.43 5.976 5.976 0 0 0 4.075-1.6L12 19.705l1.922-2.09a5.972 5.972 0 0 0 4.072 1.598 6 6 0 0 0 6-5.998 5.982 5.982 0 0 0-1.957-4.432L24 6.648h-4.35a13.573 13.573 0 0 0-7.644-2.353zM12 6.255c1.531 0 3.063.303 4.504.903C13.943 8.138 12 10.43 12 13.1c0-2.671-1.942-4.962-4.504-5.942A11.72 11.72 0 0 1 12 6.256zM6.002 9.157a4.059 4.059 0 1 1 0 8.118 4.059 4.059 0 0 1 0-8.118zm11.992.002a4.057 4.057 0 1 1 .003 8.115 4.057 4.057 0 0 1-.003-8.115zm-11.992 1.93a2.128 2.128 0 0 0 0 4.256 2.128 2.128 0 0 0 0-4.256zm11.992 0a2.128 2.128 0 0 0 0 4.256 2.128 2.128 0 0 0 0-4.256z"/>
            </svg>
          </a>`;

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  const orig = c;
  // Replace the tripadvisor anchor — match by aria-label
  c = c.replace(/<a href="https:\/\/www\.tripadvisor\.com"[^>]*>[\s\S]*?<\/a>/g, newSvg);
  if (c !== orig) {
    fs.writeFileSync(f, c, 'utf8');
    console.log('Updated: ' + f);
  } else {
    console.log('No match: ' + f);
  }
});
