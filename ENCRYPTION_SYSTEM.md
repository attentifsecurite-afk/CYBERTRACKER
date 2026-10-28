# 🔐 Système de Chiffrement des APIs

## 📋 Vue d'ensemble

CYBERTRACKER PRO intègre **5 APIs externes** pour fournir des fonctionnalités avancées de cybersécurité. Toutes les clés API sont **chiffrées avec AES-256-GCM** pour une sécurité maximale.

---

## 🔑 APIs Configurées

### 1. Brave Search API
- **Clé** : `VITE_BRAVE_API_KEY`
- **Utilisation** : Recherche de menaces cyber en temps réel
- **Documentation** : https://brave.com/search/api/
- **Pages** : Renseignement, Feed de menaces
- **Limites** : 2000 requêtes/mois (gratuit)

### 2. Google Maps API
- **Clé** : `VITE_GOOGLE_MAPS_API_KEY`
- **Utilisation** : Cartes interactives (fallback vers MapLibre GL)
- **Documentation** : https://developers.google.com/maps
- **Pages** : Carte Monde, Maps Scanner
- **Limites** : $200 crédit/mois

### 3. Scraper API (2 clés pour rotation)
- **Clés** : `VITE_SCRAPER_API_KEY_1`, `VITE_SCRAPER_API_KEY_2`
- **Utilisation** : Web scraping avec rotation automatique
- **Pages** : Web Scraper
- **Avantage** : Rotation entre 2 clés pour éviter les limites

### 4. Aviationstack API
- **Clé** : `VITE_AVIASTACK_API_KEY`
- **Utilisation** : Surveillance aérienne en temps réel
- **Documentation** : https://aviationstack.com/documentation
- **Pages** : Aviation
- **Fonctionnalités** :
  - Vols en temps réel
  - Position GPS live
  - Informations aéroports
  - Compagnies aériennes
- **Limites** : 100 requêtes/mois (basic)

### 5. IPstack API
- **Clé** : `VITE_IPSTACK_API_KEY`
- **Utilisation** : Géolocalisation d'adresses IP
- **Documentation** : https://ipstack.com/documentation
- **Pages** : IP Tracker
- **Fonctionnalités** :
  - Géolocalisation IP
  - Détection proxy/VPN/Tor
  - Informations FAI
  - Données de sécurité
- **Limites** : 100 requêtes/mois (basic)

---

## 🔒 Système de Chiffrement

### Algorithme
- **Algorithme** : AES-256-GCM (Advanced Encryption Standard)
- **Taille de clé** : 256 bits
- **Mode** : GCM (Galois/Counter Mode)
- **Authentification** : Oui (AuthTag)
- **IV** : 16 bytes aléatoires par chiffrement

### Format de Chiffrement
```
iv_hex:authTag_hex:encryptedData_hex
```

### Clé Maître
- **Variable** : `CYBERTRACKER_MASTER_KEY`
- **Défaut** : `cybertracker-pro-default-key-2024-32chars!`
- **Recommandation** : Utiliser une clé personnalisée de 32+ caractères
- **Stockage** : Coffre-fort de secrets (jamais dans le code)

---

## 📁 Fichiers de Configuration

### .env (Non commité)
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

**Statut** : ❌ Ignoré par Git (jamais commité)

### .env.encrypted (Commité)
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

**Statut** : ✅ Peut être commité sur GitHub

### .env.example (Commité)
```env
# Template avec placeholders
VITE_BRAVE_API_KEY=votre_cle_brave_ici
VITE_GOOGLE_MAPS_API_KEY=votre_cle_google_maps_ici
VITE_SCRAPER_API_KEY_1=votre_cle_scraper_1_ici
VITE_SCRAPER_API_KEY_2=votre_cle_scraper_2_ici
VITE_AVIASTACK_API_KEY=votre_cle_aviationstack_ici
VITE_IPSTACK_API_KEY=votre_cle_ipstack_ici
```

**Statut** : ✅ Peut être commité (référence)

---

## 🚀 Scripts de Gestion

### 1. Chiffrer toutes les APIs
```bash
node scripts/encrypt-all-apis.js
```

**Action** :
- Lit `.env`
- Chiffre chaque clé avec AES-256-GCM
- Sauvegarde dans `.env.encrypted`

### 2. Déchiffrer toutes les APIs
```bash
node scripts/decrypt-all-apis.js
```

**Action** :
- Lit `.env.encrypted`
- Déchiffre chaque clé
- Sauvegarde dans `.env`

### 3. Configuration interactive
```bash
node scripts/secure-setup.js
```

**Action** :
- Demande les clés API interactivement
- Crée `.env` et `.env.encrypted` automatiquement

---

## 🔄 Workflow de Développement

### Première Installation
```bash
# 1. Cloner le repository
git clone https://github.com/votre-username/cybertracker-pro.git
cd cybertracker-pro

# 2. Installer les dépendances
npm install

# 3. Configurer les clés (option A : interactive)
node scripts/secure-setup.js

# OU (option B : manuelle)
nano .env
# Ajouter vos clés API

# 4. Chiffrer les clés
node scripts/encrypt-all-apis.js

# 5. Lancer l'application
npm run dev
```

### Après un Clone
```bash
# 1. Cloner
git clone ...
cd cybertracker-pro

# 2. Installer
npm install

# 3. Définir la clé maître (si personnalisée)
export CYBERTRACKER_MASTER_KEY="votre-clé-secrète"

# 4. Déchiffrer les clés
node scripts/decrypt-all-apis.js

# 5. Lancer
npm run dev
```

