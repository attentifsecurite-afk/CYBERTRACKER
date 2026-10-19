import GoogleMaps from '../components/GoogleMaps';

export default function WorldMapPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h2 className="text-3xl font-bold neon-text-blue font-orbitron flex items-center gap-3 mb-3">
          <i className="fas fa-globe"></i>
          Carte Mondiale des Menaces
        </h2>
        <p className="text-sm text-gray-400">
          Visualisation en temps réel des attaques cyber détectées à travers le monde. Chaque point représente une menace active géolocalisée par notre système de traque.
        </p>
      </div>

      {/* World Map - Full Size */}
      <GoogleMaps />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 text-center animate-hologram">
          <i className="fas fa-skull text-4xl neon-text-pink mb-3"></i>
          <p className="text-3xl font-bold neon-text-pink font-orbitron">2,847</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Attaques/24h</p>
        </div>
        <div className="glass-card p-5 text-center animate-hologram" style={{ animationDelay: '0.1s' }}>
          <i className="fas fa-globe text-4xl neon-text-blue mb-3"></i>
          <p className="text-3xl font-bold neon-text-blue font-orbitron">127</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Pays Ciblés</p>
        </div>
        <div className="glass-card p-5 text-center animate-hologram" style={{ animationDelay: '0.2s' }}>
          <i className="fas fa-server text-4xl neon-text-green mb-3"></i>
          <p className="text-3xl font-bold neon-text-green font-orbitron">1,247</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Nodes Actifs</p>
        </div>
        <div className="glass-card p-5 text-center animate-hologram" style={{ animationDelay: '0.3s' }}>
          <i className="fas fa-shield text-4xl neon-text-purple mb-3"></i>
          <p className="text-3xl font-bold neon-text-purple font-orbitron">98.7%</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Taux Blocage</p>
        </div>
      </div>

      {/* Top Threat Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold neon-text-orange font-orbitron flex items-center gap-3 mb-4">
            <i className="fas fa-chart-bar"></i>
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
                <span className="text-xs text-gray-400 w-24 font-mono">{item.country}</span>
                <div className="flex-1 h-8 bg-black/40 rounded-lg overflow-hidden border border-gray-800">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 flex items-center justify-end pr-3"
                    style={{ width: `${item.percent}%` }}
                  >
                    <span className="text-xs font-mono text-white font-bold">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold neon-text-orange font-orbitron flex items-center gap-3 mb-4">
            <i className="fas fa-bolt"></i>
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
              <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-gray-800 hover:border-orange-500/50 transition-all">
                <div className="flex items-center gap-3">
                  <i className={`fas ${item.icon} neon-text-orange`}></i>
                  <span className="text-sm text-white font-bold">{item.type}</span>
                </div>
                <span className="text-sm font-mono neon-text-blue font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold neon-text-green font-orbitron flex items-center gap-3 mb-4">
          <i className="fas fa-clock"></i>
          Activité Récente
        </h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {Array.from({ length: 20 }, (_, i) => {
            const countries = ['Russie', 'Chine', 'Iran', 'Nigeria', 'Brésil'];
            const types = ['DDoS', 'Phishing', 'Ransomware', 'Botnet'];
            const country = countries[Math.floor(Math.random() * countries.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            const ip = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
            return (
              <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-gray-800 hover:border-green-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <span className="status-indicator status-danger"></span>
                  <span className="text-xs text-white font-mono font-bold">{type} détecté</span>
                  <span className="text-xs text-gray-400">depuis {country}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono neon-text-blue">{ip}</p>
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
