# 🔐 Scripts de Configuration Sécurisée

Ce dossier contient les scripts pour gérer la configuration des clés API de manière sécurisée.

## 📁 Fichiers

### `secure-setup.js`
Script interactif pour configurer les clés API de manière sécurisée.

**Utilisation :**
```bash
node scripts/secure-setup.js
```

**Fonctionnement :**
1. Demande les clés API de manière interactive
2. Chiffre les clés avec AES-256-GCM
3. Crée `.env.encrypted` (peut être commité)
4. Crée `.env.local` (ignoré par Git, utilisé par Vite)

### `encrypt-config.js`
Convertit `.env.local` en `.env.encrypted`.

**Utilisation :**
```bash
node scripts/encrypt-config.js
```

**Quand l'utiliser :**
- Après avoir modifié `.env.local`
- Avant de committer sur GitHub

### `decrypt-config.js`
Déchiffre `.env.encrypted` vers `.env.local`.

**Utilisation :**
```bash
node scripts/decrypt-config.js
```

**Quand l'utiliser :**
- Après avoir cloné le repository
- Sur une nouvelle machine

## 🔐 Clé de Chiffrement

Par défaut, les scripts utilisent une clé de chiffrement hardcodée :
```
default-change-me-in-production-32!
```

**⚠️ IMPORTANT :** Pour une sécurité maximale, définissez votre propre clé :

```bash
export CYBERTRACKER_MASTER_KEY="votre-clé-secrète-32-caractères"
```

## 🔄 Workflow Complet

### 1. Première Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/cybertracker-pro.git
cd cybertracker-pro

# Installer les dépendances
npm install

# Configurer les clés (interactif)
node scripts/secure-setup.js

# Lancer l'application
npm run dev
```

### 2. Après un Clone (si .env.encrypted existe)

```bash
# Cloner le repository
git clone https://github.com/votre-username/cybertracker-pro.git
cd cybertracker-pro

# Installer les dépendances
npm install

# Définir la clé maître (si différente de la clé par défaut)
export CYBERTRACKER_MASTER_KEY="votre-clé-secrète-32-caractères"

# Déchiffrer la configuration
node scripts/decrypt-config.js

# Lancer l'application
npm run dev
```

### 3. Modification des Clés

```bash
# Modifier .env.local directement
nano .env.local

# OU utiliser le script interactif
node scripts/secure-setup.js

# Générer le fichier chiffré
node scripts/encrypt-config.js

# Commiter le fichier chiffré
git add .env.encrypted
git commit -m "update: encrypted configuration"
git push
```

## 🔒 Sécurité

### Ce qui est chiffré
- ✅ Toutes les clés API
- ✅ Algorithm : AES-256-GCM (authentifié)
- ✅ IV aléatoire pour chaque chiffrement
- ✅ AuthTag pour vérification d'intégrité

### Ce qui n'est PAS chiffré
- ❌ Noms des variables (VITE_BRAVE_API_KEY, etc.)
- ❌ Structure du fichier JSON

### Fichiers générés

| Fichier | Contenu | Git |
|---------|---------|-----|
| `.env.local` | Clés en clair | ❌ Ignoré |
| `.env.encrypted` | Clés chiffrées | ✅ Commité |
| `.env.example` | Template vide | ✅ Commité |

## 🛡️ Bonnes Pratiques

### 1. Clé Maître
- Utilisez une clé unique et forte (32+ caractères)
- Ne la commitez jamais
- Stockez-la dans un gestionnaire de mots de passe
- Partagez-la sécuritairement avec l'équipe

### 2. Rotation des Clés
```bash
# 1. Modifier .env.local avec les nouvelles clés
nano .env.local

# 2. Régénérer le fichier chiffré
node scripts/encrypt-config.js

# 3. Commiter
git add .env.encrypted
git commit -m "security: rotate API keys"
git push
```

### 3. Vérification
```bash
# Vérifier que .env.local est ignoré
git status
# .env.local ne doit PAS apparaître

# Vérifier que .env.encrypted est commité
git ls-files | grep encrypted
# Doit afficher : .env.encrypted
```

## 🚨 Dépannage

### Erreur : "Format de données chiffrées invalide"
**Cause :** La clé maître est incorrecte
**Solution :** Vérifiez `CYBERTRACKER_MASTER_KEY`

### Erreur : "Fichier .env.encrypted introuvable"
**Cause :** Le fichier n'a pas été généré
**Solution :** Exécutez `node scripts/encrypt-config.js`

### Erreur : "Fichier .env.local introuvable"
**Cause :** Le fichier n'existe pas
**Solution :** Exécutez `node scripts/secure-setup.js`

## 📚 Ressources

- [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
- [Node.js Crypto](https://nodejs.org/api/crypto.html)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Version** : 1.0  
**Dernière mise à jour** : 2024