### Modification des Clés
```bash
# 1. Modifier .env
nano .env

# 2. Régénérer le fichier chiffré
node scripts/encrypt-all-apis.js

# 3. Commiter
git add .env.encrypted
git commit -m "update: encrypted API keys"
git push
```

---

## 🛡️ Sécurité

### Ce qui est Protégé
- ✅ Toutes les clés API (6 au total)
- ✅ Chiffrement AES-256-GCM (standard militaire)
- ✅ Authentification des données (AuthTag)
- ✅ IV aléatoire pour chaque chiffrement
- ✅ Protection contre la falsification

### Ce qui n'est PAS Protégé
- ❌ Noms des variables (VITE_BRAVE_API_KEY, etc.)
- ❌ Structure du fichier JSON
- ❌ Algorithme de chiffrement (public)

### Bonnes Pratiques
1. ✅ Utiliser une clé maître forte (32+ caractères)
2. ✅ Ne jamais committer `.env`
3. ✅ Stocker la clé maître dans un coffre-fort de secrets
4. ✅ Rotation régulière des clés API
5. ✅ Surveillance de l'utilisation des APIs
6. ✅ Vérifier que `.env` est dans `.gitignore`

---

## 📊 Utilisation par Page

| Page | APIs Utilisées |
|------|----------------|
| Dashboard | Brave Search, Google Maps/MapLibre |
| Menaces | Brave Search, Google Maps/MapLibre |
| Carte Monde | Google Maps/MapLibre, IPstack |
| IP Tracker | IPstack, MapLibre |
| Aviation | Aviationstack, MapLibre |
| Maps Scanner | Google Maps, MapLibre |
| Web Scraper | Scraper API (rotation) |
| Réseau | Données simulées |
| VPN/Tor | IPstack |
| SEO/AEO | Données simulées |
| Renseignement | Brave Search |

---

## 📈 Limites et Quotas

### Brave Search API
- **Plan** : Gratuit
- **Limite** : 2000 requêtes/mois
- **Recommandation** : Cache les résultats, espacer les requêtes

### Google Maps API
- **Plan** : $200 crédit/mois
- **Limite** : Selon l'utilisation
- **Recommandation** : Utiliser MapLibre GL en fallback

### Scraper API
- **Plan** : Selon le service
- **Limite** : Rotation entre 2 clés
- **Recommandation** : Espacer les requêtes (1-2s)

### Aviationstack API
- **Plan** : Basic (gratuit)
- **Limite** : 100 requêtes/mois
- **Recommandation** : Rafraîchir toutes les 30s minimum

### IPstack API
- **Plan** : Basic (gratuit)
- **Limite** : 100 requêtes/mois
- **Recommandation** : Cache les résultats de géolocalisation

---

## 🔍 Vérification

### Vérifier que .env est ignoré
```bash
git status
# .env ne doit PAS apparaître
```

### Vérifier que .env.encrypted est commité
```bash
git ls-files | grep encrypted
# Doit afficher : .env.encrypted
```

### Scanner pour détecter des secrets
```bash
# Installer GitLeaks
brew install gitleaks  # macOS

# Scanner
gitleaks detect --source . --verbose
# Aucun secret détecté
```

---

## 🚨 Dépannage

### Erreur : "Fichier .env introuvable"
```bash
# Créer le fichier
nano .env
# Ajouter vos clés API
```

### Erreur : "Clé maître incorrecte"
```bash
# Définir la clé maître
export CYBERTRACKER_MASTER_KEY="votre-clé-secrète-32-caractères"
```

### Erreur : "Format de chiffrement invalide"
```bash
# Régénérer le fichier chiffré
node scripts/encrypt-all-apis.js
```

### Erreur : "API non configurée"
```bash
# Vérifier que la clé est dans .env
cat .env | grep VITE_

# Vérifier que .env est lu par Vite
npm run dev
# Consulter la console pour les erreurs
```

---

## 📚 Documentation Complète

- **ALL_APIS_LIST.md** : Liste complète des APIs
- **AVIASTACK_INTEGRATION.md** : Intégration Aviationstack
- **SECURE_CONFIG_SYSTEM.md** : Système de configuration sécurisé
- **SECURITY.md** : Guide de sécurité complet
- **scripts/README.md** : Documentation des scripts

---

## ✅ Checklist

- [x] 5 APIs configurées dans .env
- [x] .env ignoré par Git
- [x] .env.encrypted créé
- [x] Scripts de chiffrement/déchiffrement créés
- [x] Clé maître configurable
- [x] Documentation complète
- [x] Bonnes pratiques documentées

---

## 🎯 Résumé

**CYBERTRACKER PRO intègre 5 APIs :**
1. ✅ Brave Search API (recherche menaces)
2. ✅ Google Maps API (cartes)
3. ✅ Scraper API (2 clés, web scraping)
4. ✅ Aviationstack API (surveillance aérienne)
5. ✅ IPstack API (géolocalisation IP)

**Sécurité :**
- ✅ Toutes les clés chiffrées avec AES-256-GCM
- ✅ .env ignoré par Git
- ✅ .env.encrypted commité
- ✅ Scripts de gestion sécurisés
- ✅ Documentation complète

---

**Version** : CYBERTRACKER PRO v5.0  
**Statut** : ✅ 5 APIs INTÉGRÉES ET CHIFFRÉES  
**Dernière mise à jour** : 2024
