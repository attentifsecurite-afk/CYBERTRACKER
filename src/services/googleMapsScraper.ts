// Service d'analyse des lieux suspects
// Utilisé par MapsScraperPage pour analyser les risques des lieux

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

export interface SuspiciousPlace extends GooglePlace {
  riskScore: number;
  riskFactors: string[];
  nearbyThreats: number;
  category: 'high_risk' | 'medium_risk' | 'low_risk' | 'safe';
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
