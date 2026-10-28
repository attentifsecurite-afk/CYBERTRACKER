# 🛡️ CYBERTRACKER PRO v5.0

> ⚠️ **SÉCURITÉ** : Ne jamais committer les clés API sur GitHub ! Voir [SECURITY.md](./SECURITY.md) pour les bonnes pratiques.

## Système de Lutte Anti-Cybercriminalité - MODE RÉEL ACTIF

Interface de cybersécurité ultra-moderne avec **DONNÉES RÉELLES EN TEMPS RÉEL**. Plus de simulation, que du concret !

---

## 🚀 NOUVEAU : Mode Réel à 100%

### ✅ Ce qui a changé

**AVANT** : Données simulées avec IPs fictives
**MAINTENANT** : Vraies données en temps réel !

- 🌐 **Brave Search API** : Recherche de vraies menaces cyber en temps réel
- 🗺️ **Google Maps API** : Carte interactive avec style cyberpunk
- 📍 **ip-api.com** : Géolocalisation RÉELLE des IPs détectées
- 🔄 **Rafraîchissement automatique** : Toutes les 30 secondes
- 🎯 **IPs réelles** : Extraction et géolocalisation des vraies IPs depuis les résultats

---

## 🔥 Fonctionnalités Principales

### 📊 Dashboard Principal
- **Statistiques en temps réel** : Menaces actives, anomalies, nœuds VPN/Tor, sites déréférencés
- **Carte mondiale Google Maps** : Visualisation des attaques géolocalisées RÉELLES
- **Feed de menaces** : Intégration API Brave Search pour intelligence en temps réel
- **Moniteur réseau** : Paquets/sec, bande passante, connexions, paquets bloqués
- **Console live** : Logs système en temps réel

### 🎯 Menaces
- **Centre de commandement** : Tableau détaillé de toutes les menaces détectées
- **Filtres avancés** : Par sévérité (critique, élevé, moyen, faible) et statut
- **Carte Google Maps** : Visualisation géographique des attaques RÉELLES
- **Détails complets** : IP réelle, port, protocole, source, pays, timestamp

### 🗺️ Carte Monde
- **Google Maps API** : Carte interactive avec style sombre personnalisé
- **Données RÉELLES** : IPs extraites des résultats Brave Search
- **Géolocalisation IP** : Via ip-api.com (gratuit, sans clé)
- **Marqueurs animés** : Points lumineux avec glow effect
- **Popups détaillées** : Clic sur marqueur = IP réelle, ville, pays, coordonnées
- **Rafraîchissement auto** : Toutes les 30 secondes

### 🌐 Réseau
- **Moniteur temps réel** : Paquets, bande passante, connexions, drops
- **Topologie réseau** : Visualisation SVG animée avec flux de données
- **Détection d'anomalies** : Tableau complet avec source, destination, protocole
- **Distribution des protocoles** : TCP, UDP, ICMP, DNS, HTTP, SSH, FTP
- **Règles firewall** : Liste des règles actives avec compteurs

### 🔐 VPN/Tor
- **Détection de nœuds** : 24+ nœuds VPN/Tor/I2P identifiés
- **Filtres par protocole** : OpenVPN, WireGuard, Tor Exit, I2P, SOCKS5, Shadowsocks
- **Cartes détaillées** : IP, pays, protocole, uptime, bande passante, score de risque

### 🕷️ SEO/AEO
- **Moteur de déréférencement** : SEO inverse, AEO (Answer Engine), maillage inverse
- **Sites ciblés** : Tableau avec domaine, type, statut, DA, backlinks, risque
- **Historique des actions** : Signalements Google, DMCA Takedown, blocage DNS

### 📡 Renseignement
- **API Brave Search** : Recherche de menaces en temps réel
- **Catégories** : Temps Réel, Dernières, Dark Web, Malware
- **Barre de recherche** : Recherche personnalisée de menaces, IP, domaines
- **Malware & Exploits** : Emotet, LockBit, Cobalt Strike, Mimikatz
- **Fuites de données** : Entreprises touchées, nombre de records
- **Groupes APT** : APT28, Lazarus, APT41, MuddyWater, FIN7, Sandworm

---

## 🎨 Design Futuriste

### Glassmorphism
- Cartes transparentes avec backdrop-filter blur
- Bordures néon subtiles
- Effets de hover avec glow

### Néons & Holographie
- Textes néon : bleu, violet, rose, vert, orange
- Animations holographiques (flicker, pulse, float)
- Gradient borders animés

### Animations
- Pulse markers sur la carte
- Scan lines
- Data streams
- Radar sweeps

### Typographie
- **Orbitron** : Titres futuristes
- **Rajdhani** : Corps de texte
- **JetBrains Mono** : Code et données

---

## 🔐 Configuration Sécurisée

### ⚡ Installation Rapide (Recommandé)

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les clés API (script interactif sécurisé)
node scripts/secure-setup.js

# 3. Lancer l'application
npm run dev
```

Le script va :
- ✅ Vous demander les clés API de manière interactive
- ✅ Chiffrer les clés avec AES-256-GCM
- ✅ Créer `.env.encrypted` (peut être commité sur GitHub)
- ✅ Créer `.env.local` (ignoré par Git, utilisé par Vite)

### 🔧 Configuration Manuelle

Si vous préférez configurer manuellement :

```bash
# 1. Copier le template
cp .env.example .env.local

# 2. Éditer avec vos clés
nano .env.local

