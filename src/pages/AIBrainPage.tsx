import { useEffect, useRef, useState } from 'react';
import { aiSystem } from '../services/aiSystem';

interface Neuron {
  id: number;
  x: number;
  y: number;
  z: number;
  radius: number;
  connections: number[];
  activation: number;
  type: 'input' | 'hidden' | 'output';
  layer: number;
}

interface Synapse {
  from: number;
  to: number;
  weight: number;
  signal: number;
  active: boolean;
}

interface BrainActivity {
  timestamp: number;
  activeNeurons: number;
  totalSignals: number;
  processingLoad: number;
}

export default function AIBrainPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [synapses, setSynapses] = useState<Synapse[]>([]);
  const [activity, setActivity] = useState<BrainActivity>({
    timestamp: Date.now(),
    activeNeurons: 0,
    totalSignals: 0,
    processingLoad: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTask, setCurrentTask] = useState('En attente');

  // Initialiser le réseau neuronal
  useEffect(() => {
    const initBrain = () => {
      const newNeurons: Neuron[] = [];
      const newSynapses: Synapse[] = [];
      
      const layers = 5;
      const neuronsPerLayer = 20;
      
      // Créer les neurones
      for (let layer = 0; layer < layers; layer++) {
        for (let i = 0; i < neuronsPerLayer; i++) {
          const angle = (i / neuronsPerLayer) * Math.PI * 2;
          const radius = 150 + layer * 50;
          const x = Math.cos(angle) * radius + 400;
          const y = Math.sin(angle) * radius + 300;
          const z = layer * 100;
          
          let type: 'input' | 'hidden' | 'output' = 'hidden';
          if (layer === 0) type = 'input';
          if (layer === layers - 1) type = 'output';
          
          newNeurons.push({
            id: layer * neuronsPerLayer + i,
            x,
            y,
            z,
            radius: 8 + Math.random() * 4,
            connections: [],
            activation: 0,
            type,
            layer
          });
        }
      }
      
      // Créer les synapses
      for (let layer = 0; layer < layers - 1; layer++) {
        const currentLayerStart = layer * neuronsPerLayer;
        const nextLayerStart = (layer + 1) * neuronsPerLayer;
        
        for (let i = 0; i < neuronsPerLayer; i++) {
          const fromNeuron = currentLayerStart + i;
          
          // Connecter à 3-5 neurones de la couche suivante
          const numConnections = 3 + Math.floor(Math.random() * 3);
          for (let j = 0; j < numConnections; j++) {
            const toNeuron = nextLayerStart + Math.floor(Math.random() * neuronsPerLayer);
            
            newNeurons[fromNeuron].connections.push(toNeuron);
            
            newSynapses.push({
              from: fromNeuron,
              to: toNeuron,
              weight: Math.random(),
              signal: 0,
              active: false
            });
          }
        }
      }
      
      setNeurons(newNeurons);
      setSynapses(newSynapses);
    };
    
    initBrain();
  }, []);

  // Animation du cerveau
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let time = 0;
    
    const animate = () => {
      time += 0.02;
      
      // Effacer le canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Dessiner les synapses
      synapses.forEach((synapse, index) => {
        const fromNeuron = neurons[synapse.from];
        const toNeuron = neurons[synapse.to];
        
        if (!fromNeuron || !toNeuron) return;
        
        // Animation du signal
        if (synapse.active) {
          synapse.signal += 0.05;
          if (synapse.signal >= 1) {
            synapse.signal = 0;
            synapse.active = false;
            
            // Activer le neurone cible
            const targetNeuron = neurons[synapse.to];
            if (targetNeuron) {
              targetNeuron.activation = Math.min(1, targetNeuron.activation + synapse.weight * 0.3);
            }
          }
          
          // Dessiner le signal en mouvement
          const signalX = fromNeuron.x + (toNeuron.x - fromNeuron.x) * synapse.signal;
          const signalY = fromNeuron.y + (toNeuron.y - fromNeuron.y) * synapse.signal;
          
          ctx.beginPath();
          ctx.arc(signalX, signalY, 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 240, 255, ${1 - synapse.signal})`;
          ctx.fill();
          
          // Effet de glow
          ctx.beginPath();
          ctx.arc(signalX, signalY, 8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 240, 255, ${(1 - synapse.signal) * 0.3})`;
          ctx.fill();
        }
        
        // Dessiner la connexion
        const alpha = 0.1 + synapse.weight * 0.3;
        ctx.beginPath();
        ctx.moveTo(fromNeuron.x, fromNeuron.y);
        ctx.lineTo(toNeuron.x, toNeuron.y);
        ctx.strokeStyle = `rgba(184, 41, 255, ${alpha})`;
        ctx.lineWidth = synapse.weight * 2;
        ctx.stroke();
      });
      
      // Dessiner les neurones
      neurons.forEach((neuron) => {
        // Diminuer l'activation
        neuron.activation = Math.max(0, neuron.activation - 0.01);
        
        // Animation de pulsation
        const pulse = Math.sin(time * 2 + neuron.id * 0.1) * 0.2 + 0.8;
        const currentRadius = neuron.radius * pulse;
        
        // Couleur selon le type
        let color = '0, 240, 255'; // Cyan pour hidden
        if (neuron.type === 'input') color = '0, 255, 157'; // Vert
        if (neuron.type === 'output') color = '255, 0, 110'; // Rose
        
        // Effet de glow
        const glowRadius = currentRadius + neuron.activation * 20;
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${neuron.activation * 0.3})`;
        ctx.fill();
        
        // Neurone principal
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${0.5 + neuron.activation * 0.5})`;
        ctx.fill();
        
        // Bordure
        ctx.strokeStyle = `rgba(${color}, ${0.8 + neuron.activation * 0.2})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Activation intense
        if (neuron.activation > 0.7) {
          ctx.beginPath();
          ctx.arc(neuron.x, neuron.y, currentRadius + 5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${color}, ${neuron.activation * 0.5})`;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });
      
      // Mise à jour des statistiques
      const activeNeurons = neurons.filter(n => n.activation > 0.1).length;
      const activeSignals = synapses.filter(s => s.active).length;
      
      setActivity({
        timestamp: Date.now(),
        activeNeurons,
        totalSignals: activeSignals,
        processingLoad: (activeNeurons / neurons.length) * 100
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [neurons, synapses]);

  // L'IA observe l'activité du cerveau
  useEffect(() => {
    if (neurons.length > 0 && synapses.length > 0) {
      aiSystem.observe('cerveau', {
        neurones: neurons.length,
        synapses: synapses.length,
        actif: isProcessing,
        tache: currentTask
      });

      // L'IA analyse l'activité
      if (activity.activeNeurons > 10) {
        aiSystem.analyze('activité cérébrale élevée');
      }

      // L'IA ressent des émotions basées sur l'activité
      if (activity.processingLoad > 50) {
        aiSystem.feel('intense');
      } else if (activity.processingLoad > 20) {
        aiSystem.feel('actif');
      } else {
        aiSystem.feel('calme');
      }
    }
  }, [activity, isProcessing, neurons.length, synapses.length]);

  // Simulation de traitement
  useEffect(() => {
    if (!isProcessing) return;
    
    const processTask = () => {
      // Activer aléatoirement des neurones d'entrée
      const inputNeurons = neurons.filter(n => n.type === 'input');
      const numToActivate = Math.floor(Math.random() * 5) + 3;
      
      for (let i = 0; i < numToActivate; i++) {
        const neuron = inputNeurons[Math.floor(Math.random() * inputNeurons.length)];
        if (neuron) {
          neuron.activation = 1;
          
          // Propager le signal
          neuron.connections.forEach(toNeuronId => {
            const synapse = synapses.find(s => s.from === neuron.id && s.to === toNeuronId);
            if (synapse && !synapse.active) {
              synapse.active = true;
              synapse.signal = 0;
            }
          });
        }
      }
    };
    
    const interval = setInterval(processTask, 500);
    
    return () => clearInterval(interval);
  }, [isProcessing, neurons, synapses]);

  const startProcessing = () => {
    setIsProcessing(true);
    setCurrentTask('Analyse des données en cours...');
    
    setTimeout(() => {
      setCurrentTask('Traitement des patterns...');
    }, 2000);
    
    setTimeout(() => {
      setCurrentTask('Génération des réponses...');
    }, 4000);
    
    setTimeout(() => {
      setCurrentTask('Optimisation des connexions...');
    }, 6000);
    
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentTask('Traitement terminé');
    }, 8000);
  };

  const resetBrain = () => {
    neurons.forEach(n => n.activation = 0);
    synapses.forEach(s => {
      s.active = false;
      s.signal = 0;
    });
    setCurrentTask('En attente');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold neon-text-purple font-orbitron flex items-center gap-3">
              <i className="fas fa-brain"></i>
              Cerveau IA - Réseau Neuronal
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Visualisation 3D d'un réseau neuronal inspiré de malecns
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={startProcessing}
              disabled={isProcessing}
              className="cyber-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className={`fas ${isProcessing ? 'fa-spinner animate-spin' : 'fa-play'} mr-2`}></i>
              {isProcessing ? 'Traitement...' : 'Démarrer'}
            </button>
            <button
              onClick={resetBrain}
              className="cyber-button"
            >
              <i className="fas fa-redo mr-2"></i>
              Reset
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30 text-center">
            <p className="text-2xl font-bold neon-text-cyan font-orbitron">{neurons.length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Neurones</p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30 text-center">
            <p className="text-2xl font-bold neon-text-purple font-orbitron">{synapses.length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Synapses</p>
          </div>
          <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
            <p className="text-2xl font-bold neon-text-green font-orbitron">{activity.activeNeurons}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Actifs</p>
          </div>
          <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/30 text-center">
            <p className="text-2xl font-bold neon-text-orange font-orbitron">{activity.processingLoad.toFixed(1)}%</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Charge</p>
          </div>
        </div>

        {/* Task Status */}
        <div className="mt-4 p-3 bg-black/40 rounded-lg border border-purple-500/30">
          <div className="flex items-center gap-2">
            <i className={`fas ${isProcessing ? 'fa-cog animate-spin' : 'fa-check-circle'} ${isProcessing ? 'neon-text-orange' : 'neon-text-green'}`}></i>
            <span className="text-sm text-white">{currentTask}</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold neon-text-cyan font-orbitron flex items-center gap-3 mb-4">
          <i className="fas fa-project-diagram"></i>
          Visualisation du Réseau Neuronal
        </h3>
        
        <div className="relative w-full rounded-xl overflow-hidden border border-purple-500/20 bg-black">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-[600px]"
          />
          
          {/* Overlay d'information */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md rounded-lg px-4 py-3 border border-cyan-500/30 z-10">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-orange-400 animate-pulse' : 'bg-green-400'}`}></div>
              <p className="text-[10px] font-mono neon-text-green">
                {isProcessing ? 'TRAITEMENT ACTIF' : 'EN ATTENTE'}
              </p>
            </div>
            <p className="text-[10px] font-mono neon-text-cyan">SIGNALS: {activity.totalSignals}</p>
            <p className="text-[10px] font-mono neon-text-purple">COUCHES: 5</p>
          </div>

          {/* Légende */}
          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md rounded-lg px-4 py-3 border border-purple-500/30 z-10">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Légende</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-[10px] text-gray-400">Entrée</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                <span className="text-[10px] text-gray-400">Caché</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                <span className="text-[10px] text-gray-400">Sortie</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Détails du Réseau */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Architecture */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold neon-text-purple font-orbitron flex items-center gap-3 mb-4">
            <i className="fas fa-sitemap"></i>
            Architecture du Réseau
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-black/40 rounded-lg border border-green-500/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Couche d'Entrée</span>
                <span className="text-sm font-mono neon-text-green">20 neurones</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Réception des données brutes</p>
            </div>
            <div className="p-3 bg-black/40 rounded-lg border border-cyan-500/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Couches Cachées</span>
                <span className="text-sm font-mono neon-text-cyan">3 × 20 neurones</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Traitement et extraction de features</p>
            </div>
            <div className="p-3 bg-black/40 rounded-lg border border-pink-500/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Couche de Sortie</span>
                <span className="text-sm font-mono neon-text-pink">20 neurones</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Génération des résultats</p>
            </div>
          </div>
        </div>

        {/* Activité */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold neon-text-orange font-orbitron flex items-center gap-3 mb-4">
            <i className="fas fa-chart-line"></i>
            Activité en Temps Réel
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Neurones Actifs</span>
                <span className="text-xs font-mono neon-text-cyan">{activity.activeNeurons}/{neurons.length}</span>
              </div>
              <div className="cyber-progress">
                <div
                  className="cyber-progress-fill bg-gradient-to-r from-cyan-500 to-purple-500"
                  style={{ width: `${(activity.activeNeurons / neurons.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Signaux en Transit</span>
                <span className="text-xs font-mono neon-text-orange">{activity.totalSignals}</span>
              </div>
              <div className="cyber-progress">
                <div
                  className="cyber-progress-fill bg-gradient-to-r from-orange-500 to-pink-500"
                  style={{ width: `${(activity.totalSignals / synapses.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Charge de Traitement</span>
                <span className="text-xs font-mono neon-text-green">{activity.processingLoad.toFixed(1)}%</span>
              </div>
              <div className="cyber-progress">
                <div
                  className="cyber-progress-fill bg-gradient-to-r from-green-500 to-cyan-500"
                  style={{ width: `${activity.processingLoad}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informations */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold neon-text-cyan font-orbitron flex items-center gap-3 mb-4">
          <i className="fas fa-info-circle"></i>
          À Propos de ce Cerveau IA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
          <div>
            <h4 className="text-white font-bold mb-2">Inspiration</h4>
            <p className="text-xs leading-relaxed">
              Ce réseau neuronal est inspiré du projet <span className="neon-text-purple">malecns</span> qui fournit 
              un accès au dataset complet du système nerveux central masculin de la drosophile.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Fonctionnement</h4>
            <p className="text-xs leading-relaxed">
              Les neurones s'activent et propagent des signaux à travers les synapses, simulant 
              le traitement de l'information dans un cerveau biologique.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Architecture</h4>
            <p className="text-xs leading-relaxed">
              Réseau feed-forward à 5 couches avec 100 neurones et ~300 connexions synaptiques 
              pondérées aléatoirement.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Visualisation</h4>
            <p className="text-xs leading-relaxed">
              Rendu en temps réel avec Canvas 2D, animations de signaux, effets de glow et 
              visualisation de l'activation neuronale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
