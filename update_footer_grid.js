const fs = require('fs');
const files = ['index.html', 'menu.html', 'histoire.html', 'galerie.html', 'reservation.html'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // For max-width: 900px block
  content = content.replace(
    /\.footer-grid \{ grid-template-columns: 1fr; gap: 30px; \}/g,
    '.footer-grid { grid-template-columns: 1fr 1fr; gap: 30px; }\n      .footer-grid > div:first-child { grid-column: 1 / -1; text-align: left; }'
  );
  
  // For max-width: 768px block (premium mobile layout)
  content = content.replace(
    /(\.footer-grid\s*\{\s*grid-template-columns:\s*)1fr(;\s*gap:\s*36px;\s*margin-bottom:\s*40px;\s*\})/g,
    '$11fr 1fr$2\n      .footer-grid > div:first-child { grid-column: 1 / -1; }'
  );

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Done');
