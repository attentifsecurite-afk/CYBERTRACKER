import { useState, useEffect } from 'react';

interface Anomaly {
  id: string;
  type: string;
  description: string;
  severity: number;
  timestamp: string;
  network: string;
  source: string;
  destination: string;
  protocol: string;
  packets: number;
}

const anomalyTypes = ['Trafic inhabituel', 'Port scan détecté', 'Brute force SSH', 'Exfiltration DNS', 'Lateral movement', 'Privilege escalation', 'ARP Spoofing', 'DNS Tunneling', 'ICMP Flood', 'SYN Flood'];
const ipGen = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
const protocols = ['TCP', 'UDP', 'ICMP', 'DNS', 'HTTP', 'SSH', 'FTP'];

export default function NetworkPage() {
  const [anomalies] = useState<Anomaly[]>(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: `ANM-${String(i + 1).padStart(4, '0')}`,
      type: anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)],
      description: `Anomalie détectée sur le segment réseau ${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}.x.x`,
      severity: Math.floor(Math.random() * 100),
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      network: `Segment ${String.fromCharCode(65 + Math.floor(Math.random() * 8))}-${Math.floor(Math.random() * 10)}`,
      source: ipGen(),
      destination: ipGen(),
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      packets: Math.floor(Math.random() * 10000)
    }))
  );

  const [packets, setPackets] = useState(0);
  const [bandwidth, setBandwidth] = useState(0);
  const [connections, setConnections] = useState(0);
  const [dropped, setDropped] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPackets(Math.floor(Math.random() * 50000) + 10000);
      setBandwidth(Math.floor(Math.random() * 500) + 100);
      setConnections(Math.floor(Math.random() * 5000) + 1000);
      setDropped(Math.floor(Math.random() * 200) + 10);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h2 className="text-3xl font-bold neon-text-blue font-orbitron flex items-center gap-3 mb-2">
          <i className="fas fa-network-wired"></i>
          Moniteur Réseau & Détection d'Anomalies
        </h2>
        <p className="text-sm text-gray-400">
          Surveillance en temps réel du trafic réseau, détection d'anomalies comportementales et analyse des flux suspects.
        </p>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 animate-hologram">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron">Paquets/sec</p>
              <p className="text-3xl font-bold neon-text-blue font-orbitron mt-1">{packets.toLocaleString()}</p>
            </div>
            <i className="fas fa-exchange-alt text-2xl text-cyan-500 opacity-50"></i>
          </div>
          <div className="h-12 flex items-end gap-px">
            {Array.from({ length: 20 }, (_, i) => {
              const h = Math.sin(i * 0.5) * 30 + Math.random() * 40 + 20;
              return <div key={i} className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t opacity-70" style={{ height: `${h}%` }}></div>;
            })}
          </div>
        </div>
        <div className="glass-card p-5 animate-hologram" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron">Bande passante</p>
              <p className="text-3xl font-bold neon-text-green font-orbitron mt-1">{bandwidth} Mb/s</p>
            </div>
            <i className="fas fa-signal text-2xl text-green-500 opacity-50"></i>
          </div>
          <div className="h-12 flex items-end gap-px">
            {Array.from({ length: 20 }, (_, i) => {
              const h = Math.cos(i * 0.4) * 30 + Math.random() * 40 + 20;
              return <div key={i} className="flex-1 bg-gradient-to-t from-green-500 to-cyan-500 rounded-t opacity-70" style={{ height: `${h}%` }}></div>;
            })}
          </div>
        </div>
        <div className="glass-card p-5 animate-hologram" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron">Connexions</p>
              <p className="text-3xl font-bold neon-text-purple font-orbitron mt-1">{connections.toLocaleString()}</p>
            </div>
            <i className="fas fa-plug text-2xl text-purple-500 opacity-50"></i>
          </div>
          <div className="h-12 flex items-end gap-px">
            {Array.from({ length: 20 }, (_, i) => {
              const h = Math.sin(i * 0.6 + 1) * 30 + Math.random() * 40 + 20;
              return <div key={i} className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t opacity-70" style={{ height: `${h}%` }}></div>;
            })}
          </div>
        </div>
        <div className="glass-card p-5 animate-hologram" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron">Paquets bloqués</p>
              <p className="text-3xl font-bold neon-text-pink font-orbitron mt-1">{dropped}</p>
            </div>
            <i className="fas fa-shield text-2xl text-pink-500 opacity-50"></i>
          </div>
          <div className="h-12 flex items-end gap-px">
            {Array.from({ length: 20 }, (_, i) => {
              const h = Math.random() * 60 + 10;
              return <div key={i} className="flex-1 bg-gradient-to-t from-pink-500 to-red-500 rounded-t opacity-70" style={{ height: `${h}%` }}></div>;
            })}
          </div>
        </div>
      </div>

      {/* Network Topology */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold neon-text-blue font-orbitron flex items-center gap-3 mb-4">
          <i className="fas fa-project-diagram"></i>
          Topologie Réseau
        </h3>
        <div className="relative w-full h-48 bg-black/40 rounded-lg overflow-hidden border border-cyan-500/20">
          <svg className="w-full h-full" viewBox="0 0 800 200">
            {/* Nodes */}
            {[
              { x: 100, y: 100, label: 'Firewall', color: '#ff6b00' },
              { x: 250, y: 60, label: 'Serveur Web', color: '#00ff9d' },
              { x: 250, y: 140, label: 'Serveur DB', color: '#00ff9d' },
              { x: 400, y: 100, label: 'Switch Core', color: '#00f0ff' },
              { x: 550, y: 60, label: 'Segment A', color: '#b829ff' },
              { x: 550, y: 140, label: 'Segment B', color: '#b829ff' },
              { x: 700, y: 100, label: 'DMZ', color: '#ff006e' },
            ].map((node, i) => (
              <g key={i}>
                <circle cx={node.x} cy={node.y} r="18" fill={node.color} opacity="0.2"/>
                <circle cx={node.x} cy={node.y} r="10" fill={node.color} opacity="0.8"/>
                <text x={node.x} y={node.y + 28} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">{node.label}</text>
              </g>
            ))}
            {/* Connections */}
            <line x1="100" y1="100" x2="250" y2="60" stroke="#00ff9d" strokeWidth="1.5" opacity="0.4"/>
            <line x1="100" y1="100" x2="250" y2="140" stroke="#00ff9d" strokeWidth="1.5" opacity="0.4"/>
            <line x1="250" y1="60" x2="400" y2="100" stroke="#00f0ff" strokeWidth="1.5" opacity="0.4"/>
            <line x1="250" y1="140" x2="400" y2="100" stroke="#00f0ff" strokeWidth="1.5" opacity="0.4"/>
            <line x1="400" y1="100" x2="550" y2="60" stroke="#b829ff" strokeWidth="1.5" opacity="0.4"/>
            <line x1="400" y1="100" x2="550" y2="140" stroke="#b829ff" strokeWidth="1.5" opacity="0.4"/>
            <line x1="550" y1="60" x2="700" y2="100" stroke="#ff006e" strokeWidth="1.5" opacity="0.4"/>
            <line x1="550" y1="140" x2="700" y2="100" stroke="#ff006e" strokeWidth="1.5" opacity="0.4"/>
            
            {/* Animated data flow */}
            <circle r="4" fill="#00ff9d">
              <animateMotion dur="3s" repeatCount="indefinite" path="M100,100 L250,60 L400,100 L550,60 L700,100"/>
            </circle>
            <circle r="4" fill="#00f0ff">
              <animateMotion dur="4s" repeatCount="indefinite" path="M100,100 L250,140 L400,100 L550,140 L700,100"/>
            </circle>
          </svg>
        </div>
      </div>

      {/* Anomaly Detection */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold neon-text-orange font-orbitron flex items-center gap-3">
            <i className="fas fa-wave-square"></i>
            Anomalies Détectées ({anomalies.length})
          </h3>
          <div className="flex items-center gap-2">
            <span className="status-indicator status-active"></span>
            <span className="text-xs neon-text-green font-mono">SCANNING ACTIF</span>
          </div>
        </div>

        {/* Activity Graph */}
        <div className="mb-4 h-24 flex items-end gap-px">
          {Array.from({ length: 60 }, (_, i) => {
            const height = Math.random() * 100;
            const color = height > 80 ? 'from-pink-500 to-red-500' : height > 60 ? 'from-orange-500 to-yellow-500' : height > 40 ? 'from-yellow-500 to-green-500' : 'from-green-500 to-cyan-500';
            return <div key={i} className={`flex-1 bg-gradient-to-t ${color} rounded-t opacity-70`} style={{ height: `${height}%` }}></div>;
          })}
        </div>

        {/* Anomaly Table */}
        <div className="overflow-x-auto">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Proto</th>
                <th>Paquets</th>
                <th>Sévérité</th>
                <th>Segment</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map((anomaly) => (
                <tr key={anomaly.id}>
                  <td className="font-mono text-white font-bold">{anomaly.id}</td>
                  <td className="text-gray-300">{anomaly.type}</td>
                  <td className="font-mono neon-text-blue">{anomaly.source}</td>
                  <td className="font-mono neon-text-blue">{anomaly.destination}</td>
                  <td className="font-mono neon-text-purple">{anomaly.protocol}</td>
                  <td className="font-mono text-gray-400">{anomaly.packets.toLocaleString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${anomaly.severity > 70 ? 'bg-pink-500' : anomaly.severity > 40 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                          style={{ width: `${anomaly.severity}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono text-gray-400">{anomaly.severity}%</span>
                    </div>
                  </td>
                  <td className="text-gray-400">{anomaly.network}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Protocol Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold neon-text-purple font-orbitron flex items-center gap-3 mb-4">
            <i className="fas fa-chart-pie"></i>
            Distribution des Protocoles
          </h3>
          <div className="space-y-3">
            {protocols.map(protocol => {
              const count = anomalies.filter(a => a.protocol === protocol).length;
              const percent = (count / anomalies.length) * 100;
              return (
                <div key={protocol} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-12 font-mono">{protocol}</span>
                  <div className="flex-1 h-6 bg-black/40 rounded-lg overflow-hidden border border-gray-800">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-end pr-3"
                      style={{ width: `${percent}%` }}
                    >
                      <span className="text-xs font-mono text-white font-bold">{count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold neon-text-green font-orbitron flex items-center gap-3 mb-4">
            <i className="fas fa-shield"></i>
            Règles Firewall Actives
          </h3>
          <div className="space-y-2">
            {[
              { rule: 'BLOCK ALL FROM TOR EXIT NODES', status: 'active', hits: 1247 },
              { rule: 'RATE LIMIT SSH (max 5/min)', status: 'active', hits: 892 },
              { rule: 'BLOCK KNOWN MALWARE IPS', status: 'active', hits: 2341 },
              { rule: 'INSPECT DNS QUERIES', status: 'active', hits: 567 },
              { rule: 'BLOCK CRYPTO MINING POOLS', status: 'active', hits: 123 },
              { rule: 'GEO-BLOCK HIGH RISK COUNTRIES', status: 'active', hits: 3456 },
            ].map((rule, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-gray-800 hover:border-green-500/30 transition-all">
                <div className="flex items-center gap-2">
                  <span className="status-indicator status-active"></span>
                  <span className="text-xs font-mono text-white font-bold">{rule.rule}</span>
                </div>
                <span className="text-xs font-mono neon-text-blue font-bold">{rule.hits} hits</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
