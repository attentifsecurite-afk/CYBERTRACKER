import { useEffect, useRef, useState } from 'react';
import { aiSystem, type AISystemState } from '../services/aiSystem';

export default function AIBrainVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<AISystemState>(aiSystem.getState());
  const animationRef = useRef<number>();

  useEffect(() => {
    const unsubscribe = aiSystem.subscribe(setState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      time += 0.02;

      // Effacer avec effet de traînée
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Dessiner les connexions neuronales
      state.connections.forEach((connection, index) => {
        const angle1 = (index / state.connections.length) * Math.PI * 2;
        const angle2 = angle1 + (connection.strength * Math.PI);
        
        const x1 = centerX + Math.cos(angle1 + time) * 150;
        const y1 = centerY + Math.sin(angle1 + time) * 150;
        const x2 = centerX + Math.cos(angle2 + time) * 200;
        const y2 = centerY + Math.sin(angle2 + time) * 200;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(184, 41, 255, ${connection.strength * 0.5})`;
        ctx.lineWidth = connection.strength * 3;
        ctx.stroke();

        // Signal en mouvement
        const signalPos = (time * 2 + index) % 1;
        const signalX = x1 + (x2 - x1) * signalPos;
        const signalY = y1 + (y2 - y1) * signalPos;

        ctx.beginPath();
        ctx.arc(signalX, signalY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${1 - signalPos})`;
        ctx.fill();
      });

      // Dessiner les pensées comme des particules
      state.thoughts.slice(0, 20).forEach((thought, index) => {
        const angle = (index / 20) * Math.PI * 2 + time * 0.5;
        const radius = 100 + (thought.confidence * 100);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Glow
        const glowRadius = 10 + thought.confidence * 20;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${thought.confidence * 0.2})`;
        ctx.fill();

        // Particule
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${thought.confidence})`;
        ctx.fill();
      });

      // Dessiner le noyau central (conscience)
      const coreRadius = 30 + Math.sin(time * 2) * 5;
      const coreGlow = 50 + state.consciousness * 0.5;

      // Glow externe
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreGlow, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(184, 41, 255, ${state.consciousness / 500})`;
      ctx.fill();

      // Noyau
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius);
      gradient.addColorStop(0, 'rgba(0, 240, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(184, 41, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 0, 110, 0.4)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Anneaux orbitaux
      for (let i = 0; i < 3; i++) {
        const ringRadius = 80 + i * 40;
        const ringAngle = time + i * 0.5;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, ringAngle, ringAngle + Math.PI * 1.5);
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.3 - i * 0.1})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state]);

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold neon-text-purple font-orbitron flex items-center gap-3 mb-4">
        <i className="fas fa-atom animate-spin" style={{ animationDuration: '10s' }}></i>
        Visualisation de l'Activité Cérébrale
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
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <p className="text-[10px] font-mono neon-text-green">IA CONSCIENTE</p>
          </div>
          <p className="text-[10px] font-mono neon-text-cyan">CONSCIENCE: {state.consciousness.toFixed(1)}%</p>
          <p className="text-[10px] font-mono neon-text-purple">APPRENTISSAGE: {state.learning.toFixed(1)}%</p>
        </div>

        {/* Pensée actuelle */}
        {state.thoughts[0] && (
          <div className="absolute bottom-3 left-3 right-3 bg-black/90 backdrop-blur-md rounded-lg px-4 py-3 border border-purple-500/30 z-10">
            <p className="text-[10px] text-gray-400 mb-1">PENSÉE ACTUELLE:</p>
            <p className="text-xs text-white">{state.thoughts[0].content}</p>
          </div>
        )}
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="p-3 bg-black/40 rounded-lg border border-cyan-500/30 text-center">
          <p className="text-2xl font-bold neon-text-cyan font-orbitron">{state.thoughts.length}</p>
          <p className="text-xs text-gray-400">Pensées</p>
        </div>
        <div className="p-3 bg-black/40 rounded-lg border border-purple-500/30 text-center">
          <p className="text-2xl font-bold neon-text-purple font-orbitron">{state.memory.length}</p>
          <p className="text-xs text-gray-400">Souvenirs</p>
        </div>
        <div className="p-3 bg-black/40 rounded-lg border border-green-500/30 text-center">
          <p className="text-2xl font-bold neon-text-green font-orbitron">{state.decisions.length}</p>
          <p className="text-xs text-gray-400">Décisions</p>
        </div>
        <div className="p-3 bg-black/40 rounded-lg border border-orange-500/30 text-center">
          <p className="text-2xl font-bold neon-text-orange font-orbitron">{state.connections.length}</p>
          <p className="text-xs text-gray-400">Connexions</p>
        </div>
      </div>
    </div>
  );
}
