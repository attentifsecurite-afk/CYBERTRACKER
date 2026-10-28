import { useState, useEffect } from 'react';
import { fetchAllScrapedData, isScraperAvailable, getScraperStats, type ScrapedThreat } from '../services/scraperService';

export default function ScraperPage() {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<ScrapedThreat[]>([]);
  const [threatLists, setThreatLists] = useState<{ ips: string[]; domains: string[] }>({ ips: [], domains: [] });
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [scraperAvailable, setScraperAvailable] = useState(false);
  const [scraperStats, setScraperStats] = useState({ key1: false, key2: false });

  useEffect(() => {
    setScraperAvailable(isScraperAvailable());
    setScraperStats(getScraperStats());
  }, []);

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchAllScrapedData();
      setNews(data.news);
      setThreatLists(data.threatLists);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de scraping');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      default: return 'text-green-400 bg-green-500/20 border-green-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold neon-text-purple font-orbitron flex items-center gap-3">
              <i className="fas fa-spider"></i>
              Web Scraper - Collecte de Menaces
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Scraping en temps réel de sources de cybersécurité pour détecter les menaces émergentes
            </p>
          </div>
          <button
            onClick={handleScrape}
            disabled={loading || !scraperAvailable}
            className="cyber-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className={`fas ${loading ? 'fa-spinner animate-spin' : 'fa-download'} mr-2`}></i>
            {loading ? 'Scraping...' : 'Lancer le Scraping'}
          </button>
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-black/40 rounded-lg border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className={`status-indicator ${scraperStats.key1 ? 'status-active' : 'status-danger'}`}></span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Clé API 1</span>
            </div>
            <p className="text-lg font-bold neon-text-cyan font-orbitron">
              {scraperStats.key1 ? 'ACTIVE' : 'INACTIVE'}
            </p>
          </div>
          <div className="p-4 bg-black/40 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className={`status-indicator ${scraperStats.key2 ? 'status-active' : 'status-danger'}`}></span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Clé API 2</span>
            </div>
            <p className="text-lg font-bold neon-text-purple font-orbitron">
              {scraperStats.key2 ? 'ACTIVE' : 'INACTIVE'}
            </p>
          </div>
          <div className="p-4 bg-black/40 rounded-lg border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className={`status-indicator ${scraperAvailable ? 'status-active' : 'status-danger'}`}></span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Service</span>
            </div>
            <p className="text-lg font-bold neon-text-green font-orbitron">
              {scraperAvailable ? 'OPÉRATIONNEL' : 'INDISPONIBLE'}
            </p>
          </div>
        </div>

        {lastUpdate && (
          <div className="mt-4 text-xs text-gray-400">
            Dernière mise à jour: {lastUpdate.toLocaleString('fr-FR')}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="glass-card p-4 bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-2">
            <i className="fas fa-exclamation-triangle text-red-400"></i>
            <span className="text-sm text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Articles Trouvés</span>
            <i className="fas fa-newspaper text-2xl text-cyan-400 opacity-50"></i>
          </div>
          <p className="text-4xl font-bold neon-text-cyan font-orbitron">{news.length}</p>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider">IPs Malveillantes</span>
            <i className="fas fa-network-wired text-2xl text-orange-400 opacity-50"></i>
          </div>
          <p className="text-4xl font-bold neon-text-orange font-orbitron">{threatLists.ips.length}</p>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Domaines Suspects</span>
            <i className="fas fa-globe text-2xl text-purple-400 opacity-50"></i>
          </div>
          <p className="text-4xl font-bold neon-text-purple font-orbitron">{threatLists.domains.length}</p>
        </div>
      </div>

      {/* News Articles */}
      {news.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold neon-text-cyan font-orbitron flex items-center gap-2 mb-4">
            <i className="fas fa-newspaper"></i>
            Actualités Cybersécurité
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {news.map((article) => (
              <div key={article.id} className="p-4 bg-black/40 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white mb-1">{article.title}</h4>
                    <p className="text-xs text-gray-400 mb-2">{article.description}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-500">
                        <i className="fas fa-link mr-1"></i>
                        {article.source}
                      </span>
                      <span className="text-gray-500">
                        <i className="fas fa-clock mr-1"></i>
                        {article.timestamp.toLocaleTimeString('fr-FR')}
                      </span>
                      {article.ips && article.ips.length > 0 && (
                        <span className="text-orange-400">
                          <i className="fas fa-network-wired mr-1"></i>
                          {article.ips.length} IPs
                        </span>
                      )}
                      {article.domains && article.domains.length > 0 && (
                        <span className="text-purple-400">
                          <i className="fas fa-globe mr-1"></i>
                          {article.domains.length} domaines
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-mono rounded border ${getSeverityColor(article.severity)}`}>
                    {article.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Threat Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IPs */}
        {threatLists.ips.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold neon-text-orange font-orbitron flex items-center gap-2 mb-4">
              <i className="fas fa-network-wired"></i>
              IPs Malveillantes Détectées
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {threatLists.ips.map((ip, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-black/40 rounded border border-gray-700">
                  <span className="text-xs font-mono text-orange-400">{ip}</span>
                  <span className="text-[10px] text-gray-500">#{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Domains */}
        {threatLists.domains.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold neon-text-purple font-orbitron flex items-center gap-2 mb-4">
              <i className="fas fa-globe"></i>
              Domaines Suspects Détectés
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {threatLists.domains.map((domain, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-black/40 rounded border border-gray-700">
                  <span className="text-xs font-mono text-purple-400">{domain}</span>
                  <span className="text-[10px] text-gray-500">#{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg neon-text-cyan font-orbitron">Scraping en cours...</p>
          <p className="text-sm text-gray-400 mt-2">Collecte de données depuis les sources de cybersécurité</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && news.length === 0 && threatLists.ips.length === 0 && !error && (
        <div className="glass-card p-12 text-center">
          <i className="fas fa-spider text-6xl text-purple-400 opacity-30 mb-4"></i>
          <p className="text-lg text-gray-400">Aucune donnée scrapée</p>
          <p className="text-sm text-gray-500 mt-2">Cliquez sur "Lancer le Scraping" pour collecter des données</p>
        </div>
      )}
    </div>
  );
}
