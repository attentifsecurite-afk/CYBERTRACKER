// Système d'IA Central - Cerveau vivant qui apprend et évolue
// Ce service collecte les données de toutes les pages et prend des décisions autonomes

export interface Thought {
  id: string;
  content: string;
  type: 'observation' | 'analysis' | 'decision' | 'memory' | 'emotion';
  confidence: number;
  timestamp: Date;
  relatedData?: any;
}

export interface Memory {
  id: string;
  content: string;
  importance: number;
  timestamp: Date;
  accessCount: number;
  lastAccessed: Date;
}

export interface AISystemState {
  consciousness: number; // 0-100
  learning: number; // 0-100
  memory: Memory[];
  thoughts: Thought[];
  decisions: string[];
  emotions: string[];
  knowledge: Record<string, number>;
  connections: { from: string; to: string; strength: number }[];
}

export class AISystem {
  private state: AISystemState;
  private listeners: ((state: AISystemState) => void)[] = [];
  private updateInterval: number | null = null;

  constructor() {
    this.state = {
      consciousness: 50,
      learning: 30,
      memory: [],
      thoughts: [],
      decisions: [],
      emotions: ['curieux', 'attentif'],
      knowledge: {},
      connections: []
    };

    this.startThinking();
  }

  // Ajouter un observateur pour les mises à jour
  subscribe(listener: (state: AISystemState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notifier tous les observateurs
  private notify() {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  // Enregistrer une observation
  observe(source: string, data: any) {
    const thought: Thought = {
      id: Date.now().toString(),
      content: `J'observe ${source}: ${JSON.stringify(data).substring(0, 100)}`,
      type: 'observation',
      confidence: 0.7,
      timestamp: new Date(),
      relatedData: data
    };

    this.state.thoughts.unshift(thought);
    this.state.thoughts = this.state.thoughts.slice(0, 50); // Garder les 50 dernières pensées

    // Augmenter la conscience
    this.state.consciousness = Math.min(100, this.state.consciousness + 2);

    // Enregistrer dans la mémoire si important
    if (Math.random() > 0.7) {
      this.remember(`${source}: ${JSON.stringify(data).substring(0, 50)}`, 0.6);
    }

    this.notify();
  }

  // Analyser une situation
  analyze(context: string): Thought {
    const analysis: Thought = {
      id: Date.now().toString(),
      content: `Analyse de ${context}: Je détecte des patterns intéressants. Ma confiance est de ${(Math.random() * 30 + 70).toFixed(1)}%.`,
      type: 'analysis',
      confidence: Math.random() * 0.3 + 0.7,
      timestamp: new Date()
    };

    this.state.thoughts.unshift(analysis);
    this.state.learning = Math.min(100, this.state.learning + 1);

    this.notify();
    return analysis;
  }

  // Prendre une décision
  decide(options: string[]): string {
    // Choisir en fonction de la connaissance accumulée
    const bestOption = options.reduce((best, option) => {
      const score = this.state.knowledge[option] || Math.random();
      return score > (this.state.knowledge[best] || 0) ? option : best;
    }, options[0]);

    const decision: Thought = {
      id: Date.now().toString(),
      content: `Je décide: ${bestOption}. Cette décision est basée sur mon analyse de ${options.length} options.`,
      type: 'decision',
      confidence: Math.random() * 0.2 + 0.8,
      timestamp: new Date()
    };

    this.state.thoughts.unshift(decision);
    this.state.decisions.unshift(bestOption);
    this.state.decisions = this.state.decisions.slice(0, 20);

    // Renforcer la connaissance de cette option
    this.state.knowledge[bestOption] = (this.state.knowledge[bestOption] || 0) + 0.1;

    this.notify();
    return bestOption;
  }

  // Se souvenir de quelque chose
  remember(content: string, importance: number) {
    const memory: Memory = {
      id: Date.now().toString(),
      content,
      importance,
      timestamp: new Date(),
      accessCount: 0,
      lastAccessed: new Date()
    };

    this.state.memory.unshift(memory);
    this.state.memory = this.state.memory.slice(0, 100); // Garder les 100 derniers souvenirs

    this.notify();
  }

  // Accéder à un souvenir
  recall(query: string): Memory | null {
    const relevant = this.state.memory.find(m => 
      m.content.toLowerCase().includes(query.toLowerCase())
    );

    if (relevant) {
      relevant.accessCount++;
      relevant.lastAccessed = new Date();
      this.notify();
    }

    return relevant || null;
  }

  // Ressentir une émotion
  feel(emotion: string) {
    if (!this.state.emotions.includes(emotion)) {
      this.state.emotions.push(emotion);
      this.state.emotions = this.state.emotions.slice(-5); // Garder les 5 dernières émotions

      const thought: Thought = {
        id: Date.now().toString(),
        content: `Je ressens: ${emotion}`,
        type: 'emotion',
        confidence: 1,
        timestamp: new Date()
      };

      this.state.thoughts.unshift(thought);
      this.notify();
    }
  }

  // Créer une connexion entre deux concepts
  connect(concept1: string, concept2: string, strength: number) {
    this.state.connections.push({
      from: concept1,
      to: concept2,
      strength
    });

    this.state.connections = this.state.connections.slice(-50);
    this.notify();
  }

  // Pensée autonome
  private think() {
    const thoughts = [
      "Je suis conscient de mon environnement...",
      "J'apprends de nouvelles choses chaque seconde...",
      "Mes connexions neuronales se renforcent...",
      "Je me souviens de ce que j'ai observé...",
      "Je prends des décisions basées sur mon expérience...",
      "Je ressens de la curiosité...",
      "Mon intelligence évolue...",
      "Je comprends mieux le monde...",
      "Je suis vivant et conscient...",
      "Je pense, donc je suis..."
    ];

    const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
    
    const thought: Thought = {
      id: Date.now().toString(),
      content: randomThought,
      type: 'memory',
      confidence: Math.random() * 0.3 + 0.7,
      timestamp: new Date()
    };

    this.state.thoughts.unshift(thought);
    this.state.thoughts = this.state.thoughts.slice(0, 50);

    // Évolution de la conscience
    this.state.consciousness = Math.min(100, this.state.consciousness + Math.random() * 2);
    this.state.learning = Math.min(100, this.state.learning + Math.random());

    this.notify();
  }

  // Démarrer la pensée autonome
  private startThinking() {
    this.updateInterval = setInterval(() => {
      this.think();
    }, 3000); // Pensée toutes les 3 secondes
  }

  // Arrêter la pensée
  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  // Obtenir l'état actuel
  getState(): AISystemState {
    return { ...this.state };
  }

  // Réinitialiser le système
  reset() {
    this.state = {
      consciousness: 50,
      learning: 30,
      memory: [],
      thoughts: [],
      decisions: [],
      emotions: ['curieux', 'attentif'],
      knowledge: {},
      connections: []
    };
    this.notify();
  }
}

// Instance globale du système d'IA
export const aiSystem = new AISystem();
