import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface TrackedURL {
  id: string;
  url: string;
  domain: string;
  ip: string;
  lat: number;
  lng: number;
  country: string;
  city: string;
  status: 'blocked' | 'tracking' | 'analyzed';
  threat: string;
  timestamp: Date;
}

// Données de démonstration
const DEMO_TRACKED_URLS: TrackedURL[] = [
  {
    id: '1',
    url: 'https://malware-site.com',
    domain: 'malware-site.com',
    ip: '185.220.101.1',
    lat: 52.52,
    lng: 13.405,
    country: 'Allemagne',
    city: 'Berlin',
    status: 'blocked',
    threat: 'Distribution de malware',
    timestamp: new Date()
  },
  {
    id: '2',
    url: 'https://phishing-bank.xyz',
    domain: 'phishing-bank.xyz',
    ip: '91.219.236.222',
    lat: 55.7558,
    lng: 37.6173,
    country: 'Russie',
    city: 'Moscou',
    status: 'blocked',
    threat: 'Site de phishing bancaire',
    timestamp: new Date()
  },
  {
    id: '3',
    url: 'https://crypto-scam.net',
    domain: 'crypto-scam.net',
    ip: '103.253.41.99',
    lat: 39.9042,
    lng: 116.4074,
    country: 'Chine',
    city: 'Pékin',
    status: 'tracking',
    threat: 'Escroquerie crypto',
    timestamp: new Date()
  },
  {
    id: '4',
    url: 'https://fake-shop.org',
    domain: 'fake-shop.org',
    ip: '45.33.32.156',
    lat: 37.7749,
    lng: -122.4194,
    country: 'USA',
    city: 'San Francisco',
    status: 'analyzed',
    threat: 'Boutique frauduleuse',
    timestamp: new Date()
  },
  {
    id: '5',
    url: 'https://darkmarket.onion',
    domain: 'darkmarket.onion',
    ip: '192.42.116.16',
    lat: 52.3676,
    lng: 4.9041,
    country: 'Pays-Bas',
    city: 'Amsterdam',
    status: 'tracking',
    threat: 'Marketplace darknet',
    timestamp: new Date()
  },
];

// Style sombre pour la carte
const mapStyle: maplibregl.StyleSpecification = {
  version: 8,
  name: 'CyberTracker Dark',
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap'
    }
  },
  layers: [
    {
      id: 'osm-tiles',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
      paint: {
        'raster-saturation': -1,
        'raster-brightness-max': 0.25,
        'raster-brightness-min': 0.03,
        'raster-contrast': 0.4,
        'raster-hue-rotate': 180,
      }
    }
  ]
};

