import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface AttackPoint {
  id: string;
  lat: number;
  lng: number;
  type: 'critical' | 'high' | 'medium' | 'low';
  threat: string;
  country: string;
  city: string;
  ip: string;
  timestamp: Date;
}

const attackLocations: { lat: number; lng: number; country: string; city: string }[] = [
  { lat: 55.75, lng: 37.62, country: 'Russie', city: 'Moscou' },
  { lat: 39.90, lng: 116.40, country: 'Chine', city: 'Pékin' },
  { lat: 38.03, lng: 126.98, country: 'Corée du Nord', city: 'Pyongyang' },
  { lat: 35.69, lng: 51.39, country: 'Iran', city: 'Téhéran' },
  { lat: 6.52, lng: 3.38, country: 'Nigeria', city: 'Lagos' },
  { lat: -23.55, lng: -46.63, country: 'Brésil', city: 'São Paulo' },
  { lat: 19.08, lng: 72.88, country: 'Inde', city: 'Mumbai' },
  { lat: 50.45, lng: 30.52, country: 'Ukraine', city: 'Kiev' },
  { lat: 44.43, lng: 26.10, country: 'Roumanie', city: 'Bucarest' },
  { lat: 21.03, lng: 105.85, country: 'Vietnam', city: 'Hanoï' },
  { lat: 1.35, lng: 103.82, country: 'Singapour', city: 'Singapour' },
  { lat: 37.57, lng: 126.98, country: 'Corée du Sud', city: 'Séoul' },
  { lat: 35.68, lng: 139.69, country: 'Japon', city: 'Tokyo' },
  { lat: 51.51, lng: -0.13, country: 'UK', city: 'Londres' },
  { lat: 48.86, lng: 2.35, country: 'France', city: 'Paris' },
  { lat: 52.52, lng: 13.41, country: 'Allemagne', city: 'Berlin' },
  { lat: 40.71, lng: -74.01, country: 'USA', city: 'New York' },
  { lat: 37.77, lng: -122.42, country: 'USA', city: 'San Francisco' },
  { lat: 43.65, lng: -79.38, country: 'Canada', city: 'Toronto' },
  { lat: -33.87, lng: 151.21, country: 'Australie', city: 'Sydney' },
  { lat: 25.20, lng: 55.27, country: 'EAU', city: 'Dubaï' },
  { lat: -1.29, lng: 36.82, country: 'Kenya', city: 'Nairobi' },
  { lat: 30.04, lng: 31.24, country: 'Égypte', city: 'Le Caire' },
  { lat: 14.60, lng: 120.98, country: 'Philippines', city: 'Manille' },
  { lat: -6.21, lng: 106.85, country: 'Indonésie', city: 'Jakarta' },
  { lat: 33.89, lng: 35.50, country: 'Liban', city: 'Beyrouth' },
  { lat: 41.01, lng: 28.98, country: 'Turquie', city: 'Istanbul' },
  { lat: 13.76, lng: 100.50, country: 'Thaïlande', city: 'Bangkok' },
];

const threatTypes = ['DDoS', 'Ransomware', 'Phishing', 'Botnet C2', 'Zero-Day', 'Crypto Miner', 'Data Exfil', 'Brute Force'];

