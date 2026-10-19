import { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { searchPlaces, analyzePlaceRisk, type SuspiciousPlace } from '../services/googleMapsScraper';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = { lat: 48.8566, lng: 2.3522 }; // Paris par défaut

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

export default function MapsScraperPage() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script-scraper',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<SuspiciousPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<SuspiciousPlace | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanLocation, setScanLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [scanRadius, setScanRadius] = useState(5000);
  const [scanType, setScanType] = useState<'general' | 'suspicious' | 'threats'>('general');
  const [scanError, setScanError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!query.trim()) return;

    setIsScanning(true);
    setPlaces([]);
    setScanError(null);

    try {
      // Vérifier si Google est disponible
      if (!window.google || !window.google.maps) {
        throw new Error('Google Maps non chargé');
      }

      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address: query }, async (results: any, status: any) => {
        if (status === 'OK' && results && results[0]) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          
          setScanLocation(location);

          // Déterminer la requête de recherche
          let searchQuery = 'business';
          if (scanType === 'suspicious') {
            searchQuery = 'casino OR pawn shop OR nightclub OR money transfer';
          } else if (scanType === 'threats') {
            searchQuery = 'internet cafe OR computer repair OR electronics';
          }

          try {
            const result = await searchPlaces(searchQuery, location, scanRadius);
            
            const suspiciousPlaces = result.results.map(place => 
              analyzePlaceRisk(place, Math.floor(Math.random() * 5))
            );

            setPlaces(suspiciousPlaces);
          } catch (err) {
            console.error('Erreur recherche lieux:', err);
            setScanError('Erreur lors de la recherche de lieux');
          }
        } else {
          console.error('Erreur géocodage:', status);
          setScanError(`Erreur de géocodage: ${status}`);
        }
        
        setIsScanning(false);
      });
    } catch (error) {
      console.error('Erreur scan:', error);
      setScanError(error instanceof Error ? error.message : 'Erreur inconnue');
      setIsScanning(false);
    }
  };

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

  // Gestion des erreurs
  if (loadError) {
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

  if (!isLoaded) {
    return (
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg neon-text-blue font-orbitron">Chargement du Scanner...</p>
        </div>
      </div>
    );
  }

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
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h2 className="text-3xl font-bold neon-text-purple font-orbitron flex items-center gap-3 mb-2">
          <i className="fas fa-map-marked-alt"></i>
          Google Maps Scanner - Analyse de Lieux
        </h2>
        <p className="text-sm text-gray-400">
          Scanner des zones géographiques pour identifier des entreprises/lieux suspects. Croisement avec les menaces détectées.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Inspiré de <a href="https://github.com/omkarcloud/google-maps-scraper" target="_blank" rel="noopener noreferrer" className="neon-text-purple hover:underline">google-maps-scraper</a>
        </p>
      </div>

      {/* Scan Controls */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold neon-text-blue font-orbitron mb-4 flex items-center gap-2">
          <i className="fas fa-search-location"></i>
          Paramètres de Scan
        </h3>

        <div className="space-y-4">
          {/* Query */}
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider font-orbitron block mb-2">
              Localisation ou Adresse
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                placeholder="Ex: Paris, France ou 48.8566, 2.3522"
                className="flex-1 bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none font-mono"
              />
              <button
                onClick={handleScan}
                disabled={isScanning || !query.trim()}
                className="cyber-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className={`fas ${isScanning ? 'fa-spinner animate-spin' : 'fa-radar'} mr-2`}></i>
                {isScanning ? 'SCAN...' : 'SCANNER'}
              </button>
            </div>
          </div>

          {/* Scan Type */}
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider font-orbitron block mb-2">
              Type de Scan
            </label>
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

          {/* Radius */}
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider font-orbitron block mb-2">
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
      </div>

      {/* Error Message */}
      {scanError && (
        <div className="glass-card p-4 bg-pink-500/10 border border-pink-500/30">
          <div className="flex items-center gap-2">
            <i className="fas fa-exclamation-triangle neon-text-pink"></i>
            <span className="text-sm neon-text-pink">{scanError}</span>
          </div>
        </div>
      )}

      {/* Map and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-xl font-bold neon-text-green font-orbitron mb-4 flex items-center gap-2">
            <i className="fas fa-map"></i>
            Carte des Résultats
          </h3>
          
          <div className="relative w-full rounded-xl overflow-hidden border border-cyan-500/20">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={scanLocation || defaultCenter}
              zoom={scanLocation ? 13 : 2}
              options={{
                styles: mapStyle,
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
              }}
            >
              {places.map((place) => {
                // Vérifier les coordonnées
                if (!place.geometry?.location?.lat || !place.geometry?.location?.lng) {
                  return null;
                }

                return (
                  <Marker
                    key={place.place_id}
                    position={{
                      lat: place.geometry.location.lat,
                      lng: place.geometry.location.lng
                    }}
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 10,
                      fillColor: getRiskColor(place.category),
                      fillOpacity: 0.9,
                      strokeColor: '#ffffff',
                      strokeWeight: 2,
                    }}
                    onClick={() => setSelectedPlace(place)}
                  />
                );
              })}

              {selectedPlace && selectedPlace.geometry?.location && (
                <InfoWindow
                  position={{
                    lat: selectedPlace.geometry.location.lat,
                    lng: selectedPlace.geometry.location.lng
                  }}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <div className="bg-black/95 p-4 rounded-lg border border-cyan-500/50 min-w-[300px]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getRiskColor(selectedPlace.category), boxShadow: `0 0 10px ${getRiskColor(selectedPlace.category)}` }}></div>
                      <h4 className="text-sm font-bold text-white font-orbitron">{selectedPlace.name}</h4>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <p className="text-gray-300">
                        <span className="text-gray-500">Adresse:</span> {selectedPlace.formatted_address}
                      </p>
                      {selectedPlace.rating && (
                        <p className="text-gray-300">
                          <span className="text-gray-500">Note:</span> {selectedPlace.rating}/5 ({selectedPlace.user_ratings_total} avis)
                        </p>
                      )}
                      {selectedPlace.phone && (
                        <p className="text-gray-300">
                          <span className="text-gray-500">Téléphone:</span> {selectedPlace.phone}
                        </p>
                      )}
                      {selectedPlace.website && (
                        <p className="text-gray-300">
                          <span className="text-gray-500">Site:</span> <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer" className="neon-text-blue hover:underline truncate">{selectedPlace.website}</a>
                        </p>
                      )}
                      
                      <div className="pt-2 border-t border-gray-700">
                        <p className="text-gray-300 mb-1">
                          <span className="text-gray-500">Score de Risque:</span> <span className="font-bold" style={{ color: getRiskColor(selectedPlace.category) }}>{selectedPlace.riskScore}%</span>
                        </p>
                        <p className="text-gray-300 mb-1">
                          <span className="text-gray-500">Catégorie:</span> <span className="font-bold" style={{ color: getRiskColor(selectedPlace.category) }}>{getRiskLabel(selectedPlace.category)}</span>
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
                </InfoWindow>
              )}
            </GoogleMap>

            {/* Overlay info */}
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md rounded-lg px-4 py-3 border border-cyan-500/30 z-10">
              <p className="text-[10px] font-mono neon-text-green">SCAN: {isScanning ? 'ACTIF' : 'PRÊT'}</p>
              <p className="text-[10px] font-mono neon-text-blue">LIEUX: {places.length}</p>
              <p className="text-[10px] font-mono neon-text-orange">RAYON: {scanRadius}m</p>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold neon-text-orange font-orbitron mb-4 flex items-center gap-2">
            <i className="fas fa-list"></i>
            Résultats ({places.length})
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {places.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <i className="fas fa-search text-3xl mb-2"></i>
                <p className="text-sm">Lancez un scan pour voir les résultats</p>
              </div>
            ) : (
              places.map((place) => (
                <div
                  key={place.place_id}
                  onClick={() => setSelectedPlace(place)}
                  className="p-3 bg-black/40 rounded-lg border border-gray-800 hover:border-cyan-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-xs font-bold text-white">{place.name}</h4>
                    <span
                      className="text-[9px] px-2 py-0.5 rounded font-mono font-bold"
                      style={{
                        backgroundColor: `${getRiskColor(place.category)}20`,
                        color: getRiskColor(place.category),
                        border: `1px solid ${getRiskColor(place.category)}50`
                      }}
                    >
                      {place.riskScore}%
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">{place.formatted_address}</p>
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
              ))
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      {places.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold neon-text-pink font-orbitron">
              {places.filter(p => p.category === 'high_risk').length}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Haut Risque</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold neon-text-orange font-orbitron">
              {places.filter(p => p.category === 'medium_risk').length}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Risque Moyen</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold neon-text-blue font-orbitron">
              {places.filter(p => p.category === 'low_risk').length}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Risque Faible</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold neon-text-green font-orbitron">
              {places.filter(p => p.category === 'safe').length}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Sûrs</p>
          </div>
        </div>
      )}
    </div>
  );
}
