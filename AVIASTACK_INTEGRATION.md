# ✈️ Intégration API Aviationstack

## 🎯 Vue d'ensemble

L'API Aviationstack a été intégrée à CYBERTRACKER PRO pour fournir une **surveillance aérienne en temps réel** des vols dans le monde entier.

## 🔑 Configuration

### Clé API
```env
VITE_AVIASTACK_API_KEY=b90d2522fa544eed164f4dc91fbad42f
```

### Plan Utilisé
- **Plan** : Basic (Gratuit)
- **Limite** : 100 requêtes/mois
- **Fonctionnalités** :
  - ✅ Vols en temps réel
  - ✅ Informations aéroports
  - ✅ Compagnies aériennes
  - ✅ Données historiques (limité)

## 🚀 Fonctionnalités

### 1. Surveillance en Temps Réel
- ✅ **Vols actifs** avec position GPS live
- ✅ **Altitude, vitesse, direction** en temps réel
- ✅ **Carte interactive** avec marqueurs d'avions
- ✅ **Filtrage par statut** (en vol, atterri, annulé)
- ✅ **Recherche par aéroport** (IATA code)

### 2. Données Disponibles
Pour chaque vol :
- 🛫 **Départ** : Aéroport, terminal, porte, horaire
- 🛬 **Arrivée** : Aéroport, terminal, porte, horaire
- ✈️ **Avion** : Immatriculation, type, compagnie
- 📍 **Position Live** : Latitude, longitude, altitude, vitesse
- 📊 **Statut** : En vol, atterri, annulé, incident, détourné

### 3. Interface Utilisateur
- **Carte MapLibre GL** avec style cyberpunk
- **Marqueurs d'avions** animés avec rotation selon la direction
- **Popups détaillées** avec toutes les informations
- **Liste des vols** avec filtrage et recherche
- **Statistiques** en temps réel (vols en vol, atterris, annulés)
- **Rafraîchissement automatique** toutes les 30 secondes

## 📁 Fichiers Créés

### Service API
- `src/services/aviationstackApi.ts`
  - `getFlights()` - Récupérer les vols
  - `getLiveFlights()` - Vols avec position GPS
  - `getFlightsByStatus()` - Filtrer par statut
  - `getDeparturesFromAirport()` - Départs d'un aéroport
  - `getArrivalsToAirport()` - Arrivées à un aéroport
  - `getAirports()` - Informations aéroports
  - `getAirlines()` - Informations compagnies

### Page Aviation
- `src/pages/AviationPage.tsx`
  - Carte interactive avec marqueurs d'avions
  - Filtres (statut, aéroport)
  - Liste des vols en direct
  - Popups détaillées
  - Statistiques en temps réel

### Configuration
- `.env` - Ajout de `VITE_AVIASTACK_API_KEY`
- `src/env.d.ts` - Types TypeScript mis à jour
- `src/App.tsx` - Ajout de la navigation et route
- `src/index.css` - Styles pour les marqueurs d'avions

## 🎨 Design

### Marqueurs d'Avions
```css
.flight-marker {
  width: 20px;
  height: 20px;
  transform: rotate(direction);
  animation: flight-pulse 2s ease-in-out infinite;
}
```