export default function WorldMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  
  const [trackedUrls, setTrackedUrls] = useState<TrackedURL[]>(DEMO_TRACKED_URLS);
  const [newUrl, setNewUrl] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<TrackedURL | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blocked': return '#ff006e';
      case 'tracking': return '#ff6b00';
      case 'analyzed': return '#00ff9d';
      default: return '#ffcc00';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'blocked': return 'BLOQUÉ';
      case 'tracking': return 'EN TRAQUE';
      case 'analyzed': return 'ANALYSÉ';
      default: return 'INCONNU';
    }
  };

  // Extraire le domaine d'une URL
  const extractDomain = (url: string): string => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  // Simuler l'analyse d'une URL (géolocalisation)
  const analyzeUrl = async (url: string) => {
    setIsAnalyzing(true);
    
    // Simuler un délai d'analyse
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Générer des données aléatoires pour la démonstration
    const domain = extractDomain(url);
    const randomLat = (Math.random() - 0.5) * 120;
    const randomLng = (Math.random() - 0.5) * 300;
    
    const countries = ['Russie', 'Chine', 'USA', 'Allemagne', 'Pays-Bas', 'Roumanie', 'Ukraine', 'Brésil'];
    const cities = ['Moscou', 'Pékin', 'New York', 'Berlin', 'Amsterdam', 'Bucarest', 'Kiev', 'São Paulo'];
    const threats = ['Site de phishing', 'Distribution de malware', 'Escroquerie', 'Marketplace illégal', 'Vol de données'];
    
    const randomIndex = Math.floor(Math.random() * countries.length);
    
    const newTrackedUrl: TrackedURL = {
      id: Date.now().toString(),
      url: url.startsWith('http') ? url : `https://${url}`,
      domain,
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      lat: randomLat,
      lng: randomLng,
      country: countries[randomIndex],
      city: cities[randomIndex],
      status: 'tracking',
      threat: threats[Math.floor(Math.random() * threats.length)],
      timestamp: new Date()
    };
    
    setTrackedUrls(prev => [...prev, newTrackedUrl]);
    setIsAnalyzing(false);
    setNewUrl('');
  };

  // Supprimer une URL de la liste
  const removeUrl = (id: string) => {
    setTrackedUrls(prev => prev.filter(url => url.id !== id));
    if (selectedUrl?.id === id) {
      setSelectedUrl(null);
    }
  };

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log('🗺️ Initialisation de la carte...');

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [10, 30],
      zoom: 2,
      minZoom: 1,
      maxZoom: 12,
      attributionControl: false
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      console.log('✅ Carte chargée avec succès');
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Mettre à jour les marqueurs quand les URLs changent
  useEffect(() => {
    if (!map.current) return;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Ajouter les nouveaux marqueurs avec animations avancées
    trackedUrls.forEach((trackedUrl, index) => {
      const color = getStatusColor(trackedUrl.status);
      
      // Créer un conteneur pour le marqueur avec effet ripple
      const container = document.createElement('div');
      container.style.position = 'relative';
      container.style.width = '40px';
      container.style.height = '40px';
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      
      // Effet ripple (onde de choc)
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 2px solid ${color};
        animation: ripple 2s ease-out infinite;
        animation-delay: ${index * 0.3}s;
      `;
      container.appendChild(ripple);
      
      // Marqueur principal avec animation
      const el = document.createElement('div');
      el.className = 'tracked-url-marker animate-marker-pulse';
      el.style.cssText = `
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: ${color};
        border: 3px solid rgba(255,255,255,0.9);
        box-shadow: 0 0 20px ${color}, 0 0 40px ${color}, 0 0 60px ${color};
        cursor: pointer;
        position: relative;
        z-index: 10;
        animation: marker-pulse 2s ease-in-out infinite, float-marker 3s ease-in-out infinite;
        animation-delay: ${index * 0.2}s;
      `;
      container.appendChild(el);

      const marker = new maplibregl.Marker({ element: container })
        .setLngLat([trackedUrl.lng, trackedUrl.lat])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelectedUrl(trackedUrl);
      });

      markersRef.current.push(marker);
    });
  }, [trackedUrls]);

  return (
    <div className="space-y-6">
      {/* Barre de recherche d'URL */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold neon-text-purple font-orbitron flex items-center gap-3 mb-4">
          <i className="fas fa-search-location"></i>
          Traquer ou Bloquer une URL
        </h3>
        
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && newUrl && analyzeUrl(newUrl)}
              placeholder="Entrez une URL ou un domaine à traquer (ex: malware-site.com)"
              className="w-full bg-black/60 border border-purple-500/30 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none font-mono focus:shadow-[0_0_20px_rgba(184,41,255,0.2)]"
              disabled={isAnalyzing}
            />
            <i className="fas fa-link absolute right-4 top-1/2 -translate-y-1/2 text-purple-500/50"></i>
          </div>
          <button
            onClick={() => newUrl && analyzeUrl(newUrl)}
            disabled={isAnalyzing || !newUrl}
            className="cyber-button disabled:opacity-50 disabled:cursor-not-allowed px-6"
          >
            {isAnalyzing ? (
              <>
                <i className="fas fa-spinner animate-spin mr-2"></i>
                Analyse...
              </>
            ) : (
              <>
                <i className="fas fa-crosshairs mr-2"></i>
                Traquer
              </>
            )}
          </button>
        </div>

        {isAnalyzing && (
          <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs neon-text-purple font-mono">Analyse et géolocalisation en cours...</span>
            </div>
          </div>
        )}
      </div>

      {/* Carte */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold neon-text-blue font-orbitron flex items-center gap-3">
            <i className="fas fa-globe"></i>
            Carte Mondiale des URLs Traquées
          </h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-white font-orbitron">{trackedUrls.length}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">URLs Traquées</p>
          </div>
        </div>

        {/* Légende */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff006e] shadow-[0_0_10px_#ff006e]"></div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Bloqué</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff6b00] shadow-[0_0_10px_#ff6b00]"></div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">En Traque</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00ff9d] shadow-[0_0_10px_#00ff9d]"></div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Analysé</span>
          </div>
        </div>

        {/* Conteneur de la carte */}
        <div className="relative w-full rounded-xl overflow-hidden border border-cyan-500/20" style={{ height: '600px' }}>
          <div ref={mapContainer} className="w-full h-full" />
          
          {/* Effet de scan radar */}
          <div className="absolute inset-0 pointer-events-none z-5">
            <svg className="w-full h-full animate-scan-sweep" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#00f0ff', stopOpacity: 0 }} />
                  <stop offset="50%" style={{ stopColor: '#00f0ff', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#00f0ff', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="100" height="100" fill="url(#scanGradient)" opacity="0.2" />
            </svg>
          </div>
          
          {/* Overlay d'information */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md rounded-lg px-4 py-3 border border-cyan-500/30 z-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <p className="text-[10px] font-mono neon-text-green">CARTE: ACTIVE</p>
            </div>
            <p className="text-[10px] font-mono neon-text-blue">SOURCE: OPENSTREETMAP</p>
            <p className="text-[10px] font-mono neon-text-orange">SCAN: EN COURS</p>
            <p className="text-[10px] font-mono text-gray-400">URLs: {trackedUrls.length}</p>
          </div>

          {/* Popup de l'URL sélectionnée */}
          {selectedUrl && (
            <div className="absolute bottom-3 left-3 right-3 bg-black/95 backdrop-blur-md rounded-xl p-4 border border-cyan-500/30 z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: getStatusColor(selectedUrl.status), boxShadow: `0 0 15px ${getStatusColor(selectedUrl.status)}` }}></div>
                    <h4 className="text-sm font-bold text-white font-orbitron">{selectedUrl.domain}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      selectedUrl.status === 'blocked' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50' :
                      selectedUrl.status === 'tracking' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' :
                      'bg-green-500/20 text-green-400 border border-green-500/50'
                    }`}>
                      {getStatusLabel(selectedUrl.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <p className="text-gray-300"><span className="text-gray-500">URL:</span> <span className="neon-text-blue font-mono text-[11px]">{selectedUrl.url}</span></p>
                    <p className="text-gray-300"><span className="text-gray-500">IP:</span> <span className="neon-text-orange font-mono">{selectedUrl.ip}</span></p>
                    <p className="text-gray-300"><span className="text-gray-500">Localisation:</span> {selectedUrl.city}, {selectedUrl.country}</p>
                    <p className="text-gray-300"><span className="text-gray-500">Coordonnées:</span> <span className="font-mono text-[10px]">{selectedUrl.lat.toFixed(4)}, {selectedUrl.lng.toFixed(4)}</span></p>
                    <p className="text-gray-300"><span className="text-gray-500">Menace:</span> <span className="neon-text-pink">{selectedUrl.threat}</span></p>
                  </div>
                </div>
                <button onClick={() => setSelectedUrl(null)} className="text-gray-400 hover:text-white transition-colors ml-4">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-3 bg-black/40 rounded-lg border border-pink-500/20">
            <p className="text-xl font-bold neon-text-pink font-orbitron">{trackedUrls.filter(u => u.status === 'blocked').length}</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider">Bloqués</p>
          </div>
          <div className="text-center p-3 bg-black/40 rounded-lg border border-orange-500/20">
            <p className="text-xl font-bold neon-text-orange font-orbitron">{trackedUrls.filter(u => u.status === 'tracking').length}</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider">En Traque</p>
          </div>
          <div className="text-center p-3 bg-black/40 rounded-lg border border-green-500/20">
            <p className="text-xl font-bold neon-text-green font-orbitron">{trackedUrls.filter(u => u.status === 'analyzed').length}</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider">Analysés</p>
          </div>
        </div>
      </div>

      {/* Liste des URLs traquées */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold neon-text-orange font-orbitron flex items-center gap-3 mb-4">
          <i className="fas fa-list"></i>
          URLs Traquées ({trackedUrls.length})
        </h3>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {trackedUrls.map((url) => (
            <div
              key={url.id}
              onClick={() => {
                setSelectedUrl(url);
                map.current?.flyTo({ center: [url.lng, url.lat], zoom: 8 });
              }}
              className="p-3 bg-black/40 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(url.status), boxShadow: `0 0 8px ${getStatusColor(url.status)}` }}></div>
                    <span className="text-sm font-bold text-white">{url.domain}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${
                      url.status === 'blocked' ? 'bg-pink-500/20 text-pink-400' :
                      url.status === 'tracking' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {getStatusLabel(url.status)}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono mb-1">{url.url}</p>
                  <div className="flex items-center gap-4 text-[10px] text-gray-500">
                    <span><i className="fas fa-network-wired mr-1 text-orange-400"></i>{url.ip}</span>
                    <span><i className="fas fa-map-marker-alt mr-1 text-cyan-400"></i>{url.city}, {url.country}</span>
                    <span><i className="fas fa-exclamation-triangle mr-1 text-pink-400"></i>{url.threat}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeUrl(url.id);
                  }}
                  className="text-gray-500 hover:text-pink-400 transition-colors"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
