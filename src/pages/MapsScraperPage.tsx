import { useState, useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { analyzePlaceRisk, type SuspiciousPlace } from '../services/googleMapsScraper';

// Style sombre pour la carte
const mapStyle: maplibregl.StyleSpecification = {
  version: 8,
  name: 'MapsScraper Dark',
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

// Données de démonstration pour le scan
const DEMO_PLACES: SuspiciousPlace[] = [
  {
    place_id: '1',
    name: 'Casino Royal',
    formatted_address: '123 Rue de la Paix, Paris, France',
    geometry: { location: { lat: 48.8698, lng: 2.3308 } },
    types: ['casino', 'establishment'],
    rating: 2.5,
    user_ratings_total: 15,
    website: undefined,
    phone: undefined,
    riskScore: 85,
    riskFactors: ['Note faible', 'Peu d\'avis', 'Type d\'établissement à risque', 'Pas de site web'],
    nearbyThreats: 2,
    category: 'high_risk'
  },
  {
    place_id: '2',
    name: 'Quick Cash Pawn',
    formatted_address: '456 Boulevard Saint-Germain, Paris, France',
    geometry: { location: { lat: 48.8530, lng: 2.3499 } },
    types: ['pawn_shop', 'establishment'],
    rating: 1.8,
    user_ratings_total: 8,
    website: undefined,
    phone: '+33 1 23 45 67 89',
    riskScore: 75,
    riskFactors: ['Note faible', 'Peu d\'avis', 'Type d\'établissement à risque', 'Pas de site web'],
    nearbyThreats: 1,
    category: 'high_risk'
  },
  {
    place_id: '3',
    name: 'Night Club Paradise',
    formatted_address: '789 Rue du Faubourg, Paris, France',
    geometry: { location: { lat: 48.8738, lng: 2.3538 } },
    types: ['night_club', 'establishment'],
    rating: 3.2,
    user_ratings_total: 45,
    website: 'https://paradise-club.example.com',
    phone: '+33 1 98 76 54 32',
    riskScore: 45,
    riskFactors: ['Type d\'établissement à risque'],
    nearbyThreats: 0,
    category: 'medium_risk'
  },
  {
    place_id: '4',
    name: 'Money Transfer Express',
    formatted_address: '321 Avenue des Champs-Élysées, Paris, France',
    geometry: { location: { lat: 48.8698, lng: 2.3076 } },
    types: ['finance', 'establishment'],
    rating: 2.1,
    user_ratings_total: 12,
    website: undefined,
    phone: undefined,
    riskScore: 65,
    riskFactors: ['Note faible', 'Peu d\'avis', 'Pas de site web', 'Pas de téléphone'],
    nearbyThreats: 1,
    category: 'medium_risk'
  },
  {
    place_id: '5',
    name: 'Café Internet Global',
    formatted_address: '654 Rue de Rivoli, Paris, France',
    geometry: { location: { lat: 48.8606, lng: 2.3376 } },
    types: ['cafe', 'establishment'],
    rating: 3.8,
    user_ratings_total: 120,
    website: 'https://cafe-global.example.com',
    phone: '+33 1 45 67 89 01',
    riskScore: 30,
    riskFactors: ['Peu d\'avis'],
    nearbyThreats: 0,
    category: 'low_risk'
  }
];

export default function MapsScraperPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<SuspiciousPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<SuspiciousPlace | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanLocation, setScanLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [scanRadius, setScanRadius] = useState(5000);
  const [scanType, setScanType] = useState<'general' | 'suspicious' | 'threats'>('general');
  const [scanError, setScanError] = useState<string | null>(null);

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'high_risk': return '#ff006e';
      case 'medium_risk': return '#ff6b00';
      case 'low_risk': return '#ffcc00';
      default: return '#00ff9d';
    }
  };

  const getRiskLabel = (category: string) => {
    switch (category) {
      case 'high_risk': return 'HAUT RISQUE';
      case 'medium_risk': return 'RISQUE MOYEN';
      case 'low_risk': return 'RISQUE FAIBLE';
      default: return 'SÛR';
    }
  };

  // Simuler un scan de zone
  const handleScan = async () => {
    if (!query.trim()) return;

    setIsScanning(true);
    setPlaces([]);
    setScanError(null);

    try {
      // Simuler un délai de scan
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Générer une position aléatoire basée sur la requête
      const hash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const baseLat = 48.8566 + (hash % 10 - 5) * 0.1;
      const baseLng = 2.3522 + (hash % 10 - 5) * 0.1;

      setScanLocation({ lat: baseLat, lng: baseLng });

      // Utiliser les données de démonstration avec des positions ajustées
      const scannedPlaces = DEMO_PLACES.map((place, index) => ({
        ...place,
        geometry: {
          location: {
            lat: baseLat + (Math.random() - 0.5) * 0.05,
            lng: baseLng + (Math.random() - 0.5) * 0.05
          }
        },
        formatted_address: `${place.formatted_address.split(',')[0]}, ${query}`
      }));

      setPlaces(scannedPlaces);
    } catch (error) {
      setScanError(error instanceof Error ? error.message : 'Erreur de scan');
    } finally {
      setIsScanning(false);
    }
  };

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [2.3522, 48.8566], // Paris
      zoom: 12,
      minZoom: 2,
      maxZoom: 18,
      attributionControl: false
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Mettre à jour les marqueurs
  useEffect(() => {
    if (!map.current) return;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Ajouter les nouveaux marqueurs
    places.forEach(place => {
      const color = getRiskColor(place.category);
      
      const el = document.createElement('div');
      el.className = 'place-marker';
      el.style.cssText = `
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid white;
        box-shadow: 0 0 15px ${color}, 0 0 30px ${color};
        cursor: pointer;
        animation: pulse-marker 2s infinite;
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([place.geometry.location.lng, place.geometry.location.lat])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelectedPlace(place);
      });

      markersRef.current.push(marker);
    });

    // Centrer la carte sur la zone scannée
    if (scanLocation && places.length > 0) {
      map.current.flyTo({
        center: [scanLocation.lng, scanLocation.lat],
        zoom: 13
      });
    }
  }, [places, scanLocation]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h2 className="text-3xl font-bold neon-text-purple font-orbitron flex items-center gap-3 mb-2">
          <i className="fas fa-map-marked-alt"></i>
          Scanner de Lieux Suspects
        </h2>
        <p className="text-sm text-gray-400">
          Analysez des zones géographiques pour identifier des entreprises et lieux à risque
        </p>
      </div>

      {/* Contrôles de scan */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold neon-text-cyan font-orbitron mb-3 uppercase tracking-wider">
          Paramètres de Scan
        </h3>

        <div className="space-y-4">
          {/* Zone à scanner */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Zone à Scanner</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                placeholder="Entrez une ville ou adresse (ex: Paris, London, New York)"
                className="flex-1 bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none font-mono"
                disabled={isScanning}
              />
              <button
                onClick={handleScan}
                disabled={isScanning || !query.trim()}
                className="cyber-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScanning ? (
                  <>
                    <i className="fas fa-spinner animate-spin mr-2"></i>
                    Scan...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search mr-2"></i>
                    Scanner
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Type de scan */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Type de Scan</label>
            <div className="flex gap-2">
              <button
                onClick={() => setScanType('general')}
                className={`cyber-tab text-xs ${scanType === 'general' ? 'active' : ''}`}
              >
                <i className="fas fa-building mr-1"></i>
                Général
              </button>
              <button
                onClick={() => setScanType('suspicious')}
                className={`cyber-tab text-xs ${scanType === 'suspicious' ? 'active' : ''}`}
              >
                <i className="fas fa-exclamation-triangle mr-1"></i>
                Suspect
              </button>
              <button
                onClick={() => setScanType('threats')}
                className={`cyber-tab text-xs ${scanType === 'threats' ? 'active' : ''}`}
              >
                <i className="fas fa-skull-crossbones mr-1"></i>
                Menaces
              </button>
            </div>
          </div>

          {/* Rayon de scan */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Rayon de Scan: {scanRadius}m
            </label>
            <input
              type="range"
              min="1000"
              max="20000"
              step="1000"
              value={scanRadius}
              onChange={(e) => setScanRadius(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1km</span>
              <span>20km</span>
            </div>
          </div>
        </div>

        {scanError && (
          <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
            <div className="flex items-center gap-2">
              <i className="fas fa-exclamation-triangle text-red-400"></i>
              <span className="text-sm text-red-400">{scanError}</span>
            </div>
          </div>
        )}
      </div>

      {/* Carte */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold neon-text-cyan font-orbitron flex items-center gap-3">
            <i className="fas fa-map"></i>
            Carte des Lieux Analysés
          </h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-white font-orbitron">{places.length}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Lieux Trouvés</p>
          </div>
        </div>

        {/* Légende */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff006e] shadow-[0_0_10px_#ff006e]"></div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Haut Risque</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff6b00] shadow-[0_0_10px_#ff6b00]"></div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Risque Moyen</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ffcc00] shadow-[0_0_10px_#ffcc00]"></div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Risque Faible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00ff9d] shadow-[0_0_10px_#00ff9d]"></div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Sûr</span>
          </div>
        </div>

        {/* Conteneur de la carte */}
        <div className="relative w-full rounded-xl overflow-hidden border border-cyan-500/20" style={{ height: '500px' }}>
          <div ref={mapContainer} className="w-full h-full" />
          
          {/* Overlay */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md rounded-lg px-4 py-3 border border-cyan-500/30 z-10">
            <p className="text-[10px] font-mono neon-text-green">CARTE: ACTIVE</p>
            <p className="text-[10px] font-mono neon-text-cyan">SOURCE: OPENSTREETMAP</p>
            <p className="text-[10px] font-mono neon-text-orange">LIEUX: {places.length}</p>
          </div>

          {/* Popup lieu sélectionné */}
          {selectedPlace && (
            <div className="absolute bottom-3 left-3 right-3 bg-black/95 backdrop-blur-md rounded-xl p-4 border border-cyan-500/30 z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: getRiskColor(selectedPlace.category), boxShadow: `0 0 15px ${getRiskColor(selectedPlace.category)}` }}></div>
                    <h4 className="text-sm font-bold text-white font-orbitron">{selectedPlace.name}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      selectedPlace.category === 'high_risk' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50' :
                      selectedPlace.category === 'medium_risk' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' :
                      'bg-green-500/20 text-green-400 border border-green-500/50'
                    }`}>
                      {getRiskLabel(selectedPlace.category)}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <p className="text-gray-300"><span className="text-gray-500">Adresse:</span> {selectedPlace.formatted_address}</p>
                    {selectedPlace.rating && (
                      <p className="text-gray-300"><span className="text-gray-500">Note:</span> {selectedPlace.rating}/5 ({selectedPlace.user_ratings_total} avis)</p>
                    )}
                    {selectedPlace.phone && (
                      <p className="text-gray-300"><span className="text-gray-500">Téléphone:</span> {selectedPlace.phone}</p>
                    )}
                    {selectedPlace.website && (
                      <p className="text-gray-300"><span className="text-gray-500">Site:</span> <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer" className="neon-text-blue hover:underline">{selectedPlace.website}</a></p>
                    )}
                    
                    <div className="pt-2 border-t border-gray-700">
                      <p className="text-gray-300 mb-1">
                        <span className="text-gray-500">Score de Risque:</span> <span className="font-bold" style={{ color: getRiskColor(selectedPlace.category) }}>{selectedPlace.riskScore}%</span>
                      </p>
                      {selectedPlace.riskFactors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-gray-500 mb-1">Facteurs de risque:</p>
                          <ul className="list-disc list-inside text-gray-400">
                            {selectedPlace.riskFactors.map((factor, i) => (
                              <li key={i} className="text-[10px]">{factor}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedPlace(null)} className="text-gray-400 hover:text-white transition-colors ml-4">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="text-center p-3 bg-black/40 rounded-lg border border-pink-500/20">
            <p className="text-xl font-bold neon-text-pink font-orbitron">{places.filter(p => p.category === 'high_risk').length}</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider">Haut Risque</p>
          </div>
          <div className="text-center p-3 bg-black/40 rounded-lg border border-orange-500/20">
            <p className="text-xl font-bold neon-text-orange font-orbitron">{places.filter(p => p.category === 'medium_risk').length}</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider">Risque Moyen</p>
          </div>
          <div className="text-center p-3 bg-black/40 rounded-lg border border-yellow-500/20">
            <p className="text-xl font-bold neon-text-blue font-orbitron">{places.filter(p => p.category === 'low_risk').length}</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider">Risque Faible</p>
          </div>
          <div className="text-center p-3 bg-black/40 rounded-lg border border-green-500/20">
            <p className="text-xl font-bold neon-text-green font-orbitron">{places.filter(p => p.category === 'safe').length}</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider">Sûrs</p>
          </div>
        </div>
      </div>

      {/* Liste des lieux */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold neon-text-orange font-orbitron flex items-center gap-3 mb-4">
          <i className="fas fa-list"></i>
          Lieux Analysés ({places.length})
        </h3>

        {places.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-search text-4xl mb-4"></i>
            <p>Lancez un scan pour voir les résultats</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {places.map((place) => (
              <div
                key={place.place_id}
                onClick={() => {
                  setSelectedPlace(place);
                  map.current?.flyTo({
                    center: [place.geometry.location.lng, place.geometry.location.lat],
                    zoom: 15
                  });
                }}
                className="p-3 bg-black/40 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getRiskColor(place.category), boxShadow: `0 0 8px ${getRiskColor(place.category)}` }}></div>
                      <span className="text-sm font-bold text-white">{place.name}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${
                        place.category === 'high_risk' ? 'bg-pink-500/20 text-pink-400' :
                        place.category === 'medium_risk' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {place.riskScore}%
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">{place.formatted_address}</p>
                    {place.rating && (
                      <p className="text-[10px] text-gray-500 mt-1">
                        ⭐ {place.rating}/5 ({place.user_ratings_total} avis)
                      </p>
                    )}
                    {place.riskFactors.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {place.riskFactors.slice(0, 2).map((factor, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 bg-pink-500/20 text-pink-400 rounded">
                            {factor}
                          </span>
                        ))}
                      </div>
                    )}
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
