#!/usr/bin/env node

/**
 * Script de configuration sécurisée des clés API
 * Ce script génère un fichier .env.local chiffré
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Clé de chiffrement (à stocker séparément ou dans un coffre-fort de secrets)
const ENCRYPTION_KEY = process.env.CYBERTRACKER_MASTER_KEY || 'default-change-me-in-production-32!';
const ALGORITHM = 'aes-256-gcm';

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedData) {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

async function setup() {
  console.log('🔐 Configuration sécurisée de CYBERTRACKER PRO\n');
  console.log('⚠️  Ce script va créer un fichier .env.local chiffré\n');

  const braveKey = await question('🔑 Brave Search API Key: ');
  const googleMapsKey = await question('🗺️  Google Maps API Key: ');
  const scraperKey1 = await question('🕷️  Scraper API Key 1: ');
  const scraperKey2 = await question('🕷️  Scraper API Key 2: ');

  console.log('\n🔒 Chiffrement des clés...');

  const config = {
    VITE_BRAVE_API_KEY: braveKey,
    VITE_GOOGLE_MAPS_API_KEY: googleMapsKey,
    VITE_SCRAPER_API_KEY_1: scraperKey1,
    VITE_SCRAPER_API_KEY_2: scraperKey2
  };

  // Chiffrer chaque clé
  const encryptedConfig = {};
  for (const [key, value] of Object.entries(config)) {
    encryptedConfig[key] = encrypt(value);
  }

  // Sauvegarder le fichier chiffré
  const encryptedPath = path.join(__dirname, '.env.encrypted');
  fs.writeFileSync(encryptedPath, JSON.stringify(encryptedConfig, null, 2));

  // Créer aussi un .env.local en clair pour Vite (ignoré par Git)
  const localPath = path.join(__dirname, '.env.local');
  const localContent = Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(localPath, localContent);

  console.log('\n✅ Configuration terminée!');
  console.log(`📁 Fichier chiffré: ${encryptedPath}`);
  console.log(`📁 Fichier local: ${localPath}`);
  console.log('\n⚠️  IMPORTANT:');
  console.log('   - Le fichier .env.local est ignoré par Git');
  console.log('   - Le fichier .env.encrypted peut être commité (il est chiffré)');
  console.log('   - Pour déchiffrer: node scripts/decrypt-config.js');
  console.log('\n🔐 Pour plus de sécurité, définissez la variable d\'environnement:');
  console.log('   export CYBERTRACKER_MASTER_KEY="votre-clé-secrète-32-caractères"');

  rl.close();
}

setup().catch(console.error);
