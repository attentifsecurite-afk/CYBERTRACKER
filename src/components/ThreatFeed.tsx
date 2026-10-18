import { useState, useEffect } from 'react';
import { searchThreats, searchLatestThreats, searchDarkWebLeaks, searchMalwareReports, type BraveSearchResult } from '../services/braveApi';

interface ThreatFeedItem {
  title: string;
  url: string;
  description: string;
  category: string;
  timestamp: Date;
}

export default function ThreatFeed() {
  const [feed, setFeed] = useState<ThreatFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const categories = [
    { id: 'all', label: 'Toutes', icon: 'fa-globe' },
    { id: 'latest', label: 'Dernières', icon: 'fa-bolt' },
    { id: 'darkweb', label: 'Dark Web', icon: 'fa-user-secret' },
    { id: 'malware', label: 'Malware', icon: 'fa-virus' },
  ];

  const fetchFeed = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      let results: BraveSearchResult[] = [];
      
      switch (category) {
        case 'latest':
          const latestData = await searchLatestThreats();
          results = latestData.web?.results || [];
          break;
        case 'darkweb':
          const darkData = await searchDarkWebLeaks();
          results = darkData.web?.results || [];
          break;
        case 'malware':
          const malwareData = await searchMalwareReports();
          results = malwareData.web?.results || [];
          break;
        default:
          const allData = await searchLatestThreats();
          results = allData.web?.results || [];
      }

      setFeed(results.map(r => ({
        title: r.title,
        url: r.url,
        description: r.description,
        category: category === 'all' ? 'latest' : category,
        timestamp: new Date(),
      })));
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion API');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchThreats(searchQuery);
      const results = data.web?.results || [];
      setFeed(results.map(r => ({
        title: r.title,
        url: r.url,
        description: r.description,
        category: 'search',
        timestamp: new Date(),
      })));
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de recherche');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed('latest');
  }, []);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold neon-text-orange font-orbitron flex items-center gap-3">
          <i className="fas fa-rss"></i>
          Feed Menaces - Brave API
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400 font-mono">
            MAJ: {lastUpdate.toLocaleTimeString('fr-FR')}
          </span>
          <button
            onClick={() => fetchFeed(activeCategory)}
            className="cyber-button text-xs"
            title="Rafraîchir"
          >
            <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Rechercher une menace, IP, domaine..."
            className="w-full bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none font-mono focus:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          />
          <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500/50"></i>
        </div>
        <button
          onClick={handleSearch}
          className="cyber-button"
        >
          <i className="fas fa-crosshairs mr-1"></i>
          Traquer
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); fetchFeed(cat.id); }}
            className={`cyber-tab text-xs whitespace-nowrap ${activeCategory === cat.id ? 'active' : ''}`}
          >
            <i className={`fas ${cat.icon} mr-1`}></i>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-3 p-3 bg-pink-500/10 border border-pink-500/30 rounded-lg">
          <p className="text-xs neon-text-pink flex items-center gap-2">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">Vérifiez votre clé API dans .env</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-400 font-mono">Scan en cours via Brave API...</span>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {feed.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-search text-3xl mb-2"></i>
              <p className="text-sm">Aucun résultat</p>
            </div>
          ) : (
            feed.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg bg-black/40 border border-gray-800 hover:border-cyan-500/50 transition-all group"
              >
                <div className="flex items-start gap-2">
                  <i className="fas fa-link text-cyan-400 mt-0.5 text-xs"></i>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white font-medium group-hover:neon-text-blue transition-colors truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] text-gray-500 truncate max-w-[200px]">{item.url}</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      )}

      {/* API Status */}
      <div className="mt-3 pt-3 border-t border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`status-indicator ${error ? 'status-danger' : 'status-active'}`}></span>
          <span className="text-[10px] font-mono text-gray-400">
            Brave Search API {error ? 'ERREUR' : 'CONNECTÉE'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-gray-500">
          {feed.length} résultats
        </span>
      </div>
    </div>
  );
}
