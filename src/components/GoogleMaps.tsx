import { useEffect, useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { fetchRealThreats, type RealThreat } from '../services/realTimeData';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Données de menaces de secours (en attendant les vraies données)
const FALLBACK_THREATS: RealThreat[] = [
  { id: 'FB-001', ip: '185.220.101.1', lat: 52.52, lng: 13.405, country: 'Allemagne', city: 'Berlin', threat: 'Tor Exit Node', type: 'high', timestamp: new Date(), source: 'fallback' },
  { id: 'FB-002', ip: '91.219.236.222', lat: 55.7558, lng: 37.6173, country: 'Russie', city: 'Moscou', threat: 'Botnet C2', type: 'critical', timestamp: new Date(), source: 'fallback' },
  { id: 'FB-003', ip: '103.253.41.99', lat: 39.9042, lng: 116.4074, country: 'Chine', city: 'Pékin', threat: 'APT Attack', type: 'critical', timestamp: new Date(), source: 'fallback' },
  { id: 'FB-004', ip: '45.33.32.156', lat: 37.7749, lng: -122.4194, country: 'USA', city: 'San Francisco', threat: 'Port Scanner', type: 'medium', timestamp: new Date(), source: 'fallback' },
  { id: 'FB-005', ip: '192.42.116.16', lat: 52.3676, lng: 4.9041, country: 'Pays-Bas', city: 'Amsterdam', threat: 'Tor Relay', type: 'high', timestamp: new Date(), source: 'fallback' },
  { id: 'FB-006', ip: '176.10.104.240', lat: 47.3769, lng: 8.5417, country: 'Suisse', city: 'Zurich', threat: 'Privacy Service', type: 'medium', timestamp: new Date(), source: 'fallback' },
  { id: 'FB-007', ip: '209.141.58.180', lat: 36.1699, lng: -115.1398, country: 'USA', city: 'Las Vegas', threat: 'Hosting Provider', type: 'low', timestamp: new Date(), source: 'fallback' },
  { id: 'FB-008', ip: '185.220.100.240', lat: 50.1109, lng: 8.6821, country: 'Allemagne', city: 'Francfort', threat: 'Tor Exit', type: 'high', timestamp: new Date(), source: 'fallback' },
  { id: 'FB-009', ip: '62.102.148.68', lat: 38.03, lng: 126.98, country: 'Corée du Nord', city: 'Pyongyang', threat: 'APT Group', type: 'critical', timestamp: new Date(), source: 'fallback' },
  { id: 'FB-010', ip: '5.188.206.14', lat: 44.4268, lng: 26.1025, country: 'Roumanie', city: 'Bucarest', threat: 'Brute Force', type: 'medium', timestamp: new Date(), source: 'fallback' },
  { id: 'FB-011', ip: '185.100.87.202', lat: 52.3676, lng: 4.9041, country: 'Pays-Bas', city: 'Amsterdam', threat: 'VPN Service', type: 'low', timestamp: new Date(), source: 'fallback' },
  { id: 'FB-012', ip: '77.247.181.162', lat: 48.2082, lng: 16.3738, country: 'Autriche', city: 'Vienne', threat: 'Tor Exit', type: 'high', timestamp: new Date(), source: 'fallback' },
  { id: 'FB-013', ip: '171.25.193.77', lat: 59.3293, lng: 18.0686, country: 'Suède', city: 'Stockholm', threat: 'Tor Relay', type: 'medium', timestamp: new Date(), source: 'fallback' },
  { id: 'FB-014', ip: '104.244.76.13', lat: 43.6532, lng: -79.3832, country: 'Canada', city: 'Toronto', threat: 'Hidden Service', type: 'low', timestamp: new Date(), source: 'fallback' },
  { id: 'FB-015', ip: '178.17.170.147', lat: 41.0082, lng: 28.9784, country: 'Turquie', city: 'Istanbul', threat: 'Proxy Service', type: 'medium', timestamp: new Date(), source: 'fallback' },
];

// Style sombre pour Google Maps
const googleMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0a0e1a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0e1a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4a5568' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#1e293b' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#0f172a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#334155' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c1220' }] },
];

