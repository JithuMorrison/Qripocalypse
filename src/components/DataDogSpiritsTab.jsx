import { useState } from 'react';
import { Database, Settings, Terminal, Filter, X } from 'lucide-react';

const DataDogSpiritsTab = ({
  configuration,
  onConfigChange,
  onFetchMetrics,
  logs,
  metrics,
  simulationState
}) => {
  const [logFilter, setLogFilter] = useState('ALL');
  
  const handleConfigChange = (field, value) => {
    onConfigChange(field, value);
  };

  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    handleConfigChange('tags', tagsArray);
  };

  const addTag = (tag) => {
    if (tag && !configuration.tags.includes(tag)) {
      handleConfigChange('tags', [...configuration.tags, tag]);
    }
  };

  const removeTag = (tagToRemove) => {
    handleConfigChange('tags', configuration.tags.filter(tag => tag !== tagToRemove));
  };

  // Filter logs based on selected level
  const getFilteredLogs = () => {
    if (!logs || logFilter === 'ALL') return logs;
    
    const logLines = logs.split('\n');
    return logLines
      .filter(line => line.includes(`[${logFilter}]`))
      .join('\n');
  };

  // Get log line color based on level
  const getLogLineColor = (line) => {
    if (line.includes('[ERROR]')) return 'text-red-400';
    if (line.includes('[WARN]')) return 'text-yellow-400';
    if (line.includes('[INFO]')) return 'text-blue-400';
    if (line.includes('[DEBUG]')) return 'text-gray-400';
    return 'text-green-400';
  };

  // Render logs with color coding
  const renderColoredLogs = () => {
    const filteredLogs = getFilteredLogs();
    if (!filteredLogs) {
      return (
        <div className="text-gray-500">
          📊 DataDog metrics and logs will appear here...
          <br /><br />
          Configure your DataDog settings and click "Fetch Metrics" to start.
        </div>
      );
    }

    const logLines = filteredLogs.split('\n');
    return logLines.map((line, index) => (
      <div key={index} className={getLogLineColor(line)}>
        {line}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Configuration and Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* DataDog Configuration Form */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Database size={24} />
            DataDog Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">API Key *</label>
              <input 
                type="password" 
                value={configuration.apiKey}
                onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
                disabled={simulationState.isFetchingMetrics}
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">App Key *</label>
              <input 
                type="password" 
                value={configuration.appKey}
                onChange={(e) => handleConfigChange('appKey', e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
                disabled={simulationState.isFetchingMetrics}
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Site</label>
              <select 
                value={configuration.site}
                onChange={(e) => handleConfigChange('site', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
                disabled={simulationState.isFetchingMetrics}
              >
                <option value="datadoghq.com">datadoghq.com</option>
                <option value="us3.datadoghq.com">us3.datadoghq.com</option>
                <option value="us5.datadoghq.com">us5.datadoghq.com</option>
                <option value="datadoghq.eu">datadoghq.eu</option>
                <option value="ap1.datadoghq.com">ap1.datadoghq.com</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Log Level</label>
              <select 
                value={configuration.logLevel}
                onChange={(e) => handleConfigChange('logLevel', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
                disabled={simulationState.isFetchingMetrics}
              >
                <option value="DEBUG">DEBUG</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Tags</label>
              <input 
                type="text" 
                value={configuration.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="env:prod, service:api, version:1.0"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
                disabled={simulationState.isFetchingMetrics}
              />
              {configuration.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {configuration.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-100"
                        disabled={simulationState.isFetchingMetrics}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions and Quick Stats */}
        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={onFetchMetrics}
                disabled={simulationState.isFetchingMetrics || !configuration.apiKey || !configuration.appKey}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {simulationState.isFetchingMetrics ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Fetching Metrics...
                  </>
                ) : (
                  <>
                    <Database size={16} />
                    Fetch Metrics
                  </>
                )}
              </button>
              <button 
                className="w-full bg-green-900 hover:bg-green-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                disabled={simulationState.isFetchingMetrics}
              >
                <Settings size={16} />
                Configure Alerts
              </button>
              <button 
                className="w-full bg-purple-900 hover:bg-purple-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                disabled={simulationState.isFetchingMetrics}
              >
                <Terminal size={16} />
                Live Tail Logs
              </button>
            </div>
            
            {(!configuration.apiKey || !configuration.appKey) && (
              <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                <p className="text-yellow-400 text-sm">⚠️ API Key and App Key are required</p>
              </div>
            )}
          </div>

          {/* Metrics Dashboard Preview */}
          {metrics && (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Quick Metrics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-900 rounded-lg p-3 text-center">
                  <div className="text-2xl text-green-400 mb-1">{metrics.uptime}%</div>
                  <div className="text-gray-400 text-xs">Uptime</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 text-center">
                  <div className="text-2xl text-blue-400 mb-1">{metrics.requestRate}</div>
                  <div className="text-gray-400 text-xs">Req/Min</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 text-center">
                  <div className="text-2xl text-yellow-400 mb-1">{metrics.responseTime}ms</div>
                  <div className="text-gray-400 text-xs">Response</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 text-center">
                  <div className={`text-2xl mb-1 ${
                    metrics.errorRate > 3 ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {metrics.errorRate}%
                  </div>
                  <div className="text-gray-400 text-xs">Error Rate</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Logs Display */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal size={20} />
            DataDog Logs
            {simulationState.isFetchingMetrics && (
              <span className="text-sm text-gray-400 font-normal ml-2">
                (Fetching...)
              </span>
            )}
          </h3>
          
          {/* Log Level Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1 text-sm text-white focus:border-blue-600 focus:outline-none"
            >
              <option value="ALL">All Levels</option>
              <option value="DEBUG">DEBUG</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>
          </div>
        </div>
        
        <pre className="bg-black font-mono text-sm p-4 rounded-lg h-64 overflow-y-auto whitespace-pre-wrap">
          {renderColoredLogs()}
        </pre>
      </div>

      {/* Detailed Metrics Dashboard */}
      {metrics && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Detailed Metrics Dashboard</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {/* CPU Usage Gauge */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-2">CPU Usage</div>
              <div className="text-3xl text-blue-400 font-bold mb-2">{metrics.cpuUsage}%</div>
              <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-3 rounded-full transition-all ${
                    metrics.cpuUsage > 80 ? 'bg-red-400' :
                    metrics.cpuUsage > 60 ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`}
                  style={{ width: `${metrics.cpuUsage}%` }}
                />
              </div>
            </div>

            {/* Memory Usage Gauge */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-2">Memory Usage</div>
              <div className="text-3xl text-purple-400 font-bold mb-2">{metrics.memoryUsage}%</div>
              <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-3 rounded-full transition-all ${
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

            {/* Error Count */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-2">Error Count</div>
              <div className={`text-3xl font-bold mb-2 ${
                metrics.errorCount > 20 ? 'text-red-400' : 'text-green-400'
              }`}>
                {metrics.errorCount}
              </div>
              <div className="text-gray-500 text-sm">total errors</div>
            </div>

            {/* Response Time */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-2">Avg Response Time</div>
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

            {/* Throughput */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-2">Throughput</div>
              <div className="text-3xl text-indigo-400 font-bold mb-2">{metrics.throughput}</div>
              <div className="text-gray-500 text-sm">req/sec</div>
            </div>

            {/* Error Rate */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-2">Error Rate</div>
              <div className={`text-3xl font-bold mb-2 ${
                metrics.errorRate > 3 ? 'text-red-400' : 'text-green-400'
              }`}>
                {metrics.errorRate}%
              </div>
              <div className="text-gray-500 text-sm">error percentage</div>
            </div>

            {/* Uptime */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-2">Uptime</div>
              <div className={`text-3xl font-bold mb-2 ${
                metrics.uptime < 99 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {metrics.uptime}%
              </div>
              <div className="text-gray-500 text-sm">last 24h</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataDogSpiritsTab;
