// FlowTest Integration Service
// Inspired by https://github.com/CESNET/FlowTest
// NetFlow/IPFIX network flow analysis

export interface NetworkFlow {
  id: string;
  timestamp: Date;
  srcIP: string;
  dstIP: string;
  srcPort: number;
  dstPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'DNS' | 'SSH' | 'FTP';
  bytesSent: number;
  bytesReceived: number;
  packetsSent: number;
  packetsReceived: number;
  duration: number; // in milliseconds
  flowDirection: 'inbound' | 'outbound' | 'internal';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  threatType?: string;
  country?: string;
  city?: string;
  asn?: string;
}

export interface FlowProfile {
  id: string;
  name: string;
  totalFlows: number;
  totalBytes: number;
  avgFlowDuration: number;
  topProtocols: Array<{ protocol: string; count: number; percentage: number }>;
  topPorts: Array<{ port: number; count: number; percentage: number }>;
  suspiciousFlows: number;
  timestamp: Date;
}

export interface FlowAnalysis {
  profile: FlowProfile;
  flows: NetworkFlow[];
  anomalies: FlowAnomaly[];
}

export interface FlowAnomaly {
  id: string;
  type: 'port_scan' | 'ddos' | 'data_exfiltration' | 'brute_force' | 'lateral_movement' | 'c2_communication';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedFlows: string[];
  timestamp: Date;
  srcIP?: string;
  dstIP?: string;
}

// Simulate realistic network flow generation
const PROTOCOLS: NetworkFlow['protocol'][] = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'SSH', 'FTP'];
const THREAT_TYPES = [
  'Port Scan',
  'DDoS Attack',
  'Data Exfiltration',
  'Brute Force',
  'Lateral Movement',
  'C2 Communication',
  'Malware Download',
  'Phishing Attempt'
];

