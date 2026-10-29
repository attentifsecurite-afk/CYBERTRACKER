import { useState, useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import ThreatsPage from './pages/ThreatsPage';
import WorldMapPage from './pages/WorldMapPage';
import VPNPage from './pages/VPNPage';
import SEOPage from './pages/SEOPage';
import IntelPage from './pages/IntelPage';
import NetworkPage from './pages/NetworkPage';
import MapsScraperPage from './pages/MapsScraperPage';
import ScraperPage from './pages/ScraperPage';
import AviationPage from './pages/AviationPage';
import IPTrackerPage from './pages/IPTrackerPage';

function Header() {
  const [time, setTime] = useState(new Date());
  const [systemStatus] = useState({
    active: true,
    threats: 247,
    api: 'CONNECTED',
    nodes: 1247,
    uptime: '99.98%'
  });
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-cyan-500/20">
      <div className="max-w-full mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center animate-glow-pulse">
                <i className="fas fa-shield-halved text-white text-xl"></i>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-orbitron tracking-wider">
                <span className="neon-text-blue">CYBER</span>
                <span className="neon-text-purple">TRACKER</span>
              </h1>
              <p className="text-xs text-gray-400 font-mono tracking-widest">ANTI-CYBERCRIME SYSTEM v4.0</p>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="status-indicator status-active"></div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Système</p>
                <p className="text-xs font-mono neon-text-green">ACTIF</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="status-indicator status-danger"></div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Menaces</p>
                <p className="text-xs font-mono neon-text-pink">{systemStatus.threats}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="status-indicator status-active"></div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">API Brave</p>
                <p className="text-xs font-mono neon-text-blue">{systemStatus.api}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="status-indicator status-active"></div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Nodes</p>
                <p className="text-xs font-mono neon-text-purple">{systemStatus.nodes}</p>
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="text-right">
            <div className="text-2xl font-bold font-orbitron neon-text-blue">{time.toLocaleTimeString('fr-FR')}</div>
            <div className="text-xs text-gray-400 font-mono">{time.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavigationTabs({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
    { id: 'threats', label: 'Menaces', icon: 'fa-skull-crossbones' },
    { id: 'map', label: 'Carte Monde', icon: 'fa-globe' },
    { id: 'iptracker', label: 'IP Tracker', icon: 'fa-map-marker-alt' },
    { id: 'aviation', label: 'Aviation', icon: 'fa-plane' },
    { id: 'scraper', label: 'Maps Scanner', icon: 'fa-map-marked-alt' },
    { id: 'webscraper', label: 'Web Scraper', icon: 'fa-spider' },
    { id: 'network', label: 'Réseau', icon: 'fa-network-wired' },
    { id: 'vpn', label: 'VPN/Tor', icon: 'fa-user-secret' },
    { id: 'seo', label: 'SEO/AEO', icon: 'fa-arrows-left-right' },
    { id: 'intel', label: 'Renseignement', icon: 'fa-rss' },
  ];

  return (
    <div className="glass-card p-2 mb-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cyber-tab flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
          >
            <i className={`fas ${tab.icon}`}></i>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardPage />;
      case 'threats': return <ThreatsPage />;
      case 'map': return <WorldMapPage />;
      case 'iptracker': return <IPTrackerPage />;
      case 'aviation': return <AviationPage />;
      case 'scraper': return <MapsScraperPage />;
      case 'webscraper': return <ScraperPage />;
      case 'network': return <NetworkPage />;
      case 'vpn': return <VPNPage />;
      case 'seo': return <SEOPage />;
      case 'intel': return <IntelPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-black cyber-grid-bg">
      {/* Animated Background avec effets de scan */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Orbes lumineux animés */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Effet de scan horizontal */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-scan-line" style={{ animationDuration: '8s' }}></div>
        </div>
        
        {/* Grille animée */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'data-stream 20s linear infinite'
          }}></div>
        </div>
      </div>

      <Header />
      
      <main className="relative z-10 max-w-[1800px] mx-auto px-4 py-6">
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderPage()}
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 glass-card mt-8 py-4 border-t border-cyan-500/20">
        <div className="max-w-[1800px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 font-mono tracking-wider">
            CYBERTRACKER PRO v4.0 • SYSTÈME DE LUTTE ANTI-CYBERCRIMINALITÉ • TOUS SYSTÈMES ACTIFS
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <i className="fas fa-lock neon-text-green text-xs"></i>
              <span className="text-xs text-gray-400 font-mono">AES-256</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-server neon-text-blue text-xs"></i>
              <span className="text-xs text-gray-400 font-mono">1,247 NODES</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-bolt neon-text-purple text-xs"></i>
              <span className="text-xs text-gray-400 font-mono">BRAVE API</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