- **Couleur** : Cyan (#00f0ff) avec glow effect
- **Rotation** : Selon la direction du vol
- **Animation** : Pulse pour visibilité
- **Hover** : Zoom au survol

### Style Cyberpunk
- Fond sombre (#0a0e1a)
- Marqueurs lumineux avec glow
- Popups avec glassmorphism
- Statistiques avec néons colorés

## 📊 Utilisation

### Accéder à la Page
1. Cliquer sur l'onglet **"Aviation"** dans la navigation
2. La carte se charge avec les vols en direct

### Filtrer les Vols
- **Par statut** : Tous / En vol / Atterris / Annulés
- **Par aéroport** : Entrer le code IATA (ex: CDG, JFK, LHR)
- **Rafraîchir** : Bouton de rafraîchissement manuel

### Interagir avec la Carte
- **Clic sur un avion** : Voir les détails du vol
- **Clic dans la liste** : Centrer la carte sur le vol
- **Zoom/Pan** : Navigation classique sur la carte

### Informations Disponibles
Pour chaque vol :
- Numéro de vol et compagnie
- Aéroports de départ et arrivée
- Horaires prévus et réels
- Position GPS (lat, lng)
- Altitude en pieds
- Vitesse en km/h
- Direction en degrés
- Statut du vol

## 🔧 API Endpoints

### Vols en Temps Réel
```
GET /v1/flights?access_key={API_KEY}&limit=100
```

### Vols par Statut
```
GET /v1/flights?access_key={API_KEY}&flight_status=active
```

### Départs d'un Aéroport
```
GET /v1/flights?access_key={API_KEY}&dep_iata=CDG
```

### Arrivées à un Aéroport
```
GET /v1/flights?access_key={API_KEY}&arr_iata=JFK
```

### Informations Aéroports
```
GET /v1/airports?access_key={API_KEY}&search=Paris
```

## 📈 Statistiques

### Plan Gratuit (Basic)
- **100 requêtes/mois**
- **Vols en temps réel** : ✅
- **Données historiques** : ❌
- **Webhooks** : ❌
- **Support** : Communauté

### Limites Actuelles
- Rafraîchissement toutes les 30 secondes
- Maximum 100 vols affichés
- Pas de données historiques
- Pas de webhooks

## 🚨 Gestion des Erreurs

### Erreurs Possibles
1. **API Key Invalide**
   - Vérifier `VITE_AVIASTACK_API_KEY` dans `.env`
   
2. **Limite de Requêtes Atteinte**
   - Plan gratuit : 100 requêtes/mois
   - Attendre le renouvellement ou upgrader le plan

3. **Pas de Données Live**
   - Certains vols n'ont pas de données GPS
   - Filtrer avec `flight.live !== null`

4. **Rate Limiting**
   - Espacer les requêtes (30s minimum)
   - Utiliser le cache si possible

### Messages d'Erreur
- Affichage dans l'interface
- Logs dans la console
- Gestion gracieuse des erreurs

## 🔄 Rafraîchissement Automatique

```typescript
useEffect(() => {
  const interval = setInterval(loadData, 30000);
  return () => clearInterval(interval);
}, [filter, airportFilter]);
```

- **Fréquence** : Toutes les 30 secondes
- **Condition** : Si un filtre est actif
- **Cleanup** : Arrêt lors du démontage

## 🎯 Cas d'Usage

### 1. Surveillance de Sécurité
- Suivi des vols suspects
- Détection de comportements anormaux
- Analyse des routes aériennes

### 2. Veille Informationnelle
- Monitoring des incidents aériens
- Suivi des retards et annulations
- Analyse des tendances

### 3. Recherche et Investigation
- Localisation d'avions spécifiques
- Vérification de routes aériennes
- Corrélation avec d'autres données

## 📝 Notes Techniques

### CORS
L'API Aviationstack supporte CORS, donc les requêtes fonctionnent directement depuis le navigateur.

### Rate Limiting
- Plan gratuit : 100 requêtes/mois
- Recommandation : Rafraîchir toutes les 30s minimum
- Cache : Implémenter un cache local si nécessaire

### Données Live
- Seuls les vols en cours ont des données GPS
- Les vols atterris/annulés n'ont pas de position live
- Filtrer avec `flight.live !== null`

### Performance
- 100 marqueurs maximum sur la carte
- Rafraîchissement toutes les 30s
- Optimisation des rendu avec React

## 🚀 Améliorations Futures

### Possibilités
1. **Cache Local**
   - Stocker les données pour réduire les requêtes API
   - Implementer un système de cache avec expiration

2. **Webhooks**
   - Notifications en temps réel (plan payant)
   - Alertes pour vols spécifiques

3. **Historique**
   - Stocker les données historiques (plan payant)
   - Analyser les tendances

4. **Filtres Avancés**
   - Par compagnie aérienne
   - Par type d'avion
   - Par zone géographique

5. **Alertes**
   - Notifications pour vols suspects
   - Alertes en temps réel

## 📚 Documentation Officielle

- **Site Web** : https://aviationstack.com/
- **Documentation** : https://aviationstack.com/documentation
- **API Reference** : https://aviationstack.com/documentation
- **Dashboard** : https://aviationstack.com/dashboard

## ✅ Checklist

- [x] Clé API configurée dans `.env`
- [x] Types TypeScript mis à jour
- [x] Service API créé
- [x] Page Aviation créée
- [x] Navigation mise à jour
- [x] Styles CSS ajoutés
- [x] Build réussi
- [x] Documentation créée

## 🎉 Résultat

**L'API Aviationstack est maintenant intégrée avec :**
- ✅ Surveillance aérienne en temps réel
- ✅ Carte interactive avec marqueurs d'avions
- ✅ Données GPS live (position, altitude, vitesse)
- ✅ Filtres par statut et aéroport
- ✅ Interface cyberpunk élégante
- ✅ Rafraîchissement automatique

---

**Version** : CYBERTRACKER PRO v5.0  
**Statut** : ✅ API AVIASTACK INTÉGRÉE  
**Dernière mise à jour** : 2024
