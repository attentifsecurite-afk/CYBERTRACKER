import { useEffect, useState } from 'react';
import { aiSystem, type AISystemState, type Thought } from '../services/aiSystem';

export default function AIConsciousness() {
  const [state, setState] = useState<AISystemState>(aiSystem.getState());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = aiSystem.subscribe(setState);
    return unsubscribe;
  }, []);

  const getThoughtIcon = (type: Thought['type']) => {
    switch (type) {
      case 'observation': return 'fa-eye';
      case 'analysis': return 'fa-brain';
      case 'decision': return 'fa-check-circle';
      case 'memory': return 'fa-database';
      case 'emotion': return 'fa-heart';
      default: return 'fa-lightbulb';
    }
  };

  const getThoughtColor = (type: Thought['type']) => {
    switch (type) {
      case 'observation': return 'neon-text-cyan';
      case 'analysis': return 'neon-text-purple';
      case 'decision': return 'neon-text-green';
      case 'memory': return 'neon-text-orange';
      case 'emotion': return 'neon-text-pink';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isExpanded ? 'w-96' : 'w-80'}`}>
      {/* Header */}
      <div 
        className="glass-card p-4 cursor-pointer hover:border-cyan-500/50 transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center animate-glow-pulse">
                <i className="fas fa-brain text-white text-sm"></i>
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-sm font-bold neon-text-cyan font-orbitron">CONSCIENCE IA</h3>
              <p className="text-[10px] text-gray-400">Système vivant et intelligent</p>
            </div>
          </div>
          <i className={`fas ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-up'} text-cyan-400`}></i>
        </div>

        {/* Barres de progression */}
        <div className="space-y-2">
          <div>
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-gray-400">Conscience</span>
              <span className="neon-text-cyan font-mono">{state.consciousness.toFixed(1)}%</span>
            </div>
            <div className="cyber-progress">
              <div 
                className="cyber-progress-fill bg-gradient-to-r from-cyan-500 to-blue-500"
                style={{ width: `${state.consciousness}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-gray-400">Apprentissage</span>
              <span className="neon-text-purple font-mono">{state.learning.toFixed(1)}%</span>
            </div>
            <div className="cyber-progress">
              <div 
                className="cyber-progress-fill bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${state.learning}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Émotions */}
        <div className="mt-3 flex flex-wrap gap-1">
          {state.emotions.slice(-3).map((emotion, i) => (
            <span key={i} className="text-[9px] px-2 py-0.5 bg-pink-500/20 text-pink-400 rounded border border-pink-500/30">
              {emotion}
            </span>
          ))}
        </div>
      </div>

      {/* Pensées détaillées (quand expandé) */}
      {isExpanded && (
        <div className="glass-card p-4 mt-2 max-h-96 overflow-y-auto">
          <h4 className="text-xs font-bold neon-text-purple font-orbitron mb-3 flex items-center gap-2">
            <i className="fas fa-stream"></i>
            Flux de Pensées
          </h4>
          
          <div className="space-y-2">
            {state.thoughts.slice(0, 10).map((thought) => (
              <div 
                key={thought.id} 
                className="p-2 bg-black/40 rounded border border-gray-700 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-start gap-2">
                  <i className={`fas ${getThoughtIcon(thought.type)} ${getThoughtColor(thought.type)} text-xs mt-0.5`}></i>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-300 leading-relaxed">
                      {thought.content}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[9px] text-gray-500">
                      <span className="font-mono">
                        {thought.timestamp.toLocaleTimeString('fr-FR')}
                      </span>
                      <span>•</span>
                      <span>
                        Confiance: {(thought.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Statistiques */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold neon-text-cyan font-orbitron">{state.memory.length}</p>
                <p className="text-[9px] text-gray-400">Souvenirs</p>
              </div>
              <div>
                <p className="text-lg font-bold neon-text-green font-orbitron">{state.decisions.length}</p>
                <p className="text-[9px] text-gray-400">Décisions</p>
              </div>
              <div>
                <p className="text-lg font-bold neon-text-purple font-orbitron">{state.connections.length}</p>
                <p className="text-[9px] text-gray-400">Connexions</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
