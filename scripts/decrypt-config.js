#!/usr/bin/env node

/**
 * Script de déchiffrement de la configuration
 * Déchiffre .env.encrypted vers .env.local
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.CYBERTRACKER_MASTER_KEY || 'default-change-me-in-production-32!';
const ALGORITHM = 'aes-256-gcm';

function decrypt(encryptedData) {
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Format de données chiffrées invalide');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(
    ALGORITHM, 
    Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), 
    iv
  );
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function main() {
  console.log('🔓 Déchiffrement de la configuration...\n');

  const encryptedPath = path.join(__dirname, '..', '.env.encrypted');
  const localPath = path.join(__dirname, '..', '.env.local');

  if (!fs.existsSync(encryptedPath)) {
    console.error('❌ Fichier .env.encrypted introuvable');
    console.error('   Exécutez d\'abord: node scripts/secure-setup.js');
    process.exit(1);
  }

  try {
    const encryptedConfig = JSON.parse(fs.readFileSync(encryptedPath, 'utf8'));
    
    console.log('🔑 Déchiffrement des clés...');
    
    const config = {};
    for (const [key, encryptedValue] of Object.entries(encryptedConfig)) {
      config[key] = decrypt(encryptedValue);
    }

    // Créer le fichier .env.local
    const localContent = Object.entries(config)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync(localPath, localContent);

    console.log('\n✅ Configuration déchiffrée avec succès!');
    console.log(`📁 Fichier créé: ${localPath}`);
    console.log('\n⚠️  Le fichier .env.local est ignoré par Git');
    console.log('🚀 Vous pouvez maintenant lancer: npm run dev');

  } catch (error) {
    console.error('\n❌ Erreur lors du déchiffrement:');
    console.error('   ', error.message);
    console.error('\n💡 Vérifiez que CYBERTRACKER_MASTER_KEY est correct');
    console.error('   export CYBERTRACKER_MASTER_KEY="votre-clé-secrète-32-caractères"');
    process.exit(1);
  }
}

main();
