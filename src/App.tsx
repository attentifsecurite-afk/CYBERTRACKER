import { useState, useEffect, useCallback } from 'react';

// Types
interface Threat {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  country: string;
  ip: string;
  timestamp: string;
  status: 'active' | 'blocked' | 'investigating';
  details: string;
}

interface Anomaly {
  id: string;
  type: string;
  description: string;
  severity: number;
  timestamp: string;
  network: string;
}

interface VPNNode {
  id: string;
  ip: string;
  country: string;
  protocol: string;
  status: 'active' | 'blocked' | 'monitored';
  connections: number;
  riskScore: number;
}

interface SEOTarget {
  id: string;
  domain: string;
  type: string;
  status: 'pending' | 'processing' | 'dereferenced' | 'blocked';
  backlinks: number;
  riskLevel: number;
  action: string;
}

// Data generators
const countries = ['Russie', 'Chine', 'Corée du Nord', 'Iran', 'Nigeria', 'Brésil', 'Inde', 'Ukraine', 'Roumanie', 'Vietnam'];
const threatTypes = ['DDoS', 'Phishing', 'Ransomware', 'Botnet C2', 'SQL Injection', 'XSS Attack', 'Zero-Day Exploit', 'Credential Stuffing', 'Crypto Mining', 'Data Exfiltration'];
const ipGen = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

