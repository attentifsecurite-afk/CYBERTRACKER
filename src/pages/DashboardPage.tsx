import { useState, useEffect } from 'react';
import GoogleMaps from '../components/GoogleMaps';
import ThreatFeed from '../components/ThreatFeed';

interface Threat {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  country: string;
  ip: string;
  timestamp: string;
  status: 'active' | 'blocked' | 'investigating';
}

interface Anomaly {
  id: string;
  type: string;
  severity: number;
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

const countries = ['Russie', 'Chine', 'Corée du Nord', 'Iran', 'Nigeria', 'Brésil', 'Inde', 'Ukraine', 'Roumanie', 'Vietnam'];
const threatTypes = ['DDoS', 'Phishing', 'Ransomware', 'Botnet C2', 'SQL Injection', 'XSS Attack', 'Zero-Day Exploit', 'Credential Stuffing', 'Crypto Mining', 'Data Exfiltration'];
const ipGen = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

export default function DashboardPage() {
  const [threats] = useState<Threat[]>(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: `THR-${String(i + 1).padStart(4, '0')}`,
      type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      severity: (['critical', 'high', 'medium', 'low'] as const)[Math.floor(Math.random() * 4)],
      source: countries[Math.floor(Math.random() * countries.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      ip: ipGen(),
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      status: (['active', 'blocked', 'investigating'] as const)[Math.floor(Math.random() * 3)],
    }))
  );

  const [anomalies] = useState<Anomaly[]>(() => {
    const types = ['Trafic inhabituel', 'Port scan', 'Brute force SSH', 'Exfiltration DNS', 'Lateral movement'];
    return Array.from({ length: 8 }, (_, i) => ({
      id: `ANM-${String(i + 1).padStart(4, '0')}`,
      type: types[Math.floor(Math.random() * types.length)],
      severity: Math.floor(Math.random() * 100),
      network: `Segment ${String.fromCharCode(65 + Math.floor(Math.random() * 8))}-${Math.floor(Math.random() * 10)}`
    }));
  });

  const [vpnNodes] = useState<VPNNode[]>(() => {
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
  });

  const [seoTargets] = useState<SEOTarget[]>(() => {
    const domains = ['fraud-shop.dark', 'phishing-kit.xyz', 'carding-forum.cc', 'malware-distro.net', 'stolen-data.io', 'fake-bank.login', 'crypto-scam.tech', 'identity-theft.biz'];
    const types = ['Phishing', 'Marketplace', 'Carding', 'Malware', 'Vol identité', 'Escroquerie'];
    return domains.map((domain, i) => ({
      id: `SEO-${String(i + 1).padStart(3, '0')}`,
      domain,
      type: types[i % types.length],
      status: (['pending', 'processing', 'dereferenced', 'blocked'] as const)[Math.floor(Math.random() * 4)],
      backlinks: Math.floor(Math.random() * 10000),
      riskLevel: Math.floor(Math.random() * 100),
      action: ['Signalement Google', 'DMCA Takedown', 'Signalement DNS', 'Blocage ISP'][Math.floor(Math.random() * 4)]
    }));
  });

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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 animate-hologram">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron">Menaces Actives</p>
              <p className="text-4xl font-bold neon-text-pink font-orbitron mt-2">{threats.filter(t => t.status === 'active').length}</p>
            </div>
            <i className="fas fa-skull-crossbones text-3xl text-pink-500 opacity-50"></i>
          </div>
          <div className="cyber-progress">
            <div className="cyber-progress-fill bg-gradient-to-r from-pink-500 to-red-500" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="glass-card p-5 animate-hologram" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron">Anomalies</p>
              <p className="text-4xl font-bold neon-text-blue font-orbitron mt-2">{anomalies.length}</p>
            </div>
            <i className="fas fa-triangle-exclamation text-3xl text-cyan-500 opacity-50"></i>
          </div>
          <div className="cyber-progress">
            <div className="cyber-progress-fill bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: '60%' }}></div>
          </div>
        </div>

        <div className="glass-card p-5 animate-hologram" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron">Nœuds VPN/Tor</p>
              <p className="text-4xl font-bold neon-text-purple font-orbitron mt-2">{vpnNodes.filter(v => v.status === 'active').length}</p>
            </div>
            <i className="fas fa-network-wired text-3xl text-purple-500 opacity-50"></i>
          </div>
          <div className="cyber-progress">
            <div className="cyber-progress-fill bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '45%' }}></div>
          </div>
        </div>

        <div className="glass-card p-5 animate-hologram" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron">Déréférencés</p>
              <p className="text-4xl font-bold neon-text-green font-orbitron mt-2">{seoTargets.filter(s => s.status === 'dereferenced' || s.status === 'blocked').length}</p>
            </div>
            <i className="fas fa-ban text-3xl text-green-500 opacity-50"></i>
          </div>
          <div className="cyber-progress">
            <div className="cyber-progress-fill bg-gradient-to-r from-green-500 to-cyan-500" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>

      {/* World Map */}
      <GoogleMaps />

