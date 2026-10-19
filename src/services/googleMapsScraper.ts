// Google Maps Places API Service
// Inspiré de https://github.com/omkarcloud/google-maps-scraper

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
  error_message?: string;
}

export interface SuspiciousPlace extends GooglePlace {
  riskScore: number;
  riskFactors: string[];
  nearbyThreats: number;
  category: 'high_risk' | 'medium_risk' | 'low_risk' | 'safe';
}

// Rechercher des lieux avec Google Places API
export async function searchPlaces(
  query: string,
  location?: { lat: number; lng: number },
  radius: number = 5000
): Promise<PlaceSearchResult> {
  try {
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`;
    
    if (location) {
      url += `&location=${location.lat},${location.lng}&radius=${radius}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(data.error_message || 'Erreur API Google Places');
    }

    return data;
  } catch (error) {
    console.error('Erreur recherche lieux:', error);
    throw error;
  }
}

// Obtenir les détails d'un lieu
export async function getPlaceDetails(placeId: string): Promise<GooglePlace | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,types,rating,user_ratings_total,website,formatted_phone_number,opening_hours,price_level,business_status&key=${GOOGLE_MAPS_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return data.result;
    }

    return null;
  } catch (error) {
    console.error('Erreur détails lieu:', error);
    return null;
  }
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
    const searchResult = await searchPlaces(query, center, radius);
    
    const suspiciousPlaces: SuspiciousPlace[] = searchResult.results.map(place => 
      analyzePlaceRisk(place, Math.floor(Math.random() * 3)) // Simulation des menaces proches
    );

    return suspiciousPlaces.sort((a, b) => b.riskScore - a.riskScore);
  } catch (error) {
    console.error('Erreur scan zone:', error);
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
      const result = await searchPlaces(type, location, 10000);
      const suspicious = result.results.map(place => analyzePlaceRisk(place));
      allPlaces.push(...suspicious);
    } catch (error) {
      console.error(`Erreur recherche ${type}:`, error);
    }
  }

  return allPlaces.sort((a, b) => b.riskScore - a.riskScore);
}

// Obtenir les lieux les plus proches d'une menace
export async function getNearbyPlaces(
  threatLocation: { lat: number; lng: number },
  radius: number = 1000
): Promise<GooglePlace[]> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${threatLocation.lat},${threatLocation.lng}&radius=${radius}&key=${GOOGLE_MAPS_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return data.results;
    }

    return [];
  } catch (error) {
    console.error('Erreur lieux proches:', error);
    return [];
  }
}
