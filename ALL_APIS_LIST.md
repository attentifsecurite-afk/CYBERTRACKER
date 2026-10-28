# 📋 Liste Complète des APIs Intégrées

## 🔐 Toutes les APIs Configurées dans .env

### 1. Brave Search API
```env
VITE_BRAVE_API_KEY=BSAq1DN5k0fnKRNudkcPittnCR0SuMV
```
**Utilisation** : Recherche de menaces cyber en temps réel  
**Documentation** : https://brave.com/search/api/  
**Pages** : Renseignement, Feed de menaces

---

### 2. Google Maps API
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBZpFbAwSwce9SSxC_CingLRtc_iHqVrvU
```
**Utilisation** : Cartes interactives (fallback vers MapLibre GL)  
**Documentation** : https://developers.google.com/maps  
**Pages** : Carte Monde, Maps Scanner

---

### 3. Scraper API (2 clés pour rotation)
```env
VITE_SCRAPER_API_KEY_1=scraper_api_01M5HK1M69BJ6TV4EZSJP5446T
VITE_SCRAPER_API_KEY_2=scraper_api_01M5HK4MWPJ9S6AAYGKQMGTYZZ
```
**Utilisation** : Web scraping avec rotation automatique  
**Documentation** : Service de scraping personnalisé  
**Pages** : Web Scraper

---

### 4. Aviationstack API
```env
VITE_AVIASTACK_API_KEY=b90d2522fa544eed164f4dc91fbad42f
```
**Utilisation** : Surveillance aérienne en temps réel  
**Documentation** : https://aviationstack.com/documentation  
**Pages** : Aviation  
**Fonctionnalités** :
- Vols en temps réel
- Position GPS live
- Informations aéroports
- Compagnies aériennes

---

### 5. IPstack API
```env
VITE_IPSTACK_API_KEY=b90d2522fa544eed164f4dc91fbad42f
```
**Utilisation** : Géolocalisation d'adresses IP  
**Documentation** : https://ipstack.com/documentation  
**Pages** : IP Tracker  
**Fonctionnalités** :
- Géolocalisation IP
- Détection proxy/VPN/Tor
- Informations FAI
- Données de sécurité

---

## 🔒 Sécurité des Clés

### Fichier .env
- ✅ Toutes les clés sont dans `.env`
- ✅ `.env` est ignoré par Git (`.gitignore`)
- ✅ Jamais commité sur GitHub

### Fichier .env.encrypted
- ✅ Version chiffrée des clés
- ✅ Peut être commité sur GitHub
- ✅ Chiffrement AES-256-GCM
- ✅ Généré via `node scripts/encrypt-config.js`

### Fichier .env.example
- ✅ Template avec placeholders
- ✅ Peut être commité
- ✅ Sert de référence

---

## 📊 Résumé des APIs

| API | Clé | Utilisation | Plan |
|-----|-----|-------------|------|
| Brave Search | `VITE_BRAVE_API_KEY` | Recherche menaces | Gratuit (2000 req/mois) |
| Google Maps | `VITE_GOOGLE_MAPS_API_KEY` | Cartes | $200 crédit/mois |
| Scraper API 1 | `VITE_SCRAPER_API_KEY_1` | Web scraping | Rotation |
| Scraper API 2 | `VITE_SCRAPER_API_KEY_2` | Web scraping | Rotation |
| Aviationstack | `VITE_AVIASTACK_API_KEY` | Surveillance aérienne | Basic (100 req/mois) |
| IPstack | `VITE_IPSTACK_API_KEY` | Géolocalisation IP | Basic (100 req/mois) |

---

## 🚀 Pages Utilisant les APIs

### 1. Dashboard
- Brave Search API (feed de menaces)
- Google Maps / MapLibre GL (carte)

### 2. Menaces
- Brave Search API (recherche)
- Google Maps / MapLibre GL (visualisation)

### 3. Carte Monde
- Google Maps / MapLibre GL (carte interactive)
- IPstack API (géolocalisation)

### 4. IP Tracker
- IPstack API (géolocalisation IP)
- MapLibre GL (carte)

### 5. Aviation
- Aviationstack API (vols en temps réel)
- MapLibre GL (carte)

### 6. Maps Scanner
- Google Maps API (Places)
- MapLibre GL (fallback)

### 7. Web Scraper
- Scraper API (rotation entre 2 clés)

### 8. Réseau
- Données simulées (pas d'API externe)

### 9. VPN/Tor
- IPstack API (vérification proxy/Tor)

### 10. SEO/AEO
- Données simulées (pas d'API externe)

### 11. Renseignement
- Brave Search API (feed)

---

## 🔧 Scripts de Gestion

### Chiffrement
```bash
# Chiffrer .env → .env.encrypted
node scripts/encrypt-config.js

