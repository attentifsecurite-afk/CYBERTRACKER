import { useState } from 'react';

interface VPNNode {
  id: string;
  ip: string;
  country: string;
  protocol: string;
  status: 'active' | 'blocked' | 'monitored';
  connections: number;
  riskScore: number;
  uptime: string;
  bandwidth: string;
  lastSeen: string;
}

const countries = ['Russie', 'Chine', 'Corée du Nord', 'Iran', 'Nigeria', 'Brésil', 'Inde', 'Ukraine', 'Roumanie', 'Vietnam', 'Pays-Bas', 'Allemagne', 'USA'];
const protocols = ['OpenVPN', 'WireGuard', 'Tor Exit', 'I2P', 'SOCKS5', 'Shadowsocks', 'V2Ray', 'Trojan'];
const ipGen = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

export default function VPNPage() {
  const [vpnNodes] = useState<VPNNode[]>(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: `VPN-${String(i + 1).padStart(3, '0')}`,
      ip: ipGen(),
      country: countries[Math.floor(Math.random() * countries.length)],
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      status: (['active', 'blocked', 'monitored'] as const)[Math.floor(Math.random() * 3)],
      connections: Math.floor(Math.random() * 500),
      riskScore: Math.floor(Math.random() * 100),
      uptime: `${Math.floor(Math.random() * 30)}j ${Math.floor(Math.random() * 24)}h`,
      bandwidth: `${Math.floor(Math.random() * 1000)} Mb/s`,
      lastSeen: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString('fr-FR')
    }))
  );

  const [protocolFilter, setProtocolFilter] = useState<string>('all');
  const filteredNodes = vpnNodes.filter(n => protocolFilter === 'all' || n.protocol === protocolFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h2 className="text-3xl font-bold neon-text-purple font-orbitron flex items-center gap-3 mb-2">
          <i className="fas fa-user-secret"></i>
          Détection VPN/Tor/I2P
        </h2>
        <p className="text-sm text-gray-400">
          Identification des nœuds anonymes utilisés par les cybercriminels pour masquer leur identité et localisation.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/30 text-center">
            <p className="text-3xl font-bold neon-text-pink font-orbitron">{vpnNodes.filter(n => n.status === 'active').length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Actifs</p>
          </div>
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
            <p className="text-3xl font-bold neon-text-green font-orbitron">{vpnNodes.filter(n => n.status === 'blocked').length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Bloqués</p>
          </div>
          <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30 text-center">
            <p className="text-3xl font-bold neon-text-orange font-orbitron">{vpnNodes.filter(n => n.status === 'monitored').length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Surveillés</p>
          </div>
          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30 text-center">
            <p className="text-3xl font-bold neon-text-purple font-orbitron">{vpnNodes.length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Total</p>
          </div>
        </div>
      </div>

      {/* Protocol Filter */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold neon-text-purple font-orbitron mb-3 uppercase tracking-wider">Filtrer par Protocole</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setProtocolFilter('all')}
            className={`cyber-tab text-xs ${protocolFilter === 'all' ? 'active' : ''}`}
          >
            TOUS
          </button>
          {protocols.map(p => (
            <button
              key={p}
              onClick={() => setProtocolFilter(p)}
              className={`cyber-tab text-xs ${protocolFilter === p ? 'active' : ''}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNodes.map((node) => (
          <div key={node.id} className="glass-card p-4 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`status-indicator ${node.status === 'active' ? 'status-danger' : node.status === 'blocked' ? 'status-active' : 'status-warning'}`}></span>
                <span className="text-xs font-mono text-white font-bold">{node.ip}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">{node.protocol}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400"><i className="fas fa-globe mr-1 text-cyan-400"></i>Pays</span>
                <span className="text-white font-bold">{node.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400"><i className="fas fa-link mr-1 text-purple-400"></i>Connexions</span>
                <span className="neon-text-blue font-mono font-bold">{node.connections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400"><i className="fas fa-clock mr-1 text-green-400"></i>Uptime</span>
                <span className="text-white font-mono">{node.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400"><i className="fas fa-signal mr-1 text-orange-400"></i>Bande</span>
                <span className="text-white font-mono">{node.bandwidth}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Score de Risque</span>
                <span className="text-xs font-mono text-white font-bold">{node.riskScore}%</span>
              </div>
              <div className="cyber-progress">
                <div
                  className={`cyber-progress-fill ${node.riskScore > 70 ? 'bg-gradient-to-r from-pink-500 to-red-500' : node.riskScore > 40 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' : 'bg-gradient-to-r from-green-500 to-cyan-500'}`}
                  style={{ width: `${node.riskScore}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-gray-500 font-mono">
              Dernière activité: {node.lastSeen}
            </div>
          </div>
        ))}
      </div>

      {/* Protocol Distribution */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold neon-text-purple font-orbitron flex items-center gap-3 mb-4">
          <i className="fas fa-chart-pie"></i>
          Distribution des Protocoles
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {protocols.map(protocol => {
            const count = vpnNodes.filter(n => n.protocol === protocol).length;
            return (
              <div key={protocol} className="p-4 bg-black/40 rounded-lg border border-gray-800 text-center hover:border-purple-500/50 transition-all">
                <p className="text-2xl font-bold neon-text-purple font-orbitron">{count}</p>
                <p className="text-xs text-gray-400">{protocol}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
