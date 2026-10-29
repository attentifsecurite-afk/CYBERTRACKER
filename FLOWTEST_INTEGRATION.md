# 🔗 Intégration FlowTest - CESNET

## 📋 Vue d'ensemble

FlowTest est un projet open-source de CESNET qui fournit un testbed complet pour tester des sondes de monitoring réseau NetFlow/IPFIX. Il inclut des outils pour générer et rejouer du trafic réseau réaliste à haute vitesse (1/10/100 Gbps).

**Projet GitHub** : https://github.com/CESNET/FlowTest

---

## 🎯 Intégration dans CYBERTRACKER PRO

Nous avons intégré les concepts de FlowTest dans CYBERTRACKER PRO pour fournir une analyse de flux réseau en temps réel avec détection d'anomalies.

### Fonctionnalités Ajoutées

#### 1. Service FlowTest (`src/services/flowTestService.ts`)

**Interfaces principales** :

```typescript
interface NetworkFlow {
  id: string;
  timestamp: Date;
  srcIP: string;
  dstIP: string;
  srcPort: number;
  dstPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'DNS' | 'SSH' | 'FTP';
  bytesSent: number;
  bytesReceived: number;
  packetsSent: number;
  packetsReceived: number;
  duration: number;
  flowDirection: 'inbound' | 'outbound' | 'internal';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  threatType?: string;
  country?: string;
  city?: string;
  asn?: string;
}

interface FlowAnomaly {
  id: string;
  type: 'port_scan' | 'ddos' | 'data_exfiltration' | 'brute_force' | 'lateral_movement' | 'c2_communication';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedFlows: string[];
  timestamp: Date;
  srcIP?: string;
  dstIP?: string;
}

interface FlowProfile {
  id: string;
  name: string;
  totalFlows: number;
  totalBytes: number;
  avgFlowDuration: number;
  topProtocols: Array<{ protocol: string; count: number; percentage: number }>;
  topPorts: Array<{ port: number; count: number; percentage: number }>;
  suspiciousFlows: number;
  timestamp: Date;
}
```

**Classes et fonctions** :

- `FlowMonitor` : Classe pour surveiller les flux en temps réel
- `generateFlowAnalysis()` : Génère une analyse de flux réaliste
- `analyzeFlowThreat()` : Analyse un flux pour détecter des menaces

#### 2. Page Flow Analysis (`src/pages/FlowAnalysisPage.tsx`)

**Fonctionnalités** :

- ✅ **Monitoring en temps réel** : Surveillance continue des flux réseau
- ✅ **Visualisation animée** : Canvas avec particules représentant les flux
- ✅ **Détection d'anomalies** : Identification automatique des comportements suspects
- ✅ **Analyse de menaces** : Détection de port scans, DDoS, exfiltration, etc.
- ✅ **Profils réseau** : Statistiques sur les protocoles, ports, durée des flux
- ✅ **Géolocalisation** : Pays, ville et ASN pour chaque flux
- ✅ **Modal de détails** : Informations complètes sur chaque flux

**Modes de visualisation** :

1. **Network Flows** : Liste des flux avec analyse de risque
2. **Anomalies** : Détections d'anomalies avec sévérité
3. **Network Profile** : Statistiques et distribution des protocoles

---

## 🔍 Détection de Menaces

Le système analyse chaque flux pour détecter :

### 1. Port Scan
```typescript
if (flow.packetsSent > 100 && flow.bytesSent < 10000) {
  confidence += 30;
  threatType = 'Port Scan';
}
```
**Indicateurs** :
- Nombre élevé de paquets
- Faible volume de données
- Recommandation : Surveiller l'IP source

### 2. DDoS Attack
```typescript
if (flow.bytesSent > 500000 && flow.duration < 5000) {
  confidence += 40;
  threatType = 'DDoS Attack';
}
```
**Indicateurs** :
- Volume de données très élevé
- Durée très courte
- Recommandation : Rate limiting ou blocage

