// POST /api/seed — initialise KV avec les données de départ
// À appeler une seule fois après avoir lié la KV store au projet
import { kvGet, kvSet } from './_redis.js'

const CARTE = {
  "formules": [
    { "id": "f1", "label": "Formule déjeuner", "nom": "Le Menu du Marché", "detail": "Entrée + Plat ou Plat + Dessert", "prix": "42", "ordre": 1 },
    { "id": "f2", "label": "Formule déjeuner", "nom": "Le Menu Complet", "detail": "Entrée + Plat + Dessert", "prix": "58", "ordre": 2 },
    { "id": "f3", "label": "Formule dîner", "nom": "Menu Bistronomique", "detail": "3 services au choix de la carte", "prix": "72", "ordre": 3 },
    { "id": "f4", "label": "Formule dîner", "nom": "Menu Dégustation", "detail": "5 services — carte blanche au chef", "prix": "98", "ordre": 4 }
  ],
  "plats": [
    { "id": "e1", "categorie": "entrees", "nom": "Terrine de foie gras maison", "description": "Chutney de figues, brioche toastée au beurre noisette", "prix": "26", "ordre": 1, "actif": true },
    { "id": "e2", "categorie": "entrees", "nom": "Saint-Jacques poêlées", "description": "Velouté de topinambour fumé, huile de truffe noire, noisettes torréfiées", "prix": "32", "ordre": 2, "actif": true },
    { "id": "e3", "categorie": "entrees", "nom": "Soupe à l'oignon gratinée", "description": "Bouillon de bœuf maison, croûton, gruyère AOP vieux fondu", "prix": "18", "ordre": 3, "actif": true },
    { "id": "e4", "categorie": "entrees", "nom": "Œuf parfait basse température", "description": "Crème de cèpes, lardons fumés, pain de seigle grillé", "prix": "22", "ordre": 4, "actif": true },
    { "id": "e5", "categorie": "entrees", "nom": "Salade de homard breton", "description": "Avocat, pamplemousse rose, vinaigrette à l'estragon", "prix": "38", "ordre": 5, "actif": true },
    { "id": "e6", "categorie": "entrees", "nom": "Burrata di bufala", "description": "Tomates confites, basilic, huile d'olive vierge extra, fleur de sel", "prix": "20", "ordre": 6, "actif": true },
    { "id": "p1", "categorie": "plats", "nom": "Filet de bœuf Rossini", "description": "Escalope de foie gras poêlée, sauce Périgueux, pommes sarladaises", "prix": "58", "ordre": 1, "actif": true },
    { "id": "p2", "categorie": "plats", "nom": "Turbot sauvage rôti à l'arête", "description": "Écrasé de pommes de terre à la ciboule, beurre blanc aux agrumes", "prix": "52", "ordre": 2, "actif": true },
    { "id": "p3", "categorie": "plats", "nom": "Ris de veau aux morilles", "description": "Jus corsé à la crème, purée truffée, pousses de saison", "prix": "48", "ordre": 3, "actif": true },
    { "id": "p4", "categorie": "plats", "nom": "Canard à l'orange façon L'AGAPE", "description": "Magret rosé, sauce Grand Marnier, gratin dauphinois, orange confite", "prix": "44", "ordre": 4, "actif": true },
    { "id": "p5", "categorie": "plats", "nom": "Dos de cabillaud meunière", "description": "Beurre noisette aux câpres, légumes glacés du marché", "prix": "40", "ordre": 5, "actif": true },
    { "id": "p6", "categorie": "plats", "nom": "Risotto de saison (végétarien)", "description": "Parmesan 24 mois, champignons sauvages, huile de truffe blanche", "prix": "36", "ordre": 6, "actif": true },
    { "id": "d1", "categorie": "desserts", "nom": "Soufflé au Grand Marnier", "description": "Crème anglaise à la vanille Bourbon, zestes d'orange confits", "prix": "18", "ordre": 1, "actif": true },
    { "id": "d2", "categorie": "desserts", "nom": "Millefeuille à la vanille de Madagascar", "description": "Pâte feuilletée caramélisée, crème légère, sucre glace", "prix": "16", "ordre": 2, "actif": true },
    { "id": "d3", "categorie": "desserts", "nom": "Tarte tatin revisitée", "description": "Pommes caramélisées, crème normande, glace Calvados", "prix": "15", "ordre": 3, "actif": true },
    { "id": "d4", "categorie": "desserts", "nom": "Mousse au chocolat Valrhona", "description": "Guanaja 70%, tuile craquante, fleur de sel", "prix": "14", "ordre": 4, "actif": true },
    { "id": "d5", "categorie": "desserts", "nom": "Sélection de fromages affinés", "description": "Plateau du fromager, confiture maison, pain de campagne", "prix": "22", "ordre": 5, "actif": true },
    { "id": "d6", "categorie": "desserts", "nom": "Mignardises & petits fours", "description": "Assortiment de la maison, servi avec le café", "prix": "10", "ordre": 6, "actif": true }
  ],
  "vins": [
    { "id": "v1", "categorieVin": "blancs", "nom": "Domaine Chèvre d'Or — Chablis Premier Cru", "region": "Bourgogne, France · 2022", "prixVerre": "16", "prixBouteille": "72", "ordre": 1 },
    { "id": "v2", "categorieVin": "blancs", "nom": "Domaine Weinbach — Riesling Réserve", "region": "Alsace, France · 2021", "prixVerre": "14", "prixBouteille": "64", "ordre": 2 },
    { "id": "v3", "categorieVin": "blancs", "nom": "Châtelain Biollaz — Fendant du Valais", "region": "Valais, Suisse · 2023", "prixVerre": "12", "prixBouteille": "52", "ordre": 3 },
    { "id": "v4", "categorieVin": "rouges", "nom": "Château Léoville Barton — Saint-Julien", "region": "Bordeaux, France · 2018", "prixVerre": "22", "prixBouteille": "120", "ordre": 1 },
    { "id": "v5", "categorieVin": "rouges", "nom": "Domaine Faiveley — Gevrey-Chambertin", "region": "Bourgogne, France · 2020", "prixVerre": "20", "prixBouteille": "95", "ordre": 2 },
    { "id": "v6", "categorieVin": "rouges", "nom": "Adrian & Diego Mathier — Cornalin", "region": "Valais, Suisse · 2022", "prixVerre": "14", "prixBouteille": "58", "ordre": 3 },
    { "id": "v7", "categorieVin": "champagnes", "nom": "Billecart-Salmon — Brut Réserve", "region": "Champagne, France · NM", "prixVerre": "24", "prixBouteille": "115", "ordre": 1 },
    { "id": "v8", "categorieVin": "champagnes", "nom": "Louis Roederer — Cristal Brut", "region": "Champagne, France · 2016", "prixVerre": null, "prixBouteille": "320", "ordre": 2 }
  ]
}

