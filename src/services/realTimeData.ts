// Service pour récupérer de VRAIES données en temps réel
// Utilise Brave Search API + géolocalisation IP réelle

import { searchThreats, searchLatestThreats, searchMalwareReports } from './braveApi';

export interface RealThreat {
  id: string;
  ip: string;
  lat: number;
  lng: number;
  country: string;
  city: string;
  threat: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
  source: string;
}

export interface IPGeolocation {
  ip: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
}

// Géolocalisation d'IP réelle via ipapi.co (HTTPS, supporte CORS)
export async function geolocateIP(ip: string): Promise<IPGeolocation | null> {
  try {
    // Utiliser ipapi.co qui supporte CORS et HTTPS
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    
    if (!response.ok) {
      console.warn(`Géolocalisation échouée pour ${ip}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.warn(`Erreur géolocalisation ${ip}:`, data.reason);
      return null;
    }
    
    // Vérifier que nous avons les coordonnées
    if (data.latitude && data.longitude) {
      return {
        ip,
        country: data.country_name || 'Inconnu',
        city: data.city || 'Inconnu',
        lat: data.latitude,
        lng: data.longitude
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur géolocalisation IP:', error);
    return null;
  }
}

// Extraction d'IPs depuis du texte (regex pour IPv4)
function extractIPs(text: string): string[] {
  const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
  const matches = text.match(ipRegex) || [];
  // Filtrer les IPs privées et invalides
  return matches.filter(ip => {
    const parts = ip.split('.').map(Number);
    return !(parts[0] === 10 || 
             (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
             (parts[0] === 192 && parts[1] === 168) ||
             parts[0] === 127 ||
             parts[0] === 0);
  });
}

// Déterminer le type de menace basé sur le contenu
function determineThreatType(title: string, description: string): 'critical' | 'high' | 'medium' | 'low' {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('ransomware') || text.includes('zero-day') || text.includes('apt')) {
    return 'critical';
  }
  if (text.includes('malware') || text.includes('botnet') || text.includes('exploit')) {
    return 'high';
  }
  if (text.includes('phishing') || text.includes('scam') || text.includes('fraud')) {
    return 'medium';
  }
  return 'low';
}

// Déterminer le nom de la menace
function determineThreatName(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('ransomware')) return 'Ransomware Attack';
  if (text.includes('phishing')) return 'Phishing Campaign';
  if (text.includes('ddos')) return 'DDoS Attack';
  if (text.includes('malware')) return 'Malware Distribution';
  if (text.includes('botnet')) return 'Botnet Activity';
  if (text.includes('exploit')) return 'Exploit Detected';
  if (text.includes('breach')) return 'Data Breach';
  if (text.includes('vulnerability')) return 'Vulnerability';
  if (text.includes('scam')) return 'Scam Detected';
  if (text.includes('fraud')) return 'Fraud Attempt';
  
  return 'Cyber Threat';
}

// Récupérer de VRAIES menaces en temps réel
export async function fetchRealThreats(): Promise<RealThreat[]> {
  const threats: RealThreat[] = [];
  
  try {
    console.log('🔍 Récupération des menaces via Brave Search API...');
    
    // Rechercher les dernières menaces via Brave Search
    const searchResults = await searchLatestThreats();
    
    if (searchResults.web?.results) {
      console.log(`✅ ${searchResults.web.results.length} résultats trouvés`);
      
      for (const result of searchResults.web.results.slice(0, 10)) {
        // Extraire les IPs du titre et de la description
        const ips = extractIPs(result.title + ' ' + result.description);
        
        console.log(`📍 ${ips.length} IPs extraites de: ${result.title.substring(0, 50)}...`);
        
        // Si on trouve des IPs, les géolocaliser
        for (const ip of ips.slice(0, 2)) { // Max 2 IPs par résultat
          const geo = await geolocateIP(ip);
          
          if (geo) {
            console.log(`✅ IP géolocalisée: ${ip} → ${geo.city}, ${geo.country}`);
            
            threats.push({
              id: `REAL-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              ip,
              lat: geo.lat,
              lng: geo.lng,
              country: geo.country,
              city: geo.city,
              threat: determineThreatName(result.title, result.description),
              type: determineThreatType(result.title, result.description),
              timestamp: new Date(),
              source: result.url
            });
          } else {
            console.warn(`⚠️ Impossible de géolocaliser: ${ip}`);
          }
          
          // Petit délai pour éviter le rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    }
    
    // Si pas assez de menaces, chercher des rapports malware
    if (threats.length < 5) {
      console.log('🔍 Recherche de rapports malware supplémentaires...');
      
      const malwareResults = await searchMalwareReports();
      
      if (malwareResults.web?.results) {
        for (const result of malwareResults.web.results.slice(0, 5)) {
          const ips = extractIPs(result.title + ' ' + result.description);
          
          for (const ip of ips.slice(0, 1)) {
            const geo = await geolocateIP(ip);
            
            if (geo) {
              threats.push({
                id: `REAL-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                ip,
                lat: geo.lat,
                lng: geo.lng,
                country: geo.country,
                city: geo.city,
                threat: determineThreatName(result.title, result.description),
                type: determineThreatType(result.title, result.description),
                timestamp: new Date(),
                source: result.url
              });
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      }
    }
    
    console.log(`✅ Total: ${threats.length} menaces géolocalisées`);
    return threats;
  } catch (error) {
    console.error('❌ Erreur récupération menaces réelles:', error);
    return [];
  }
}

// Récupérer des menaces réelles avec un délai pour ne pas spammer les APIs
export async function fetchRealThreatsWithDelay(): Promise<RealThreat[]> {
  const threats = await fetchRealThreats();
  
  // Attendre 1 seconde entre les appels
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return threats;
}
