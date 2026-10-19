import { useState } from 'react';
import GoogleMaps from '../components/GoogleMaps';

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
  port: number;
  protocol: string;
}

const countries = ['Russie', 'Chine', 'Corée du Nord', 'Iran', 'Nigeria', 'Brésil', 'Inde', 'Ukraine', 'Roumanie', 'Vietnam'];
const threatTypes = ['DDoS', 'Phishing', 'Ransomware', 'Botnet C2', 'SQL Injection', 'XSS Attack', 'Zero-Day Exploit', 'Credential Stuffing', 'Crypto Mining', 'Data Exfiltration', 'Man-in-the-Middle', 'DNS Spoofing'];
const ipGen = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

export default function ThreatsPage() {
  const [threats] = useState<Threat[]>(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: `THR-${String(i + 1).padStart(4, '0')}`,
      type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      severity: (['critical', 'high', 'medium', 'low'] as const)[Math.floor(Math.random() * 4)],
      source: countries[Math.floor(Math.random() * countries.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      ip: ipGen(),
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      status: (['active', 'blocked', 'investigating'] as const)[Math.floor(Math.random() * 3)],
      details: `Pattern suspect détecté - Analyse comportementale en cours`,
      port: [22, 80, 443, 3306, 8080, 3389, 445, 21][Math.floor(Math.random() * 8)],
      protocol: ['TCP', 'UDP', 'HTTP', 'HTTPS', 'SSH', 'FTP'][Math.floor(Math.random() * 6)]
    }))
  );

  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked' | 'investigating'>('all');

  const filteredThreats = threats.filter(t => {
    if (filter !== 'all' && t.severity !== filter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-pink-500/20 text-pink-400 border-pink-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-green-500/20 text-green-400 border-green-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold neon-text-pink font-orbitron flex items-center gap-3">
              <i className="fas fa-skull-crossbones"></i>
              Centre de Commandement des Menaces
            </h2>
            <p className="text-sm text-gray-400 mt-2">Détection, analyse et neutralisation des cybermenaces en temps réel</p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold neon-text-pink font-orbitron">{threats.filter(t => t.status === 'active').length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Menaces Actives</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/30 text-center">
            <p className="text-3xl font-bold neon-text-pink font-orbitron">{threats.filter(t => t.severity === 'critical').length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Critiques</p>
          </div>
          <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30 text-center">
            <p className="text-3xl font-bold neon-text-blue font-orbitron">{threats.filter(t => t.severity === 'high').length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Élevées</p>
          </div>
          <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30 text-center">
            <p className="text-3xl font-bold neon-text-purple font-orbitron">{threats.filter(t => t.severity === 'medium').length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Moyennes</p>
          </div>
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
            <p className="text-3xl font-bold neon-text-green font-orbitron">{threats.filter(t => t.severity === 'low').length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Faibles</p>
          </div>
        </div>
      </div>

      {/* World Map */}
      <GoogleMaps />

      {/* Filters */}
      <div className="glass-card p-5">
        <div className="flex flex-wrap gap-6">
          <div>
            <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wider font-orbitron">Sévérité</label>
            <div className="flex gap-2">
              {(['all', 'critical', 'high', 'medium', 'low'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`cyber-tab text-xs ${filter === f ? 'active' : ''}`}
                >
                  {f === 'all' ? 'TOUT' : f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wider font-orbitron">Statut</label>
            <div className="flex gap-2">
              {(['all', 'active', 'blocked', 'investigating'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`cyber-tab text-xs ${statusFilter === s ? 'active' : ''}`}
                >
                  {s === 'all' ? 'TOUT' : s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Threats Table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold neon-text-blue font-orbitron">
            {filteredThreats.length} Menaces Trouvées
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Sévérité</th>
                <th>Source</th>
                <th>IP</th>
                <th>Port</th>
                <th>Statut</th>
                <th>Heure</th>
              </tr>
            </thead>
            <tbody>
              {filteredThreats.slice(0, 20).map((threat) => (
                <tr key={threat.id}>
                  <td className="font-mono text-white font-bold">{threat.id}</td>
                  <td className="text-gray-300">{threat.type}</td>
                  <td>
                    <span className={`px-2 py-1 text-[10px] font-mono rounded border ${getSeverityColor(threat.severity)}`}>
                      {threat.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-gray-400">{threat.source}</td>
                  <td className="font-mono neon-text-blue">{threat.ip}</td>
                  <td className="font-mono text-gray-400">{threat.port}/{threat.protocol}</td>
                  <td>
                    <span className={`flex items-center gap-2 text-xs ${
                      threat.status === 'active' ? 'neon-text-pink' : threat.status === 'blocked' ? 'neon-text-green' : 'neon-text-orange'
                    }`}>
                      <span className={`status-indicator ${threat.status === 'active' ? 'status-danger' : threat.status === 'blocked' ? 'status-active' : 'status-warning'}`}></span>
                      {threat.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-gray-500 font-mono text-xs">{new Date(threat.timestamp).toLocaleTimeString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
