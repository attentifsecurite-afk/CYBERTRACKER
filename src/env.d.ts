/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BRAVE_API_KEY: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_SCRAPER_API_KEY_1: string;
  readonly VITE_SCRAPER_API_KEY_2: string;
  readonly VITE_AVIASTACK_API_KEY: string;
  readonly VITE_IPSTACK_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Google Maps types
interface Window {
  google: any;
  initGoogleMaps: () => void;
}
