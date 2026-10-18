import { useState } from 'react';
import WorldMap from '../components/WorldMap';

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
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      default: return 'text-green-400 bg-green-500/20 border-green-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-cyber p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <i className="fas fa-skull-crossbones text-red-400"></i>
              Centre de Commandement des Menaces
            </h2>
            <p className="text-sm text-gray-400 mt-1">Détection, analyse et neutralisation des cybermenaces en temps réel</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-3xl font-bold text-red-400 font-mono">{threats.filter(t => t.status === 'active').length}</p>
              <p className="text-xs text-gray-400">Menaces Actives</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
            <p className="text-2xl font-bold text-red-400 font-mono">{threats.filter(t => t.severity === 'critical').length}</p>
            <p className="text-xs text-gray-400">Critiques</p>
          </div>
          <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
            <p className="text-2xl font-bold text-orange-400 font-mono">{threats.filter(t => t.severity === 'high').length}</p>
            <p className="text-xs text-gray-400">Élevées</p>
          </div>
          <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <p className="text-2xl font-bold text-yellow-400 font-mono">{threats.filter(t => t.severity === 'medium').length}</p>
            <p className="text-xs text-gray-400">Moyennes</p>
          </div>
          <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
            <p className="text-2xl font-bold text-green-400 font-mono">{threats.filter(t => t.severity === 'low').length}</p>
            <p className="text-xs text-gray-400">Faibles</p>
          </div>
        </div>
      </div>

      {/* World Map */}
      <WorldMap />

      {/* Filters */}
      <div className="card-cyber p-5">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Sévérité</label>
            <div className="flex gap-2">
              {(['all', 'critical', 'high', 'medium', 'low'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    filter === f ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {f === 'all' ? 'TOUT' : f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Statut</label>
            <div className="flex gap-2">
              {(['all', 'active', 'blocked', 'investigating'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    statusFilter === s ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {s === 'all' ? 'TOUT' : s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Threats Table */}
      <div className="card-cyber p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            {filteredThreats.length} Menaces Trouvées
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs text-gray-400 font-medium pb-2">ID</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2">Type</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2">Sévérité</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2">Source</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2">IP</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2">Port</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2">Statut</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2">Heure</th>
              </tr>
            </thead>
            <tbody>
              {filteredThreats.slice(0, 20).map((threat) => (
                <tr key={threat.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 text-xs font-mono text-white">{threat.id}</td>
                  <td className="py-3 text-xs text-gray-300">{threat.type}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-mono rounded border ${getSeverityColor(threat.severity)}`}>
                      {threat.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-gray-400">{threat.source}</td>
                  <td className="py-3 text-xs font-mono text-cyan-400">{threat.ip}</td>
                  <td className="py-3 text-xs font-mono text-gray-400">{threat.port}/{threat.protocol}</td>
                  <td className="py-3">
                    <span className={`flex items-center gap-1 text-xs ${
                      threat.status === 'active' ? 'text-red-400' : threat.status === 'blocked' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      <span className={`status-dot ${threat.status === 'active' ? 'status-danger' : threat.status === 'blocked' ? 'status-active' : 'status-warning'}`}></span>
                      {threat.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-gray-500 font-mono">{new Date(threat.timestamp).toLocaleTimeString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
