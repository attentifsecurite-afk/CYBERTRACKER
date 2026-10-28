/**
 * Service de Web Scraping pour la collecte de données de menaces
 * Utilise deux clés API pour le scraping de sites de cybersécurité
 */

const SCRAPER_API_KEY_1 = import.meta.env.VITE_SCRAPER_API_KEY_1;
const SCRAPER_API_KEY_2 = import.meta.env.VITE_SCRAPER_API_KEY_2;

// Sources de données de menaces
const THREAT_SOURCES = [
  'https://haveibeenpwned.com/api/v3/breaches',
  'https://cve.circl.lu/api/cve/',
  'https://services.nvd.nist.gov/rest/json/cves/2.0',
  'https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_level1.netset',
  'https://raw.githubusercontent.com/stamparm/BlackBook/master/blackbook'
];

// Sites de news cybersécurité
const CYBER_NEWS_SOURCES = [
  'https://thehackernews.com/',
  'https://www.bleepingcomputer.com/',
  'https://krebsonsecurity.com/',
  'https://www.zdnet.com/topic/security/',
  'https://cyberscoop.com/'
];

export interface ScrapedThreat {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
  ips?: string[];
  domains?: string[];
}

interface ScrapeResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Fonction de scraping avec rotation de clés API
 */
async function scrapeUrl(url: string): Promise<ScrapeResult> {
  // Rotation entre les deux clés API
  const apiKey = Math.random() > 0.5 ? SCRAPER_API_KEY_1 : SCRAPER_API_KEY_2;
  
  try {
    // Utiliser un proxy CORS pour le scraping
    const proxyUrl = `https://api.scraperapi.com/structured/url?url=${encodeURIComponent(url)}&api_key=${apiKey}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`Erreur de scraping pour ${url}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}

/**
 * Scrape les actualités de cybersécurité
 */
export async function scrapeCyberNews(): Promise<ScrapedThreat[]> {
  const threats: ScrapedThreat[] = [];
  
  console.log('🔍 Scraping des actualités cybersécurité...');
  
  // Scrape quelques sources de news
  for (const source of CYBER_NEWS_SOURCES.slice(0, 3)) {
    try {
      const result = await scrapeUrl(source);
      
      if (result.success && result.data) {
        // Extraire les articles récents
        const articles = extractArticles(result.data, source);
        threats.push(...articles);
      }
    } catch (error) {
      console.error(`Erreur scraping ${source}:`, error);
    }
    
    // Délai entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`✅ ${threats.length} articles trouvés`);
  return threats;
}

/**
 * Extrait les articles d'une page web scrapée
 */
function extractArticles(data: any, source: string): ScrapedThreat[] {
  const articles: ScrapedThreat[] = [];
  
  // Parser le contenu pour extraire les articles
  if (data && typeof data === 'object') {
    // Chercher des patterns d'articles dans les données
    const content = JSON.stringify(data);
    
    // Extraire les titres et descriptions
    const titleMatches = content.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi) || [];
    const descMatches = content.match(/<p[^>]*>([^<]+)<\/p>/gi) || [];
    
    // Créer des entrées de menaces à partir du contenu
    for (let i = 0; i < Math.min(titleMatches.length, 5); i++) {
      const title = titleMatches[i]?.replace(/<[^>]+>/g, '').trim() || '';
      const description = descMatches[i]?.replace(/<[^>]+>/g, '').trim() || title;
      
      if (title && title.length > 10) {
        articles.push({
          id: `SCRAPE-${Date.now()}-${i}`,
          title,
          description,
          url: source,
          source: 'Web Scraper',
          severity: determineSeverity(title + ' ' + description),
          timestamp: new Date(),
          ips: extractIPs(title + ' ' + description),
          domains: extractDomains(title + ' ' + description)
        });
      }
    }
  }
  
  return articles;
}

/**
 * Détermine la sévérité d'une menace basée sur le contenu
 */
function determineSeverity(text: string): 'critical' | 'high' | 'medium' | 'low' {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('critical') || lowerText.includes('zero-day') || lowerText.includes('apt')) {
    return 'critical';
  }
  if (lowerText.includes('high') || lowerText.includes('ransomware') || lowerText.includes('breach')) {
    return 'high';
  }
  if (lowerText.includes('medium') || lowerText.includes('phishing') || lowerText.includes('malware')) {
    return 'medium';
  }
  return 'low';
}

/**
 * Extrait les adresses IP d'un texte
 */
function extractIPs(text: string): string[] {
  const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
  const matches = text.match(ipRegex) || [];
  
  // Filtrer les IPs privées
  return matches.filter(ip => {
    const parts = ip.split('.').map(Number);
    return !(parts[0] === 10 || 
             (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
             (parts[0] === 192 && parts[1] === 168) ||
             parts[0] === 127);
  });
}

/**
 * Extrait les domaines d'un texte
 */
function extractDomains(text: string): string[] {
  const domainRegex = /\b(?:[a-zA-Z0-9-]+\.)+(?:com|org|net|edu|gov|mil|io|co|info|biz|xyz|top|club)\b/gi;
  const matches = text.match(domainRegex) || [];
  
  // Filtrer les domaines communs non suspects
  const excluded = ['google.com', 'facebook.com', 'twitter.com', 'github.com', 'wikipedia.org'];
  return matches.filter(domain => !excluded.includes(domain.toLowerCase()));
}

/**
 * Scrape les listes de menaces (IPs malveillantes, domaines, etc.)
 */
export async function scrapeThreatLists(): Promise<{ ips: string[]; domains: string[] }> {
  const ips: string[] = [];
  const domains: string[] = [];
  
  console.log('🔍 Scraping des listes de menaces...');
  
  // Scrape les listes d'IPs malveillantes
  for (const source of THREAT_SOURCES.slice(3, 5)) {
    try {
      const result = await scrapeUrl(source);
      
      if (result.success && result.data) {
        const content = typeof result.data === 'string' ? result.data : JSON.stringify(result.data);
        
        // Extraire les IPs
        const foundIPs = extractIPs(content);
        ips.push(...foundIPs);
        
        // Extraire les domaines
        const foundDomains = extractDomains(content);
        domains.push(...foundDomains);
      }
    } catch (error) {
      console.error(`Erreur scraping ${source}:`, error);
    }
    
    // Délai entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  console.log(`✅ ${ips.length} IPs et ${domains.length} domaines trouvés`);
  return { ips: [...new Set(ips)].slice(0, 50), domains: [...new Set(domains)].slice(0, 50) };
}

/**
 * Récupère toutes les données scrapées
 */
export async function fetchAllScrapedData(): Promise<{
  news: ScrapedThreat[];
  threatLists: { ips: string[]; domains: string[] };
}> {
  console.log('🚀 Démarrage du scraping complet...');
  
  const [news, threatLists] = await Promise.all([
    scrapeCyberNews(),
    scrapeThreatLists()
  ]);
  
  console.log('✅ Scraping terminé');
  
  return { news, threatLists };
}

/**
 * Vérifie si le service de scraping est disponible
 */
export function isScraperAvailable(): boolean {
  return !!(SCRAPER_API_KEY_1 && SCRAPER_API_KEY_2);
}

/**
 * Obtient les statistiques des clés API
 */
export function getScraperStats(): { key1: boolean; key2: boolean } {
  return {
    key1: !!SCRAPER_API_KEY_1,
    key2: !!SCRAPER_API_KEY_2
  };
}
