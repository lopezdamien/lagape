const fs = require('fs');
const filepath = 'menu.html';
let content = fs.readFileSync(filepath, 'utf8');

// The CSS to inject
const customCSS = `
    /* CUSTOM FORMULES - PREMIUM LAYOUTS */
    .custom-formule-wrapper { display: flex; flex-direction: column; gap: 80px; margin-bottom: 50px; }
    
    .menu-semaine { 
      background: linear-gradient(135deg, rgba(201,169,110,0.08) 0%, rgba(201,169,110,0.02) 100%);
      border: 1px solid rgba(201,169,110,0.3);
      padding: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px;
      border-radius: 4px;
    }
    .semaine-prices p { font-size: 1.05rem; letter-spacing: 0.05em; color: var(--blanc-casse); margin-bottom: 16px; font-family: 'Barlow Condensed', sans-serif; font-weight: 500; }
    .semaine-prices .notice { margin-top: 30px; font-size: 0.78rem; color: var(--texte-gris); font-style: italic; line-height: 1.4; }
    .semaine-plats { display: flex; flex-direction: column; gap: 30px; }
    .semaine-step-label { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--or); font-weight: 700; margin-bottom: 6px; }
    .semaine-step-plat { font-size: 1.1rem; color: var(--blanc-casse); font-family: 'Barlow Condensed', sans-serif; font-weight: 400; letter-spacing: 0.02em; }
    .semaine-step-plat span.ou { font-size: 0.8rem; color: var(--texte-gris); margin: 6px 0; display: block; font-family: 'Barlow', sans-serif; }

    .menu-agapes {
      background: rgba(0, 43, 60, 0.4);
      border-top: 1px solid rgba(184,196,208,0.1);
      border-bottom: 1px solid rgba(184,196,208,0.1);
      padding: 60px 40px; text-align: center;
      position: relative;
    }
    .agapes-header { margin-bottom: 50px; }
    .agapes-title { font-family: 'Barlow Condensed', sans-serif; font-size: 2.8rem; font-weight: 700; color: var(--or); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px; }
    .agapes-steplist { display: flex; flex-direction: column; gap: 26px; margin-bottom: 50px; }
    .agapes-step-title { font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--blanc-casse); font-weight: 600; margin-bottom: 4px; }
    .agapes-step-desc { font-size: 0.95rem; color: var(--texte-gris); font-style: italic; font-family: 'Cormorant Garamond', serif; }
    .agapes-price { font-size: 1.4rem; color: var(--or); font-family: 'Barlow Condensed', sans-serif; letter-spacing: 0.05em; margin-bottom: 40px; }
    .agapes-accords { border-top: 1px dashed rgba(201,169,110,0.3); padding-top: 40px; max-width: 500px; margin: 0 auto; }
    .agapes-accords-title { font-size: 0.75rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--or); margin-bottom: 24px; font-weight: 600; }
    .accord-row { display: flex; justify-content: space-between; align-items: baseline; font-size: 0.9rem; color: var(--argent); margin-bottom: 12px; }
    .accord-row span.glasses { font-size: 0.75rem; color: var(--texte-gris); font-style: italic; }

    .menu-rossini {
      background: transparent;
      padding: 40px 0; text-align: center;
    }
    .rossini-header { margin-bottom: 40px; }
    .rossini-title { font-family: 'Barlow Condensed', sans-serif; font-size: 2.4rem; font-weight: 700; color: var(--blanc-casse); letter-spacing: 0.05em; text-transform: uppercase; }
    .rossini-subtitle { font-size: 0.8rem; letter-spacing: 0.25em; color: var(--or); text-transform: uppercase; margin-bottom: 8px; font-weight: 600; }
    .rossini-options { display: flex; justify-content: center; gap: 40px; margin-bottom: 50px; }
    .rossini-box { border: 1px solid rgba(201,169,110,0.5); padding: 30px 40px; background: rgba(0, 43, 60, 0.6); position: relative; }
    .rossini-box::after { content: ''; position: absolute; inset: 6px; border: 1px solid rgba(201,169,110,0.15); pointer-events: none; }
    .rbox-title { font-size: 0.65rem; color: var(--or); letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700; margin-bottom: 16px; }
    .rbox-item { font-size: 0.9rem; color: var(--blanc-casse); margin: 8px 0; font-family: 'Barlow Condensed', sans-serif; letter-spacing: 0.05em; text-transform: uppercase; }
    .rbox-separator { margin: 10px auto; width: 20px; height: 1px; background: rgba(201,169,110,0.4); }
    .rbox-price { font-size: 1.1rem; color: var(--or); margin-top: 16px; font-weight: 500; }
    
    .rossini-choices { display: flex; flex-direction: column; gap: 40px; max-width: 600px; margin: 0 auto; }
    .choice-group { border-top: 1px solid rgba(184,196,208,0.1); padding-top: 24px; }
    .choice-label { font-size: 0.7rem; color: var(--blanc-casse); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 16px; font-weight: 600; }
    .choice-items { display: flex; justify-content: center; flex-wrap: wrap; gap: 20px 40px; }
    .c-item { font-size: 0.85rem; color: var(--texte-gris); position: relative; padding-left: 16px; }
    .c-item::before { content: '◇'; position: absolute; left: 0; top: 0; color: var(--or); font-size: 0.8rem; }
`;