### 3. Data Exfiltration
```typescript
if (flow.bytesSent > 1000000 && flow.flowDirection === 'outbound') {
  confidence += 35;
  threatType = 'Data Exfiltration';
}
```
**Indicateurs** :
- Transfert de données important
- Direction sortante
- Recommandation : Investiguer les données envoyées

### 4. Brute Force
```typescript
if (flow.packetsSent > 50 && flow.dstPort === 22 && flow.duration < 10000) {
  confidence += 45;
  threatType = 'Brute Force';
}
```
**Indicateurs** :
- Nombre élevé de paquets
- Port SSH (22)
- Durée courte
- Recommandation : Bloquer l'IP source

### 5. C2 Communication
```typescript
if (flow.protocol === 'HTTPS' && flow.duration > 30000 && flow.bytesReceived > flow.bytesSent * 2) {
  confidence += 25;
  threatType = 'C2 Communication';
}
```
**Indicateurs** :
- Protocole HTTPS
- Longue durée
- Plus de données reçues qu'envoyées
- Recommandation : Analyser la réputation de l'IP de destination

---

## 🎨 Visualisation

### Canvas Animation

La page utilise un canvas HTML5 pour visualiser les flux en temps réel :

```typescript
// Dessin des particules représentant les flux
flows.slice(0, 50).forEach((flow, index) => {
  const x = (index / 50) * width;
  const y = height / 2 + Math.sin(Date.now() / 1000 + index) * 50;
  
  const color = flow.riskLevel === 'critical' ? '#ff006e' :
               flow.riskLevel === 'high' ? '#ff6b00' :
               flow.riskLevel === 'medium' ? '#ffcc00' : '#00ff9d';

  // Dessin de la particule
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // Dessin de la lueur
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fillStyle = color + '40';
  ctx.fill();
});
```

**Caractéristiques** :
- ✅ Particules animées avec mouvement sinusoïdal
- ✅ Couleurs selon le niveau de risque
- ✅ Effet de lueur (glow)
- ✅ Lignes de connexion entre particules
- ✅ Mise à jour en temps réel

---

## 📊 Statistiques et Profils

### Network Profile

Le système génère automatiquement un profil réseau avec :

- **Total Flows** : Nombre total de flux analysés
- **Total Bytes** : Volume de données transférées (en MB)
- **Average Duration** : Durée moyenne des flux
- **Top Protocols** : Distribution des protocoles (TCP, UDP, HTTP, etc.)
- **Suspicious Flows** : Nombre de flux suspects
- **Anomalies** : Nombre d'anomalies détectées

### Distribution des Protocoles

```typescript
const protocolCounts: Record<string, number> = {};
flows.forEach(f => {
  protocolCounts[f.protocol] = (protocolCounts[f.protocol] || 0) + 1;
});

const topProtocols = Object.entries(protocolCounts)
  .map(([protocol, count]) => ({
    protocol,
    count,
    percentage: (count / flows.length) * 100
  }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 5);
```

**Visualisation** : Barres de progression avec pourcentages

---

## 🚀 Utilisation

### Démarrer le Monitoring

1. Cliquer sur l'onglet **"Flow Analysis"** dans la navigation
2. Cliquer sur le bouton **"Start Monitoring"**
3. Le système commence à générer et analyser des flux en temps réel

### Analyser les Flux

- **Vue Flows** : Voir la liste des flux avec leur niveau de risque
- **Vue Anomalies** : Voir les anomalies détectées avec leur sévérité
- **Vue Profile** : Voir les statistiques et la distribution des protocoles

### Détails d'un Flux

Cliquer sur un flux pour voir :
- Source et destination (IP:Port)
- Protocole et direction
- Volume de données (envoi/réception)
- Nombre de paquets
- Durée du flux
- Niveau de risque
- Localisation (pays, ville, ASN)
- Type de menace détectée
- Recommandations de sécurité

