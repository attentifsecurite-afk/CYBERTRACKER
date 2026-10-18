import ThreatFeed from '../components/ThreatFeed';

export default function IntelPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-cyber p-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <i className="fas fa-rss text-orange-400"></i>
          Renseignement Cyber - Threat Intelligence
        </h2>
        <p className="text-sm text-gray-400">
          Collecte de renseignements en temps réel via l'API Brave Search. Recherche de menaces, fuites de données, malware et sites frauduleux.
        </p>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-[#0a0e1a] rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-bolt text-orange-400"></i>
              <h4 className="text-sm font-semibold text-orange-400">Brave Search API</h4>
            </div>
            <p className="text-xs text-gray-400">
              Moteur de recherche indépendant avec accès à des sources non filtrées par les GAFAM. Idéal pour la recherche de menaces.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="status-dot status-active"></span>
              <span className="text-xs text-green-400 font-mono">CONNECTÉE</span>
            </div>
          </div>
          <div className="p-4 bg-[#0a0e1a] rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-database text-cyan-400"></i>
              <h4 className="text-sm font-semibold text-cyan-400">Sources OSINT</h4>
            </div>
            <p className="text-xs text-gray-400">
              Open Source Intelligence : forums, paste sites, dark web markets, repositories GitHub publics.
            </p>
            <div className="mt-2 text-xs text-cyan-400 font-mono">
              1,247 sources indexées
            </div>
          </div>
          <div className="p-4 bg-[#0a0e1a] rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-brain text-purple-400"></i>
              <h4 className="text-sm font-semibold text-purple-400">Analyse IA</h4>
            </div>
            <p className="text-xs text-gray-400">
              Modèles de machine learning pour détecter les patterns de menaces émergentes et les campagnes coordonnées.
            </p>
            <div className="mt-2 text-xs text-purple-400 font-mono">
              Précision: 97.3%
            </div>
          </div>
        </div>
      </div>

      {/* Threat Feed */}
      <ThreatFeed />

      {/* Intelligence Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-cyber p-5">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <i className="fas fa-virus text-red-400"></i>
            Malware & Exploits
          </h3>
          <div className="space-y-2">
            {[
              { name: 'Emotet Variant', severity: 'critical', detections: 1247 },
              { name: 'LockBit 3.0', severity: 'critical', detections: 892 },
              { name: 'Cobalt Strike', severity: 'high', detections: 634 },
              { name: 'Mimikatz', severity: 'high', detections: 523 },
              { name: 'Meterpreter', severity: 'medium', detections: 412 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-[#0a0e1a] rounded border border-gray-800">
                <div className="flex items-center gap-2">
                  <i className="fas fa-bug text-red-400"></i>
                  <span className="text-xs text-white">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    item.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                    item.severity === 'high' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.severity.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-cyan-400">{item.detections}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-cyber p-5">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <i className="fas fa-database text-orange-400"></i>
            Fuites de Données Récentes
          </h3>
          <div className="space-y-2">
            {[
              { company: 'TechCorp Inc.', records: '2.3M', date: '2024-01-15' },
              { company: 'BankSecure', records: '1.8M', date: '2024-01-12' },
              { company: 'HealthData+', records: '950K', date: '2024-01-10' },
              { company: 'EduPlatform', records: '720K', date: '2024-01-08' },
              { company: 'RetailMax', records: '540K', date: '2024-01-05' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-[#0a0e1a] rounded border border-gray-800">
                <div>
                  <p className="text-xs text-white">{item.company}</p>
                  <p className="text-[10px] text-gray-500">{item.date}</p>
                </div>
                <span className="text-xs font-mono text-red-400">{item.records} records</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Threat Actors */}
      <div className="card-cyber p-5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <i className="fas fa-user-secret text-purple-400"></i>
          Groupes de Menaces Actifs (APT)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'APT28 (Fancy Bear)', origin: 'Russie', targets: 'Gouvernements, OTAN', activity: 'Très élevée' },
            { name: 'Lazarus Group', origin: 'Corée du Nord', targets: 'Crypto, Banques', activity: 'Élevée' },
            { name: 'APT41 (Winnti)', origin: 'Chine', targets: 'Tech, Pharma', activity: 'Élevée' },
            { name: 'MuddyWater', origin: 'Iran', targets: 'Moyen-Orient', activity: 'Moyenne' },
            { name: 'FIN7 (Carbanak)', origin: 'Europe de l\'Est', targets: 'Retail, Finance', activity: 'Élevée' },
            { name: 'Sandworm', origin: 'Russie', targets: 'Infrastructures', activity: 'Critique' },
          ].map((group, i) => (
            <div key={i} className="p-3 bg-[#0a0e1a] rounded-lg border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-skull text-purple-400"></i>
                <h4 className="text-sm font-semibold text-white">{group.name}</h4>
              </div>
              <div className="space-y-1 text-xs">
                <p className="text-gray-400"><i className="fas fa-globe mr-1 text-cyan-400"></i>{group.origin}</p>
                <p className="text-gray-400"><i className="fas fa-crosshairs mr-1 text-red-400"></i>{group.targets}</p>
                <p className="text-gray-400"><i className="fas fa-bolt mr-1 text-yellow-400"></i>{group.activity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Console */}
      <div className="card-cyber p-5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
          <i className="fas fa-terminal text-green-400"></i>
          Console de Renseignement
        </h3>
        <div className="bg-black/50 rounded-lg p-3 font-mono text-xs max-h-64 overflow-y-auto border border-gray-800">
          {Array.from({ length: 20 }, (_, i) => {
            const actions = [
              '[BRAVE] Query: "ransomware attack 2024"',
              '[OSINT] Scraping forum darkweb...',
              '[API] Brave Search - 10 résultats',
              '[AI] Pattern matching: 97.3% confidence',
              '[SCAN] Analyse nouvelle menace...',
              '[INTEL] Rapport APT28 mis à jour',
              '[FEED] 5 nouvelles menaces détectées',
              '[DB] Mise à jour base de signatures',
            ];
            const log = `[${new Date(Date.now() - i * 5000).toLocaleTimeString('fr-FR')}] ${actions[i % actions.length]}`;
            const color = log.includes('[BRAVE]') || log.includes('[API]') ? 'text-cyan-400' :
                         log.includes('[AI]') || log.includes('[INTEL]') ? 'text-purple-400' :
                         log.includes('[OSINT]') || log.includes('[SCAN]') ? 'text-orange-400' : 'text-gray-400';
            return <div key={i} className={`py-0.5 ${color}`}>{log}</div>;
          })}
          <div className="text-green-400 animate-blink">█</div>
        </div>
      </div>
    </div>
  );
}
