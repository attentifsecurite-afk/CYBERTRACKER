// Aviationstack API Service
// Documentation: https://aviationstack.com/documentation

const AVIATIONSTACK_API_KEY = import.meta.env.VITE_AVIASTACK_API_KEY;
const BASE_URL = 'http://api.aviationstack.com/v1';

export interface Flight {
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    delay: number;
    scheduled: string;
    estimated: string;
    actual: string;
    estimated_runway: string;
    actual_runway: string;
  };
  arrival: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    baggage: string;
    delay: number;
    scheduled: string;
    estimated: string;
    actual: string;
    estimated_runway: string;
    actual_runway: string;
  };
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  flight: {
    number: string;
    iata: string;
    icao: string;
    codeshared: string;
  };
  aircraft: {
    registration: string;
    iata: string;
    icao: string;
    icao24: string;
  };
  live: {
    updated: string;
    latitude: number;
    longitude: number;
    altitude: number;
    direction: number;
    speed_horizontal: number;
    speed_vertical: number;
    is_ground: boolean;
  } | null;
}

export interface Airport {
  id: number;
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
  latitude: number;
  longitude: number;
  altitude: number;
  timezone: string;
  dst: string;
  tz_db_time: string;
  type: string;
}

export interface Airline {
  id: number;
  name: string;
  iata: string;
  icao: string;
  callsign: string;
  country: string;
  active: string;
}

export interface AviationstackResponse<T> {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: T[];
}

// Récupérer les vols en temps réel
export async function getFlights(params: {
  limit?: number;
  offset?: number;
  flight_status?: string;
  airline_iata?: string;
  dep_iata?: string;
  arr_iata?: string;
} = {}): Promise<AviationstackResponse<Flight>> {
  try {
    const queryParams = new URLSearchParams({
      access_key: AVIATIONSTACK_API_KEY,
      ...(params.limit && { limit: params.limit.toString() }),
      ...(params.offset && { offset: params.offset.toString() }),
      ...(params.flight_status && { flight_status: params.flight_status }),
      ...(params.airline_iata && { airline_iata: params.airline_iata }),
      ...(params.dep_iata && { dep_iata: params.dep_iata }),
      ...(params.arr_iata && { arr_iata: params.arr_iata }),
    });

    const response = await fetch(`${BASE_URL}/flights?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'API Error');
    }

    return data;
  } catch (error) {
    console.error('Erreur Aviationstack API:', error);
    throw error;
  }
}

// Récupérer les informations d'un aéroport
export async function getAirports(params: {
  limit?: number;
  offset?: number;
  search?: string;
  iata?: string;
  country?: string;
} = {}): Promise<AviationstackResponse<Airport>> {
  try {
    const queryParams = new URLSearchParams({
      access_key: AVIATIONSTACK_API_KEY,
      ...(params.limit && { limit: params.limit.toString() }),
      ...(params.offset && { offset: params.offset.toString() }),
      ...(params.search && { search: params.search }),
      ...(params.iata && { iata: params.iata }),
      ...(params.country && { country: params.country }),
    });

    const response = await fetch(`${BASE_URL}/airports?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'API Error');
    }

    return data;
  } catch (error) {
    console.error('Erreur Aviationstack API:', error);
    throw error;
  }
}

// Récupérer les informations d'une compagnie aérienne
export async function getAirlines(params: {
  limit?: number;
  offset?: number;
  search?: string;
  iata?: string;
  country?: string;
} = {}): Promise<AviationstackResponse<Airline>> {
  try {
    const queryParams = new URLSearchParams({
      access_key: AVIATIONSTACK_API_KEY,
      ...(params.limit && { limit: params.limit.toString() }),
      ...(params.offset && { offset: params.offset.toString() }),
      ...(params.search && { search: params.search }),
      ...(params.iata && { iata: params.iata }),
      ...(params.country && { country: params.country }),
    });

    const response = await fetch(`${BASE_URL}/airlines?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'API Error');
    }

    return data;
  } catch (error) {
    console.error('Erreur Aviationstack API:', error);
    throw error;
  }
}

// Récupérer les vols en direct avec position GPS
export async function getLiveFlights(limit: number = 100): Promise<Flight[]> {
  try {
    const response = await getFlights({ limit });
    
    // Filtrer pour ne garder que les vols avec données live
    const liveFlights = response.data.filter(flight => flight.live !== null);
    
    return liveFlights;
  } catch (error) {
    console.error('Erreur récupération vols live:', error);
    return [];
  }
}

// Récupérer les vols par statut
export async function getFlightsByStatus(status: 'active' | 'landed' | 'cancelled' | 'incident' | 'diverted', limit: number = 50): Promise<Flight[]> {
  try {
    const response = await getFlights({ flight_status: status, limit });
    return response.data;
  } catch (error) {
    console.error(`Erreur récupération vols ${status}:`, error);
    return [];
  }
}

// Rechercher des vols par aéroport de départ
export async function getDeparturesFromAirport(iata: string, limit: number = 50): Promise<Flight[]> {
  try {
    const response = await getFlights({ dep_iata: iata, limit });
    return response.data;
  } catch (error) {
    console.error(`Erreur récupération départs ${iata}:`, error);
    return [];
  }
}

// Rechercher des vols par aéroport d'arrivée
export async function getArrivalsToAirport(iata: string, limit: number = 50): Promise<Flight[]> {
  try {
    const response = await getFlights({ arr_iata: iata, limit });
    return response.data;
  } catch (error) {
    console.error(`Erreur récupération arrivées ${iata}:`, error);
    return [];
  }
}

// Vérifier si l'API est disponible
export function isAviationstackAvailable(): boolean {
  return !!AVIATIONSTACK_API_KEY;
}
