import WorldMap from '../components/WorldMap';

export default function WorldMapPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-cyber p-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <i className="fas fa-globe text-cyan-400"></i>
          Carte Mondiale des Menaces - Géolocalisation Temps Réel
        </h2>
        <p className="text-sm text-gray-400">
          Visualisation en temps réel des attaques cyber détectées à travers le monde. Chaque point représente une menace active géolocalisée par notre système de traque.
        </p>
      </div>

      {/* World Map - Full Size */}
      <WorldMap />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-cyber p-4 text-center">
          <i className="fas fa-skull text-3xl text-red-400 mb-2"></i>
          <p className="text-2xl font-bold text-red-400 font-mono">2,847</p>
          <p className="text-xs text-gray-400">Attaques/24h</p>
        </div>
        <div className="card-cyber p-4 text-center">
          <i className="fas fa-globe text-3xl text-cyan-400 mb-2"></i>
          <p className="text-2xl font-bold text-cyan-400 font-mono">127</p>
          <p className="text-xs text-gray-400">Pays Ciblés</p>
        </div>
        <div className="card-cyber p-4 text-center">
          <i className="fas fa-server text-3xl text-green-400 mb-2"></i>
          <p className="text-2xl font-bold text-green-400 font-mono">1,247</p>
          <p className="text-xs text-gray-400">Nodes Actifs</p>
        </div>
        <div className="card-cyber p-4 text-center">
          <i className="fas fa-shield text-3xl text-purple-400 mb-2"></i>
          <p className="text-2xl font-bold text-purple-400 font-mono">98.7%</p>
          <p className="text-xs text-gray-400">Taux Blocage</p>
        </div>
      </div>

      {/* Top Threat Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-cyber p-5">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <i className="fas fa-chart-bar text-orange-400"></i>
            Top Sources d'Attaques
          </h3>
          <div className="space-y-3">
            {[
              { country: 'Russie', count: 847, percent: 30 },
              { country: 'Chine', count: 623, percent: 22 },
              { country: 'Corée du Nord', count: 412, percent: 14 },
              { country: 'Iran', count: 298, percent: 10 },
              { country: 'Nigeria', count: 234, percent: 8 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-24">{item.country}</span>
                <div className="flex-1 h-6 bg-gray-800 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-end pr-2"
                    style={{ width: `${item.percent}%` }}
                  >
                    <span className="text-[10px] font-mono text-white">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-cyber p-5">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <i className="fas fa-bolt text-yellow-400"></i>
            Types d'Attaques les Plus Fréquents
          </h3>
          <div className="space-y-3">
            {[
              { type: 'DDoS', count: 1234, icon: 'fa-bolt' },
              { type: 'Phishing', count: 892, icon: 'fa-fish' },
              { type: 'Ransomware', count: 567, icon: 'fa-lock' },
              { type: 'Botnet C2', count: 423, icon: 'fa-robot' },
              { type: 'SQL Injection', count: 312, icon: 'fa-database' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-[#0a0e1a] rounded-lg border border-gray-800">
                <div className="flex items-center gap-2">
                  <i className={`fas ${item.icon} text-orange-400`}></i>
                  <span className="text-sm text-white">{item.type}</span>
                </div>
                <span className="text-sm font-mono text-cyan-400">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-cyber p-5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <i className="fas fa-clock text-green-400"></i>
          Activité Récente
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {Array.from({ length: 15 }, (_, i) => {
            const countries = ['Russie', 'Chine', 'Iran', 'Nigeria', 'Brésil'];
            const types = ['DDoS', 'Phishing', 'Ransomware', 'Botnet'];
            const country = countries[Math.floor(Math.random() * countries.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            const ip = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
            return (
              <div key={i} className="flex items-center justify-between p-2 bg-[#0a0e1a] rounded border border-gray-800">
                <div className="flex items-center gap-3">
                  <span className="status-dot status-danger"></span>
                  <span className="text-xs text-white font-mono">{type} détecté</span>
                  <span className="text-xs text-gray-400">depuis {country}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-cyan-400">{ip}</p>
                  <p className="text-[10px] text-gray-500">{new Date(Date.now() - i * 60000).toLocaleTimeString('fr-FR')}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
