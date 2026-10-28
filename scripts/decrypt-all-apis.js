#!/usr/bin/env node

/**
 * Script pour déchiffrer les clés API du fichier .env.encrypted
 * Utilise AES-256-GCM pour le déchiffrement
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Clé de chiffrement (doit correspondre à celle utilisée pour chiffrer)
const ENCRYPTION_KEY = process.env.CYBERTRACKER_MASTER_KEY || 'cybertracker-pro-default-key-2024-32chars!';
const ALGORITHM = 'aes-256-gcm';

// Chemins des fichiers
const ENCRYPTED_PATH = path.join(__dirname, '..', '.env.encrypted');
const ENV_PATH = path.join(__dirname, '..', '.env');

/**
 * Déchiffre une valeur avec AES-256-GCM
 */
function decrypt(encryptedText) {
  const parts = encryptedText.split(':');
  
  if (parts.length !== 3) {
    throw new Error('Format de chiffrement invalide');
  }
  
  const [ivHex, authTagHex, encrypted] = parts;
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Fonction principale
 */
function main() {
  console.log('🔓 Déchiffrement des clés API...\n');
  
  // Vérifier que le fichier .env.encrypted existe
  if (!fs.existsSync(ENCRYPTED_PATH)) {
    console.error('❌ Erreur: Le fichier .env.encrypted n\'existe pas');
    console.error('   Exécutez d\'abord: node scripts/encrypt-all-apis.js');
    process.exit(1);
  }
  
  // Lire le fichier .env.encrypted
  console.log('📖 Lecture du fichier .env.encrypted...');
  const encryptedContent = fs.readFileSync(ENCRYPTED_PATH, 'utf8');
  const encrypted = JSON.parse(encryptedContent);
  
  const keys = Object.keys(encrypted);
  console.log(`✅ ${keys.length} clés chiffrées trouvées\n`);
  
  // Déchiffrer chaque clé
  console.log('🔓 Déchiffrement avec AES-256-GCM...');
  const envLines = ['# Clés API déchiffrées', '# Ce fichier ne doit JAMAIS être commité sur GitHub', ''];
  
  for (const key of keys) {
    try {
      const encryptedValue = encrypted[key];
      const decryptedValue = decrypt(encryptedValue);
      envLines.push(`${key}=${decryptedValue}`);
      console.log(`  ✓ ${key}`);
    } catch (error) {
      console.error(`  ✗ ${key}: ${error.message}`);
    }
  }
  
  console.log('\n💾 Sauvegarde dans .env...');
  fs.writeFileSync(ENV_PATH, envLines.join('\n'));
  
  console.log('\n✅ Déchiffrement terminé avec succès!\n');
  console.log('📁 Fichier créé: .env');
  console.log('\n⚠️  Important:');
  console.log('  • Le fichier .env contient vos clés en clair');
  console.log('  • Ne JAMAIS committer .env sur GitHub');
  console.log('  • Vérifiez que .env est dans .gitignore');
  console.log('\n🚀 Vous pouvez maintenant lancer l\'application:');
  console.log('  npm run dev');
}

// Exécuter le script
main();
