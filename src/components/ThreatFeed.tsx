import { useState, useEffect } from 'react';
import { searchThreats, searchLatestThreats, searchDarkWebLeaks, searchMalwareReports, type BraveSearchResult } from '../services/braveApi';
import { geolocateIP, type RealThreat } from '../services/realTimeData';

interface ThreatFeedItem {
  title: string;
  url: string;
  description: string;
  category: string;
  timestamp: Date;
  ips?: string[];
  locations?: { ip: string; country: string; city: string }[];
}

export default function ThreatFeed() {
  const [feed, setFeed] = useState<ThreatFeedItem[]>([]);
  const [realThreats, setRealThreats] = useState<RealThreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [mode, setMode] = useState<'real' | 'search'>('real');

  const categories = [
    { id: 'all', label: 'Temps Réel', icon: 'fa-bolt' },
    { id: 'latest', label: 'Dernières', icon: 'fa-clock' },
    { id: 'darkweb', label: 'Dark Web', icon: 'fa-user-secret' },
    { id: 'malware', label: 'Malware', icon: 'fa-virus' },
  ];

  // Extraction d'IPs depuis du texte
  const extractIPs = (text: string): string[] => {
    const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
    const matches = text.match(ipRegex) || [];
    return matches.filter(ip => {
      const parts = ip.split('.').map(Number);
      return !(parts[0] === 10 || 
               (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
               (parts[0] === 192 && parts[1] === 168) ||
               parts[0] === 127 ||
               parts[0] === 0);
    });
  };

  // Récupérer de VRAIES données en temps réel
  const fetchRealTimeData = async () => {
    setLoading(true);
    setError(null);
    setMode('real');
    
    try {
      // Récupérer les dernières menaces via Brave Search
      const results = await searchLatestThreats();
      
      if (results.web?.results) {
        const feedItems: ThreatFeedItem[] = [];
        const threats: RealThreat[] = [];
        
        for (const result of results.web.results) {
          const ips = extractIPs(result.title + ' ' + result.description);
          const locations: { ip: string; country: string; city: string }[] = [];
          
          // Géolocaliser les IPs trouvées
          for (const ip of ips.slice(0, 2)) {
            const geo = await geolocateIP(ip);
            if (geo) {
              locations.push({
                ip: geo.ip,
                country: geo.country,
                city: geo.city
              });
              
              // Déterminer le type de menace
              const text = (result.title + ' ' + result.description).toLowerCase();
              let type: 'critical' | 'high' | 'medium' | 'low' = 'low';
              if (text.includes('ransomware') || text.includes('zero-day')) type = 'critical';
              else if (text.includes('malware') || text.includes('botnet')) type = 'high';
              else if (text.includes('phishing') || text.includes('scam')) type = 'medium';
              
              threats.push({
                id: `REAL-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                ip: geo.ip,
                lat: geo.lat,
                lng: geo.lng,
                country: geo.country,
                city: geo.city,
                threat: text.includes('ransomware') ? 'Ransomware' : 
                       text.includes('phishing') ? 'Phishing' :
                       text.includes('malware') ? 'Malware' : 'Cyber Threat',
                type,
                timestamp: new Date(),
                source: result.url
              });
            }
          }
          
          feedItems.push({
            title: result.title,
            url: result.url,
            description: result.description,
            category: 'latest',
            timestamp: new Date(),
            ips,
            locations
          });
        }
        
        setFeed(feedItems);
        setRealThreats(threats);
        setLastUpdate(new Date());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion API');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeed = async (category: string) => {
    if (category === 'all') {
      await fetchRealTimeData();
      return;
    }
    
    setLoading(true);
    setError(null);
    setMode('search');
    
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
      }

      const feedItems: ThreatFeedItem[] = results.map(r => ({
        title: r.title,
        url: r.url,
        description: r.description,
        category,
        timestamp: new Date(),
        ips: extractIPs(r.title + ' ' + r.description),
      }));
      
      setFeed(feedItems);
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
    setMode('search');
    
    try {
      const data = await searchThreats(searchQuery);
      const results = data.web?.results || [];
      
      const feedItems: ThreatFeedItem[] = results.map(r => ({
        title: r.title,
        url: r.url,
        description: r.description,
        category: 'search',
        timestamp: new Date(),
        ips: extractIPs(r.title + ' ' + r.description),
      }));
      
      setFeed(feedItems);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de recherche');
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial avec de VRAIES données
  useEffect(() => {
    fetchRealTimeData();
    
    // Rafraîchir automatiquement toutes les 30 secondes
    const interval = setInterval(fetchRealTimeData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold neon-text-orange font-orbitron flex items-center gap-3">
          <i className="fas fa-rss"></i>
          Feed Menaces RÉELLES - Brave API
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

      {/* Mode indicator */}
      <div className="mb-4 p-3 bg-black/40 rounded-lg border border-green-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="status-indicator status-active"></span>
            <span className="text-xs neon-text-green font-mono">
              {mode === 'real' ? 'MODE TEMPS RÉEL ACTIF' : 'MODE RECHERCHE'}
            </span>
          </div>
          <div className="text-xs text-gray-400 font-mono">
            {realThreats.length > 0 && `${realThreats.length} IPs géolocalisées`}
          </div>
        </div>
        <p className="text-[10px] text-gray-500 mt-1">
          Données réelles via Brave Search API + Géolocalisation IP (ip-api.com)
        </p>
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
            <span className="text-sm text-gray-400 font-mono">Récupération de vraies menaces en temps réel...</span>
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
                    
                    {/* IPs detected */}
                    {item.ips && item.ips.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.ips.slice(0, 3).map((ip, idx) => (
                          <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-pink-500/20 text-pink-400 rounded border border-pink-500/30 font-mono">
                            IP: {ip}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Locations */}
                    {item.locations && item.locations.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.locations.map((loc, idx) => (
                          <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">
                            <i className="fas fa-map-marker-alt mr-1"></i>
                            {loc.city}, {loc.country}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] text-gray-500 truncate max-w-[200px]">{item.url}</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">
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
          {feed.length} résultats | {realThreats.length} IPs géolocalisées
        </span>
      </div>
    </div>
  );
}
