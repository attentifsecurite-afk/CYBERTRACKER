#!/usr/bin/env node

/**
 * Script pour chiffrer toutes les clés API du fichier .env
 * Utilise AES-256-GCM pour un chiffrement sécurisé
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Clé de chiffrement (à stocker séparément dans un coffre-fort de secrets)
const ENCRYPTION_KEY = process.env.CYBERTRACKER_MASTER_KEY || 'cybertracker-pro-default-key-2024-32chars!';
const ALGORITHM = 'aes-256-gcm';

// Chemins des fichiers
const ENV_PATH = path.join(__dirname, '..', '.env');
const ENCRYPTED_PATH = path.join(__dirname, '..', '.env.encrypted');

/**
 * Chiffre une valeur avec AES-256-GCM
 */
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Parse le fichier .env
 */
function parseEnvFile(content) {
  const env = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Ignorer les lignes vides et les commentaires
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }
    
    const key = trimmed.substring(0, separatorIndex).trim();
    const value = trimmed.substring(separatorIndex + 1).trim();
    
    if (key && value) {
      env[key] = value;
    }
  }
  
  return env;
}

/**
 * Fonction principale
 */
function main() {
  console.log('🔐 Chiffrement des clés API...\n');
  
  // Vérifier que le fichier .env existe
  if (!fs.existsSync(ENV_PATH)) {
    console.error('❌ Erreur: Le fichier .env n\'existe pas');
    console.error('   Créez le fichier .env avec vos clés API');
    process.exit(1);
  }
  
  // Lire le fichier .env
  console.log('📖 Lecture du fichier .env...');
  const envContent = fs.readFileSync(ENV_PATH, 'utf8');
  const envVars = parseEnvFile(envContent);
  
  const keys = Object.keys(envVars);
  console.log(`✅ ${keys.length} clés trouvées\n`);
  
  // Chiffrer chaque clé
  console.log('🔒 Chiffrement des clés avec AES-256-GCM...');
  const encrypted = {};
  
  for (const key of keys) {
    const value = envVars[key];
    encrypted[key] = encrypt(value);
    console.log(`  ✓ ${key}`);
  }
  
  console.log('\n💾 Sauvegarde dans .env.encrypted...');
  fs.writeFileSync(ENCRYPTED_PATH, JSON.stringify(encrypted, null, 2));
  
  console.log('\n✅ Chiffrement terminé avec succès!\n');
  console.log('📁 Fichiers:');
  console.log(`  • .env (original, ignoré par Git)`);
  console.log(`  • .env.encrypted (chiffré, peut être commité)`);
  console.log('\n🔐 Pour déchiffrer:');
  console.log('  node scripts/decrypt-config.js');
  console.log('\n⚠️  Important:');
  console.log('  • Ne jamais committer .env sur GitHub');
  console.log('  • Conserver la clé maître en lieu sûr');
  console.log('  • Utiliser .env.encrypted pour le partage');
}

// Exécuter le script
main();