const GALERIE = {
  "photos": [
    { "id": "g1", "url": null, "caption": "La salle du restaurant", "categorie": "ambiance", "ordre": 1, "createdAt": "2026-03-01T10:00:00Z" },
    { "id": "g2", "url": null, "caption": "Saint-Jacques poêlées", "categorie": "plats", "ordre": 2, "createdAt": "2026-03-01T10:00:00Z" },
    { "id": "g3", "url": null, "caption": "Le dressage de l'assiette", "categorie": "cuisine", "ordre": 3, "createdAt": "2026-03-01T10:00:00Z" },
    { "id": "g4", "url": null, "caption": "Filet de bœuf Rossini", "categorie": "plats", "ordre": 4, "createdAt": "2026-03-01T10:00:00Z" },
    { "id": "g5", "url": null, "caption": "Table pour deux", "categorie": "ambiance", "ordre": 5, "createdAt": "2026-03-01T10:00:00Z" },
    { "id": "g6", "url": null, "caption": "La brigade en action", "categorie": "equipe", "ordre": 6, "createdAt": "2026-03-01T10:00:00Z" },
    { "id": "g7", "url": null, "caption": "Millefeuille à la vanille", "categorie": "plats", "ordre": 7, "createdAt": "2026-03-01T10:00:00Z" },
    { "id": "g8", "url": null, "caption": "Notre cave à vins", "categorie": "ambiance", "ordre": 8, "createdAt": "2026-03-01T10:00:00Z" },
    { "id": "g9", "url": null, "caption": "La mise en place du matin", "categorie": "cuisine", "ordre": 9, "createdAt": "2026-03-01T10:00:00Z" },
    { "id": "g10", "url": null, "caption": "Plateau de fromages affinés", "categorie": "plats", "ordre": 10, "createdAt": "2026-03-01T10:00:00Z" },
    { "id": "g11", "url": null, "caption": "Le service en salle", "categorie": "equipe", "ordre": 11, "createdAt": "2026-03-01T10:00:00Z" },
    { "id": "g12", "url": null, "caption": "Soirée privée", "categorie": "ambiance", "ordre": 12, "createdAt": "2026-03-01T10:00:00Z" }
  ]
}

const BLOG = { articles: [] }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })

  try {
    const existing = await kvGet('carte')
    if (existing) return res.json({ message: 'KV déjà initialisé — aucune action.' })

    await Promise.all([
      kvSet('carte', CARTE),
      kvSet('galerie', GALERIE),
      kvSet('blog', BLOG),
    ])
    res.json({ success: true, message: 'KV initialisé avec les données de départ.' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
