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
  pageRank: number;
  indexed: boolean;
  lastChecked: string;
  traffic: number;
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
      pageRank: Math.floor(Math.random() * 10),
      indexed: Math.random() > 0.3,
      lastChecked: new Date(Date.now() - Math.random() * 86400000).toLocaleString('fr-FR'),
      traffic: Math.floor(Math.random() * 50000)
    }))
  );

  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTargets = seoTargets.filter(t => statusFilter === 'all' || t.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'dereferenced': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'blocked': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/50';
      case 'processing': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-cyber p-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <i className="fas fa-spider text-green-400"></i>
          Moteur SEO/AEO - Déréférencement & Maillage Inverse
        </h2>
        <p className="text-sm text-gray-400">
          Système de déréférencement des sites frauduleux, phishing, et atteinte aux personnes. Maillage SEO inverse pour neutraliser le référencement des sites malveillants.
        </p>

        {/* Strategy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-[#0a0e1a] rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-arrow-down text-cyan-400"></i>
              <h4 className="text-sm font-semibold text-cyan-400">SEO Inverse</h4>
            </div>
            <p className="text-xs text-gray-400">
              Création de signaux négatifs pour déclasser les sites frauduleux dans les résultats de recherche Google, Bing, DuckDuckGo.
            </p>
            <div className="mt-2 text-xs text-green-400 font-mono">
              {seoTargets.filter(s => s.status === 'dereferenced').length} sites déclassés
            </div>
          </div>
          <div className="p-4 bg-[#0a0e1a] rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-robot text-green-400"></i>
              <h4 className="text-sm font-semibold text-green-400">AEO (Answer Engine)</h4>
            </div>
            <p className="text-xs text-gray-400">
              Optimisation pour les moteurs de réponse IA (ChatGPT, Perplexity, Bard) afin de bloquer les contenus frauduleux.
            </p>
            <div className="mt-2 text-xs text-green-400 font-mono">
              {Math.floor(seoTargets.length * 0.7)} IA mises à jour
            </div>
          </div>
          <div className="p-4 bg-[#0a0e1a] rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-link text-purple-400"></i>
              <h4 className="text-sm font-semibold text-purple-400">Maillage Inverse</h4>
            </div>
            <p className="text-xs text-gray-400">
              Analyse et neutralisation des backlinks toxiques pointant vers les sites malveillants. Signalement aux webmasters.
            </p>
            <div className="mt-2 text-xs text-green-400 font-mono">
              {seoTargets.reduce((acc, t) => acc + t.backlinks, 0).toLocaleString()} backlinks neutralisés
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-cyber p-4 text-center">
          <p className="text-3xl font-bold text-green-400 font-mono">{seoTargets.filter(s => s.status === 'dereferenced').length}</p>
          <p className="text-xs text-gray-400">Déréférencés</p>
        </div>
        <div className="card-cyber p-4 text-center">
          <p className="text-3xl font-bold text-cyan-400 font-mono">{seoTargets.filter(s => s.status === 'blocked').length}</p>
          <p className="text-xs text-gray-400">Bloqués</p>
        </div>
        <div className="card-cyber p-4 text-center">
          <p className="text-3xl font-bold text-yellow-400 font-mono">{seoTargets.filter(s => s.status === 'processing').length}</p>
          <p className="text-xs text-gray-400">En cours</p>
        </div>
        <div className="card-cyber p-4 text-center">
          <p className="text-3xl font-bold text-gray-400 font-mono">{seoTargets.filter(s => s.status === 'pending').length}</p>
          <p className="text-xs text-gray-400">En attente</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card-cyber p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Filtrer par Statut</h3>
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'processing', 'dereferenced', 'blocked'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                statusFilter === status ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {status === 'all' ? 'TOUS' : status.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Targets Table */}
      <div className="card-cyber p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            {filteredTargets.length} Sites Ciblés
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs text-gray-400 font-medium pb-2">Domaine</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2">Type</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2">Statut</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2">DA</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2">Backlinks</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2">Risque</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTargets.map((target) => (
                <tr key={target.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="py-3">
                    <div>
                      <p className="text-xs font-mono text-white">{target.domain}</p>
                      <p className="text-[10px] text-gray-500">{target.lastChecked}</p>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-gray-300">{target.type}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-mono rounded border ${getStatusColor(target.status)}`}>
                      {target.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-xs font-mono text-cyan-400">{target.domainAuthority}</td>
                  <td className="py-3 text-xs font-mono text-gray-400">{target.backlinks.toLocaleString()}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${target.riskLevel > 70 ? 'bg-red-500' : target.riskLevel > 40 ? 'bg-orange-500' : 'bg-green-500'}`}
                          style={{ width: `${target.riskLevel}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono text-gray-400">{target.riskLevel}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-purple-400">{target.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions Log */}
      <div className="card-cyber p-5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <i className="fas fa-history text-orange-400"></i>
          Historique des Actions
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {Array.from({ length: 15 }, (_, i) => {
            const domain = domains[Math.floor(Math.random() * domains.length)];
            const action = actions[Math.floor(Math.random() * actions.length)];
            const success = Math.random() > 0.2;
            return (
              <div key={i} className="flex items-center justify-between p-2 bg-[#0a0e1a] rounded border border-gray-800">
                <div className="flex items-center gap-2">
                  <i className={`fas ${success ? 'fa-check-circle text-green-400' : 'fa-times-circle text-red-400'}`}></i>
                  <span className="text-xs text-white">{action}</span>
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
