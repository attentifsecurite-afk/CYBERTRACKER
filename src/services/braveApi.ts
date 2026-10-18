// Brave Search API Service
const BRAVE_API_KEY = import.meta.env.VITE_BRAVE_API_KEY;
const BRAVE_API_URL = 'https://api.search.brave.com/res/v1/web/search';

export interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
  age?: string;
}

export interface BraveResponse {
  query: {
    original: string;
  };
  web: {
    results: BraveSearchResult[];
    total_estimates?: number;
  };
  news?: {
    results: BraveSearchResult[];
  };
}

export async function searchThreats(query: string): Promise<BraveResponse> {
  try {
    const response = await fetch(
      `${BRAVE_API_URL}?q=${encodeURIComponent(query)}&count=10&search_lang=en`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': BRAVE_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Brave API Error:', error);
    throw error;
  }
}

export async function searchLatestThreats(): Promise<BraveResponse> {
  return searchThreats('cybersecurity threats today ransomware phishing 2024 2025');
}

export async function searchDarkWebLeaks(): Promise<BraveResponse> {
  return searchThreats('data breach leak dark web vulnerability exposed');
}

export async function searchMalwareReports(): Promise<BraveResponse> {
  return searchThreats('malware new variant trojan worm botnet detection');
}

export async function searchFraudSites(): Promise<BraveResponse> {
  return searchThreats('phishing scam fraud website fake identity theft');
}
