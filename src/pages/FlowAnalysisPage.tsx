import { useState, useEffect, useRef } from 'react';
import { FlowMonitor, analyzeFlowThreat, type NetworkFlow, type FlowAnomaly, type FlowProfile } from '../services/flowTestService';

export default function FlowAnalysisPage() {
  const [flows, setFlows] = useState<NetworkFlow[]>([]);
  const [anomalies, setAnomalies] = useState<FlowAnomaly[]>([]);
  const [profile, setProfile] = useState<FlowProfile | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<NetworkFlow | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [viewMode, setViewMode] = useState<'flows' | 'anomalies' | 'profile'>('flows');
  const monitorRef = useRef<FlowMonitor | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isMonitoring) {
      monitorRef.current = new FlowMonitor();
      monitorRef.current.start((newFlows, newAnomalies) => {
        setFlows(newFlows);
        setAnomalies(newAnomalies);
        
        // Update profile
        const totalBytes = newFlows.reduce((sum, f) => sum + f.bytesSent + f.bytesReceived, 0);
        const avgDuration = newFlows.reduce((sum, f) => sum + f.duration, 0) / newFlows.length;
        
        const protocolCounts: Record<string, number> = {};
        newFlows.forEach(f => {
          protocolCounts[f.protocol] = (protocolCounts[f.protocol] || 0) + 1;
        });

        const topProtocols = Object.entries(protocolCounts)
          .map(([protocol, count]) => ({
            protocol,
            count,
            percentage: (count / newFlows.length) * 100
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setProfile({
          id: 'current',
          name: 'Real-time Network Profile',
          totalFlows: newFlows.length,
          totalBytes,
          avgFlowDuration: avgDuration,
          topProtocols,
          topPorts: [],
          suspiciousFlows: newFlows.filter(f => f.riskLevel !== 'low').length,
          timestamp: new Date()
        });
      });
    } else {
      if (monitorRef.current) {
        monitorRef.current.stop();
        monitorRef.current = null;
      }
    }

    return () => {
      if (monitorRef.current) {
        monitorRef.current.stop();
      }
    };
  }, [isMonitoring]);

  // Animate flow visualization
  useEffect(() => {
    if (!canvasRef.current || flows.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Draw flows as animated particles
    flows.slice(0, 50).forEach((flow, index) => {
      const x = (index / 50) * width;
      const y = height / 2 + Math.sin(Date.now() / 1000 + index) * 50;
      
      const color = flow.riskLevel === 'critical' ? '#ff006e' :
                   flow.riskLevel === 'high' ? '#ff6b00' :
                   flow.riskLevel === 'medium' ? '#ffcc00' : '#00ff9d';

      // Draw particle
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Draw glow
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = color + '40';
      ctx.fill();

      // Draw connection line
      if (index > 0) {
        const prevX = ((index - 1) / 50) * width;
        const prevY = height / 2 + Math.sin(Date.now() / 1000 + index - 1) * 50;
        
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = color + '60';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Animate
    const animationId = requestAnimationFrame(() => {
      if (canvasRef.current) {
        const event = new Event('animate');
        canvasRef.current.dispatchEvent(event);
      }
    });

    return () => cancelAnimationFrame(animationId);
  }, [flows]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return '#ff006e';
      case 'high': return '#ff6b00';
      case 'medium': return '#ffcc00';
      default: return '#00ff9d';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-pink-500/20 text-pink-400 border-pink-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-green-500/20 text-green-400 border-green-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold neon-text-cyan font-orbitron flex items-center gap-3">
              <i className="fas fa-project-diagram"></i>
              Flow Analysis - NetFlow/IPFIX Monitoring
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Real-time network flow analysis inspired by CESNET FlowTest
            </p>
          </div>
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`cyber-button ${isMonitoring ? 'bg-red-500/20 border-red-500/50' : ''}`}
          >
            <i className={`fas ${isMonitoring ? 'fa-stop' : 'fa-play'} mr-2`}></i>
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>

        {/* Stats */}
        {profile && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30 text-center">
              <p className="text-2xl font-bold neon-text-cyan font-orbitron">{profile.totalFlows}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Total Flows</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30 text-center">
              <p className="text-2xl font-bold neon-text-purple font-orbitron">
                {(profile.totalBytes / 1024 / 1024).toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">MB Transferred</p>
            </div>
            <div className="p-3 bg-pink-500/10 rounded-lg border border-pink-500/30 text-center">
              <p className="text-2xl font-bold neon-text-pink font-orbitron">{profile.suspiciousFlows}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Suspicious Flows</p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/30 text-center">
              <p className="text-2xl font-bold neon-text-orange font-orbitron">{anomalies.length}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Anomalies</p>
            </div>
          </div>
        )}
      </div>

      {/* Flow Visualization */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold neon-text-cyan font-orbitron flex items-center gap-3 mb-4">
          <i className="fas fa-chart-line"></i>
          Real-time Flow Visualization
        </h3>
        <canvas
          ref={canvasRef}
          width={1200}
          height={300}
          className="w-full h-[300px] bg-black/40 rounded-lg border border-cyan-500/20"
        />
        <div className="flex gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff006e]"></div>
            <span className="text-gray-400">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff6b00]"></div>
            <span className="text-gray-400">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ffcc00]"></div>
            <span className="text-gray-400">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00ff9d]"></div>
            <span className="text-gray-400">Low</span>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="glass-card p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('flows')}
            className={`cyber-tab flex-1 ${viewMode === 'flows' ? 'active' : ''}`}
          >
            <i className="fas fa-stream mr-2"></i>
            Network Flows ({flows.length})
          </button>
          <button
            onClick={() => setViewMode('anomalies')}
            className={`cyber-tab flex-1 ${viewMode === 'anomalies' ? 'active' : ''}`}
          >
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Anomalies ({anomalies.length})
          </button>
          <button
            onClick={() => setViewMode('profile')}
            className={`cyber-tab flex-1 ${viewMode === 'profile' ? 'active' : ''}`}
          >
            <i className="fas fa-chart-pie mr-2"></i>
            Network Profile
          </button>
        </div>
      </div>

      {/* Flows View */}
      {viewMode === 'flows' && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold neon-text-cyan font-orbitron flex items-center gap-3 mb-4">
            <i className="fas fa-stream"></i>
            Network Flows
          </h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {flows.slice(0, 50).map((flow) => {
              const analysis = analyzeFlowThreat(flow);
              
              return (
                <div
                  key={flow.id}
                  onClick={() => setSelectedFlow(flow)}
                  className="p-3 bg-black/40 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer"
                  style={{ borderLeft: `3px solid ${getRiskColor(flow.riskLevel)}` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono text-white">{flow.protocol}</span>
                        <span className="text-xs text-gray-400">
                          {flow.srcIP}:{flow.srcPort} → {flow.dstIP}:{flow.dstPort}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${getSeverityColor(flow.riskLevel)}`}>
                          {flow.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-gray-500">
                        <span>
                          <i className="fas fa-arrow-up mr-1 text-green-400"></i>
                          {(flow.bytesSent / 1024).toFixed(2)} KB
                        </span>
                        <span>
                          <i className="fas fa-arrow-down mr-1 text-blue-400"></i>
                          {(flow.bytesReceived / 1024).toFixed(2)} KB
                        </span>
                        <span>
                          <i className="fas fa-clock mr-1"></i>
                          {(flow.duration / 1000).toFixed(2)}s
                        </span>
                        {flow.country && (
                          <span>
                            <i className="fas fa-globe mr-1"></i>
                            {flow.city}, {flow.country}
                          </span>
                        )}
                      </div>
                      {analysis.isThreat && (
                        <div className="mt-1 text-[10px] text-pink-400">
                          <i className="fas fa-exclamation-triangle mr-1"></i>
                          {analysis.threatType} (Confidence: {analysis.confidence}%)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Anomalies View */}
      {viewMode === 'anomalies' && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold neon-text-pink font-orbitron flex items-center gap-3 mb-4">
            <i className="fas fa-exclamation-triangle"></i>
            Detected Anomalies
          </h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {anomalies.map((anomaly) => (
              <div
                key={anomaly.id}
                className="p-4 bg-black/40 rounded-lg border border-pink-500/30"
                style={{ borderLeft: `3px solid ${getRiskColor(anomaly.severity)}` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase">{anomaly.type.replace('_', ' ')}</h4>
                    <p className="text-xs text-gray-400 mt-1">{anomaly.description}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded font-mono ${getSeverityColor(anomaly.severity)}`}>
                    {anomaly.severity.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-gray-500 mt-2">
                  {anomaly.srcIP && (
                    <span>
                      <i className="fas fa-network-wired mr-1"></i>
                      Source: {anomaly.srcIP}
                    </span>
                  )}
                  {anomaly.dstIP && (
                    <span>
                      <i className="fas fa-bullseye mr-1"></i>
                      Target: {anomaly.dstIP}
                    </span>
                  )}
                  <span>
                    <i className="fas fa-link mr-1"></i>
                    {anomaly.affectedFlows.length} affected flows
                  </span>
                  <span>
                    <i className="fas fa-clock mr-1"></i>
                    {anomaly.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile View */}
      {viewMode === 'profile' && profile && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold neon-text-purple font-orbitron flex items-center gap-3 mb-4">
            <i className="fas fa-chart-pie"></i>
            Network Profile
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Protocol Distribution */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3">Top Protocols</h4>
              <div className="space-y-2">
                {profile.topProtocols.map((proto) => (
                  <div key={proto.protocol} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-16">{proto.protocol}</span>
                    <div className="flex-1 h-6 bg-gray-800 rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-end pr-2"
                        style={{ width: `${proto.percentage}%` }}
                      >
                        <span className="text-[10px] font-mono text-white">{proto.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 w-12 text-right">{proto.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3">Statistics</h4>
              <div className="space-y-3">
                <div className="p-3 bg-black/40 rounded-lg">
                  <p className="text-xs text-gray-400">Average Flow Duration</p>
                  <p className="text-lg font-bold neon-text-cyan font-orbitron">
                    {(profile.avgFlowDuration / 1000).toFixed(2)}s
                  </p>
                </div>
                <div className="p-3 bg-black/40 rounded-lg">
                  <p className="text-xs text-gray-400">Total Data Transferred</p>
                  <p className="text-lg font-bold neon-text-purple font-orbitron">
                    {(profile.totalBytes / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="p-3 bg-black/40 rounded-lg">
                  <p className="text-xs text-gray-400">Suspicious Flow Rate</p>
                  <p className="text-lg font-bold neon-text-pink font-orbitron">
                    {((profile.suspiciousFlows / profile.totalFlows) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flow Details Modal */}
      {selectedFlow && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold neon-text-cyan font-orbitron">
                Flow Details
              </h3>
              <button
                onClick={() => setSelectedFlow(null)}
                className="text-gray-400 hover:text-white"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Source</p>
                  <p className="text-sm font-mono text-white">{selectedFlow.srcIP}:{selectedFlow.srcPort}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Destination</p>
                  <p className="text-sm font-mono text-white">{selectedFlow.dstIP}:{selectedFlow.dstPort}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Protocol</p>
                  <p className="text-sm text-white">{selectedFlow.protocol}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Direction</p>
                  <p className="text-sm text-white capitalize">{selectedFlow.flowDirection}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Bytes Sent</p>
                  <p className="text-sm text-green-400 font-mono">{(selectedFlow.bytesSent / 1024).toFixed(2)} KB</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Bytes Received</p>
                  <p className="text-sm text-blue-400 font-mono">{(selectedFlow.bytesReceived / 1024).toFixed(2)} KB</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Packets Sent</p>
                  <p className="text-sm text-white font-mono">{selectedFlow.packetsSent}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Packets Received</p>
                  <p className="text-sm text-white font-mono">{selectedFlow.packetsReceived}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="text-sm text-white font-mono">{(selectedFlow.duration / 1000).toFixed(2)}s</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Risk Level</p>
                  <p className="text-sm font-mono" style={{ color: getRiskColor(selectedFlow.riskLevel) }}>
                    {selectedFlow.riskLevel.toUpperCase()}
                  </p>
                </div>
              </div>

              {selectedFlow.country && (
                <div className="p-3 bg-black/40 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Location</p>
                  <p className="text-sm text-white">
                    <i className="fas fa-globe mr-2"></i>
                    {selectedFlow.city}, {selectedFlow.country}
                  </p>
                  {selectedFlow.asn && (
                    <p className="text-xs text-gray-400 mt-1">ASN: {selectedFlow.asn}</p>
                  )}
                </div>
              )}

              {selectedFlow.threatType && (
                <div className="p-3 bg-pink-500/10 rounded-lg border border-pink-500/30">
                  <p className="text-xs text-pink-400 mb-1">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    Threat Detected
                  </p>
                  <p className="text-sm text-white">{selectedFlow.threatType}</p>
                </div>
              )}

              {(() => {
                const analysis = analyzeFlowThreat(selectedFlow);
                if (analysis.isThreat) {
                  return (
                    <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                      <p className="text-xs text-orange-400 mb-2">
                        <i className="fas fa-shield-alt mr-1"></i>
                        Threat Analysis (Confidence: {analysis.confidence}%)
                      </p>
                      <p className="text-sm text-white mb-2">{analysis.threatType}</p>
                      {analysis.recommendations.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Recommendations:</p>
                          <ul className="list-disc list-inside text-xs text-gray-300">
                            {analysis.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
