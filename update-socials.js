const fs = require('fs');
const path = require('path');

const cssTarget = /\.footer-social\s*a\s*{\s*color:\s*var\(--texte-gris\);\s*text-decoration:\s*none;\s*transition:\s*all\s*0\.3s\s*ease;\s*display:\s*flex;\s*align-items:\s*center;\s*justify-content:\s*center;\s*}\s*\.footer-social\s*a:hover\s*{\s*color:\s*var\(--or\);\s*transform:\s*translateY\(-2px\);\s*}/g;

const cssReplacement = `.footer-social a {
      color: var(--blanc-casse); opacity: 0.9;
      text-decoration: none; transition: all 0.3s ease;
      display: flex; align-items: center; justify-content: center;
    }
    .footer-social a:hover { color: var(--or); opacity: 1; transform: translateY(-2px); }`;

const htmlRegex = /<div class="footer-social">[\s\S]*?<\/div>\s*<\/div>\s*<div>\s*<p class="footer-col-title">Navigation<\/p>/g;

const htmlReplacement = `<div class="footer-social">
          <a href="https://www.instagram.com/lagape_geneve" target="_blank" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 448 512" fill="currentColor">
              <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
            </svg>
          </a>
          <a href="https://www.facebook.com/lagapegeneve" target="_blank" aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 320 512" fill="currentColor">
              <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
            </svg>
          </a>
          <a href="https://www.tripadvisor.com" target="_blank" aria-label="TripAdvisor">
            <svg width="22" height="22" viewBox="0 0 448 512" fill="currentColor">
              <path d="M285.3 189.6c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm0-96.2c-35.4 0-64.1 28.7-64.1 64.1s28.7 64.1 64.1 64.1 64.1-28.7 64.1-64.1-28.7-64.1-64.1-64.1zm-170.8 96.2c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm0-96.2c-35.4 0-64.1 28.7-64.1 64.1s28.7 64.1 64.1 64.1 64.1-28.7 64.1-64.1-28.7-64.1-64.1-64.1zm241.1-23.2C324.9 59.5 282.8 54.3 243.6 71c-13.4-18-35.1-28-57-27.5-16.1.1-32.1 5.9-44.5 16.5-13.2-12-30.8-18.7-48.9-19-46.7-1-85.9 36-87.3 82.5-.2 4.4 0 6.1.6 15 .2 3 .7 15.6 1.4 18.5 22.3 89.6 98.7 152.9 187.3 162 13.5 1.4 27 1.6 40.5.8 45.4-2.8 89.6-21.4 123-53.7.8-.8 1.4-1.6 1.6-1.6.4-.2.8-.2 1.4.2 36.4 19.3 75.2 27.6 116.5 29.5.4 0 2 0 2.2-.2s-.4-1.4-.8-2c-15.6-25.1-24.1-54-25.1-84-1.6-43.6-77.9-123.5-98.3-132.8zM245.9 203.2c-19.8-38.3-43.1-62.7-72.2-74-8.7-3.4-16.1-4.2-27.4-3-31.4 3.4-56.4 24.3-66 54.9-5.1 16.5-4.4 35.1 2 51.3 22 55.3 75.8 86.8 135 78.4 26.6-3.8 51.1-16.7 69.4-36.8-21.2-13.2-34.9-29.9-40.8-70.8zm116.1 20.3c-7.9 31.8-31 58.2-61.6 70.8 1.4-32.9-8.7-64.3-25.1-83.8-3-3.6-6.1-7.1-9.5-10.3 32.3-2.6 62.7 6.1 84.4 25.1 8.3 7 13.6 16.1 11.8 18.2z"/>
            </svg>
          </a>
        </div>
      </div>
      <div>
        <p class="footer-col-title">Navigation</p>`;

const files = ['index.html', 'menu.html', 'histoire.html', 'galerie.html', 'reservation.html'];

for (const file of files) {
  const p = path.join(__dirname, file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    let original = content;
    
    content = content.replace(cssTarget, cssReplacement);
    content = content.replace(htmlRegex, htmlReplacement);
    
    if (content !== original) {
      fs.writeFileSync(p, content, 'utf8');
      console.log(`Updated ${file}`);
    } else {
      console.log(`No match in ${file}`);
    }
  }
}