function generateThreats(): Threat[] {
  return Array.from({ length: 15 }, (_, i) => ({
    id: `THR-${String(i + 1).padStart(4, '0')}`,
    type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
    severity: (['critical', 'high', 'medium', 'low'] as const)[Math.floor(Math.random() * 4)],
    source: countries[Math.floor(Math.random() * countries.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    ip: ipGen(),
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    status: (['active', 'blocked', 'investigating'] as const)[Math.floor(Math.random() * 3)],
    details: `Détection automatique - Pattern suspect identifié sur le réseau`
  }));
}

function generateAnomalies(): Anomaly[] {
  const types = ['Trafic inhabituel', 'Port scan détecté', 'Brute force SSH', 'Exfiltration DNS', 'Lateral movement', 'Privilege escalation'];
  return Array.from({ length: 8 }, (_, i) => ({
    id: `ANM-${String(i + 1).padStart(4, '0')}`,
    type: types[Math.floor(Math.random() * types.length)],
    description: `Anomalie détectée sur le segment réseau ${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}.x.x`,
    severity: Math.floor(Math.random() * 100),
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    network: `Segment ${String.fromCharCode(65 + Math.floor(Math.random() * 8))}-${Math.floor(Math.random() * 10)}`
  }));
}

function generateVPNnodes(): VPNNode[] {
  const protocols = ['OpenVPN', 'WireGuard', 'Tor Exit', 'I2P', 'SOCKS5', 'Shadowsocks'];
  return Array.from({ length: 12 }, (_, i) => ({
    id: `VPN-${String(i + 1).padStart(3, '0')}`,
    ip: ipGen(),
    country: countries[Math.floor(Math.random() * countries.length)],
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    status: (['active', 'blocked', 'monitored'] as const)[Math.floor(Math.random() * 3)],
    connections: Math.floor(Math.random() * 500),
    riskScore: Math.floor(Math.random() * 100)
  }));
}

function generateSEOTargets(): SEOTarget[] {
  const domains = ['fraud-shop.dark', 'phishing-kit.xyz', 'carding-forum.cc', 'malware-distro.net', 'stolen-data.io', 'fake-bank.login', 'crypto-scam.tech', 'identity-theft.biz'];
  const types = ['Site de phishing', 'Marketplace illégal', 'Forum de carding', 'Distribution malware', 'Vol d\'identité', 'Escroquerie crypto'];
  return domains.map((domain, i) => ({
    id: `SEO-${String(i + 1).padStart(3, '0')}`,
    domain,
    type: types[i % types.length],
    status: (['pending', 'processing', 'dereferenced', 'blocked'] as const)[Math.floor(Math.random() * 4)],
    backlinks: Math.floor(Math.random() * 10000),
    riskLevel: Math.floor(Math.random() * 100),
    action: ['Signalement Google', 'DMCA Takedown', 'Signalement DNS', 'Blocage ISP'][Math.floor(Math.random() * 4)]
  }));
}

// Components
function Header() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-gray-800 bg-[#0a0e1a]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-full mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center">
              <i className="fas fa-shield-halved text-white text-lg"></i>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              CYBER<span className="text-green-400">TRACKER</span> PRO
            </h1>
            <p className="text-xs text-gray-400 font-mono">Système de Traque de Fraude & Anti-Cybercriminalité</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="status-dot status-active"></span>
              <span className="text-xs text-green-400 font-mono">SYSTÈME ACTIF</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot status-danger animate-blink"></span>
              <span className="text-xs text-red-400 font-mono">MENACES: <span id="threat-count">247</span></span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono text-cyan-400">{time.toLocaleTimeString('fr-FR')}</div>
            <div className="text-xs text-gray-500 font-mono">{time.toLocaleDateString('fr-FR')}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatsPanel({ threats, anomalies, vpnNodes, seoTargets }: { threats: Threat[], anomalies: Anomaly[], vpnNodes: VPNNode[], seoTargets: SEOTarget[] }) {
  const stats = [
    { label: 'Menaces Actives', value: threats.filter(t => t.status === 'active').length, icon: 'fa-skull-crossbones', color: 'text-red-400', bg: 'from-red-500/20 to-red-900/20' },
    { label: 'Anomalies Détectées', value: anomalies.length, icon: 'fa-triangle-exclamation', color: 'text-orange-400', bg: 'from-orange-500/20 to-orange-900/20' },
    { label: 'Nœuds VPN/Tor', value: vpnNodes.filter(v => v.status === 'active').length, icon: 'fa-network-wired', color: 'text-cyan-400', bg: 'from-cyan-500/20 to-cyan-900/20' },
    { label: 'Sites Déréférencés', value: seoTargets.filter(s => s.status === 'dereferenced' || s.status === 'blocked').length, icon: 'fa-ban', color: 'text-green-400', bg: 'from-green-500/20 to-green-900/20' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className={`card-cyber p-4 bg-gradient-to-br ${stat.bg}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color} font-mono mt-1`}>{stat.value}</p>
            </div>
            <i className={`fas ${stat.icon} text-2xl ${stat.color} opacity-50`}></i>
          </div>
          <div className="mt-3 progress-bar">
            <div className={`progress-fill bg-gradient-to-r ${stat.bg.replace('/20', '/60')}`} style={{ width: `${Math.min(stat.value * 10, 100)}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ThreatMap() {
  const [dots, setDots] = useState<{x: number, y: number, id: number}[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        const newDots = [...prev, { x: Math.random() * 100, y: Math.random() * 100, id: Date.now() }];
        return newDots.slice(-20);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-cyber p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <i className="fas fa-globe text-cyan-400"></i>
          Carte Mondiale des Menaces
        </h3>
        <span className="text-xs font-mono text-green-400 animate-blink">● LIVE</span>
      </div>
      <div className="relative w-full h-64 bg-[#0a0e1a] rounded-lg overflow-hidden border border-gray-800">
        {/* Grid overlay */}
        <div className="absolute inset-0 cyber-grid opacity-50"></div>
        
        {/* Simplified world map representation */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 400">
          {/* Continents simplified */}
          <path d="M150,100 Q200,80 250,100 Q280,120 260,150 Q240,180 200,170 Q160,160 150,130 Z" fill="#00ff88" opacity="0.3"/>
          <path d="M350,80 Q450,60 550,80 Q580,100 560,140 Q540,180 480,200 Q420,220 380,180 Q340,140 350,100 Z" fill="#00ff88" opacity="0.3"/>
          <path d="M500,100 Q600,80 700,120 Q720,160 680,200 Q640,240 580,220 Q520,200 500,160 Z" fill="#00ff88" opacity="0.3"/>
          <path d="M180,200 Q220,180 260,200 Q280,240 240,280 Q200,300 180,260 Z" fill="#00ff88" opacity="0.3"/>
          <path d="M600,250 Q650,230 700,260 Q720,300 680,320 Q640,340 600,300 Z" fill="#00ff88" opacity="0.3"/>
        </svg>
        
        {/* Attack dots */}
        {dots.map(dot => (
          <div
            key={dot.id}
            className="absolute w-2 h-2 rounded-full bg-red-500 animate-ping"
            style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
          />
        ))}
        
        {/* Radar sweep */}
        <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2">
          <div className="w-full h-full rounded-full border border-green-500/20 animate-radar">
            <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-b from-green-400 to-transparent origin-bottom"></div>
          </div>
        </div>
        
        {/* Stats overlay */}
        <div className="absolute bottom-2 left-2 text-xs font-mono text-green-400/70">
          <div>SCAN: ACTIF</div>
          <div>NODES: 1,247</div>
          <div>LATENCE: 12ms</div>
        </div>
        <div className="absolute top-2 right-2 text-xs font-mono text-red-400/70">
          <div>ALERTE NIVEAU: ÉLEVÉ</div>
          <div>ATTAQUES/24H: 2,847</div>
        </div>
      </div>
    </div>
  );
}

function ThreatList({ threats }: { threats: Threat[] }) {
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      default: return 'text-green-400 bg-green-500/20 border-green-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return 'fa-circle-exclamation text-red-400';
      case 'blocked': return 'fa-shield text-green-400';
      default: return 'fa-magnifying-glass text-yellow-400';
    }
  };

  return (
    <div className="card-cyber p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <i className="fas fa-list-check text-red-400"></i>
          Menaces Détectées
        </h3>
        <span className="px-2 py-1 text-xs font-mono bg-red-500/20 text-red-400 rounded border border-red-500/30">
          {threats.length} ACTIVES
        </span>
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
        {threats.slice(0, 10).map((threat) => (
          <div key={threat.id} className={`p-3 rounded-lg bg-[#0a0e1a] border border-gray-800 hover:border-gray-600 transition-all ${
            threat.severity === 'critical' ? 'threat-high' : threat.severity === 'high' ? 'threat-medium' : 'threat-low'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <i className={`fas ${getStatusIcon(threat.status)}`}></i>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-white">{threat.id}</span>
                    <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded border ${getSeverityColor(threat.severity)}`}>
                      {threat.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{threat.type} • {threat.source}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-cyan-400">{threat.ip}</p>
                <p className="text-[10px] text-gray-500">{new Date(threat.timestamp).toLocaleTimeString('fr-FR')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnomalyDetector({ anomalies }: { anomalies: Anomaly[] }) {
  return (
    <div className="card-cyber p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <i className="fas fa-wave-square text-orange-400"></i>
          Détection d'Anomalies
        </h3>
        <div className="flex items-center gap-2">
          <span className="status-dot status-active animate-pulse"></span>
          <span className="text-xs text-green-400 font-mono">SCANNING</span>
        </div>
      </div>
      
      {/* Activity graph simulation */}
      <div className="mb-4 h-20 flex items-end gap-0.5">
        {Array.from({ length: 40 }, (_, i) => {
          const height = Math.random() * 100;
          const color = height > 80 ? 'bg-red-500' : height > 60 ? 'bg-orange-500' : height > 40 ? 'bg-yellow-500' : 'bg-green-500';
          return <div key={i} className={`flex-1 ${color} rounded-t opacity-70`} style={{ height: `${height}%` }}></div>;
        })}
      </div>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {anomalies.map((anomaly) => (
          <div key={anomaly.id} className="p-2 rounded bg-[#0a0e1a] border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${anomaly.severity > 70 ? 'bg-red-500' : anomaly.severity > 40 ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
              <div>
                <p className="text-xs text-white font-mono">{anomaly.type}</p>
                <p className="text-[10px] text-gray-500">{anomaly.network}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-cyan-400">{anomaly.severity}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VPNTracker({ vpnNodes }: { vpnNodes: VPNNode[] }) {
  return (
    <div className="card-cyber p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <i className="fas fa-user-secret text-purple-400"></i>
          Détection VPN / Tor / I2P
        </h3>
        <span className="px-2 py-1 text-xs font-mono bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">
          {vpnNodes.length} NŒUDS
        </span>
      </div>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {vpnNodes.map((node) => (
          <div key={node.id} className="p-3 rounded-lg bg-[#0a0e1a] border border-gray-800 hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`status-dot ${node.status === 'active' ? 'status-danger' : node.status === 'blocked' ? 'status-active' : 'status-warning'}`}></span>
                <span className="text-xs font-mono text-white">{node.ip}</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">{node.protocol}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-400"><i className="fas fa-globe mr-1"></i>{node.country}</span>
                <span className="text-[10px] text-gray-400"><i className="fas fa-link mr-1"></i>{node.connections} conn.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${node.riskScore > 70 ? 'bg-red-500' : node.riskScore > 40 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${node.riskScore}%` }}></div>
                </div>
                <span className="text-[10px] font-mono text-gray-400">{node.riskScore}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SEOEngine({ seoTargets }: { seoTargets: SEOTarget[] }) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'dereferenced': return 'text-green-400 bg-green-500/20';
      case 'blocked': return 'text-cyan-400 bg-cyan-500/20';
      case 'processing': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="card-cyber p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <i className="fas fa-spider text-green-400"></i>
          Moteur SEO/AEO - Déréférencement
        </h3>
        <span className="px-2 py-1 text-xs font-mono bg-green-500/20 text-green-400 rounded border border-green-500/30">
          MAILLAGE INVERSE ACTIF
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 bg-[#0a0e1a] rounded-lg">
          <p className="text-lg font-bold text-green-400 font-mono">{seoTargets.filter(s => s.status === 'dereferenced').length}</p>
          <p className="text-[10px] text-gray-400">Déréférencés</p>
        </div>
        <div className="text-center p-2 bg-[#0a0e1a] rounded-lg">
          <p className="text-lg font-bold text-yellow-400 font-mono">{seoTargets.filter(s => s.status === 'processing').length}</p>
          <p className="text-[10px] text-gray-400">En cours</p>
        </div>
        <div className="text-center p-2 bg-[#0a0e1a] rounded-lg">
          <p className="text-lg font-bold text-red-400 font-mono">{seoTargets.filter(s => s.status === 'pending').length}</p>
          <p className="text-[10px] text-gray-400">En attente</p>
        </div>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {seoTargets.map((target) => (
          <div key={target.id} className="p-3 rounded-lg bg-[#0a0e1a] border border-gray-800 hover:border-green-500/30 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-mono text-white">{target.domain}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${getStatusColor(target.status)}`}>
                {target.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400">{target.type}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500">{target.backlinks} backlinks</span>
                <span className="text-[10px] text-cyan-400">{target.action}</span>
              </div>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${target.riskLevel > 70 ? 'bg-red-500' : target.riskLevel > 40 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${target.riskLevel}%` }}></div>
              </div>
              <span className="text-[10px] font-mono text-gray-400">Risque: {target.riskLevel}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NetworkMonitor() {
  const [packets, setPackets] = useState(0);
  const [bandwidth, setBandwidth] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPackets(Math.floor(Math.random() * 50000) + 10000);
      setBandwidth(Math.floor(Math.random() * 500) + 100);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-cyber p-5">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
        <i className="fas fa-chart-line text-cyan-400"></i>
        Moniteur Réseau
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-[#0a0e1a] rounded-lg">
          <p className="text-2xl font-bold text-cyan-400 font-mono">{packets.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Paquets/sec</p>
        </div>
        <div className="text-center p-3 bg-[#0a0e1a] rounded-lg">
          <p className="text-2xl font-bold text-green-400 font-mono">{bandwidth} Mb/s</p>
          <p className="text-xs text-gray-400">Bande passante</p>
        </div>
      </div>
      
      {/* Mini chart */}
      <div className="h-16 flex items-end gap-px">
        {Array.from({ length: 60 }, (_, i) => {
          const h = Math.sin(i * 0.3) * 30 + Math.random() * 40 + 20;
          return <div key={i} className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t opacity-60" style={{ height: `${h}%` }}></div>;
        })}
      </div>
    </div>
  );
}

function ConsoleLog() {
  const [logs, setLogs] = useState<string[]>([]);
  
  const generateLog = useCallback(() => {
    const actions = [
      '[SCAN] Analyse du paquet entrant...',
      '[ALERT] Pattern DDoS détecté - Source: ',
      '[BLOCK] IP blacklistée bloquée: ',
      '[TOR] Nœud de sortie Tor identifié: ',
      '[SEO] Signalement envoyé à Google pour: ',
      '[DNS] Résolution suspecte bloquée: ',
      '[FIREWALL] Règle mise à jour - Port fermé: ',
      '[AI] Modèle ML: confiance 97.3% - Menace confirmée',
      '[VPN] Tunnel WireGuard détecté et analysé',
      '[PHISH] Page de phishing identifiée: ',
      '[DMCA] Takedown request envoyée pour: ',
      '[NET] Anomalie de trafic sur segment B-7',
    ];
    const log = actions[Math.floor(Math.random() * actions.length)] + ipGen();
    return `[${new Date().toLocaleTimeString('fr-FR')}] ${log}`;
  }, []);

  useEffect(() => {
    setLogs(Array.from({ length: 8 }, () => generateLog()));
    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-15), generateLog()]);
    }, 2500);
    return () => clearInterval(interval);
  }, [generateLog]);

  return (
    <div className="card-cyber p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <i className="fas fa-terminal text-green-400"></i>
          Console Système
        </h3>
        <span className="text-xs font-mono text-green-400 animate-blink">●</span>
      </div>
      <div className="bg-black/50 rounded-lg p-3 font-mono text-xs max-h-48 overflow-y-auto border border-gray-800">
        {logs.map((log, i) => (
          <div key={i} className={`py-0.5 ${log.includes('[ALERT]') || log.includes('[BLOCK]') ? 'text-red-400' : log.includes('[SEO]') || log.includes('[DMCA]') ? 'text-green-400' : log.includes('[TOR]') || log.includes('[VPN]') ? 'text-purple-400' : 'text-gray-400'}`}>
            {log}
          </div>
        ))}
        <div className="text-green-400 animate-blink">█</div>
      </div>
    </div>
  );
}

function NavigationTabs({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
    { id: 'threats', label: 'Menaces', icon: 'fa-skull-crossbones' },
    { id: 'vpn', label: 'VPN/Tor', icon: 'fa-user-secret' },
    { id: 'seo', label: 'SEO/AEO', icon: 'fa-spider' },
    { id: 'network', label: 'Réseau', icon: 'fa-network-wired' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === tab.id 
              ? 'tab-active text-green-400' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <i className={`fas ${tab.icon}`}></i>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Main App
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [threats] = useState<Threat[]>(generateThreats);
  const [anomalies] = useState<Anomaly[]>(generateAnomalies);
  const [vpnNodes] = useState<VPNNode[]>(generateVPNnodes);
  const [seoTargets] = useState<SEOTarget[]>(generateSEOTargets);

  return (
    <div className="min-h-screen bg-[#0a0e1a] cyber-grid">
      <Header />
      
      <main className="max-w-[1600px] mx-auto px-4 py-6">
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <StatsPanel threats={threats} anomalies={anomalies} vpnNodes={vpnNodes} seoTargets={seoTargets} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ThreatMap />
              <NetworkMonitor />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ThreatList threats={threats} />
              <AnomalyDetector anomalies={anomalies} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VPNTracker vpnNodes={vpnNodes} />
              <ConsoleLog />
            </div>
          </div>
        )}

        {activeTab === 'threats' && (
          <div className="space-y-6">
            <StatsPanel threats={threats} anomalies={anomalies} vpnNodes={vpnNodes} seoTargets={seoTargets} />
            <ThreatMap />
            <ThreatList threats={threats} />
            <ConsoleLog />
          </div>
        )}

        {activeTab === 'vpn' && (
          <div className="space-y-6">
            <div className="card-cyber p-6">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <i className="fas fa-user-secret text-purple-400"></i>
                Détection & Analyse VPN/Tor/I2P
              </h2>
              <p className="text-sm text-gray-400">Identification des nœuds anonymes utilisés par les cybercriminels pour masquer leur identité et localisation.</p>
            </div>
            <VPNTracker vpnNodes={vpnNodes} />
            <NetworkMonitor />
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="card-cyber p-6">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <i className="fas fa-spider text-green-400"></i>
                Moteur SEO/AEO - Déréférencement & Maillage Inverse
              </h2>
              <p className="text-sm text-gray-400">Système de déréférencement des sites frauduleux, phishing, et atteinte aux personnes. Maillage SEO inverse pour neutraliser le référencement des sites malveillants.</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-[#0a0e1a] rounded-lg border border-gray-800">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-1">SEO Inverse</h4>
                  <p className="text-xs text-gray-400">Création de signaux négatifs pour déclasser les sites frauduleux dans les résultats de recherche.</p>
                </div>
                <div className="p-3 bg-[#0a0e1a] rounded-lg border border-gray-800">
                  <h4 className="text-sm font-semibold text-green-400 mb-1">AEO (Answer Engine)</h4>
                  <p className="text-xs text-gray-400">Optimisation pour les moteurs de réponse IA afin de bloquer les contenus frauduleux.</p>
                </div>
                <div className="p-3 bg-[#0a0e1a] rounded-lg border border-gray-800">
                  <h4 className="text-sm font-semibold text-purple-400 mb-1">Maillage Inverse</h4>
                  <p className="text-xs text-gray-400">Analyse et neutralisation des backlinks toxiques pointant vers les sites malveillants.</p>
                </div>
              </div>
            </div>
            <SEOEngine seoTargets={seoTargets} />
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-6">
            <NetworkMonitor />
            <AnomalyDetector anomalies={anomalies} />
            <ConsoleLog />
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 mt-8 py-4">
        <div className="max-w-[1600px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500 font-mono">
            CYBERTRACKER PRO v3.7.2 • Système de Lutte Anti-Cybercriminalité
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 font-mono">
              <i className="fas fa-lock text-green-400 mr-1"></i>Connexion chiffrée AES-256
            </span>
            <span className="text-xs text-gray-500 font-mono">
              <i className="fas fa-server text-cyan-400 mr-1"></i>Nodes: 1,247 actifs
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
