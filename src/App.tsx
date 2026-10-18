import { useState, useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import ThreatsPage from './pages/ThreatsPage';
import WorldMapPage from './pages/WorldMapPage';
import VPNPage from './pages/VPNPage';
import SEOPage from './pages/SEOPage';
import IntelPage from './pages/IntelPage';
import NetworkPage from './pages/NetworkPage';

function Header() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-gray-800 bg-[#0a0e1a]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-full mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center">
              <i className="fas fa-shield-halved text-white text-lg"></i>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              CYBER<span className="text-green-400">TRACKER</span> PRO
            </h1>
            <p className="text-xs text-gray-400 font-mono">Système de Traque de Fraude & Anti-Cybercriminalité</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="status-dot status-active"></span>
              <span className="text-xs text-green-400 font-mono">SYSTÈME ACTIF</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot status-danger animate-blink"></span>
              <span className="text-xs text-red-400 font-mono">MENACES: 247</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-cyan-400 font-mono">
                <i className="fas fa-bolt mr-1"></i>BRAVE API
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono text-cyan-400">{time.toLocaleTimeString('fr-FR')}</div>
            <div className="text-xs text-gray-500 font-mono">{time.toLocaleDateString('fr-FR')}</div>
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
    { id: 'network', label: 'Réseau', icon: 'fa-network-wired' },
    { id: 'vpn', label: 'VPN/Tor', icon: 'fa-user-secret' },
    { id: 'seo', label: 'SEO/AEO', icon: 'fa-spider' },
    { id: 'intel', label: 'Renseignement', icon: 'fa-rss' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === tab.id 
              ? 'tab-active text-green-400' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <i className={`fas ${tab.icon}`}></i>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
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
      case 'network': return <NetworkPage />;
      case 'vpn': return <VPNPage />;
      case 'seo': return <SEOPage />;
      case 'intel': return <IntelPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] cyber-grid">
      <Header />
      
      <main className="max-w-[1600px] mx-auto px-4 py-6">
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderPage()}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 mt-8 py-4">
        <div className="max-w-[1600px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500 font-mono">
            CYBERTRACKER PRO v4.0.0 • Système de Lutte Anti-Cybercriminalité • Brave Search API Active
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 font-mono">
              <i className="fas fa-lock text-green-400 mr-1"></i>AES-256
            </span>
            <span className="text-xs text-gray-500 font-mono">
              <i className="fas fa-server text-cyan-400 mr-1"></i>1,247 Nodes
            </span>
            <span className="text-xs text-gray-500 font-mono">
              <i className="fas fa-bolt text-orange-400 mr-1"></i>Brave API
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
