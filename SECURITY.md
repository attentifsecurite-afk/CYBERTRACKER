# 🔒 Sécurité - CYBERTRACKER PRO

## ⚠️ AVERTISSEMENT CRITIQUE

**NE JAMAIS COMMITTER LES CLÉS API SUR GITHUB !**

Les clés API sont des secrets qui doivent rester privés. Si elles sont exposées publiquement :
- Elles peuvent être volées et utilisées à votre place
- Vous pouvez être facturé pour des utilisations non autorisées
- Votre compte peut être suspendu
- Des attaques peuvent être lancées contre vous

---

## 🛡️ Configuration Sécurisée

### 1. Fichier `.env` (Local uniquement)

Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Éditez `.env` avec vos vraies clés :

```env
VITE_BRAVE_API_KEY=votre_vraie_cle_brave
VITE_GOOGLE_MAPS_API_KEY=votre_vraie_cle_google_maps
VITE_SCRAPER_API_KEY_1=votre_premiere_cle_scraper
VITE_SCRAPER_API_KEY_2=votre_deuxieme_cle_scraper
```

### 2. Fichier `.gitignore`

Le fichier `.gitignore` est configuré pour exclure :
- `.env`
- `.env.local`
- `.env.*.local`
- Toutes les variantes de fichiers d'environnement

**Vérifiez que `.env` est bien ignoré :**
```bash
git status
# .env ne doit PAS apparaître dans la liste
```

### 3. Fichier `.env.example` (À committer)

Ce fichier contient des placeholders et peut être commité :

```env
VITE_BRAVE_API_KEY=votre_cle_brave_search_ici
VITE_GOOGLE_MAPS_API_KEY=votre_cle_google_maps_ici
VITE_SCRAPER_API_KEY_1=votre_premiere_cle_scraper_ici
VITE_SCRAPER_API_KEY_2=votre_deuxieme_cle_scraper_ici
```

---

## 🚨 Si vos clés sont déjà sur GitHub

### Étape 1 : Révoquer les clés compromises

1. **Brave Search API** :
   - Connectez-vous sur https://brave.com/search/api/
   - Générez une nouvelle clé
   - Supprimez l'ancienne clé

2. **Google Maps API** :
   - Connectez-vous sur Google Cloud Console
   - Allez dans "APIs & Services" > "Credentials"
   - Supprimez la clé compromise
   - Créez une nouvelle clé

3. **Scraper API** :
   - Connectez-vous à votre service de scraping
   - Révoquez les clés compromises
   - Générez de nouvelles clés

### Étape 2 : Nettoyer l'historique Git

**ATTENTION : Cette opération est irréversible !**

```bash
# Supprimer le fichier .env de l'historique
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Forcer le push (écrase l'historique distant)
git push origin --force --all
git push origin --force --tags
```

### Étape 3 : Mettre à jour `.gitignore`

Vérifiez que `.env` est bien dans `.gitignore` :

```bash
echo ".env" >> .gitignore
git add .gitignore
git commit -m "security: add .env to gitignore"
git push
```

---

## 🔐 Bonnes Pratiques

### 1. Rotation des clés

- Changez vos clés API régulièrement (tous les 3-6 mois)
- Utilisez plusieurs clés pour la rotation automatique
- Surveillez l'utilisation de vos clés

### 2. Restrictions d'accès

**Google Maps API** :
- Restreignez par domaine HTTP
- Restreignez par adresse IP
- Activez uniquement les APIs nécessaires
- Configurez des quotas d'utilisation

**Brave Search API** :
- Surveillez le nombre de requêtes
- Configurez des alertes d'utilisation
- Utilisez des quotas si disponible

### 3. Surveillance

- Vérifiez régulièrement les logs d'utilisation
- Configurez des alertes pour les utilisations anormales
- Surveillez votre facture API

### 4. Environnements séparés

Utilisez des clés différentes pour :
- Développement local
- Staging/testing
- Production

```env
# .env.development
VITE_BRAVE_API_KEY=dev_key_here

# .env.production
VITE_BRAVE_API_KEY=prod_key_here
```

---

## 📋 Checklist de Sécurité

Avant de pusher sur GitHub, vérifiez :

- [ ] `.env` est dans `.gitignore`
- [ ] `.env.example` existe avec des placeholders
- [ ] Aucune clé en dur dans le code source
- [ ] `git status` ne montre pas `.env`
- [ ] Les clés sont stockées localement uniquement
- [ ] Les restrictions d'accès sont configurées sur les APIs
- [ ] La surveillance d'utilisation est activée

---

## 🛠️ Outils de Détection

### GitLeaks

Installez GitLeaks pour détecter les secrets dans votre historique :

```bash
# Installation
brew install gitleaks  # macOS
# ou
go install github.com/gitleaks/gitleaks/v8@latest

# Scan du repository
gitleaks detect --source . --verbose
```

### Pre-commit Hooks

Installez un hook pre-commit pour empêcher le commit de secrets :

```bash
# Installer pre-commit
pip install pre-commit

# Créer .pre-commit-config.yaml
cat > .pre-commit-config.yaml << EOF
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
EOF

# Installer les hooks
pre-commit install
```

---

## 📚 Ressources

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Google Cloud API Security](https://cloud.google.com/docs/authentication/api-keys#securing)
- [Best Practices for Managing API Keys](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html)

---

## 🆘 Support

Si vous pensez que vos clés ont été compromises :

1. **Révoquez immédiatement** les clés compromises
2. **Générez de nouvelles clés**
3. **Nettoyez l'historique Git** (voir section ci-dessus)
4. **Contactez le support** de chaque service API
5. **Surveillez** votre compte pour toute activité suspecte

---

## ✅ Résumé

**À FAIRE :**
- ✅ Utiliser `.env` pour les clés locales
- ✅ Committer `.env.example` avec des placeholders
- ✅ Configurer `.gitignore` correctement
- ✅ Restreindre l'accès aux APIs
- ✅ Surveiller l'utilisation
- ✅ Changer les clés régulièrement

**À NE PAS FAIRE :**
- ❌ Committer `.env` sur GitHub
- ❌ Mettre des clés en dur dans le code
- ❌ Partager vos clés
- ❌ Utiliser la même clé partout
- ❌ Ignorer les alertes de sécurité

---

**Dernière mise à jour** : 2024  
**Version** : CYBERTRACKER PRO v5.0  
**Statut** : 🔒 SÉCURISÉ
