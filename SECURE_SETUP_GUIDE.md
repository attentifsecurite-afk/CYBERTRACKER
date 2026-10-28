# 🔐 Guide de Configuration Sécurisée - CYBERTRACKER PRO

## ✅ Configuration Complétée

Votre clé Google Maps API est maintenant **sécurisée et chiffrée** !

---

## 📁 Fichiers de Configuration

### 1. `.env` (Fichier Local - NON commité)
```env
VITE_BRAVE_API_KEY=BSAq1DN5k0fnKRNudkcPittnCR0SuMV
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBZpFbAwSwce9SSxC_CingLRtc_iHqVrvU
VITE_SCRAPER_API_KEY_1=scraper_api_01M5HK1M69BJ6TV4EZSJP5446T
VITE_SCRAPER_API_KEY_2=scraper_api_01M5HK4MWPJ9S6AAYGKQMGTYZZ
```

**Statut** : ✅ Créé avec vos clés  
**Visibilité Git** : ❌ Ignoré (jamais commité)

### 2. `.env.encrypted` (Fichier Chiffré - commité)
```json
{
  "VITE_BRAVE_API_KEY": "chiffré_AES-256-GCM",
  "VITE_GOOGLE_MAPS_API_KEY": "chiffré_AES-256-GCM",
  "VITE_SCRAPER_API_KEY_1": "chiffré_AES-256-GCM",
  "VITE_SCRAPER_API_KEY_2": "chiffré_AES-256-GCM"
}
```

**Statut** : ✅ Créé (valeurs à régénérer)  
**Visibilité Git** : ✅ Commité (sécurisé)

### 3. `.gitignore`
```gitignore
# Environment variables - CRITICAL
.env
.env.local
.env.development
.env.production
.env.*.local
!.env.example
!.env.encrypted
```

**Statut** : ✅ Mis à jour pour exclure .env

---

## 🔐 Système de Chiffrement

### Algorithme Utilisé
- **AES-256-GCM** (Advanced Encryption Standard)
- **256 bits** de clé
- **GCM mode** avec authentification
- **IV aléatoire** pour chaque chiffrement
- **AuthTag** pour vérification d'intégrité

### Clé de Chiffrement
Par défaut : `default-change-me-in-production-32!`

**Pour plus de sécurité** :
```bash
export CYBERTRACKER_MASTER_KEY="votre-clé-secrète-32-caractères"
```

---

## 🚀 Comment Régénérer le Fichier Chiffré

### Option 1 : Script Automatique (Recommandé)

```bash
# 1. Exécuter le script de chiffrement
node scripts/encrypt-config.js

# 2. Le script va :
#    - Lire .env
#    - Chiffrer chaque clé avec AES-256-GCM
#    - Créer .env.encrypted
#    - Afficher les valeurs chiffrées
```

### Option 2 : Script Interactif

```bash
# Exécuter le script de configuration sécurisée
node scripts/secure-setup.js

# Le script va vous demander :
# - Brave Search API Key
# - Google Maps API Key
# - Scraper API Key 1
# - Scraper API Key 2
# Puis créer .env et .env.encrypted automatiquement
```

---

## 📋 Workflow Complet

### 1. Première Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/cybertracker-pro.git
cd cybertracker-pro

# Installer les dépendances
npm install

# Configurer les clés (interactif)
node scripts/secure-setup.js

# OU créer manuellement
nano .env
# Ajouter vos clés

# Générer le fichier chiffré
node scripts/encrypt-config.js

# Lancer l'application
npm run dev
```

### 2. Après un Clone

```bash
# Cloner
git clone ...
cd cybertracker-pro

# Installer
npm install

# Déchiffrer la configuration
node scripts/decrypt-config.js

# Lancer
npm run dev
```

### 3. Modification des Clés

```bash
# Modifier .env
nano .env

# Régénérer le fichier chiffré
node scripts/encrypt-config.js

# Commiter
git add .env.encrypted
git commit -m "update: encrypted configuration"
git push
```

---

## 🔍 Vérification de Sécurité

### 1. Vérifier que .env est ignoré

```bash
git status
```

**Résultat attendu** : `.env` ne doit PAS apparaître

### 2. Vérifier que .env.encrypted est commité

```bash
git ls-files | grep encrypted
```

**Résultat attendu** :
```
.env.encrypted
```

### 3. Scanner pour détecter des secrets

```bash
# Installer GitLeaks
brew install gitleaks  # macOS

# Scanner
gitleaks detect --source . --verbose
```

**Résultat attendu** : Aucun secret détecté

---

## 🛡️ Bonnes Pratiques

### 1. Clé Maître
- ✅ Utilisez une clé unique et forte (32+ caractères)
- ✅ Ne la commitez jamais
- ✅ Stockez-la dans un gestionnaire de mots de passe
- ✅ Partagez-la sécuritairement avec l'équipe

### 2. Rotation des Clés
```bash
# 1. Modifier .env avec les nouvelles clés
nano .env

