import { useState, useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  geolocateIP, 
  geolocateSelf, 
  geolocateMultipleIPs,
  checkIPSecurity,
  isIPstackAvailable,
  formatGeolocation,
  getCountryFlag,
  type IPGeolocation 
} from '../services/ipstackApi';

// Style sombre pour la carte
const mapStyle: maplibregl.StyleSpecification = {
  version: 8,
  name: 'IPTracker Dark',
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

interface TrackedIP {
  ip: string;
  data: IPGeolocation;
  timestamp: Date;
}

export default function IPTrackerPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [searchIP, setSearchIP] = useState('');
  const [batchIPs, setBatchIPs] = useState('');
  const [currentIP, setCurrentIP] = useState<IPGeolocation | null>(null);
  const [trackedIPs, setTrackedIPs] = useState<TrackedIP[]>([]);
  const [selectedIP, setSelectedIP] = useState<TrackedIP | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBatchMode, setShowBatchMode] = useState(false);

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [0, 20],
      zoom: 2,
      minZoom: 1,
      maxZoom: 18,
      attributionControl: false
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Charger l'IP du client au démarrage
    loadSelfIP();

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Charger l'IP du client
  const loadSelfIP = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await geolocateSelf();
      if (data) {
        setCurrentIP(data);
        addToTracked(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  // Rechercher une IP
  const handleSearchIP = async () => {
    if (!searchIP.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await geolocateIP(searchIP.trim());
      if (data) {
        addToTracked(data);
        setSearchIP('');
      } else {
        setError('IP non trouvée ou invalide');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de recherche');
    } finally {
      setIsLoading(false);
    }
  };

  // Rechercher plusieurs IPs
  const handleBatchSearch = async () => {
    if (!batchIPs.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const ips = batchIPs.split(/[,\n\s]+/).filter(ip => ip.trim());
      const results = await geolocateMultipleIPs(ips);
      
      results.forEach(data => {
        addToTracked(data);
      });

      setBatchIPs('');
      setShowBatchMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de recherche batch');
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter aux IPs suivies
  const addToTracked = (data: IPGeolocation) => {
    const newTracked: TrackedIP = {
      ip: data.ip,
      data,
      timestamp: new Date()
    };

    setTrackedIPs(prev => {
      // Éviter les doublons
      if (prev.some(item => item.ip === data.ip)) {
        return prev;
      }
      return [newTracked, ...prev].slice(0, 50); // Max 50 IPs
    });
  };

  // Supprimer une IP
  const removeTrackedIP = (ip: string) => {
    setTrackedIPs(prev => prev.filter(item => item.ip !== ip));
    if (selectedIP?.ip === ip) {
      setSelectedIP(null);
    }
  };

  // Mettre à jour les marqueurs
  useEffect(() => {
    if (!map.current) return;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Ajouter les nouveaux marqueurs avec animations avancées
    trackedIPs.forEach((tracked, index) => {
      const { latitude, longitude } = tracked.data;
      if (!latitude || !longitude) return;

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
        border: 2px solid #00f0ff;
        animation: ripple 2s ease-out infinite;
        animation-delay: ${index * 0.3}s;
      `;
      container.appendChild(ripple);
      
      // Marqueur principal avec animation
      const el = document.createElement('div');
      el.className = 'ip-marker animate-marker-pulse';
      el.style.cssText = `
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #00f0ff;
        border: 3px solid rgba(255,255,255,0.9);
        box-shadow: 0 0 20px #00f0ff, 0 0 40px #00f0ff, 0 0 60px #00f0ff;
        cursor: pointer;
        position: relative;
        z-index: 10;
        animation: marker-pulse 2s ease-in-out infinite, float-marker 3s ease-in-out infinite;
        animation-delay: ${index * 0.2}s;
      `;
      container.appendChild(el);

      const marker = new maplibregl.Marker({ element: container })
        .setLngLat([longitude, latitude])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelectedIP(tracked);
      });

      markersRef.current.push(marker);
    });
  }, [trackedIPs]);

  // Sélectionner une IP et centrer la carte
  const selectIP = (tracked: TrackedIP) => {
    setSelectedIP(tracked);
    if (map.current && tracked.data.latitude && tracked.data.longitude) {
      map.current.flyTo({
        center: [tracked.data.longitude, tracked.data.latitude],
        zoom: 8
      });
    }
  };

  if (!isIPstackAvailable()) {
    return (
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <i className="fas fa-map-marker-alt text-6xl text-red-400 mb-4"></i>
          <h2 className="text-2xl font-bold text-red-400 font-orbitron mb-2">
            API IPstack Non Configurée
          </h2>
          <p className="text-gray-400">
            Ajoutez VITE_IPSTACK_API_KEY dans le fichier .env
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold neon-text-cyan font-orbitron flex items-center gap-3">
              <i className="fas fa-map-marker-alt"></i>
              Géolocalisation IP en Temps Réel
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Suivi et analyse d'adresses IP avec IPstack API
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold neon-text-cyan font-orbitron">{trackedIPs.length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">IPs Suivies</p>
          </div>
        </div>

        {/* IP Actuelle */}
        {currentIP && (
          <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCountryFlag(currentIP)}</span>
              <div className="flex-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Votre IP</p>
                <p className="text-lg font-bold text-white font-mono">{currentIP.ip}</p>
                <p className="text-xs text-gray-400">{formatGeolocation(currentIP)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">FAI</p>
                <p className="text-sm text-cyan-400">{currentIP.connection?.isp || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recherche */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold neon-text-cyan font-orbitron uppercase tracking-wider">
            Recherche d'IP
          </h3>
          <button
            onClick={() => setShowBatchMode(!showBatchMode)}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {showBatchMode ? 'Mode Simple' : 'Mode Batch'}
          </button>
        </div>

        {!showBatchMode ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={searchIP}
              onChange={(e) => setSearchIP(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchIP()}
              placeholder="Entrez une adresse IP (ex: 8.8.8.8)"
              className="flex-1 bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none font-mono"
              disabled={isLoading}
            />
            <button
              onClick={handleSearchIP}
              disabled={isLoading || !searchIP.trim()}
              className="cyber-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className={`fas ${isLoading ? 'fa-spinner animate-spin' : 'fa-search'} mr-2`}></i>
              Rechercher
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              value={batchIPs}
              onChange={(e) => setBatchIPs(e.target.value)}
              placeholder="Entrez plusieurs IPs (séparées par virgule, espace ou nouvelle ligne)&#10;Ex: 8.8.8.8, 1.1.1.1, 208.67.222.222"
              className="w-full bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none font-mono h-24 resize-none"
              disabled={isLoading}
            />
            <button
              onClick={handleBatchSearch}
              disabled={isLoading || !batchIPs.trim()}
              className="cyber-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className={`fas ${isLoading ? 'fa-spinner animate-spin' : 'fa-search'} mr-2`}></i>
              Rechercher {batchIPs.split(/[,\n\s]+/).filter(ip => ip.trim()).length} IPs
            </button>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
            <div className="flex items-center gap-2">
              <i className="fas fa-exclamation-triangle text-red-400"></i>
              <span className="text-sm text-red-400">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Carte */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold neon-text-cyan font-orbitron flex items-center gap-3">
            <i className="fas fa-map"></i>
            Carte des IPs Géolocalisées
          </h3>
        </div>

        <div className="relative w-full rounded-xl overflow-hidden border border-cyan-500/20" style={{ height: '500px' }}>
          <div ref={mapContainer} className="w-full h-full" />
          
          {/* Overlay */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md rounded-lg px-4 py-3 border border-cyan-500/30 z-10">
            <p className="text-[10px] font-mono neon-text-green">API: IPSTACK</p>
            <p className="text-[10px] font-mono neon-text-cyan">IPs: {trackedIPs.length}</p>
          </div>

          {/* Popup IP sélectionnée */}
          {selectedIP && (
            <div className="absolute bottom-3 left-3 right-3 bg-black/95 backdrop-blur-md rounded-xl p-4 border border-cyan-500/30 z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{getCountryFlag(selectedIP.data)}</span>
                    <div>
                      <h4 className="text-lg font-bold text-white font-mono">{selectedIP.ip}</h4>
                      <p className="text-xs text-gray-400">{selectedIP.data.type.toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-gray-500 mb-1">LOCALISATION</p>
                      <p className="text-white font-bold">{selectedIP.data.city}</p>
                      <p className="text-gray-400">{selectedIP.data.region_name}</p>
                      <p className="text-gray-400">{selectedIP.data.country_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">COORDONNÉES</p>
                      <p className="text-cyan-400 font-mono">Lat: {selectedIP.data.latitude}</p>
                      <p className="text-cyan-400 font-mono">Lng: {selectedIP.data.longitude}</p>
                      <p className="text-gray-400">ZIP: {selectedIP.data.zip || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">CONNEXION</p>
                      <p className="text-white">{selectedIP.data.connection?.isp || 'N/A'}</p>
                      <p className="text-gray-400">ASN: {selectedIP.data.connection?.asn || 'N/A'}</p>
                      <p className="text-gray-400">Org: {selectedIP.data.connection?.org || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">SÉCURITÉ</p>
                      <p className={selectedIP.data.security?.is_proxy ? 'text-orange-400' : 'text-green-400'}>
                        Proxy: {selectedIP.data.security?.is_proxy ? 'Oui' : 'Non'}
                      </p>
                      <p className={selectedIP.data.security?.is_tor ? 'text-red-400' : 'text-green-400'}>
                        Tor: {selectedIP.data.security?.is_tor ? 'Oui' : 'Non'}
                      </p>
                      <p className={selectedIP.data.security?.is_crawler ? 'text-orange-400' : 'text-green-400'}>
                        Crawler: {selectedIP.data.security?.is_crawler ? 'Oui' : 'Non'}
                      </p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedIP(null)} className="text-gray-400 hover:text-white transition-colors ml-4">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Liste des IPs */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold neon-text-cyan font-orbitron flex items-center gap-3 mb-4">
          <i className="fas fa-list"></i>
          IPs Géolocalisées ({trackedIPs.length})
        </h3>

        {trackedIPs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-search text-4xl mb-4"></i>
            <p>Aucune IP géolocalisée</p>
            <p className="text-xs mt-2">Recherchez une IP pour commencer</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {trackedIPs.map((tracked) => (
              <div
                key={tracked.ip}
                onClick={() => selectIP(tracked)}
                className="p-3 bg-black/40 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCountryFlag(tracked.data)}</span>
                    <div>
                      <p className="text-sm font-bold text-white font-mono">{tracked.ip}</p>
                      <p className="text-[10px] text-gray-400">
                        {tracked.data.city}, {tracked.data.country_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{tracked.data.connection?.isp || 'N/A'}</p>
                      <div className="flex gap-1 mt-1">
                        {tracked.data.security?.is_proxy && (
                          <span className="text-[9px] px-1 py-0.5 bg-orange-500/20 text-orange-400 rounded">PROXY</span>
                        )}
                        {tracked.data.security?.is_tor && (
                          <span className="text-[9px] px-1 py-0.5 bg-red-500/20 text-red-400 rounded">TOR</span>
                        )}
                        {tracked.data.security?.is_crawler && (
                          <span className="text-[9px] px-1 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">BOT</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTrackedIP(tracked.ip);
                      }}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
