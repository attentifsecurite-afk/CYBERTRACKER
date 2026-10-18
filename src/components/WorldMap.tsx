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

const cyberStyle: maplibregl.StyleSpecification = {
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
  const [attacks, setAttacks] = useState<AttackPoint[]>([]);
  const [selectedAttack, setSelectedAttack] = useState<AttackPoint | null>(null);
  const [totalAttacks, setTotalAttacks] = useState(2847);
  const [mapLoaded, setMapLoaded] = useState(false);

  const getColor = (type: string) => {
    switch (type) {
      case 'critical': return '#ff006e';
      case 'high': return '#ff6b00';
      case 'medium': return '#ffcc00';
      default: return '#00ff9d';
    }
  };

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

    const initialAttacks = Array.from({ length: 15 }, () => generateAttackPoint());
    setAttacks(initialAttacks);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    attacks.forEach(attack => {
      const color = getColor(attack.type);
      
      const el = document.createElement('div');
      el.className = 'attack-marker';
      el.style.cssText = `
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid rgba(255,255,255,0.8);
        box-shadow: 0 0 15px ${color}, 0 0 30px ${color}, 0 0 45px ${color};
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
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold neon-text-blue font-orbitron flex items-center gap-3">
          <i className="fas fa-globe"></i>
          Carte Mondiale des Menaces - Temps Réel
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="status-indicator status-danger"></span>
            <span className="text-xs font-mono neon-text-pink">LIVE</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white font-orbitron">{totalAttacks.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Attaques/24h</p>
          </div>
        </div>
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

      {/* Map Container */}
      <div className="relative w-full rounded-xl overflow-hidden border border-cyan-500/20" style={{ height: '500px' }}>
        <div ref={mapContainer} className="w-full h-full" />
        
        {/* Info overlay */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md rounded-lg px-4 py-3 border border-cyan-500/30 z-10">
          <p className="text-[10px] font-mono neon-text-green">SCAN: ACTIF</p>
          <p className="text-[10px] font-mono neon-text-blue">NODES: 1,247</p>
          <p className="text-[10px] font-mono neon-text-orange">LATENCE: 12ms</p>
        </div>

        <div className="absolute top-3 right-14 bg-black/80 backdrop-blur-md rounded-lg px-4 py-3 border border-pink-500/30 z-10">
          <p className="text-[10px] font-mono neon-text-pink">ALERTE: ÉLEVÉE</p>
          <p className="text-[10px] font-mono neon-text-orange">ZONES: 25 ACTIVES</p>
        </div>

        {/* Selected attack info */}
        {selectedAttack && (
          <div className="absolute bottom-3 left-3 right-3 bg-black/90 backdrop-blur-md rounded-xl p-4 border border-cyan-500/30 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: getColor(selectedAttack.type), boxShadow: `0 0 15px ${getColor(selectedAttack.type)}` }}></div>
                <div>
                  <p className="text-sm font-bold text-white font-orbitron">{selectedAttack.threat} - {selectedAttack.city}, {selectedAttack.country}</p>
                  <p className="text-[10px] text-gray-400 font-mono">IP: {selectedAttack.ip} | Lat: {selectedAttack.lat.toFixed(2)}° Lng: {selectedAttack.lng.toFixed(2)}°</p>
                </div>
              </div>
              <button onClick={() => setSelectedAttack(null)} className="text-gray-400 hover:text-white transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-4 gap-3 mt-4">
        <div className="text-center p-3 bg-black/40 rounded-lg border border-pink-500/20">
          <p className="text-xl font-bold neon-text-pink font-orbitron">{attacks.filter(a => a.type === 'critical').length}</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-wider">Critiques</p>
        </div>
        <div className="text-center p-3 bg-black/40 rounded-lg border border-orange-500/20">
          <p className="text-xl font-bold neon-text-blue font-orbitron">{attacks.filter(a => a.type === 'high').length}</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-wider">Élevées</p>
        </div>
        <div className="text-center p-3 bg-black/40 rounded-lg border border-yellow-500/20">
          <p className="text-xl font-bold neon-text-purple font-orbitron">{attacks.filter(a => a.type === 'medium').length}</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-wider">Moyennes</p>
        </div>
        <div className="text-center p-3 bg-black/40 rounded-lg border border-green-500/20">
          <p className="text-xl font-bold neon-text-green font-orbitron">{attacks.filter(a => a.type === 'low').length}</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-wider">Faibles</p>
        </div>
      </div>
    </div>
  );
}