// Insert the CSS right before /* FOOTER */
content = content.replace('    /* FOOTER */', customCSS + '\n\n    /* FOOTER */');

// Also update the media query limits for the custom elements
const mediaQueryAdd = `
      .menu-semaine { grid-template-columns: 1fr; gap: 40px; padding: 30px 20px; }
      .rossini-options { flex-direction: column; gap: 20px; }
      .agapes-accords { padding-left: 20px; padding-right: 20px; }
      .menu-agapes { padding: 50px 20px; }
`;
// add inside @media (max-width: 900px) block
content = content.replace('.menu-tab { padding: 16px 20px; white-space: nowrap; }', '.menu-tab { padding: 16px 20px; white-space: nowrap; }' + mediaQueryAdd);


// The HTML replace: we replace <div class="formule-box"></div> with our massive layout
const customHTML = `
      <div class="custom-formule-wrapper">
        
        <!-- MENU DE LA SEMAINE -->
        <div class="menu-semaine">
           <div class="semaine-prices">
             <div style="margin-bottom: 30px;">
               <h3 style="font-family: 'Barlow Condensed', sans-serif; font-size: 2rem; color: var(--or); margin-bottom: 20px; letter-spacing: 0.05em; text-transform: uppercase;">Menu de la semaine</h3>
               <p>Entrée + Plat + Dessert = CHF 40.—</p>
               <p>Entrée + Plat = CHF 35.—</p>
               <p>Plat + Dessert = CHF 35.—</p>
               <p>Plat du jour = CHF 25.—</p>
             </div>
             <div class="notice">
               L'AGAPE collabore dès à présent avec les potagers de Gaïa situés à Hermance. Les fruits et légumes présents dans la majorité de vos mets proviennent des récoltes d'Hugo.<br><br>
               Celui-ci prône, dans son potager, une culture de la terre de manière naturelle et durable, sans aucun ajout de produit chimique et selon les principes de l'agriculture biologique.<br><br>
               Les potagers de Gaïa<br>
               Route d'Hermance, 527
             </div>
           </div>
           <div class="semaine-plats">
             <div>
               <p class="semaine-step-label">Entrée</p>
               <p class="semaine-step-plat">Flan aux champignons</p>
             </div>
             <div>
               <p class="semaine-step-label">Plat</p>
               <p class="semaine-step-plat">Suprême de volaille et gratin de pommes de terre</p>
             </div>
             <div>
               <p class="semaine-step-label">Dessert</p>
               <p class="semaine-step-plat">Mousse au chocolat<span class="ou">OU</span>Assiette de fromages</p>
             </div>
           </div>
        </div>

        <!-- MENU DES AGAPES -->
        <div class="menu-agapes">
          <div class="agapes-header">
            <h3 class="agapes-title">Le Menu des Agapes</h3>
            <p style="font-size: 0.85rem; color: var(--texte-gris); letter-spacing: 0.1em; text-transform: uppercase;">Menu proposé uniquement le soir et servi à toute la table</p>
          </div>
          
          <div class="agapes-steplist">
            <div>
              <p class="agapes-step-title">Amuse Bouche</p>
              <p class="agapes-step-desc">Tartelette fenouil &amp; seiche à la vanille</p>
            </div>
            <div>
              <p class="agapes-step-title">Entrée</p>
              <p class="agapes-step-desc">Asperge verte et pamplemousse, œuf parfait à la moutarde violette</p>
            </div>
            <div>
              <p class="agapes-step-title">Poisson</p>
              <p class="agapes-step-desc">Saumon fumé en bouillon umami et rhubarbe confite</p>
            </div>
            <div>
              <p class="agapes-step-title">Viande</p>
              <p class="agapes-step-desc">Épaule d'agneau confite, cassolette de févettes aux fruits secs et vadouvan, tuile de seigle</p>
            </div>
            <div>
              <p class="agapes-step-title">Fromage</p>
              <p class="agapes-step-desc">Épaule d'agneau confite, cassolette de févettes aux fruits secs et vadouvan, tuile de seigle</p>
            </div>
            <div>
              <p class="agapes-step-title">Dessert</p>
              <p class="agapes-step-desc">Tartelette rhubarbe, meringue déstructurée</p>
            </div>
            <div>
              <p class="agapes-step-title">Mignardises</p>
              <p class="agapes-step-desc">Macarons</p>
            </div>
          </div>
          
          <p class="agapes-price">89.—</p>
          
          <div class="agapes-accords">
            <p class="agapes-accords-title">Accords mets &amp; boissons</p>
            <div class="accord-row">
              <div style="text-align: left;">Sauvignon blanc<br>Pinot noir</div>
              <div style="text-align: right;"><span class="glasses">2 verres pour</span> CHF 23.—</div>
            </div>
            <div class="accord-row">
              <div style="text-align: left;">Sauvignon blanc<br>Vermentino<br>Pinot noir<br>Batabata-cha et yuzu</div>
              <div style="text-align: right;"><span class="glasses">4 verres pour</span> CHF 45.—</div>
            </div>
          </div>
        </div>

        <!-- ROSSINI -->
        <div class="menu-rossini">
          <div class="rossini-header">
            <p class="rossini-subtitle">L'incontournable</p>
            <h3 class="rossini-title">Bœuf Façon Rossini au Chariot</h3>
          </div>
          
          <div class="rossini-options">
            <div class="rossini-box">
              <p class="rbox-title">Le Menu</p>
              <p class="rbox-item">L'Entrée du Chef</p>
              <div class="rbox-separator"></div>
              <p class="rbox-item">Filet de bœuf<br>façon Rossini (150g)</p>
              <div class="rbox-separator"></div>
              <p class="rbox-item">Dessert au choix</p>
              <p class="rbox-price">79.—</p>
            </div>
            <div class="rossini-box" style="display: flex; flex-direction: column; justify-content: center;">
              <p class="rbox-item" style="margin-bottom: 20px;">Filet de bœuf<br>façon Rossini (150g)</p>
              <p class="rbox-price">54.—</p>
            </div>
          </div>
          
          <div class="rossini-choices">
            <div class="choice-group">
              <p class="choice-label">Choisissez le Foie Gras</p>
              <div class="choice-items">
                <span class="c-item">Foie gras des Landes au vin jaune</span>
                <span class="c-item">Foie gras poêlé</span>
              </div>
            </div>
            <div class="choice-group">
              <p class="choice-label">Choisissez votre Sauce</p>
              <div class="choice-items">
                <span class="c-item">Sauce Morilles</span>
                <span class="c-item">Sauce Madère</span>
                <span class="c-item">Sauce 5 Poivres</span>
              </div>
            </div>
            <div class="choice-group">
              <p class="choice-label">Choisissez votre Garniture</p>
              <div class="choice-items">
                <span class="c-item">Siphon pomme de terre au sel fumé</span>
                <span class="c-item">Grenaille rôties au poivre rouge</span>
              </div>
            </div>
          </div>
        </div>

      </div>
`;
content = content.replace('<div class="formule-box"></div>', customHTML);

// Also comment out renderFormules dynamically generating form objects
content = content.replace('renderFormules(data.formules || []);', '// renderFormules(data.formules || []); // Remplacé par le design sur mesure');

fs.writeFileSync(filepath, content, 'utf8');
