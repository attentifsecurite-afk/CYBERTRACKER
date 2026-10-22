// Google Maps Places Service
// Utilise la bibliothèque JavaScript Google Maps (Places Library)
// Fonctionne côté client sans problème CORS

export interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  rating?: number;
  user_ratings_total?: number;
  website?: string;
  phone?: string;
  opening_hours?: {
    open_now: boolean;
  };
  price_level?: number;
  business_status?: string;
  vicinity?: string;
}

export interface PlaceSearchResult {
  results: GooglePlace[];
  status: string;
}

export interface SuspiciousPlace extends GooglePlace {
  riskScore: number;
  riskFactors: string[];
  nearbyThreats: number;
  category: 'high_risk' | 'medium_risk' | 'low_risk' | 'safe';
}

// Vérifier si Google Maps est disponible
function checkGoogleMaps(): boolean {
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    console.error('❌ Google Maps Places library not loaded');
    return false;
  }
  return true;
}

// Rechercher des lieux avec Google Places JavaScript API
export async function searchPlaces(
  query: string,
  location?: { lat: number; lng: number },
  radius: number = 5000
): Promise<PlaceSearchResult> {
  return new Promise((resolve, reject) => {
    if (!checkGoogleMaps()) {
      reject(new Error('Google Maps Places library not available'));
      return;
    }

    // Créer un élément div temporaire pour le service
    const div = document.createElement('div');
    div.style.display = 'none';
    document.body.appendChild(div);

    // Créer une carte temporaire (requise par PlacesService)
    const map = new window.google.maps.Map(div, {
      center: location || { lat: 0, lng: 0 },
      zoom: 10
    });

    const service = new window.google.maps.places.PlacesService(map);

    const request: any = {
      query: query,
      fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types', 'rating', 'user_ratings_total', 'website', 'formatted_phone_number', 'opening_hours', 'price_level', 'business_status']
    };

    if (location) {
      request.location = new window.google.maps.LatLng(location.lat, location.lng);
      request.radius = radius;
    }

    service.textSearch(request, (results: any[], status: any) => {
      // Nettoyer l'élément temporaire
      document.body.removeChild(div);

      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const formattedResults: GooglePlace[] = results.map(place => ({
          place_id: place.place_id,
          name: place.name,
          formatted_address: place.formatted_address || '',
          geometry: {
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }
          },
          types: place.types || [],
          rating: place.rating,
          user_ratings_total: place.user_ratings_total,
          website: place.website,
          phone: place.formatted_phone_number,
          opening_hours: place.opening_hours ? {
            open_now: place.opening_hours.open_now || false
          } : undefined,
          price_level: place.price_level,
          business_status: place.business_status,
          vicinity: place.vicinity
        }));

        resolve({
          results: formattedResults,
          status: status
        });
      } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve({
          results: [],
          status: 'ZERO_RESULTS'
        });
      } else {
        reject(new Error(`Places API error: ${status}`));
      }
    });
  });
}

// Obtenir les détails d'un lieu
export async function getPlaceDetails(placeId: string): Promise<GooglePlace | null> {
  return new Promise((resolve) => {
    if (!checkGoogleMaps()) {
      resolve(null);
      return;
    }

    const div = document.createElement('div');
    div.style.display = 'none';
    document.body.appendChild(div);

    const map = new window.google.maps.Map(div, {
      center: { lat: 0, lng: 0 },
      zoom: 10
    });

    const service = new window.google.maps.places.PlacesService(map);

    service.getDetails(
      {
        placeId: placeId,
        fields: ['name', 'formatted_address', 'geometry', 'types', 'rating', 'user_ratings_total', 'website', 'formatted_phone_number', 'opening_hours', 'price_level', 'business_status']
      },
      (place: any, status: any) => {
        document.body.removeChild(div);

        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          resolve({
            place_id: place.place_id,
            name: place.name,
            formatted_address: place.formatted_address || '',
            geometry: {
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }
            },
            types: place.types || [],
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            website: place.website,
            phone: place.formatted_phone_number,
            opening_hours: place.opening_hours ? {
              open_now: place.opening_hours.open_now || false
            } : undefined,
            price_level: place.price_level,
            business_status: place.business_status
          });
        } else {
          resolve(null);
        }
      }
    );
  });
}

