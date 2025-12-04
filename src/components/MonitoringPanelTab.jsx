import { useState, useEffect, useCallback } from 'react';
import { Activity, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const MonitoringPanelTab = ({
  metrics,
  alerts,
  onRefresh,
  selectedProject
}) => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval] = useState(5000); // 5 seconds
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [onRefresh]);

  // Auto-refresh metrics
  useEffect(() => {
    if (!autoRefresh || !selectedProject) return;

    const intervalId = setInterval(() => {
      handleRefresh();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, selectedProject, handleRefresh]);

  // Calculate health status based on metrics
  const getHealthStatus = () => {
    if (!metrics) return { status: 'unknown', color: 'gray', icon: '❓' };

    const { cpuUsage, memoryUsage, errorRate, uptime } = metrics;

    // Critical: High CPU/Memory, high error rate, or low uptime
    if (cpuUsage > 85 || memoryUsage > 85 || errorRate > 5 || uptime < 95) {
      return { status: 'down', color: 'red', icon: '🔴', label: 'Critical' };
    }

    // Degraded: Moderate issues
    if (cpuUsage > 70 || memoryUsage > 70 || errorRate > 2 || uptime < 99) {
      return { status: 'degraded', color: 'yellow', icon: '🟡', label: 'Degraded' };
    }

    // Healthy: All systems normal
    return { status: 'healthy', color: 'green', icon: '🟢', label: 'Healthy' };
  };

  // Calculate performance score (0-100)
  const calculatePerformanceScore = () => {
    if (!metrics) return 0;

    const { cpuUsage, memoryUsage, errorRate, uptime, responseTime } = metrics;

    // Scoring factors (weighted)
    const cpuScore = Math.max(0, 100 - cpuUsage); // Lower is better
    const memoryScore = Math.max(0, 100 - memoryUsage); // Lower is better
    const errorScore = Math.max(0, 100 - (errorRate * 20)); // Lower is better
    const uptimeScore = uptime; // Higher is better
    const responseScore = Math.max(0, 100 - (responseTime / 2)); // Lower is better

    // Weighted average
    const score = (
      cpuScore * 0.2 +
      memoryScore * 0.2 +
      errorScore * 0.25 +
      uptimeScore * 0.25 +
      responseScore * 0.1
    );

    return Math.round(score);
  };

  // Get SLA status
  const getSLAStatus = () => {
    if (!metrics) return { met: false, target: 99.9 };
    
    const target = 99.9;
    const met = metrics.uptime >= target;
    
    return { met, target, current: metrics.uptime };
  };

  const healthStatus = getHealthStatus();
  const performanceScore = calculatePerformanceScore();
  const slaStatus = getSLAStatus();

  if (!selectedProject) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👻</div>
        <h3 className="text-2xl font-bold text-white mb-2">No Project Selected</h3>
        <p className="text-gray-400">Please select a project to view monitoring data.</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-2xl font-bold text-white mb-2">No Metrics Available</h3>
        <p className="text-gray-400">Fetch metrics from the DataDog Spirits tab to view monitoring data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Real-Time Monitoring</h2>
          <p className="text-gray-400 text-sm">Project: {selectedProject.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-gray-400">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Auto-refresh</span>
          </label>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Health Status and Performance Score */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Health Status */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity size={20} />
            System Health
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-6xl">{healthStatus.icon}</div>
            <div>
              <div className={`text-3xl font-bold text-${healthStatus.color}-400`}>
                {healthStatus.label}
              </div>
              <div className="text-gray-400 text-sm mt-1">
                All systems {healthStatus.status === 'healthy' ? 'operational' : 
                           healthStatus.status === 'degraded' ? 'experiencing issues' : 
                           'critical'}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Score */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Performance Score</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - performanceScore / 100)}`}
                  className={`${
                    performanceScore >= 80 ? 'text-green-400' :
                    performanceScore >= 60 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{performanceScore}</span>
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-2">Overall system performance</div>
              <div className={`text-lg font-bold ${
                performanceScore >= 80 ? 'text-green-400' :
                performanceScore >= 60 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {performanceScore >= 80 ? 'Excellent' :
                 performanceScore >= 60 ? 'Good' :
                 performanceScore >= 40 ? 'Fair' :
                 'Poor'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Metrics Grid */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Real-Time Metrics</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {/* CPU Usage */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">CPU Usage</span>
              {metrics.cpuUsage > 80 ? (
                <TrendingUp size={16} className="text-red-400" />
              ) : (
                <TrendingDown size={16} className="text-green-400" />
              )}
            </div>
            <div className={`text-3xl font-bold mb-2 ${
              metrics.cpuUsage > 80 ? 'text-red-400' :
              metrics.cpuUsage > 60 ? 'text-yellow-400' :
              'text-blue-400'
            }`}>
              {metrics.cpuUsage}%
            </div>
            <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all ${
                  metrics.cpuUsage > 80 ? 'bg-red-400' :
                  metrics.cpuUsage > 60 ? 'bg-yellow-400' :
                  'bg-blue-400'
                }`}
                style={{ width: `${metrics.cpuUsage}%` }}
              />
            </div>
          </div>

          {/* Memory Usage */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Memory Usage</span>
              {metrics.memoryUsage > 80 ? (
                <TrendingUp size={16} className="text-red-400" />
              ) : (
                <TrendingDown size={16} className="text-green-400" />
              )}
            </div>
            <div className={`text-3xl font-bold mb-2 ${
              metrics.memoryUsage > 80 ? 'text-red-400' :
              metrics.memoryUsage > 60 ? 'text-yellow-400' :
              'text-purple-400'
            }`}>
              {metrics.memoryUsage}%
            </div>
            <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all ${
                  metrics.memoryUsage > 80 ? 'bg-red-400' :
                  metrics.memoryUsage > 60 ? 'bg-yellow-400' :
                  'bg-purple-400'
                }`}
                style={{ width: `${metrics.memoryUsage}%` }}
              />
            </div>
          </div>

          {/* Request Rate */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Request Rate</div>
            <div className="text-3xl text-green-400 font-bold mb-2">{metrics.requestRate}</div>
            <div className="text-gray-500 text-sm">requests/min</div>
          </div>

          {/* Error Rate */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Error Rate</span>
              {metrics.errorRate > 3 ? (
                <AlertTriangle size={16} className="text-red-400" />
              ) : (
                <CheckCircle size={16} className="text-green-400" />
              )}
            </div>
            <div className={`text-3xl font-bold mb-2 ${
              metrics.errorRate > 3 ? 'text-red-400' : 'text-green-400'
            }`}>
              {metrics.errorRate}%
            </div>
            <div className="text-gray-500 text-sm">{metrics.errorCount} errors</div>
          </div>

          {/* Response Time */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Response Time</div>
            <div className={`text-3xl font-bold mb-2 ${
              metrics.responseTime > 150 ? 'text-red-400' :
              metrics.responseTime > 100 ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {metrics.responseTime}ms
            </div>
            <div className="text-gray-500 text-sm">average</div>
          </div>

          {/* Active Connections */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Active Connections</div>
            <div className="text-3xl text-cyan-400 font-bold mb-2">{metrics.activeConnections}</div>
            <div className="text-gray-500 text-sm">connections</div>
          </div>
        </div>
      </div>

      {/* Resource Utilization Gauges */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Resource Utilization</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* CPU Gauge */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">CPU</span>
              <span className="text-white font-bold">{metrics.cpuUsage}%</span>
            </div>
            <div className="relative h-8 bg-gray-900 rounded-full overflow-hidden">
              <div 
                className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                  metrics.cpuUsage > 80 ? 'bg-gradient-to-r from-red-600 to-red-400' :
                  metrics.cpuUsage > 60 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' :
                  'bg-gradient-to-r from-blue-600 to-blue-400'
                }`}
                style={{ width: `${metrics.cpuUsage}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
                {metrics.cpuUsage}%
              </div>
            </div>
          </div>

          {/* Memory Gauge */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Memory</span>
              <span className="text-white font-bold">{metrics.memoryUsage}%</span>
            </div>
            <div className="relative h-8 bg-gray-900 rounded-full overflow-hidden">
              <div 
                className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                  metrics.memoryUsage > 80 ? 'bg-gradient-to-r from-red-600 to-red-400' :
                  metrics.memoryUsage > 60 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' :
                  'bg-gradient-to-r from-purple-600 to-purple-400'
                }`}
                style={{ width: `${metrics.memoryUsage}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
                {metrics.memoryUsage}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Uptime and SLA */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Uptime & SLA</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Uptime */}
          <div>
            <div className="text-gray-400 text-sm mb-2">Current Uptime (24h)</div>
            <div className={`text-4xl font-bold mb-2 ${
              metrics.uptime >= 99.9 ? 'text-green-400' :
              metrics.uptime >= 99 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {metrics.uptime}%
            </div>
            <div className="bg-gray-900 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 rounded-full ${
                  metrics.uptime >= 99.9 ? 'bg-green-400' :
                  metrics.uptime >= 99 ? 'bg-yellow-400' :
                  'bg-red-400'
                }`}
                style={{ width: `${metrics.uptime}%` }}
              />
            </div>
          </div>

          {/* SLA Status */}
          <div>
            <div className="text-gray-400 text-sm mb-2">SLA Target: {slaStatus.target}%</div>
            <div className="flex items-center gap-3 mb-2">
              {slaStatus.met ? (
                <>
                  <CheckCircle size={32} className="text-green-400" />
                  <div>
                    <div className="text-2xl font-bold text-green-400">SLA Met</div>
                    <div className="text-gray-400 text-sm">
                      {(slaStatus.current - slaStatus.target).toFixed(2)}% above target
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <XCircle size={32} className="text-red-400" />
                  <div>
                    <div className="text-2xl font-bold text-red-400">SLA Breach</div>
                    <div className="text-gray-400 text-sm">
                      {(slaStatus.target - slaStatus.current).toFixed(2)}% below target
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Request/Error Rate Trends */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Request & Error Trends</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Request Rate Trend */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400">Request Rate</span>
              <TrendingUp size={20} className="text-green-400" />
            </div>
            <div className="text-3xl text-green-400 font-bold mb-2">
              {metrics.requestRate}
            </div>
            <div className="text-gray-500 text-sm mb-3">requests/min</div>
            <div className="text-gray-400 text-sm">
              Throughput: {metrics.throughput} req/sec
            </div>
          </div>

          {/* Error Rate Trend */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400">Error Rate</span>
              {metrics.errorRate > 3 ? (
                <TrendingUp size={20} className="text-red-400" />
              ) : (
                <TrendingDown size={20} className="text-green-400" />
              )}
            </div>
            <div className={`text-3xl font-bold mb-2 ${
              metrics.errorRate > 3 ? 'text-red-400' : 'text-green-400'
            }`}>
              {metrics.errorRate}%
            </div>
            <div className="text-gray-500 text-sm mb-3">error percentage</div>
            <div className="text-gray-400 text-sm">
              Total errors: {metrics.errorCount}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle size={20} />
          Active Alerts
        </h3>
        <div className="space-y-3">
          {alerts.filter(a => !a.resolved).length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">✅</div>
              <div>No active alerts</div>
              <div className="text-sm mt-1">All systems operating normally</div>
            </div>
          ) : (
            alerts.filter(a => !a.resolved).map(alert => (
              <div 
                key={alert.id}
                className={`bg-gray-900 rounded-lg p-4 border-l-4 ${
                  alert.type === 'error' ? 'border-red-500' :
                  alert.type === 'warning' ? 'border-yellow-500' :
                  'border-blue-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {alert.type === 'error' ? (
                        <XCircle size={16} className="text-red-400" />
                      ) : alert.type === 'warning' ? (
                        <AlertTriangle size={16} className="text-yellow-400" />
                      ) : (
                        <CheckCircle size={16} className="text-blue-400" />
                      )}
                      <span className="text-white font-bold">{alert.message}</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-4 ${
                    alert.severity === 'critical' ? 'bg-red-900 text-red-200' :
                    alert.severity === 'high' ? 'bg-orange-900 text-orange-200' :
                    alert.severity === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-blue-900 text-blue-200'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitoringPanelTab;
