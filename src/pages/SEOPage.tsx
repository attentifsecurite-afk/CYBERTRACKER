import { useState } from 'react';

interface SEOTarget {
  id: string;
  domain: string;
  type: string;
  status: 'pending' | 'processing' | 'dereferenced' | 'blocked';
  backlinks: number;
  riskLevel: number;
  action: string;
  domainAuthority: number;
  indexed: boolean;
  lastChecked: string;
}

const domains = [
  'fraud-shop.dark', 'phishing-kit.xyz', 'carding-forum.cc', 'malware-distro.net',
  'stolen-data.io', 'fake-bank.login', 'crypto-scam.tech', 'identity-theft.biz',
  'dark-market.onion', 'fake-shop.ru', 'phishing-central.cn', 'ransomware-hub.cc'
];
const types = ['Site de phishing', 'Marketplace illégal', 'Forum de carding', 'Distribution malware', 'Vol d\'identité', 'Escroquerie crypto'];
const actions = ['Signalement Google', 'DMCA Takedown', 'Signalement DNS', 'Blocage ISP', 'Notification Registrar'];

export default function SEOPage() {
  const [seoTargets] = useState<SEOTarget[]>(() =>
    domains.map((domain, i) => ({
      id: `SEO-${String(i + 1).padStart(3, '0')}`,
      domain,
      type: types[i % types.length],
      status: (['pending', 'processing', 'dereferenced', 'blocked'] as const)[Math.floor(Math.random() * 4)],
      backlinks: Math.floor(Math.random() * 10000),
      riskLevel: Math.floor(Math.random() * 100),
      action: actions[Math.floor(Math.random() * actions.length)],
      domainAuthority: Math.floor(Math.random() * 100),
      indexed: Math.random() > 0.3,
      lastChecked: new Date(Date.now() - Math.random() * 86400000).toLocaleString('fr-FR'),
    }))
  );

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const filteredTargets = seoTargets.filter(t => statusFilter === 'all' || t.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'dereferenced': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'blocked': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h2 className="text-3xl font-bold neon-text-green font-orbitron flex items-center gap-3 mb-2">
          <i className="fas fa-spider"></i>
          Moteur SEO/AEO - Déréférencement
        </h2>
        <p className="text-sm text-gray-400">
          Système de déréférencement des sites frauduleux, phishing, et atteinte aux personnes. Maillage SEO inverse pour neutraliser le référencement des sites malveillants.
        </p>

        {/* Strategy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-black/40 rounded-lg border border-cyan-500/30 hover:border-cyan-500/60 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-arrow-down neon-text-blue"></i>
              <h4 className="text-sm font-bold neon-text-blue font-orbitron">SEO INVERSE</h4>
            </div>
            <p className="text-xs text-gray-400">
              Création de signaux négatifs pour déclasser les sites frauduleux dans les résultats de recherche Google, Bing, DuckDuckGo.
            </p>
            <div className="mt-2 text-xs neon-text-green font-mono">
              {seoTargets.filter(s => s.status === 'dereferenced').length} sites déclassés
            </div>
          </div>
          <div className="p-4 bg-black/40 rounded-lg border border-green-500/30 hover:border-green-500/60 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-robot neon-text-green"></i>
              <h4 className="text-sm font-bold neon-text-green font-orbitron">AEO (ANSWER ENGINE)</h4>
            </div>
            <p className="text-xs text-gray-400">
              Optimisation pour les moteurs de réponse IA (ChatGPT, Perplexity, Bard) afin de bloquer les contenus frauduleux.
            </p>
            <div className="mt-2 text-xs neon-text-green font-mono">
              {Math.floor(seoTargets.length * 0.7)} IA mises à jour
            </div>
          </div>
          <div className="p-4 bg-black/40 rounded-lg border border-purple-500/30 hover:border-purple-500/60 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-link neon-text-purple"></i>
              <h4 className="text-sm font-bold neon-text-purple font-orbitron">MAILLAGE INVERSE</h4>
            </div>
            <p className="text-xs text-gray-400">
              Analyse et neutralisation des backlinks toxiques pointant vers les sites malveillants. Signalement aux webmasters.
            </p>
            <div className="mt-2 text-xs neon-text-green font-mono">
              {seoTargets.reduce((acc, t) => acc + t.backlinks, 0).toLocaleString()} backlinks neutralisés
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold neon-text-green font-orbitron">{seoTargets.filter(s => s.status === 'dereferenced').length}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Déréférencés</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold neon-text-blue font-orbitron">{seoTargets.filter(s => s.status === 'blocked').length}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Bloqués</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold neon-text-orange font-orbitron">{seoTargets.filter(s => s.status === 'processing').length}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider">En cours</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-gray-400 font-orbitron">{seoTargets.filter(s => s.status === 'pending').length}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider">En attente</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold neon-text-green font-orbitron mb-3 uppercase tracking-wider">Filtrer par Statut</h3>
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'processing', 'dereferenced', 'blocked'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`cyber-tab text-xs ${statusFilter === status ? 'active' : ''}`}
            >
              {status === 'all' ? 'TOUS' : status.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Targets Table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold neon-text-green font-orbitron">
            {filteredTargets.length} Sites Ciblés
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Domaine</th>
                <th>Type</th>
                <th>Statut</th>
                <th>DA</th>
                <th>Backlinks</th>
                <th>Risque</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTargets.map((target) => (
                <tr key={target.id}>
                  <td>
                    <div>
                      <p className="text-xs font-mono text-white font-bold">{target.domain}</p>
                      <p className="text-[10px] text-gray-500">{target.lastChecked}</p>
                    </div>
                  </td>
                  <td className="text-xs text-gray-300">{target.type}</td>
                  <td>
                    <span className={`px-2 py-1 text-[10px] font-mono rounded border ${getStatusColor(target.status)}`}>
                      {target.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-xs font-mono neon-text-blue font-bold">{target.domainAuthority}</td>
                  <td className="text-xs font-mono text-gray-400">{target.backlinks.toLocaleString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${target.riskLevel > 70 ? 'bg-pink-500' : target.riskLevel > 40 ? 'bg-orange-500' : 'bg-green-500'}`}
                          style={{ width: `${target.riskLevel}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono text-gray-400">{target.riskLevel}%</span>
                    </div>
                  </td>
                  <td className="text-xs neon-text-purple">{target.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions Log */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold neon-text-orange font-orbitron flex items-center gap-3 mb-4">
          <i className="fas fa-history"></i>
          Historique des Actions
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {Array.from({ length: 15 }, (_, i) => {
            const domain = domains[Math.floor(Math.random() * domains.length)];
            const action = actions[Math.floor(Math.random() * actions.length)];
            const success = Math.random() > 0.2;
            return (
              <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-gray-800 hover:border-green-500/30 transition-all">
                <div className="flex items-center gap-2">
                  <i className={`fas ${success ? 'fa-check-circle neon-text-green' : 'fa-times-circle neon-text-pink'}`}></i>
                  <span className="text-xs text-white font-bold">{action}</span>
                  <span className="text-xs text-gray-400">pour {domain}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">
                  {new Date(Date.now() - i * 3600000).toLocaleString('fr-FR')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