---

## 🔧 Configuration

### FlowMonitor Class

```typescript
const monitor = new FlowMonitor();

// Démarrer le monitoring
monitor.start((flows, anomalies) => {
  console.log('Nouveaux flux:', flows);
  console.log('Nouvelles anomalies:', anomalies);
});

// Arrêter le monitoring
monitor.stop();

// Obtenir les flux actuels
const currentFlows = monitor.getFlows();

// Obtenir les anomalies actuelles
const currentAnomalies = monitor.getAnomalies();
```

### Paramètres

- **Intervalle de mise à jour** : 2 secondes
- **Nombre maximum de flux** : 200 (les plus anciens sont supprimés)
- **Nombre maximum d'anomalies** : 20
- **Taux de flux suspects** : ~15% (simulation réaliste)

---

## 📈 Performance

### Optimisations

- ✅ Canvas rendering optimisé
- ✅ Limitation à 50 flux affichés simultanément
- ✅ Mise à jour toutes les 2 secondes
- ✅ Nettoyage automatique des anciens flux
- ✅ Pas de mémoire leak (cleanup dans useEffect)

### Build

```
✓ 50 modules transformed
✓ Built in 6.66s

Tailles :
- CSS: 124.70 kB (gzip: 19.39 kB)
- JS: 1,383.46 kB (gzip: 375.56 kB)
```

---

## 🎯 Inspiration FlowTest

### Outils FlowTest Originaux

1. **ft-profiler** : Créer des profils réseau à partir de records NetFlow/IPFIX
2. **ft-profile-sampler** : Réduire la taille des profils réseau haute vitesse
3. **ft-profile-trimmer** : Nettoyer les profils des records excessifs
4. **ft-generator** : Générer du trafic réseau réaliste basé sur des profils
5. **ft-replay** : Rejouer des PCAPs à très haute vitesse (1/10/100 Gbps)
6. **ft-analyzer** : Bibliothèque pour comparer des flow records
7. **ft-orchestration** : Outil d'orchestration pour tests automatisés

### Adaptation pour CYBERTRACKER PRO

Nous avons adapté les concepts de FlowTest pour :

- ✅ Générer des flux réseau réalistes (simulation de ft-generator)
- ✅ Analyser les flux pour détecter des anomalies (inspiration de ft-analyzer)
- ✅ Créer des profils réseau (inspiration de ft-profiler)
- ✅ Visualiser les flux en temps réel (inspiration de ft-replay)
- ✅ Orchestrer le monitoring (inspiration de ft-orchestration)

---

## 📚 Documentation FlowTest

**Repository GitHub** : https://github.com/CESNET/FlowTest

**Documentation officielle** :
- README.md : Instructions d'installation et d'utilisation
- Outils : Documentation de chaque outil dans `/tools/`
- Datasets : Profils réseau et PCAPs annotés dans `/pcap/` et `/testing/`

**Langages** :
- C++ : 65.6% (ft-generator, ft-replay, ft-profile-sampler)
- Python : 32.9% (ft-profiler, ft-analyzer, ft-orchestration)
- CMake : 1.4%

**Licence** : BSD-3-Clause

---

## 🎉 Résultat

**FlowTest est maintenant intégré dans CYBERTRACKER PRO avec :**

- ✅ Service d'analyse de flux réseau en temps réel
- ✅ Page dédiée avec visualisation animée
- ✅ Détection automatique d'anomalies
- ✅ Analyse de menaces avec recommandations
- ✅ Profils réseau avec statistiques
- ✅ Géolocalisation des flux
- ✅ Interface cyberpunk futuriste
- ✅ Build réussi sans erreurs

---

**Version** : CYBERTRACKER PRO v5.0  
**Statut** : ✅ FLOWTEST INTÉGRÉ  
**Dernière mise à jour** : 2024
