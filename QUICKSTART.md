# 🚀 Guide de Démarrage Rapide - CYBERTRACKER PRO

## ⚡ Installation en 3 étapes

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/votre-username/cybertracker-pro.git
cd cybertracker-pro
```

### 2️⃣ Installer les dépendances

```bash
npm install
```

### 3️⃣ Configurer les clés API

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec vos clés
nano .env  # ou votre éditeur préféré
```

Remplacez les placeholders par vos vraies clés :

```env
VITE_BRAVE_API_KEY=votre_cle_brave_ici
VITE_GOOGLE_MAPS_API_KEY=votre_cle_google_maps_ici
VITE_SCRAPER_API_KEY_1=votre_premiere_cle_scraper_ici
VITE_SCRAPER_API_KEY_2=votre_deuxieme_cle_scraper_ici
```

### 4️⃣ Lancer l'application

```bash
npm run dev
```

Ouvrez votre navigateur sur `http://localhost:5173`

---

## 🔑 Obtenir les clés API

### Brave Search API
1. Allez sur https://brave.com/search/api/
2. Créez un compte
3. Obtenez votre clé API gratuite (2000 requêtes/mois)
4. Collez-la dans `.env` : `VITE_BRAVE_API_KEY`

### Google Maps API
1. Allez sur https://console.cloud.google.com/
2. Créez un projet ou sélectionnez un projet existant
3. Activez "Maps JavaScript API"
4. Créez une clé API dans "APIs & Services" > "Credentials"
5. **IMPORTANT** : Restreignez la clé par domaine HTTP
6. Collez-la dans `.env` : `VITE_GOOGLE_MAPS_API_KEY`

### Scraper API (2 clés recommandées)
1. Inscrivez-vous sur un service de scraping (ex: ScraperAPI, ZenRows, etc.)
2. Obtenez 2 clés API pour la rotation automatique
3. Collez-les dans `.env` :
   - `VITE_SCRAPER_API_KEY_1`
   - `VITE_SCRAPER_API_KEY_2`

---

## 🔒 Sécurité

### ⚠️ NE JAMAIS FAIRE :
- ❌ Committer `.env` sur GitHub
- ❌ Partager vos clés API
- ❌ Mettre des clés en dur dans le code

### ✅ TOUJOURS FAIRE :
- ✅ Utiliser `.env` pour les clés locales
- ✅ Vérifier que `.env` est dans `.gitignore`
- ✅ Utiliser `.env.example` comme template
- ✅ Restreindre l'accès aux APIs (domaines, IPs)
- ✅ Surveiller l'utilisation de vos clés

### Vérifier que `.env` est ignoré :

```bash
git status
# .env ne doit PAS apparaître dans la liste
```

Si `.env` apparaît :

```bash
git rm --cached .env
git commit -m "security: remove .env from tracking"
```

---

## 📁 Structure du projet

```
cybertracker-pro/
├── .env                    # ❌ VOS CLÉS (ne pas committer)
├── .env.example            # ✅ Template à committer
├── .gitignore              # ✅ Configure pour ignorer .env
├── SECURITY.md             # 📖 Guide de sécurité complet
├── README.md               # 📖 Documentation principale
├── package.json
├── vite.config.ts
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── GoogleMaps.tsx
│   │   └── ThreatFeed.tsx
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── ThreatsPage.tsx
│   │   ├── WorldMapPage.tsx
│   │   ├── MapsScraperPage.tsx
│   │   ├── ScraperPage.tsx
│   │   ├── NetworkPage.tsx
│   │   ├── VPNPage.tsx
│   │   ├── SEOPage.tsx
│   │   └── IntelPage.tsx
│   └── services/
│       ├── braveApi.ts
│       ├── realTimeData.ts
│       ├── googleMapsScraper.ts
│       └── scraperService.ts
└── public/
```

---

## 🎯 Fonctionnalités

### 9 Pages Spécialisées

1. **Dashboard** : Vue d'ensemble avec statistiques en temps réel
2. **Menaces** : Centre de commandement des cybermenaces
3. **Carte Monde** : Visualisation géographique des attaques
4. **Maps Scanner** : Scanner de lieux suspects via Google Maps
5. **Web Scraper** : Collecte de menaces depuis le web
6. **Réseau** : Moniteur réseau et détection d'anomalies
7. **VPN/Tor** : Détection de nœuds anonymes
8. **SEO/AEO** : Moteur de déréférencement
9. **Renseignement** : Feed de renseignements cyber

### APIs Intégrées

- 🌐 **Brave Search** : Recherche de menaces en temps réel
- 🗺️ **Google Maps** : Carte interactive avec style cyberpunk
- 📍 **ipapi.co** : Géolocalisation des IPs
- 🕷️ **Scraper API** : Collecte de données web (2 clés en rotation)

---

## 🛠️ Commandes disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement

# Production
npm run build        # Build pour la production
npm run preview      # Prévisualise le build de production

# Linting
npm run lint         # Vérifie le code avec ESLint
```

---

## 🐛 Dépannage

### La carte ne s'affiche pas
- Vérifiez que `VITE_GOOGLE_MAPS_API_KEY` est configurée dans `.env`
- Vérifiez que l'API "Maps JavaScript API" est activée dans Google Cloud
- Vérifiez les restrictions de la clé (domaines autorisés)
- Ouvrez la console (F12) pour voir les erreurs

### Les données ne se chargent pas
- Vérifiez que `VITE_BRAVE_API_KEY` est configurée
- Vérifiez votre quota Brave Search (2000 requêtes/mois gratuit)
- Ouvrez la console (F12) pour voir les erreurs CORS

### Le scraper ne fonctionne pas
- Vérifiez que les deux clés scraper sont configurées
- Vérifiez votre quota sur le service de scraping
- Consultez les logs dans la console

### Erreur CORS
- Vérifiez que vous utilisez les bonnes APIs (pas d'appels REST directs)
- Le projet utilise déjà les bonnes méthodes (PlacesService, ipapi.co)
- Si le problème persiste, ouvrez une issue sur GitHub

---

## 📚 Documentation complète

- [README.md](./README.md) - Documentation principale
- [SECURITY.md](./SECURITY.md) - Guide de sécurité complet
- [SCRAPER_API_INTEGRATION.md](./SCRAPER_API_INTEGRATION.md) - Intégration du scraper
- [GOOGLE_MAPS_SCRAPER.md](./GOOGLE_MAPS_SCRAPER.md) - Maps Scanner
- [FIX_CORS_ISSUE.md](./FIX_CORS_ISSUE.md) - Résolution des problèmes CORS

---

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. **Vérifiez que `.env` n'est pas commité**
4. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
5. Push vers la branche (`git push origin feature/AmazingFeature`)
6. Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](./LICENSE) pour plus de détails.

---

## 🆘 Support

- 📖 Documentation : Voir les fichiers `.md` à la racine
- 🐛 Bugs : Ouvrez une issue sur GitHub
- 💡 Questions : Discussions GitHub
- 🔒 Sécurité : Voir [SECURITY.md](./SECURITY.md)

---

**Développé avec ❤️ pour la cybersécurité**

**Version** : 5.0  
**Dernière mise à jour** : 2024