function generateAttackPoint(): AttackPoint {
  const loc = attackLocations[Math.floor(Math.random() * attackLocations.length)];
  const types: ('critical' | 'high' | 'medium' | 'low')[] = ['critical', 'high', 'medium', 'low'];
  return {
    id: `ATK-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    lat: loc.lat + (Math.random() - 0.5) * 3,
    lng: loc.lng + (Math.random() - 0.5) * 3,
    type: types[Math.floor(Math.random() * types.length)],
    threat: threatTypes[Math.floor(Math.random() * threatTypes.length)],
    country: loc.country,
    city: loc.city,
    ip: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
    timestamp: new Date(),
  };
}

// Dark cyberpunk style for MapLibre
const cyberStyle: maplibregl.StyleSpecification = {
  version: 8,
  name: 'CyberTracker Dark',
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
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
        'raster-brightness-max': 0.3,
        'raster-brightness-min': 0.05,
        'raster-contrast': 0.3,
      }
    }
  ],
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
};

export default function WorldMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [attacks, setAttacks] = useState<AttackPoint[]>([]);
  const [selectedAttack, setSelectedAttack] = useState<AttackPoint | null>(null);
  const [totalAttacks, setTotalAttacks] = useState(2847);
  const [mapLoaded, setMapLoaded] = useState(false);

  const getColor = (type: string) => {
    switch (type) {
      case 'critical': return '#ff3366';
      case 'high': return '#ff8800';
      case 'medium': return '#ffcc00';
      default: return '#00ff88';
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: cyberStyle,
      center: [10, 30],
      zoom: 1.5,
      minZoom: 1,
      maxZoom: 12,
      attributionControl: false
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Initial attacks
    const initialAttacks = Array.from({ length: 15 }, () => generateAttackPoint());
    setAttacks(initialAttacks);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add markers when attacks change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    attacks.forEach(attack => {
      const color = getColor(attack.type);
      
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'attack-marker';
      el.style.cssText = `
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid white;
        box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
        cursor: pointer;
        animation: pulse-marker 2s infinite;
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([attack.lng, attack.lat])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelectedAttack(attack);
      });

      markersRef.current.push(marker);
    });
  }, [attacks, mapLoaded]);

  // Add new attacks periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAttacks(prev => {
        const newAttacks = [...prev, generateAttackPoint()];
        return newAttacks.slice(-30);
      });
      setTotalAttacks(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-cyber p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <i className="fas fa-globe text-cyan-400"></i>
          Carte Mondiale des Menaces - Temps Réel
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="status-dot status-danger animate-blink"></span>
            <span className="text-xs font-mono text-red-400">LIVE</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-white font-mono">{totalAttacks.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400">Attaques/24h</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-3">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#ff3366]"></div>
          <span className="text-[10px] text-gray-400">Critique</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#ff8800]"></div>
          <span className="text-[10px] text-gray-400">Élevé</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#ffcc00]"></div>
          <span className="text-[10px] text-gray-400">Moyen</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#00ff88]"></div>
          <span className="text-[10px] text-gray-400">Faible</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full rounded-lg overflow-hidden border border-gray-800" style={{ height: '500px' }}>
        <div ref={mapContainer} className="w-full h-full" />
        
        {/* Info overlay */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded px-3 py-2 border border-gray-700 z-10">
          <p className="text-[10px] font-mono text-green-400">SCAN: ACTIF</p>
          <p className="text-[10px] font-mono text-cyan-400">NODES: 1,247</p>
          <p className="text-[10px] font-mono text-yellow-400">LATENCE: {Math.floor(Math.random() * 20 + 5)}ms</p>
        </div>

        <div className="absolute top-2 right-12 bg-black/70 backdrop-blur-sm rounded px-3 py-2 border border-gray-700 z-10">
          <p className="text-[10px] font-mono text-red-400">ALERTE: ÉLEVÉE</p>
          <p className="text-[10px] font-mono text-orange-400">ZONES: 25 ACTIVES</p>
        </div>

        {/* Selected attack info */}
        {selectedAttack && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(selectedAttack.type) }}></div>
                <div>
                  <p className="text-xs font-mono text-white font-bold">{selectedAttack.threat} - {selectedAttack.city}, {selectedAttack.country}</p>
                  <p className="text-[10px] text-gray-400">IP: {selectedAttack.ip} | Lat: {selectedAttack.lat.toFixed(2)}° Lng: {selectedAttack.lng.toFixed(2)}°</p>
                </div>
              </div>
              <button onClick={() => setSelectedAttack(null)} className="text-gray-400 hover:text-white text-xs">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-4 gap-2 mt-3">
        <div className="text-center p-2 bg-[#0a0e1a] rounded border border-gray-800">
          <p className="text-sm font-bold text-red-400 font-mono">{attacks.filter(a => a.type === 'critical').length}</p>
          <p className="text-[9px] text-gray-500">Critiques</p>
        </div>
        <div className="text-center p-2 bg-[#0a0e1a] rounded border border-gray-800">
          <p className="text-sm font-bold text-orange-400 font-mono">{attacks.filter(a => a.type === 'high').length}</p>
          <p className="text-[9px] text-gray-500">Élevées</p>
        </div>
        <div className="text-center p-2 bg-[#0a0e1a] rounded border border-gray-800">
          <p className="text-sm font-bold text-yellow-400 font-mono">{attacks.filter(a => a.type === 'medium').length}</p>
          <p className="text-[9px] text-gray-500">Moyennes</p>
        </div>
        <div className="text-center p-2 bg-[#0a0e1a] rounded border border-gray-800">
          <p className="text-sm font-bold text-green-400 font-mono">{attacks.filter(a => a.type === 'low').length}</p>
          <p className="text-[9px] text-gray-500">Faibles</p>
        </div>
      </div>
    </div>
  );
}