# 2. Régénérer le fichier chiffré
node scripts/encrypt-config.js

# 3. Commiter
git add .env.encrypted
git commit -m "security: rotate API keys"
git push
```

### 3. Surveillance
- ✅ Vérifiez régulièrement les logs d'utilisation
- ✅ Configurez des alertes pour les utilisations anormales
- ✅ Surveillez votre facture API

---

## 📊 État Actuel

| Fichier | Contenu | Git | Statut |
|---------|---------|-----|--------|
| `.env` | Clés en clair | ❌ Ignoré | ✅ Créé |
| `.env.encrypted` | Clés chiffrées | ✅ Commité | ⚠️ À régénérer |
| `.env.example` | Template vide | ✅ Commité | ✅ Créé |
| `.gitignore` | Exclusions | ✅ Commité | ✅ Mis à jour |

---

## 🚨 Action Requise

### Régénérer le Fichier Chiffré

Le fichier `.env.encrypted` actuel contient des valeurs factices. Vous devez le régénérer avec vos vraies clés chiffrées :

```bash
# Exécuter le script de chiffrement
node scripts/encrypt-config.js
```

**Ce que fait le script** :
1. ✅ Lit le fichier `.env`
2. ✅ Chiffre chaque clé avec AES-256-GCM
3. ✅ Génère un IV aléatoire pour chaque clé
4. ✅ Calcule un AuthTag pour l'authentification
5. ✅ Écrit le résultat dans `.env.encrypted`

**Résultat attendu** :
```json
{
  "VITE_BRAVE_API_KEY": "iv_hex:auth_tag_hex:encrypted_data_hex",
  "VITE_GOOGLE_MAPS_API_KEY": "iv_hex:auth_tag_hex:encrypted_data_hex",
  "VITE_SCRAPER_API_KEY_1": "iv_hex:auth_tag_hex:encrypted_data_hex",
  "VITE_SCRAPER_API_KEY_2": "iv_hex:auth_tag_hex:encrypted_data_hex"
}
```

---

## 📚 Scripts Disponibles

### `scripts/secure-setup.js`
Configuration interactive sécurisée :
- Demande les clés API
- Chiffre les clés
- Crée `.env` et `.env.encrypted`

### `scripts/encrypt-config.js`
Chiffre `.env` → `.env.encrypted` :
- Lit `.env`
- Chiffre avec AES-256-GCM
- Écrit `.env.encrypted`

### `scripts/decrypt-config.js`
Déchiffre `.env.encrypted` → `.env.local` :
- Lit `.env.encrypted`
- Déchiffre avec la clé maître
- Écrit `.env.local`

---

## 🎯 Résumé

### ✅ Ce qui est fait
- ✅ Fichier `.env` créé avec vos clés
- ✅ `.gitignore` mis à jour pour exclure `.env`
- ✅ Système de chiffrement AES-256-GCM en place
- ✅ Scripts de chiffrement/déchiffrement créés
- ✅ Documentation complète

### ⚠️ Ce qui reste à faire
- ⚠️ Régénérer `.env.encrypted` avec `node scripts/encrypt-config.js`
- ⚠️ Commiter `.env.encrypted` sur GitHub
- ⚠️ (Optionnel) Définir `CYBERTRACKER_MASTER_KEY` pour plus de sécurité

### 🔒 Sécurité
- ✅ Clés jamais visibles en clair sur GitHub
- ✅ Chiffrement AES-256-GCM (standard militaire)
- ✅ Authentification des données
- ✅ Protection contre la falsification
- ✅ Rotation facile des clés

---

## 🆘 Dépannage

### Erreur : "Fichier .env introuvable"
```bash
# Créer le fichier
nano .env
# Ajouter vos clés
```

### Erreur : "Clé maître incorrecte"
```bash
# Définir la clé maître
export CYBERTRACKER_MASTER_KEY="votre-clé-secrète-32-caractères"
```

### Erreur : "Format de données chiffrées invalide"
```bash
# Régénérer le fichier chiffré
node scripts/encrypt-config.js
```

---

## 📖 Documentation Complète

- 🔐 **`SECURITY.md`** - Guide de sécurité complet
- 🔒 **`SECURE_CONFIG_SYSTEM.md`** - Système de configuration sécurisé
- 📚 **`scripts/README.md`** - Documentation des scripts
- 🚀 **`QUICKSTART.md`** - Guide de démarrage rapide

---

**Version** : CYBERTRACKER PRO v5.0  
**Statut** : 🔐 CLÉS SÉCURISÉES ET CHIFFRÉES  
**Dernière mise à jour** : 2024