// Analyser si un lieu est suspect
export function analyzePlaceRisk(place: GooglePlace, nearbyThreats: number = 0): SuspiciousPlace {
  const riskFactors: string[] = [];
  let riskScore = 0;

  // Facteurs de risque
  if (!place.rating || place.rating < 3) {
    riskFactors.push('Note faible');
    riskScore += 20;
  }

  if (place.user_ratings_total && place.user_ratings_total < 10) {
    riskFactors.push('Peu d\'avis');
    riskScore += 15;
  }

  if (place.business_status === 'CLOSED_PERMANENTLY') {
    riskFactors.push('Fermé définitivement');
    riskScore += 30;
  }

  if (nearbyThreats > 0) {
    riskFactors.push(`${nearbyThreats} menace(s) à proximité`);
    riskScore += nearbyThreats * 10;
  }

  // Types suspects
  const suspiciousTypes = ['night_club', 'casino', 'pawn_shop', 'liquor_store'];
  if (place.types.some(type => suspiciousTypes.includes(type))) {
    riskFactors.push('Type d\'établissement à risque');
    riskScore += 25;
  }

  // Pas de site web
  if (!place.website) {
    riskFactors.push('Pas de site web');
    riskScore += 10;
  }

  // Pas de téléphone
  if (!place.phone) {
    riskFactors.push('Pas de téléphone');
    riskScore += 5;
  }

  // Déterminer la catégorie
  let category: 'high_risk' | 'medium_risk' | 'low_risk' | 'safe';
  if (riskScore >= 60) {
    category = 'high_risk';
  } else if (riskScore >= 40) {
    category = 'medium_risk';
  } else if (riskScore >= 20) {
    category = 'low_risk';
  } else {
    category = 'safe';
  }

  return {
    ...place,
    riskScore: Math.min(riskScore, 100),
    riskFactors,
    nearbyThreats,
    category
  };
}

// Scanner une zone géographique pour des lieux suspects
export async function scanArea(
  center: { lat: number; lng: number },
  radius: number = 5000,
  query: string = 'business'
): Promise<SuspiciousPlace[]> {
  try {
    console.log(`🔍 Scan de la zone: ${query} (rayon: ${radius}m)`);
    
    const searchResult = await searchPlaces(query, center, radius);
    
    console.log(`✅ ${searchResult.results.length} lieux trouvés`);
    
    const suspiciousPlaces: SuspiciousPlace[] = searchResult.results.map(place => 
      analyzePlaceRisk(place, Math.floor(Math.random() * 3))
    );

    return suspiciousPlaces.sort((a, b) => b.riskScore - a.riskScore);
  } catch (error) {
    console.error('❌ Erreur scan zone:', error);
    return [];
  }
}

// Rechercher des entreprises suspectes par type
export async function searchSuspiciousBusinesses(
  location: { lat: number; lng: number },
  businessTypes: string[] = ['casino', 'pawn_shop', 'night_club']
): Promise<SuspiciousPlace[]> {
  const allPlaces: SuspiciousPlace[] = [];

  for (const type of businessTypes) {
    try {
      console.log(`🔍 Recherche: ${type}`);
      const result = await searchPlaces(type, location, 10000);
      const suspicious = result.results.map(place => analyzePlaceRisk(place));
      allPlaces.push(...suspicious);
      console.log(`✅ ${suspicious.length} résultats pour ${type}`);
    } catch (error) {
      console.error(`❌ Erreur recherche ${type}:`, error);
    }
  }

  return allPlaces.sort((a, b) => b.riskScore - a.riskScore);
}

// Obtenir les lieux les plus proches d'une menace
export async function getNearbyPlaces(
  threatLocation: { lat: number; lng: number },
  radius: number = 1000
): Promise<GooglePlace[]> {
  return new Promise((resolve) => {
    if (!checkGoogleMaps()) {
      resolve([]);
      return;
    }

    const div = document.createElement('div');
    div.style.display = 'none';
    document.body.appendChild(div);

    const map = new window.google.maps.Map(div, {
      center: threatLocation,
      zoom: 15
    });

    const service = new window.google.maps.places.PlacesService(map);

    service.nearbySearch(
      {
        location: new window.google.maps.LatLng(threatLocation.lat, threatLocation.lng),
        radius: radius,
        fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types', 'rating', 'user_ratings_total', 'website', 'formatted_phone_number']
      },
      (results: any[], status: any) => {
        document.body.removeChild(div);

        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const formattedResults: GooglePlace[] = results.map(place => ({
            place_id: place.place_id,
            name: place.name,
            formatted_address: place.formatted_address || place.vicinity || '',
            geometry: {
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }
            },
            types: place.types || [],
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            website: place.website,
            phone: place.formatted_phone_number
          }));

          resolve(formattedResults);
        } else {
          resolve([]);
        }
      }
    );
  });
}
