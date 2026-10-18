import { useState, useEffect } from 'react';

interface AttackPoint {
  id: string;
  lat: number;
  lng: number;
  type: 'critical' | 'high' | 'medium' | 'low';
  threat: string;
  country: string;
  ip: string;
  timestamp: Date;
}

// Convert lat/lng to SVG coordinates (Mercator-like projection for 1000x500 viewBox)
function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  const x = (lng + 180) * (1000 / 360);
  const y = (90 - lat) * (500 / 180);
  return { x, y };
}

const attackLocations = [
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
];

const threatTypes = ['DDoS', 'Ransomware', 'Phishing', 'Botnet C2', 'Zero-Day', 'Crypto Miner', 'Data Exfil', 'Brute Force'];

function generateAttackPoint(): AttackPoint {
  const loc = attackLocations[Math.floor(Math.random() * attackLocations.length)];
  const types: ('critical' | 'high' | 'medium' | 'low')[] = ['critical', 'high', 'medium', 'low'];
  return {
    id: `ATK-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    lat: loc.lat + (Math.random() - 0.5) * 5,
    lng: loc.lng + (Math.random() - 0.5) * 5,
    type: types[Math.floor(Math.random() * types.length)],
    threat: threatTypes[Math.floor(Math.random() * threatTypes.length)],
    country: loc.country,
    ip: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
    timestamp: new Date(),
  };
}

export default function WorldMap() {
  const [attacks, setAttacks] = useState<AttackPoint[]>([]);
  const [selectedAttack, setSelectedAttack] = useState<AttackPoint | null>(null);
  const [totalAttacks, setTotalAttacks] = useState(2847);

  useEffect(() => {
    // Initial attacks
    setAttacks(Array.from({ length: 15 }, () => generateAttackPoint()));

    // Add new attacks periodically
    const interval = setInterval(() => {
      setAttacks(prev => {
        const newAttacks = [...prev, generateAttackPoint()];
        return newAttacks.slice(-30);
      });
      setTotalAttacks(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getColor = (type: string) => {
    switch (type) {
      case 'critical': return '#ff3366';
      case 'high': return '#ff8800';
      case 'medium': return '#ffcc00';
      default: return '#00ff88';
    }
  };

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

      {/* World Map SVG */}
      <div className="relative w-full bg-[#050810] rounded-lg overflow-hidden border border-gray-800" style={{ aspectRatio: '2/1' }}>
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,255,136,0.05)" strokeWidth="0.5"/>
            </pattern>
            <radialGradient id="attackGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff3366" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#ff3366" stopOpacity="0"/>
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="1000" height="500" fill="url(#grid)"/>
          
          {/* Latitude/Longitude lines */}
          {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(x => (
            <line key={`vl-${x}`} x1={x} y1={0} x2={x} y2={500} stroke="rgba(0,212,255,0.03)" strokeWidth="0.5"/>
          ))}
          {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500].map(y => (
            <line key={`hl-${y}`} x1={0} y1={y} x2={1000} y2={y} stroke="rgba(0,212,255,0.03)" strokeWidth="0.5"/>
          ))}

          {/* Continents - Simplified but recognizable */}
          {/* North America */}
          <path d="M 80,60 L 120,50 L 160,55 L 200,60 L 230,80 L 250,100 L 260,130 L 250,160 L 240,180 L 220,200 L 200,210 L 180,220 L 160,230 L 140,220 L 120,200 L 100,180 L 90,160 L 80,140 L 75,120 L 70,100 L 75,80 Z" 
                fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.3)" strokeWidth="0.8"/>
          {/* Central America */}
          <path d="M 160,230 L 170,240 L 180,250 L 190,260 L 185,270 L 175,265 L 165,255 L 155,245 L 150,235 Z"
                fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.3)" strokeWidth="0.8"/>
          {/* South America */}
          <path d="M 190,270 L 210,275 L 230,290 L 240,310 L 245,340 L 240,370 L 230,400 L 215,420 L 200,430 L 190,420 L 185,390 L 180,360 L 175,330 L 178,300 L 185,280 Z"
                fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.3)" strokeWidth="0.8"/>
          {/* Europe */}
          <path d="M 430,60 L 460,55 L 490,60 L 520,70 L 530,85 L 520,100 L 510,110 L 500,120 L 490,130 L 470,135 L 450,130 L 440,120 L 430,110 L 425,95 L 420,80 Z"
                fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.3)" strokeWidth="0.8"/>
          {/* UK/Ireland */}
          <path d="M 415,75 L 425,70 L 430,80 L 425,90 L 418,85 Z"
                fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.3)" strokeWidth="0.8"/>
          {/* Africa */}
          <path d="M 440,170 L 470,160 L 500,165 L 530,180 L 545,200 L 550,230 L 545,260 L 535,290 L 520,320 L 500,340 L 480,350 L 460,340 L 445,320 L 435,290 L 430,260 L 425,230 L 430,200 Z"
                fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.3)" strokeWidth="0.8"/>
          {/* Russia/Northern Asia */}
          <path d="M 530,40 L 580,35 L 640,38 L 700,42 L 760,45 L 800,50 L 830,55 L 850,65 L 840,80 L 820,90 L 780,85 L 740,80 L 700,75 L 660,70 L 620,68 L 580,65 L 550,60 L 530,55 Z"
                fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.3)" strokeWidth="0.8"/>
          {/* Middle East */}
          <path d="M 540,130 L 570,125 L 600,130 L 620,140 L 615,155 L 600,165 L 580,170 L 560,165 L 545,155 L 535,145 Z"
                fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.3)" strokeWidth="0.8"/>
          {/* India */}
          <path d="M 620,140 L 650,135 L 670,145 L 680,165 L 675,190 L 665,210 L 650,220 L 635,215 L 625,200 L 620,180 L 615,160 Z"
                fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.3)" strokeWidth="0.8"/>
          {/* China/East Asia */}
          <path d="M 700,80 L 740,75 L 780,80 L 810,90 L 820,110 L 810,130 L 790,140 L 760,145 L 730,140 L 710,130 L 700,115 L 695,100 Z"
                fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.3)" strokeWidth="0.8"/>
          {/* Southeast Asia */}
          <path d="M 730,160 L 760,155 L 790,160 L 810,175 L 800,190 L 780,200 L 760,195 L 740,185 L 730,175 Z"
                fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.3)" strokeWidth="0.8"/>
          {/* Japan */}
          <path d="M 840,100 L 850,95 L 855,105 L 850,120 L 842,115 Z"
                fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.3)" strokeWidth="0.8"/>
          {/* Australia */}
          <path d="M 780,310 L 820,300 L 860,305 L 890,320 L 895,345 L 880,370 L 850,380 L 820,375 L 795,360 L 780,340 L 775,325 Z"
                fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.3)" strokeWidth="0.8"/>
          {/* Indonesia */}
          <path d="M 750,230 L 780,225 L 810,228 L 840,232 L 860,238 L 850,245 L 820,242 L 790,240 L 760,238 Z"
                fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.3)" strokeWidth="0.8"/>

          {/* Connection lines between some attack points */}
          {attacks.slice(0, 8).map((attack, i) => {
            if (i === 0) return null;
            const from = latLngToXY(attacks[0].lat, attacks[0].lng);
            const to = latLngToXY(attack.lat, attack.lng);
            return (
              <line
                key={`line-${attack.id}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={getColor(attack.type)}
                strokeWidth="0.5"
                strokeOpacity="0.3"
                strokeDasharray="4,4"
              />
            );
          })}

          {/* Attack points */}
          {attacks.map((attack) => {
            const { x, y } = latLngToXY(attack.lat, attack.lng);
            const color = getColor(attack.type);
            return (
              <g key={attack.id} onClick={() => setSelectedAttack(attack)} className="cursor-pointer">
                {/* Pulse ring */}
                <circle cx={x} cy={y} r="8" fill="none" stroke={color} strokeWidth="1" opacity="0.4">
                  <animate attributeName="r" from="3" to="15" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite"/>
                </circle>
                {/* Glow */}
                <circle cx={x} cy={y} r="6" fill={color} opacity="0.2" filter="url(#glow)"/>
                {/* Core dot */}
                <circle cx={x} cy={y} r="3" fill={color} opacity="0.9"/>
                <circle cx={x} cy={y} r="1.5" fill="white" opacity="0.8"/>
              </g>
            );
          })}

          {/* Scan line effect */}
          <line x1="0" y1="0" x2="1000" y2="0" stroke="rgba(0,255,136,0.1)" strokeWidth="2">
            <animate attributeName="y1" from="0" to="500" dur="8s" repeatCount="indefinite"/>
            <animate attributeName="y2" from="0" to="500" dur="8s" repeatCount="indefinite"/>
          </line>
        </svg>

        {/* Info overlay */}
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 border border-gray-700">
          <p className="text-[10px] font-mono text-green-400">SCAN: ACTIF</p>
          <p className="text-[10px] font-mono text-cyan-400">NODES: 1,247</p>
          <p className="text-[10px] font-mono text-yellow-400">LATENCE: {Math.floor(Math.random() * 20 + 5)}ms</p>
        </div>

        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 border border-gray-700">
          <p className="text-[10px] font-mono text-red-400">ALERTE: ÉLEVÉE</p>
          <p className="text-[10px] font-mono text-orange-400">ZONES: 25 ACTIVES</p>
        </div>

        {/* Selected attack info */}
        {selectedAttack && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(selectedAttack.type) }}></div>
                <div>
                  <p className="text-xs font-mono text-white font-bold">{selectedAttack.threat} - {selectedAttack.country}</p>
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
