import { useState, useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  getLiveFlights, 
  getFlightsByStatus, 
  getDeparturesFromAirport,
  getArrivalsToAirport,
  isAviationstackAvailable,
  type Flight 
} from '../services/aviationstackApi';

// Style sombre pour la carte
const mapStyle: maplibregl.StyleSpecification = {
  version: 8,
  name: 'Aviation Dark',
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

export default function AviationPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'landed' | 'cancelled'>('all');
  const [airportFilter, setAirportFilter] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Charger les données
  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let data: Flight[] = [];

      if (airportFilter) {
        // Charger les vols par aéroport
        const [departures, arrivals] = await Promise.all([
          getDeparturesFromAirport(airportFilter.toUpperCase(), 50),
          getArrivalsToAirport(airportFilter.toUpperCase(), 50)
        ]);
        data = [...departures, ...arrivals];
      } else if (filter === 'all') {
        // Charger tous les vols live
        data = await getLiveFlights(100);
      } else {
        // Charger par statut
        data = await getFlightsByStatus(filter, 100);
      }

      setFlights(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [10, 45],
      zoom: 3,
      minZoom: 2,
      maxZoom: 15,
      attributionControl: false
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      loadData();
    });

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
    flights.forEach(flight => {
      if (!flight.live) return;

      const { latitude, longitude, direction } = flight.live;
      if (!latitude || !longitude) return;

      // Créer un élément personnalisé pour le marqueur
      const el = document.createElement('div');
      el.className = 'flight-marker';
      
      const rotation = direction || 0;
      el.style.cssText = `
        width: 20px;
        height: 20px;
        cursor: pointer;
        transform: rotate(${rotation}deg);
        transition: transform 0.3s ease;
      `;
      
      // SVG d'avion
      el.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#00f0ff" style="filter: drop-shadow(0 0 5px #00f0ff);">
          <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z"/>
        </svg>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([longitude, latitude])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelectedFlight(flight);
      });

      markersRef.current.push(marker);
    });
  }, [flights]);

  // Rafraîchir automatiquement toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [filter, airportFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'landed': return 'text-blue-400';
      case 'cancelled': return 'text-red-400';
      case 'incident': return 'text-orange-400';
      case 'diverted': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'fa-plane';
      case 'landed': return 'fa-plane-arrival';
      case 'cancelled': return 'fa-plane-slash';
      case 'incident': return 'fa-exclamation-triangle';
      case 'diverted': return 'fa-route';
      default: return 'fa-plane';
    }
  };

  if (!isAviationstackAvailable()) {
    return (
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <i className="fas fa-plane-slash text-6xl text-red-400 mb-4"></i>
          <h2 className="text-2xl font-bold text-red-400 font-orbitron mb-2">
            API Aviationstack Non Configurée
          </h2>
          <p className="text-gray-400">
            Ajoutez VITE_AVIASTACK_API_KEY dans le fichier .env
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
              <i className="fas fa-plane"></i>
              Surveillance Aérienne en Temps Réel
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Suivi des vols en direct via Aviationstack API
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold neon-text-cyan font-orbitron">{flights.length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Vols Suivis</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
            <p className="text-2xl font-bold text-green-400 font-orbitron">
              {flights.filter(f => f.flight_status === 'active').length}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">En Vol</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30 text-center">
            <p className="text-2xl font-bold text-blue-400 font-orbitron">
              {flights.filter(f => f.flight_status === 'landed').length}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Atterris</p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30 text-center">
            <p className="text-2xl font-bold text-red-400 font-orbitron">
              {flights.filter(f => f.flight_status === 'cancelled').length}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Annulés</p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30 text-center">
            <p className="text-2xl font-bold text-purple-400 font-orbitron">
              {flights.filter(f => f.live !== null).length}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Live GPS</p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold neon-text-cyan font-orbitron mb-3 uppercase tracking-wider">
          Filtres
        </h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Statut</label>
            <div className="flex gap-2">
              {(['all', 'active', 'landed', 'cancelled'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`cyber-tab text-xs ${filter === status ? 'active' : ''}`}
                >
                  {status === 'all' ? 'TOUS' : status.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Code Aéroport (IATA)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={airportFilter}
                onChange={(e) => setAirportFilter(e.target.value)}
                placeholder="Ex: CDG, JFK, LHR"
                className="bg-black/60 border border-cyan-500/30 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none font-mono w-32"
              />
              <button
                onClick={loadData}
                className="cyber-button text-xs"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="cyber-button"
            >
              <i className={`fas ${isLoading ? 'fa-spinner animate-spin' : 'fa-sync-alt'} mr-2`}></i>
              Rafraîchir
            </button>
          </div>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="glass-card p-4 bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-2">
            <i className="fas fa-exclamation-triangle text-red-400"></i>
            <span className="text-sm text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* Carte */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold neon-text-cyan font-orbitron flex items-center gap-3">
            <i className="fas fa-map-marked-alt"></i>
            Carte des Vols en Direct
          </h3>
          <div className="text-xs text-gray-400 font-mono">
            Dernière MAJ: {lastUpdate.toLocaleTimeString('fr-FR')}
          </div>
        </div>

        <div className="relative w-full rounded-xl overflow-hidden border border-cyan-500/20" style={{ height: '600px' }}>
          <div ref={mapContainer} className="w-full h-full" />
          
          {/* Overlay */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md rounded-lg px-4 py-3 border border-cyan-500/30 z-10">
            <p className="text-[10px] font-mono neon-text-green">API: AVIATIONSTACK</p>
            <p className="text-[10px] font-mono neon-text-cyan">VOLS: {flights.filter(f => f.live).length}</p>
            <p className="text-[10px] font-mono neon-text-orange">MODE: LIVE GPS</p>
          </div>

          {/* Popup vol sélectionné */}
          {selectedFlight && (
            <div className="absolute bottom-3 left-3 right-3 bg-black/95 backdrop-blur-md rounded-xl p-4 border border-cyan-500/30 z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <i className={`fas ${getStatusIcon(selectedFlight.flight_status)} text-2xl ${getStatusColor(selectedFlight.flight_status)}`}></i>
                    <div>
                      <h4 className="text-lg font-bold text-white font-orbitron">
                        {selectedFlight.airline.iata}{selectedFlight.flight.number}
                      </h4>
                      <p className="text-xs text-gray-400">{selectedFlight.airline.name}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-mono font-bold ${
                      selectedFlight.flight_status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                      selectedFlight.flight_status === 'landed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                      'bg-red-500/20 text-red-400 border border-red-500/50'
                    }`}>
                      {selectedFlight.flight_status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-gray-500 mb-1">DÉPART</p>
                      <p className="text-white font-bold">{selectedFlight.departure.iata}</p>
                      <p className="text-gray-400">{selectedFlight.departure.airport}</p>
                      <p className="text-gray-500 text-[10px]">{selectedFlight.departure.scheduled}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">ARRIVÉE</p>
                      <p className="text-white font-bold">{selectedFlight.arrival.iata}</p>
                      <p className="text-gray-400">{selectedFlight.arrival.airport}</p>
                      <p className="text-gray-500 text-[10px]">{selectedFlight.arrival.scheduled}</p>
                    </div>
                  </div>

                  {selectedFlight.live && (
                    <div className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-gray-500">ALTITUDE</p>
                        <p className="text-cyan-400 font-mono">{selectedFlight.live.altitude} ft</p>
                      </div>
                      <div>
                        <p className="text-gray-500">VITESSE</p>
                        <p className="text-cyan-400 font-mono">{selectedFlight.live.speed_horizontal} km/h</p>
                      </div>
                      <div>
                        <p className="text-gray-500">DIRECTION</p>
                        <p className="text-cyan-400 font-mono">{selectedFlight.live.direction}°</p>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={() => setSelectedFlight(null)} className="text-gray-400 hover:text-white transition-colors ml-4">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Liste des vols */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold neon-text-cyan font-orbitron flex items-center gap-3 mb-4">
          <i className="fas fa-list"></i>
          Vols en Direct ({flights.filter(f => f.live).length})
        </h3>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des données...</p>
          </div>
        ) : flights.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-plane-slash text-4xl mb-4"></i>
            <p>Aucun vol trouvé</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {flights.filter(f => f.live).map((flight) => (
              <div
                key={`${flight.flight.iata}-${flight.flight_date}`}
                onClick={() => {
                  setSelectedFlight(flight);
                  if (flight.live) {
                    map.current?.flyTo({
                      center: [flight.live.longitude, flight.live.latitude],
                      zoom: 8
                    });
                  }
                }}
                className="p-3 bg-black/40 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <i className={`fas ${getStatusIcon(flight.flight_status)} text-xl ${getStatusColor(flight.flight_status)}`}></i>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {flight.airline.iata}{flight.flight.number}
                      </p>
                      <p className="text-[10px] text-gray-400">{flight.airline.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white">
                      {flight.departure.iata} → {flight.arrival.iata}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {flight.live?.altitude} ft | {flight.live?.speed_horizontal} km/h
                    </p>
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
