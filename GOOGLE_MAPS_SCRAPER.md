# Google Maps Scanner - Documentation

## 🗺️ Vue d'ensemble

Le **Google Maps Scanner** est une fonctionnalité avancée de CYBERTRACKER PRO qui permet d'analyser des zones géographiques pour identifier des entreprises et lieux suspects. Cette fonctionnalité s'inspire du projet [google-maps-scraper](https://github.com/omkarcloud/google-maps-scraper) et utilise l'API Google Places.

## 🎯 Fonctionnalités

### 1. Scan de Zones Géographiques
- **Recherche par adresse ou coordonnées** : Entrez une ville, une adresse ou des coordonnées GPS
- **Rayon configurable** : De 1km à 20km
- **3 types de scan** :
  - **Général** : Toutes les entreprises
  - **Suspect** : Casinos, pawn shops, nightclubs, transferts d'argent
  - **Menaces** : Cybercafés, réparateurs informatiques, électroniciens

### 2. Analyse de Risque
Chaque lieu scanné reçoit un **score de risque** (0-100%) basé sur :
- Note Google (faible = risque élevé)
- Nombre d'avis (peu d'avis = suspect)
- Statut de l'entreprise (fermé = risque)
- Type d'établissement (certains types sont plus à risque)
- Présence de site web et téléphone
- Proximité avec des menaces détectées

### 3. Catégorisation
Les lieux sont classés en 4 catégories :
- 🔴 **HAUT RISQUE** (60-100%) : Rouge
- 🟠 **RISQUE MOYEN** (40-59%) : Orange
- 🟡 **RISQUE FAIBLE** (20-39%) : Jaune
- 🟢 **SÛR** (0-19%) : Vert

### 4. Visualisation
- **Carte interactive** : Marqueurs colorés selon le niveau de risque
- **Liste détaillée** : Tous les résultats avec scores et facteurs de risque
- **Popups détaillés** : Informations complètes au clic sur un marqueur
- **Statistiques** : Compteurs par catégorie de risque

## 🚀 Utilisation

### 1. Accéder au Scanner
Cliquez sur l'onglet **"Maps Scanner"** dans la navigation principale.

### 2. Configurer le Scan
1. **Localisation** : Entrez une ville ou adresse (ex: "Paris, France")
2. **Type de scan** : Choisissez Général, Suspect ou Menaces
3. **Rayon** : Ajustez le rayon de recherche (1-20km)

### 3. Lancer le Scan
Cliquez sur le bouton **"SCANNER"** et attendez les résultats.

### 4. Analyser les Résultats
- **Carte** : Cliquez sur les marqueurs pour voir les détails
- **Liste** : Parcourez les résultats triés par score de risque
- **Filtres** : Utilisez les statistiques pour voir la répartition

## 📊 Facteurs de Risque

### Facteurs Détectés
- ❌ Note faible (< 3/5)
- ❌ Peu d'avis (< 10 avis)
- ❌ Entreprise fermée définitivement
- ❌ Pas de site web
- ❌ Pas de téléphone
- ❌ Type d'établissement à risque
- ❌ Menaces détectées à proximité

### Types d'Établissements à Risque
- Night clubs
- Casinos
- Pawn shops (prêteurs sur gage)
- Liquor stores
- Transferts d'argent

## 🔧 Configuration API

Le scanner utilise l'API Google Places qui nécessite :
- **Clé API Google Maps** : Configurée dans `.env`
- **Bibliothèque Places** : Chargée automatiquement
- **Quotas** : Respecte les limites de l'API Google

### Variables d'Environnement
```env
VITE_GOOGLE_MAPS_API_KEY=votre_clé_api
```

## 💡 Cas d'Usage

### 1. Investigation Cyber
Identifier les lieux physiques liés à des activités cybercriminelles détectées dans une zone.

### 2. Analyse de Zone
Scanner une zone géographique pour évaluer le niveau de risque global.

### 3. Due Diligence
Vérifier la légitimité d'entreprises avant des transactions.

### 4. Surveillance
Surveiller les changements dans une zone (nouvelles entreprises, fermetures).

## 🎨 Interface

### Design Futuriste
- **Glassmorphism** : Cartes transparentes avec blur
- **Néons** : Couleurs vives (cyan, purple, pink, green, orange)
- **Animations** : Effets de pulse, float, glow
- **Typographie** : Orbitron, Rajdhani, JetBrains Mono

### Composants
- **Carte Google Maps** : Style cyberpunk personnalisé
- **Marqueurs** : Cercles colorés avec glow effect
- **Popups** : Informations détaillées au clic
- **Liste** : Résultats avec scores et badges
- **Statistiques** : Compteurs par catégorie

## 📈 Statistiques

Le scanner affiche :
- Nombre total de lieux scannés
- Répartition par catégorie de risque
- Score de risque moyen
- Facteurs de risque les plus fréquents

## 🔒 Sécurité

- **API Keys** : Stockées dans `.env` (non commitées)
- **HTTPS** : Toutes les communications sont sécurisées
- **Rate Limiting** : Respect des quotas API Google
- **Données** : Pas de stockage permanent des résultats

## 🌐 API Utilisées

### Google Places API
- **Text Search** : Recherche de lieux par requête
- **Nearby Search** : Recherche par proximité
- **Place Details** : Détails complets d'un lieu
- **Geocoding** : Conversion adresse ↔ coordonnées

### Limites
- **Quotas** : Selon votre plan Google Maps
- **Rate Limit** : Requêtes limitées par seconde
- **Coûts** : Payant au-delà du crédit gratuit ($200/mois)

## 🎓 Inspiration

Cette fonctionnalité s'inspire de :
- [google-maps-scraper](https://github.com/omkarcloud/google-maps-scraper) - Outil de scraping Google Maps
- Techniques d'analyse de risque géographique
- Méthodologies d'investigation cyber

## 🚧 Limitations

- **API Google** : Nécessite une clé API valide
- **Coûts** : Payant au-delà du crédit gratuit
- **Précision** : Les scores de risque sont indicatifs
- **Temps réel** : Les données peuvent être cachées

## 🔮 Améliorations Futures

- [ ] Intégration avec les menaces détectées en temps réel
- [ ] Historique des scans
- [ ] Export des résultats (CSV, JSON)
- [ ] Alertes automatiques pour nouveaux lieux à risque
- [ ] Analyse de tendances temporelles
- [ ] Croisement avec bases de données de fraudes

## 📝 Notes

- Les scores de risque sont calculés localement et ne reflètent pas une réalité absolue
- L'analyse est basée sur des heuristiques et peut nécessiter une validation humaine
- Respectez les conditions d'utilisation de Google Maps API
- Utilisez cet outil de manière éthique et légale

---

**Version** : CYBERTRACKER PRO v5.0  
**Dernière mise à jour** : 2024  
**Statut** : ✅ Opérationnel