# Déchiffrer .env.encrypted → .env.local
node scripts/decrypt-config.js

# Configuration interactive
node scripts/secure-setup.js
```

### Vérification
```bash
# Vérifier que .env est ignoré
git status

# Scanner pour détecter des secrets
gitleaks detect --source . --verbose
```

---

## 📝 Notes Importantes

### Limites d'Utilisation
- **Brave Search** : 2000 requêtes/mois (gratuit)
- **Google Maps** : $200 crédit/mois
- **Aviationstack** : 100 requêtes/mois (basic)
- **IPstack** : 100 requêtes/mois (basic)
- **Scraper API** : Selon le plan

### Bonnes Pratiques
1. ✅ Utiliser le cache quand possible
2. ✅ Espacer les requêtes (30s minimum)
3. ✅ Rotation des clés Scraper API
4. ✅ Surveiller l'utilisation
5. ✅ Ne jamais committer `.env`

### Sécurité
1. ✅ Clés dans `.env` (ignoré par Git)
2. ✅ Version chiffrée dans `.env.encrypted`
3. ✅ Clé maître pour chiffrement
4. ✅ Rotation régulière des clés
5. ✅ Surveillance des accès

---

## 🎯 Configuration Requise

### Fichier .env
```env
# Brave Search API
VITE_BRAVE_API_KEY=BSAq1DN5k0fnKRNudkcPittnCR0SuMV

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBZpFbAwSwce9SSxC_CingLRtc_iHqVrvU

# Scraper API Keys (2 clés pour rotation automatique)
VITE_SCRAPER_API_KEY_1=scraper_api_01M5HK1M69BJ6TV4EZSJP5446T
VITE_SCRAPER_API_KEY_2=scraper_api_01M5HK4MWPJ9S6AAYGKQMGTYZZ

# Aviationstack API (Surveillance aérienne)
VITE_AVIASTACK_API_KEY=b90d2522fa544eed164f4dc91fbad42f

# IPstack API (Géolocalisation IP)
VITE_IPSTACK_API_KEY=b90d2522fa544eed164f4dc91fbad42f
```

### Fichier .env.encrypted
```json
{
  "VITE_BRAVE_API_KEY": "chiffré_AES-256-GCM",
  "VITE_GOOGLE_MAPS_API_KEY": "chiffré_AES-256-GCM",
  "VITE_SCRAPER_API_KEY_1": "chiffré_AES-256-GCM",
  "VITE_SCRAPER_API_KEY_2": "chiffré_AES-256-GCM",
  "VITE_AVIASTACK_API_KEY": "chiffré_AES-256-GCM",
  "VITE_IPSTACK_API_KEY": "chiffré_AES-256-GCM"
}
```

---

## ✅ Checklist

- [x] Brave Search API configurée
- [x] Google Maps API configurée
- [x] Scraper API (2 clés) configurées
- [x] Aviationstack API configurée
- [x] IPstack API configurée
- [x] Toutes les clés dans .env
- [x] .env ignoré par Git
- [x] .env.encrypted créé
- [x] Scripts de chiffrement créés
- [x] Documentation complète

---

**Version** : CYBERTRACKER PRO v5.0  
**Statut** : ✅ 5 APIs INTÉGRÉES ET CONFIGURÉES  
**Dernière mise à jour** : 2024