      {/* Feed + Network */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatFeed />
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold neon-text-blue font-orbitron flex items-center gap-3 mb-4">
            <i className="fas fa-chart-line"></i>
            Moniteur Réseau
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-black/40 rounded-lg border border-cyan-500/20">
              <p className="text-3xl font-bold neon-text-cyan font-orbitron">{packets.toLocaleString()}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Paquets/sec</p>
            </div>
            <div className="text-center p-4 bg-black/40 rounded-lg border border-green-500/20">
              <p className="text-3xl font-bold neon-text-green font-orbitron">{bandwidth} Mb/s</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Bande passante</p>
            </div>
          </div>
          <div className="h-20 flex items-end gap-1">
            {Array.from({ length: 60 }, (_, i) => {
              const h = Math.sin(i * 0.3) * 30 + Math.random() * 40 + 20;
              return <div key={i} className="flex-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t opacity-70" style={{ height: `${h}%` }}></div>;
            })}
          </div>
        </div>
      </div>

      {/* Threats + Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold neon-text-pink font-orbitron flex items-center gap-3 mb-4">
            <i className="fas fa-list-check"></i>
            Menaces Récentes
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {threats.slice(0, 8).map((threat) => (
              <div key={threat.id} className={`p-3 rounded-lg bg-black/40 border border-gray-800 ${
                threat.severity === 'critical' ? 'threat-critical' : 
                threat.severity === 'high' ? 'threat-high' : 
                threat.severity === 'medium' ? 'threat-medium' : 'threat-low'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`status-indicator ${threat.status === 'active' ? 'status-danger' : threat.status === 'blocked' ? 'status-active' : 'status-warning'}`}></span>
                    <div>
                      <span className="text-sm font-mono text-white font-bold">{threat.id}</span>
                      <span className={`ml-2 px-2 py-0.5 text-[10px] font-mono rounded border ${
                        threat.severity === 'critical' ? 'bg-pink-500/20 text-pink-400 border-pink-500/50' :
                        threat.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' :
                        threat.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-green-500/20 text-green-400 border-green-500/50'
                      }`}>{threat.severity.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono neon-text-blue">{threat.ip}</p>
                    <p className="text-[10px] text-gray-500">{threat.type} • {threat.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold neon-text-orange font-orbitron flex items-center gap-3 mb-4">
            <i className="fas fa-wave-square"></i>
            Anomalies Réseau
          </h3>
          <div className="mb-4 h-20 flex items-end gap-1">
            {Array.from({ length: 30 }, (_, i) => {
              const h = Math.random() * 100;
              const color = h > 80 ? 'from-pink-500 to-red-500' : h > 60 ? 'from-orange-500 to-yellow-500' : h > 40 ? 'from-yellow-500 to-green-500' : 'from-green-500 to-cyan-500';
              return <div key={i} className={`flex-1 bg-gradient-to-t ${color} rounded-t opacity-70`} style={{ height: `${h}%` }}></div>;
            })}
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {anomalies.map((a) => (
              <div key={a.id} className="p-2 rounded-lg bg-black/40 border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${a.severity > 70 ? 'bg-pink-500' : a.severity > 40 ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-xs text-white font-mono">{a.type}</span>
                </div>
                <span className="text-xs font-mono neon-text-blue">{a.severity}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VPN + Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold neon-text-purple font-orbitron flex items-center gap-3 mb-4">
            <i className="fas fa-user-secret"></i>
            Nœuds Anonymes Détectés
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {vpnNodes.slice(0, 6).map((node) => (
              <div key={node.id} className="p-3 rounded-lg bg-black/40 border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`status-indicator ${node.status === 'active' ? 'status-danger' : node.status === 'blocked' ? 'status-active' : 'status-warning'}`}></span>
                  <span className="text-xs font-mono text-white">{node.ip}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">{node.protocol}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${node.riskScore > 70 ? 'bg-pink-500' : node.riskScore > 40 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${node.riskScore}%` }}></div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">{node.riskScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold neon-text-green font-orbitron flex items-center gap-3 mb-4">
            <i className="fas fa-terminal"></i>
            Console Live
          </h3>
          <div className="bg-black/60 rounded-lg p-4 font-mono text-xs max-h-64 overflow-y-auto border border-green-500/20">
            {Array.from({ length: 12 }, (_, i) => {
              const actions = ['[SCAN] Analyse paquet...', '[ALERT] DDoS détecté', '[BLOCK] IP bloquée', '[TOR] Nœud identifié', '[BRAVE] API query sent', '[AI] ML confidence 97%'];
              const log = `[${new Date(Date.now() - i * 3000).toLocaleTimeString('fr-FR')}] ${actions[i % actions.length]} ${ipGen()}`;
              const color = log.includes('[ALERT]') || log.includes('[BLOCK]') ? 'neon-text-pink' : log.includes('[BRAVE]') ? 'neon-text-blue' : log.includes('[TOR]') ? 'neon-text-purple' : 'text-gray-400';
              return <div key={i} className={`py-0.5 ${color}`}>{log}</div>;
            })}
            <div className="neon-text-green animate-pulse">█</div>
          </div>
        </div>
      </div>
    </div>
  );
}