# 3. Générer le fichier chiffré
node scripts/encrypt-config.js
```

### 📁 Fichiers de Configuration

| Fichier | Description | Git |
|---------|-------------|-----|
| `.env.local` | Clés en clair (local uniquement) | ❌ Ignoré |
| `.env.encrypted` | Clés chiffrées (partageable) | ✅ Commité |
| `.env.example` | Template vide | ✅ Commité |

### 🔑 Obtenir les Clés API

**Brave Search API** : https://brave.com/search/api/ (2000 requêtes/mois gratuit)

**Google Maps API** : https://console.cloud.google.com/google/maps-apis/credentials
- Activez "Maps JavaScript API"
- Restreignez par domaine HTTP

**Scraper API** : Service de web scraping (2 clés pour rotation automatique)

### 🔐 Clé de Chiffrement

Par défaut, une clé par défaut est utilisée. Pour plus de sécurité :

```bash
export CYBERTRACKER_MASTER_KEY="votre-clé-secrète-32-caractères"
```

📖 Documentation complète : [scripts/README.md](./scripts/README.md)

### 🌐 Géolocalisation IP
Aucune configuration nécessaire ! Utilise ipapi.co (gratuit, sans clé, HTTPS).

---

## 📦 Installation

```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

---

## 📁 Structure du Projet

```
src/
├── components/
│   ├── GoogleMaps.tsx          # Carte Google Maps avec données RÉELLES
│   └── ThreatFeed.tsx          # Feed API Brave Search avec IPs réelles
├── pages/
│   ├── DashboardPage.tsx       # Dashboard principal
│   ├── ThreatsPage.tsx         # Page Menaces
│   ├── WorldMapPage.tsx        # Page Carte Monde
│   ├── NetworkPage.tsx         # Page Réseau
│   ├── VPNPage.tsx             # Page VPN/Tor
│   ├── SEOPage.tsx             # Page SEO/AEO
│   └── IntelPage.tsx           # Page Renseignement
├── services/
│   ├── braveApi.ts             # Service API Brave Search
│   └── realTimeData.ts         # Service données RÉELLES + géolocalisation
├── App.tsx                     # Composant principal
├── index.css                   # Styles globaux futuristes
└── main.tsx                    # Point d'entrée
```

---

## 🌟 Technologies

- **React 18** : Framework UI
- **TypeScript** : Typage statique
- **Vite** : Build tool ultra-rapide
- **Tailwind CSS v4** : Styling utility-first
- **@react-google-maps/api** : Google Maps officiel
- **Brave Search API** : Intelligence cyber en temps réel
- **ip-api.com** : Géolocalisation IP gratuite
- **Font Awesome** : Icônes

---

## 🎯 Mode Réel - Comment ça marche ?

### 1. Récupération des menaces
```typescript
// Brave Search API → Résultats de recherche sur les cybermenaces
const results = await searchLatestThreats();
```

### 2. Extraction des IPs
```typescript
// Regex pour extraire les IPs des titres et descriptions
const ips = extractIPs(result.title + ' ' + result.description);
```

### 3. Géolocalisation
```typescript
// ip-api.com → Coordonnées GPS réelles
const geo = await geolocateIP(ip);
// Retourne : { lat, lng, country, city }
```

### 4. Affichage sur Google Maps
```typescript
// Marqueur Google Maps à la position réelle
<Marker position={{ lat: geo.lat, lng: geo.lng }} />
```

### 5. Rafraîchissement automatique
```typescript
// Toutes les 30 secondes
setInterval(fetchRealThreats, 30000);
```

---

## 🔒 Sécurité

- ✅ Chiffrement AES-256
- ✅ Connexions sécurisées HTTPS
- ✅ Authentification API par token
- ✅ Clés API cachées dans `.env`
- ✅ Logs audités

---

## 📊 Statistiques Temps Réel

- **Menaces réelles détectées** : Variable (dépend des résultats Brave)
- **IPs géolocalisées** : Variable (dépend des IPs trouvées)
- **Rafraîchissement** : Toutes les 30 secondes
- **Sources OSINT** : Brave Search API
- **Géolocalisation** : ip-api.com

---

## 🎨 Palette de Couleurs Néon

- **Neon Cyan** : `#00f0ff`
- **Neon Purple** : `#b829ff`
- **Neon Pink** : `#ff006e`
- **Neon Green** : `#00ff9d`
- **Neon Orange** : `#ff6b00`

---

## 🚀 Déploiement

Le projet est prêt pour le déploiement :
```bash
npm run build
# Les fichiers sont dans dist/
```

---

## 📝 Notes Importantes

### Limitations API
- **Brave Search API** : Limites selon votre plan (gratuit/payant)
- **ip-api.com** : 45 requêtes/minute (gratuit)
- **Google Maps** : $200 de crédit gratuit par mois

### Performance
- Rafraîchissement toutes les 30 secondes pour éviter le rate limiting
- Extraction d'IPs optimisée avec regex
- Géolocalisation asynchrone pour ne pas bloquer l'UI

### Données Réelles
- Les IPs affichées sont de VRAIES IPs extraites des résultats de recherche
- La géolocalisation est RÉELLE via ip-api.com
- Les menaces sont des menaces ACTUELLES détectées par Brave Search

---

## 🎉 Version

**CYBERTRACKER PRO v5.0** - Système de Lutte Anti-Cybercriminalité

*MODE RÉEL ACTIF - Données en temps réel à 100%*

---

## 📄 Licence

Projet de démonstration pour système de cybersécurité futuriste avec données réelles.

---

**⚠️ Avertissement** : Ce système affiche de vraies données en temps réel. Les IPs et menaces détectées sont réelles et proviennent de sources publiques.
