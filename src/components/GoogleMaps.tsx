import { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { fetchRealThreats, type RealThreat } from '../services/realTimeData';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Style sombre pour Google Maps
const mapStyle = [
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

const containerStyle = {
  width: '100%',
  height: '500px'
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

  const [threats, setThreats] = useState<RealThreat[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<RealThreat | null>(null);
  const [totalAttacks, setTotalAttacks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [mapError, setMapError] = useState<string | null>(null);

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
      setIsLoading(true);
      try {
        console.log('Chargement des menaces réelles...');
        const realThreats = await fetchRealThreats();
        console.log('Menaces chargées:', realThreats.length);
        setThreats(realThreats);
        setTotalAttacks(prev => prev + realThreats.length);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Erreur chargement données:', error);
        setMapError('Erreur de chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Erreur de chargement Google Maps
  if (loadError) {
    console.error('Erreur Google Maps:', loadError);
    return (
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <i className="fas fa-exclamation-triangle text-4xl neon-text-pink mb-4"></i>
          <p className="text-lg neon-text-pink font-orbitron">Erreur de chargement Google Maps</p>
          <p className="text-sm text-gray-400 mt-2">Vérifiez votre clé API dans .env</p>
          <p className="text-xs text-gray-500 mt-4 font-mono">{String(loadError)}</p>
        </div>
      </div>
    );
  }

  // API pas encore chargée
  if (!isLoaded) {
    return (
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg neon-text-blue font-orbitron">Chargement de Google Maps...</p>
          <p className="text-xs text-gray-400 mt-2">Vérification de la clé API</p>
        </div>
      </div>
    );
  }

  // Vérifier si la clé API est présente
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <i className="fas fa-key text-4xl neon-text-orange mb-4"></i>
          <p className="text-lg neon-text-orange font-orbitron">Clé API Google Maps manquante</p>
          <p className="text-sm text-gray-400 mt-2">Ajoutez VITE_GOOGLE_MAPS_API_KEY dans .env</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold neon-text-blue font-orbitron flex items-center gap-3">
          <i className="fas fa-globe"></i>
          Carte Mondiale des Menaces - DONNÉES RÉELLES
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="status-indicator status-danger"></span>
            <span className="text-xs font-mono neon-text-pink">LIVE</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white font-orbitron">{totalAttacks}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Menaces Réelles</p>
          </div>
        </div>
      </div>

      {/* Info temps réel */}
      <div className="mb-4 p-3 bg-black/40 rounded-lg border border-green-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="status-indicator status-active"></span>
            <span className="text-xs neon-text-green font-mono">MODE RÉEL ACTIF</span>
          </div>
          <div className="text-xs text-gray-400 font-mono">
            Dernière MAJ: {lastUpdate.toLocaleTimeString('fr-FR')} | {threats.length} menaces détectées
          </div>
        </div>
        <p className="text-[10px] text-gray-500 mt-1">
          Données récupérées en temps réel via Brave Search API + Géolocalisation IP réelle
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
            styles: mapStyle,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            backgroundColor: '#0a0e1a',
          }}
        >
          {threats.map((threat) => {
            // Vérifier que les coordonnées sont valides
            if (!threat.lat || !threat.lng || isNaN(threat.lat) || isNaN(threat.lng)) {
              console.warn('Coordonnées invalides pour:', threat.id);
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
                {selectedThreat.source && (
                  <a href={selectedThreat.source} target="_blank" rel="noopener noreferrer" className="block mt-2 text-[10px] neon-text-purple hover:underline truncate">
                    Source: {selectedThreat.source}
                  </a>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Info overlay */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md rounded-lg px-4 py-3 border border-cyan-500/30 z-10">
          <p className="text-[10px] font-mono neon-text-green">MODE: RÉEL</p>
          <p className="text-[10px] font-mono neon-text-blue">API: BRAVE SEARCH</p>
          <p className="text-[10px] font-mono neon-text-orange">GEO: IP-API.COM</p>
        </div>

        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md rounded-lg px-4 py-3 border border-pink-500/30 z-10">
          <p className="text-[10px] font-mono neon-text-pink">ALERTE: ÉLEVÉE</p>
          <p className="text-[10px] font-mono neon-text-orange">MENACES: {threats.length}</p>
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

      {/* Error message */}
      {mapError && (
        <div className="mt-4 p-3 bg-pink-500/10 rounded-lg border border-pink-500/30">
          <div className="flex items-center gap-2">
            <i className="fas fa-exclamation-triangle neon-text-pink"></i>
            <span className="text-xs neon-text-pink font-mono">{mapError}</span>
          </div>
        </div>
      )}
    </div>
  );
}