// Style MapLibre (fallback)
const maplibreStyle: maplibregl.StyleSpecification = {
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

const containerStyle = {
  width: '100%',
  height: '600px'
};

const defaultCenter = {
  lat: 30,
  lng: 10
};

export default function GoogleMaps() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  const [threats, setThreats] = useState<RealThreat[]>(FALLBACK_THREATS);
  const [selectedThreat, setSelectedThreat] = useState<RealThreat | null>(null);
  const [totalAttacks, setTotalAttacks] = useState(2847);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [mapError, setMapError] = useState<string | null>(null);
  const [useMapLibre, setUseMapLibre] = useState(false);
  
  // MapLibre refs
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const getColor = (type: string) => {
    switch (type) {
      case 'critical': return '#ff006e';
      case 'high': return '#ff6b00';
      case 'medium': return '#ffcc00';
      default: return '#00ff9d';
    }
  };

  // Charger les données réelles
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔍 Chargement des menaces réelles...');
        const realThreats = await fetchRealThreats();
        
        if (realThreats.length > 0) {
          console.log(`✅ ${realThreats.length} menaces réelles chargées`);
          setThreats(realThreats);
        } else {
          console.log('⚠️ Pas de menaces réelles, utilisation des données de secours');
          setThreats(FALLBACK_THREATS);
        }
        
        setLastUpdate(new Date());
      } catch (error) {
        console.error('❌ Erreur chargement données:', error);
        setThreats(FALLBACK_THREATS);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000); // Toutes les 60 secondes
    return () => clearInterval(interval);
  }, []);

  // Initialiser MapLibre si Google Maps échoue
  useEffect(() => {
    if (!useMapLibre || !mapContainer.current || map.current) return;

    console.log('🗺️ Initialisation de MapLibre GL (fallback)...');

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: maplibreStyle,
      center: [defaultCenter.lng, defaultCenter.lat],
      zoom: 2,
      minZoom: 1,
      maxZoom: 12,
      attributionControl: false
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      console.log('✅ MapLibre GL chargé avec succès');
      
      // Ajouter les marqueurs
      threats.forEach(threat => {
        const color = getColor(threat.type);
        
        const el = document.createElement('div');
        el.className = 'attack-marker';
        el.style.cssText = `
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${color};
          border: 2px solid rgba(255,255,255,0.8);
          box-shadow: 0 0 15px ${color}, 0 0 30px ${color};
          cursor: pointer;
          animation: pulse-marker 2s infinite;
        `;

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([threat.lng, threat.lat])
          .addTo(map.current!);

        el.addEventListener('click', () => {
          setSelectedThreat(threat);
        });

        markersRef.current.push(marker);
      });
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [useMapLibre, threats]);

  // Si Google Maps échoue, utiliser MapLibre
  useEffect(() => {
    if (loadError || !GOOGLE_MAPS_API_KEY) {
      console.warn('⚠️ Google Maps non disponible, utilisation de MapLibre GL');
      setUseMapLibre(true);
      setMapError('Mode MapLibre activé (fallback)');
    }
  }, [loadError]);

  // Rafraîchir les marqueurs MapLibre quand les menaces changent
  useEffect(() => {
    if (!useMapLibre || !map.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    threats.forEach(threat => {
      const color = getColor(threat.type);
      
      const el = document.createElement('div');
      el.className = 'attack-marker';
      el.style.cssText = `
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid rgba(255,255,255,0.8);
        box-shadow: 0 0 15px ${color}, 0 0 30px ${color};
        cursor: pointer;
        animation: pulse-marker 2s infinite;
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([threat.lng, threat.lat])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelectedThreat(threat);
      });

      markersRef.current.push(marker);
    });
  }, [threats, useMapLibre]);

  // Si on utilise MapLibre, afficher le conteneur MapLibre
  if (useMapLibre) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold neon-text-blue font-orbitron flex items-center gap-3">
            <i className="fas fa-globe"></i>
            Carte Mondiale des Menaces - MapLibre GL
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="status-indicator status-danger"></span>
              <span className="text-xs font-mono neon-text-pink">LIVE</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white font-orbitron">{totalAttacks.toLocaleString()}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Menaces Totales</p>
            </div>
          </div>
        </div>

        <div className="mb-4 p-3 bg-black/40 rounded-lg border border-yellow-500/30">
          <div className="flex items-center gap-2">
            <i className="fas fa-exclamation-triangle neon-text-orange"></i>
            <span className="text-xs neon-text-orange font-mono">MODE FALLBACK - MapLibre GL (OpenStreetMap)</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            Google Maps non disponible. Utilisation de MapLibre GL avec OpenStreetMap.
          </p>
        </div>

        <div className="relative w-full rounded-xl overflow-hidden border border-cyan-500/20" style={{ height: '600px' }}>
          <div ref={mapContainer} className="w-full h-full" />
          
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md rounded-lg px-4 py-3 border border-cyan-500/30 z-10">
            <p className="text-[10px] font-mono neon-text-green">MODE: FALLBACK</p>
            <p className="text-[10px] font-mono neon-text-blue">API: OPENSTREETMAP</p>
            <p className="text-[10px] font-mono neon-text-orange">MOTIF: {mapError}</p>
          </div>

          {selectedThreat && (
            <div className="absolute bottom-3 left-3 right-3 bg-black/90 backdrop-blur-md rounded-xl p-4 border border-cyan-500/30 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: getColor(selectedThreat.type), boxShadow: `0 0 15px ${getColor(selectedThreat.type)}` }}></div>
                  <div>
                    <p className="text-sm font-bold text-white font-orbitron">{selectedThreat.threat} - {selectedThreat.city}, {selectedThreat.country}</p>
                    <p className="text-[10px] text-gray-400 font-mono">IP: {selectedThreat.ip} | Lat: {selectedThreat.lat.toFixed(4)}° Lng: {selectedThreat.lng.toFixed(4)}°</p>
                  </div>
                </div>
                <button onClick={() => setSelectedThreat(null)} className="text-gray-400 hover:text-white transition-colors">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="text-center p-3 bg-black/40 rounded-lg border border-pink-500/20">
            <p className="text-xl font-bold neon-text-pink font-orbitron">{threats.filter(t => t.type === 'critical').length}</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider">Critiques</p>
          </div>
          <div className="text-center p-3 bg-black/40 rounded-lg border border-orange-500/20">
            <p className="text-xl font-bold neon-text-blue font-orbitron">{threats.filter(t => t.type === 'high').length}</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider">Élevées</p>
          </div>
          <div className="text-center p-3 bg-black/40 rounded-lg border border-yellow-500/20">
            <p className="text-xl font-bold neon-text-purple font-orbitron">{threats.filter(t => t.type === 'medium').length}</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider">Moyennes</p>
          </div>
          <div className="text-center p-3 bg-black/40 rounded-lg border border-green-500/20">
            <p className="text-xl font-bold neon-text-green font-orbitron">{threats.filter(t => t.type === 'low').length}</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider">Faibles</p>
          </div>
        </div>
      </div>
    );
  }

  // Si Google Maps est en cours de chargement
  if (!isLoaded) {
    return (
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg neon-text-blue font-orbitron">Chargement de la Carte du Monde...</p>
          <p className="text-xs text-gray-400 mt-2">Initialisation de Google Maps</p>
        </div>
      </div>
    );
  }

  // Si Google Maps est chargé, l'afficher
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold neon-text-blue font-orbitron flex items-center gap-3">
          <i className="fas fa-globe"></i>
          Carte Mondiale des Menaces - Google Maps
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="status-indicator status-danger"></span>
            <span className="text-xs font-mono neon-text-pink">LIVE</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white font-orbitron">{totalAttacks.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Menaces Totales</p>
          </div>
        </div>
      </div>

      <div className="mb-4 p-3 bg-black/40 rounded-lg border border-green-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="status-indicator status-active"></span>
            <span className="text-xs neon-text-green font-mono">MODE RÉEL ACTIF</span>
          </div>
          <div className="text-xs text-gray-400 font-mono">
            Dernière MAJ: {lastUpdate.toLocaleTimeString('fr-FR')} | {threats.length} menaces affichées
          </div>
        </div>
        <p className="text-[10px] text-gray-500 mt-1">
          {threats[0]?.source === 'fallback' ? 'Données de secours affichées (en attente de données réelles)' : 'Données réelles via Brave Search API + Géolocalisation IP'}
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff006e] shadow-[0_0_10px_#ff006e]"></div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Critique</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff6b00] shadow-[0_0_10px_#ff6b00]"></div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Élevé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ffcc00] shadow-[0_0_10px_#ffcc00]"></div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Moyen</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#00ff9d] shadow-[0_0_10px_#00ff9d]"></div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Faible</span>
        </div>
      </div>

      {/* Google Map */}
      <div className="relative w-full rounded-xl overflow-hidden border border-cyan-500/20">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={2}
          options={{
            styles: googleMapStyle,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            backgroundColor: '#0a0e1a',
          }}
        >
          {threats.map((threat) => {
            if (!threat.lat || !threat.lng || isNaN(threat.lat) || isNaN(threat.lng)) {
              return null;
            }

            return (
              <Marker
                key={threat.id}
                position={{ lat: threat.lat, lng: threat.lng }}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: getColor(threat.type),
                  fillOpacity: 0.9,
                  strokeColor: '#ffffff',
                  strokeWeight: 2,
                }}
                onClick={() => setSelectedThreat(threat)}
                title={`${threat.threat} - ${threat.city}`}
              />
            );
          })}

          {selectedThreat && selectedThreat.lat && selectedThreat.lng && (
            <InfoWindow
              position={{ lat: selectedThreat.lat, lng: selectedThreat.lng }}
              onCloseClick={() => setSelectedThreat(null)}
            >
              <div className="bg-black/95 p-3 rounded-lg border border-cyan-500/50 min-w-[250px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(selectedThreat.type), boxShadow: `0 0 10px ${getColor(selectedThreat.type)}` }}></div>
                  <h4 className="text-sm font-bold text-white font-orbitron">{selectedThreat.threat}</h4>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-gray-300"><span className="text-gray-500">IP:</span> <span className="neon-text-blue font-mono">{selectedThreat.ip}</span></p>
                  <p className="text-gray-300"><span className="text-gray-500">Localisation:</span> {selectedThreat.city}, {selectedThreat.country}</p>
                  <p className="text-gray-300"><span className="text-gray-500">Coordonnées:</span> <span className="font-mono text-[10px]">{selectedThreat.lat.toFixed(4)}, {selectedThreat.lng.toFixed(4)}</span></p>
                  <p className="text-gray-300"><span className="text-gray-500">Type:</span> <span className="neon-text-orange">{selectedThreat.type.toUpperCase()}</span></p>
                  <p className="text-gray-300"><span className="text-gray-500">Heure:</span> {selectedThreat.timestamp.toLocaleTimeString('fr-FR')}</p>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Info overlay */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md rounded-lg px-4 py-3 border border-cyan-500/30 z-10">
          <p className="text-[10px] font-mono neon-text-green">MODE: RÉEL</p>
          <p className="text-[10px] font-mono neon-text-blue">API: GOOGLE MAPS</p>
          <p className="text-[10px] font-mono neon-text-orange">MENACES: {threats.length}</p>
        </div>

        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md rounded-lg px-4 py-3 border border-pink-500/30 z-10">
          <p className="text-[10px] font-mono neon-text-pink">ALERTE: ÉLEVÉE</p>
          <p className="text-[10px] font-mono neon-text-orange">ZONES: 25 ACTIVES</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mt-4">
        <div className="text-center p-3 bg-black/40 rounded-lg border border-pink-500/20">
          <p className="text-xl font-bold neon-text-pink font-orbitron">{threats.filter(t => t.type === 'critical').length}</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-wider">Critiques</p>
        </div>
        <div className="text-center p-3 bg-black/40 rounded-lg border border-orange-500/20">
          <p className="text-xl font-bold neon-text-blue font-orbitron">{threats.filter(t => t.type === 'high').length}</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-wider">Élevées</p>
        </div>
        <div className="text-center p-3 bg-black/40 rounded-lg border border-yellow-500/20">
          <p className="text-xl font-bold neon-text-purple font-orbitron">{threats.filter(t => t.type === 'medium').length}</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-wider">Moyennes</p>
        </div>
        <div className="text-center p-3 bg-black/40 rounded-lg border border-green-500/20">
          <p className="text-xl font-bold neon-text-green font-orbitron">{threats.filter(t => t.type === 'low').length}</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-wider">Faibles</p>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="mt-4 p-3 bg-black/40 rounded-lg border border-cyan-500/30">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs neon-text-blue font-mono">Récupération de vraies menaces en temps réel...</span>
          </div>
        </div>
      )}
    </div>
  );
}
