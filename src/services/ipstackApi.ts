// Service IPstack - Géolocalisation d'adresses IP
// Documentation: https://ipstack.com/documentation

const IPSTACK_API_KEY = import.meta.env.VITE_IPSTACK_API_KEY;
const BASE_URL = 'http://api.ipstack.com';

export interface IPGeolocation {
  ip: string;
  type: 'ipv4' | 'ipv6';
  continent_code: string;
  continent_name: string;
  country_code: string;
  country_name: string;
  region_code: string;
  region_name: string;
  city: string;
  zip: string;
  latitude: number;
  longitude: number;
  location: {
    geoname_id: number;
    capital: string;
    languages: Array<{
      code: string;
      name: string;
      native: string;
    }>;
    country_flag: string;
    country_flag_emoji: string;
    country_flag_emoji_unicode: string;
    calling_code: string;
    is_eu: boolean;
  };
  time_zone: {
    id: string;
    current_time: string;
    gmt_offset: number;
    code: string;
    is_daylight_saving: boolean;
  };
  currency: {
    code: string;
    name: string;
    plural: string;
    symbol: string;
    symbol_native: string;
  };
  connection: {
    asn: number;
    org: string;
    isp: string;
    domain: string;
  };
  security: {
    is_proxy: boolean;
    proxy_type: string;
    is_crawler: boolean;
    crawler_name: string;
    crawler_type: string;
    is_tor: boolean;
    threat_level: string;
    threat_types: string;
  };
}

// Géolocaliser une adresse IP
export async function geolocateIP(ip: string): Promise<IPGeolocation | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/${ip}?access_key=${IPSTACK_API_KEY}&fields=main,location,time_zone,currency,connection,security`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.info || 'API Error');
    }

    return data;
  } catch (error) {
    console.error('Erreur IPstack API:', error);
    return null;
  }
}

// Géolocaliser l'IP du client actuel
export async function geolocateSelf(): Promise<IPGeolocation | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/check?access_key=${IPSTACK_API_KEY}&fields=main,location,time_zone,currency,connection,security`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.info || 'API Error');
    }

    return data;
  } catch (error) {
    console.error('Erreur IPstack API:', error);
    return null;
  }
}

// Géolocaliser plusieurs IPs (batch)
export async function geolocateMultipleIPs(ips: string[]): Promise<IPGeolocation[]> {
  try {
    const ipList = ips.join(',');
    const response = await fetch(
      `${BASE_URL}/${ipList}?access_key=${IPSTACK_API_KEY}&fields=main,location,time_zone,currency,connection,security`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data.filter(item => !item.error);
    }

    return [];
  } catch (error) {
    console.error('Erreur IPstack API (batch):', error);
    return [];
  }
}

// Vérifier si une IP est un proxy/VPN/Tor
export async function checkIPSecurity(ip: string): Promise<{
  isProxy: boolean;
  isTor: boolean;
  isCrawler: boolean;
  threatLevel: string;
} | null> {
  try {
    const data = await geolocateIP(ip);
    
    if (!data || !data.security) {
      return null;
    }

    return {
      isProxy: data.security.is_proxy,
      isTor: data.security.is_tor,
      isCrawler: data.security.is_crawler,
      threatLevel: data.security.threat_level || 'low'
    };
  } catch (error) {
    console.error('Erreur vérification sécurité IP:', error);
    return null;
  }
}

// Obtenir les informations de connexion d'une IP
export async function getIPConnection(ip: string): Promise<{
  asn: number;
  org: string;
  isp: string;
  domain: string;
} | null> {
  try {
    const data = await geolocateIP(ip);
    
    if (!data || !data.connection) {
      return null;
    }

    return data.connection;
  } catch (error) {
    console.error('Erreur récupération connexion IP:', error);
    return null;
  }
}

// Vérifier si l'API est disponible
export function isIPstackAvailable(): boolean {
  return !!IPSTACK_API_KEY;
}

// Formater les données de géolocalisation pour affichage
export function formatGeolocation(data: IPGeolocation): string {
  return `${data.city}, ${data.region_name}, ${data.country_name} (${data.latitude}, ${data.longitude})`;
}

// Obtenir le drapeau d'un pays
export function getCountryFlag(data: IPGeolocation): string {
  return data.location?.country_flag_emoji || '🏳️';
}