const COUNTRIES = [
  { code: 'US', name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago'] },
  { code: 'RU', name: 'Russia', cities: ['Moscow', 'Saint Petersburg', 'Novosibirsk'] },
  { code: 'CN', name: 'China', cities: ['Beijing', 'Shanghai', 'Shenzhen'] },
  { code: 'DE', name: 'Germany', cities: ['Berlin', 'Munich', 'Hamburg'] },
  { code: 'NL', name: 'Netherlands', cities: ['Amsterdam', 'Rotterdam', 'The Hague'] },
  { code: 'FR', name: 'France', cities: ['Paris', 'Lyon', 'Marseille'] },
  { code: 'GB', name: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham'] },
  { code: 'BR', name: 'Brazil', cities: ['São Paulo', 'Rio de Janeiro', 'Brasília'] },
];

function generateIP(): string {
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

function generatePort(): number {
  const commonPorts = [80, 443, 22, 21, 53, 8080, 3306, 5432, 25, 110, 143, 993, 995, 3389, 5900];
  return Math.random() > 0.7 ? commonPorts[Math.floor(Math.random() * commonPorts.length)] : Math.floor(Math.random() * 65535) + 1;
}

function generateFlow(id: number): NetworkFlow {
  const protocol = PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)];
  const isSuspicious = Math.random() > 0.85;
  const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  const city = country.cities[Math.floor(Math.random() * country.cities.length)];
  
  const flow: NetworkFlow = {
    id: `flow-${id}-${Date.now()}`,
    timestamp: new Date(),
    srcIP: generateIP(),
    dstIP: generateIP(),
    srcPort: generatePort(),
    dstPort: generatePort(),
    protocol,
    bytesSent: Math.floor(Math.random() * 1000000) + 100,
    bytesReceived: Math.floor(Math.random() * 1000000) + 100,
    packetsSent: Math.floor(Math.random() * 1000) + 1,
    packetsReceived: Math.floor(Math.random() * 1000) + 1,
    duration: Math.floor(Math.random() * 60000) + 100,
    flowDirection: Math.random() > 0.5 ? 'inbound' : Math.random() > 0.5 ? 'outbound' : 'internal',
    riskLevel: isSuspicious ? (Math.random() > 0.7 ? 'critical' : Math.random() > 0.5 ? 'high' : 'medium') : 'low',
    country: country.name,
    city: city,
    asn: `AS${Math.floor(Math.random() * 65535)}`
  };

  if (isSuspicious) {
    flow.threatType = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
  }

  return flow;
}

function generateAnomaly(flows: NetworkFlow[]): FlowAnomaly | null {
  const suspiciousFlows = flows.filter(f => f.riskLevel !== 'low');
  if (suspiciousFlows.length === 0) return null;

  const anomalyTypes: FlowAnomaly['type'][] = [
    'port_scan', 'ddos', 'data_exfiltration', 'brute_force', 'lateral_movement', 'c2_communication'
  ];

  const type = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
  const affectedFlows = suspiciousFlows.slice(0, Math.floor(Math.random() * 5) + 1).map(f => f.id);

  const descriptions: Record<FlowAnomaly['type'], string> = {
    port_scan: 'Multiple connection attempts to different ports detected from single source',
    ddos: 'Unusual volume of traffic targeting single destination',
    data_exfiltration: 'Large data transfer to external IP detected',
    brute_force: 'Multiple failed authentication attempts detected',
    lateral_movement: 'Internal network scanning and connection attempts detected',
    c2_communication: 'Suspicious communication pattern matching known C2 protocols'
  };

  return {
    id: `anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    severity: Math.random() > 0.7 ? 'critical' : Math.random() > 0.5 ? 'high' : 'medium',
    description: descriptions[type],
    affectedFlows,
    timestamp: new Date(),
    srcIP: suspiciousFlows[0]?.srcIP,
    dstIP: suspiciousFlows[0]?.dstIP
  };
}

// Generate flow analysis with realistic data
export function generateFlowAnalysis(numFlows: number = 100): FlowAnalysis {
  const flows: NetworkFlow[] = [];
  
  for (let i = 0; i < numFlows; i++) {
    flows.push(generateFlow(i));
  }

  const anomalies: FlowAnomaly[] = [];
  const numAnomalies = Math.floor(Math.random() * 5) + 1;
  
  for (let i = 0; i < numAnomalies; i++) {
    const anomaly = generateAnomaly(flows);
    if (anomaly) {
      anomalies.push(anomaly);
    }
  }

  // Calculate profile
  const totalBytes = flows.reduce((sum, f) => sum + f.bytesSent + f.bytesReceived, 0);
  const avgDuration = flows.reduce((sum, f) => sum + f.duration, 0) / flows.length;
  
  const protocolCounts: Record<string, number> = {};
  flows.forEach(f => {
    protocolCounts[f.protocol] = (protocolCounts[f.protocol] || 0) + 1;
  });

  const topProtocols = Object.entries(protocolCounts)
    .map(([protocol, count]) => ({
      protocol,
      count,
      percentage: (count / flows.length) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const portCounts: Record<number, number> = {};
  flows.forEach(f => {
    portCounts[f.dstPort] = (portCounts[f.dstPort] || 0) + 1;
  });

  const topPorts = Object.entries(portCounts)
    .map(([port, count]) => ({
      port: parseInt(port),
      count,
      percentage: (count / flows.length) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const profile: FlowProfile = {
    id: `profile-${Date.now()}`,
    name: `Network Profile ${new Date().toLocaleString()}`,
    totalFlows: flows.length,
    totalBytes,
    avgFlowDuration: avgDuration,
    topProtocols,
    topPorts,
    suspiciousFlows: flows.filter(f => f.riskLevel !== 'low').length,
    timestamp: new Date()
  };

  return {
    profile,
    flows,
    anomalies
  };
}

// Simulate real-time flow monitoring
export class FlowMonitor {
  private flows: NetworkFlow[] = [];
  private anomalies: FlowAnomaly[] = [];
  private intervalId: number | null = null;
  private onUpdate: ((flows: NetworkFlow[], anomalies: FlowAnomaly[]) => void) | null = null;

  start(updateCallback: (flows: NetworkFlow[], anomalies: FlowAnomaly[]) => void) {
    this.onUpdate = updateCallback;
    
    // Generate initial flows
    const initialAnalysis = generateFlowAnalysis(50);
    this.flows = initialAnalysis.flows;
    this.anomalies = initialAnalysis.anomalies;
    this.onUpdate(this.flows, this.anomalies);

    // Simulate real-time updates
    this.intervalId = setInterval(() => {
      // Add new flows
      const newFlowsCount = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < newFlowsCount; i++) {
        this.flows.unshift(generateFlow(Date.now() + i));
      }

      // Keep only last 200 flows
      this.flows = this.flows.slice(0, 200);

      // Maybe generate new anomaly
      if (Math.random() > 0.7) {
        const anomaly = generateAnomaly(this.flows);
        if (anomaly) {
          this.anomalies.unshift(anomaly);
          this.anomalies = this.anomalies.slice(0, 20);
        }
      }

      this.onUpdate?.(this.flows, this.anomalies);
    }, 2000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getFlows(): NetworkFlow[] {
    return this.flows;
  }

  getAnomalies(): FlowAnomaly[] {
    return this.anomalies;
  }
}

// Analyze flow for threats
export function analyzeFlowThreat(flow: NetworkFlow): {
  isThreat: boolean;
  threatType?: string;
  confidence: number;
  recommendations: string[];
} {
  const recommendations: string[] = [];
  let confidence = 0;
  let threatType: string | undefined;

  // Check for port scan pattern
  if (flow.packetsSent > 100 && flow.bytesSent < 10000) {
    confidence += 30;
    threatType = 'Port Scan';
    recommendations.push('Monitor source IP for further scanning activity');
  }

  // Check for DDoS pattern
  if (flow.bytesSent > 500000 && flow.duration < 5000) {
    confidence += 40;
    threatType = 'DDoS Attack';
    recommendations.push('Consider rate limiting or blocking source IP');
  }

  // Check for data exfiltration
  if (flow.bytesSent > 1000000 && flow.flowDirection === 'outbound') {
    confidence += 35;
    threatType = 'Data Exfiltration';
    recommendations.push('Investigate data being sent and verify destination');
  }

  // Check for brute force
  if (flow.packetsSent > 50 && flow.dstPort === 22 && flow.duration < 10000) {
    confidence += 45;
    threatType = 'Brute Force';
    recommendations.push('Block source IP and review authentication logs');
  }

  // Check for C2 communication
  if (flow.protocol === 'HTTPS' && flow.duration > 30000 && flow.bytesReceived > flow.bytesSent * 2) {
    confidence += 25;
    threatType = 'C2 Communication';
    recommendations.push('Analyze destination IP reputation and traffic patterns');
  }

  return {
    isThreat: confidence > 20,
    threatType,
    confidence: Math.min(confidence, 100),
    recommendations
  };
}
