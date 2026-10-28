#!/usr/bin/env node

/**
 * Script pour générer le fichier .env.encrypted à partir de .env.local
 * Ce fichier peut être commité sur GitHub car il est chiffré
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

function parseEnvFile(content) {
  const config = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        config[key.trim()] = valueParts.join('=').trim();
      }
    }
  }
  
  return config;
}

function main() {
  console.log('🔐 Génération du fichier .env.encrypted...\n');

  const localPath = path.join(__dirname, '..', '.env.local');
  const encryptedPath = path.join(__dirname, '..', '.env.encrypted');

  if (!fs.existsSync(localPath)) {
    console.error('❌ Fichier .env.local introuvable');
    console.error('   Créez le fichier .env.local avec vos clés API');
    process.exit(1);
  }

  try {
    const localContent = fs.readFileSync(localPath, 'utf8');
    const config = parseEnvFile(localContent);

    console.log('🔒 Chiffrement des clés...');
    
    const encryptedConfig = {};
    for (const [key, value] of Object.entries(config)) {
      encryptedConfig[key] = encrypt(value);
    }

    fs.writeFileSync(encryptedPath, JSON.stringify(encryptedConfig, null, 2));

    console.log('\n✅ Fichier .env.encrypted créé avec succès!');
    console.log(`📁 Fichier: ${encryptedPath}`);
    console.log('\n🔐 Ce fichier peut être commité sur GitHub car il est chiffré');
    console.log('🔓 Pour l\'utiliser sur une autre machine:');
    console.log('   1. Cloner le repository');
    console.log('   2. Définir CYBERTRACKER_MASTER_KEY');
    console.log('   3. Exécuter: node scripts/decrypt-config.js');
    console.log('   4. Lancer: npm run dev');

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    process.exit(1);
  }
}

main();
