import { useState } from 'react';
import { Clock, CheckCircle, XCircle, Filter, RefreshCw, ExternalLink, GitBranch, Hash } from 'lucide-react';

/**
 * DeploymentPanelTab Component
 * Displays deployment history, timeline, details, and quick stats
 * Implements Requirements: 5.1, 5.2, 5.3, 5.4
 */
const DeploymentPanelTab = ({ 
  deployments, 
  selectedProject,
  onRedeploy 
}) => {
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  // Filter deployments based on selected filters
  const filteredDeployments = deployments.filter(deployment => {
    if (filterStatus !== 'all' && deployment.status !== filterStatus) return false;
    if (filterPlatform !== 'all' && deployment.platform !== filterPlatform) return false;
    
    if (filterDate !== 'all') {
      const deploymentDate = new Date(deployment.timestamp);
      const now = new Date();
      const daysDiff = Math.floor((now - deploymentDate) / (1000 * 60 * 60 * 24));
      
      if (filterDate === 'today' && daysDiff > 0) return false;
      if (filterDate === 'week' && daysDiff > 7) return false;
      if (filterDate === 'month' && daysDiff > 30) return false;
    }
    
    return true;
  });

  // Calculate quick stats
  const totalDeployments = deployments.length;
  const successfulDeployments = deployments.filter(d => d.status === 'success').length;
  const failedDeployments = deployments.filter(d => d.status === 'failed').length;
  const successRate = totalDeployments > 0 
    ? Math.round((successfulDeployments / totalDeployments) * 100) 
    : 0;
  const avgDuration = totalDeployments > 0
    ? Math.round(deployments.reduce((sum, d) => sum + d.duration, 0) / totalDeployments)
    : 0;

  // Get unique platforms for filter
  const platforms = [...new Set(deployments.map(d => d.platform))];

  // Format relative time
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Get status icon and color
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'success':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400' };
      case 'failed':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400' };
      case 'pending':
      case 'building':
      case 'deploying':
        return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400' };
      default:
        return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-400' };
    }
  };

  // Handle redeploy
  const handleRedeploy = (deployment) => {
    if (onRedeploy) {
      onRedeploy(deployment);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats Section */}
      <div className="grid md:grid-cols-5 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-3xl text-purple-400 mb-1">{totalDeployments}</div>
          <div className="text-gray-400 text-sm">Total Deployments</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-3xl text-green-400 mb-1">{successfulDeployments}</div>
          <div className="text-gray-400 text-sm">Successful</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-3xl text-red-400 mb-1">{failedDeployments}</div>
          <div className="text-gray-400 text-sm">Failed</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-3xl text-blue-400 mb-1">{successRate}%</div>
          <div className="text-gray-400 text-sm">Success Rate</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-3xl text-yellow-400 mb-1">{avgDuration}s</div>
          <div className="text-gray-400 text-sm">Avg Duration</div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={20} className="text-purple-400" />
          <h3 className="text-white font-bold">Filters</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-600 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Platform</label>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-600 focus:outline-none"
            >
              <option value="all">All Platforms</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>
                  {platform.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Date Range</label>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-600 focus:outline-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deployment History List */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">
          Deployment History ({filteredDeployments.length})
        </h3>
        
        {filteredDeployments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-white mb-2">No Deployments Found</h3>
            <p className="text-gray-400">
              {deployments.length === 0 
                ? 'No deployments yet. Deploy your first application!'
                : 'No deployments match the selected filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDeployments.slice(0, 10).map(deployment => {
              const statusDisplay = getStatusDisplay(deployment.status);
              const StatusIcon = statusDisplay.icon;
              
              return (
                <div 
                  key={deployment.id}
                  className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
                  onClick={() => setSelectedDeployment(deployment)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <StatusIcon className={`${statusDisplay.color} mt-1`} size={20} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-bold text-lg">
                            {deployment.platform.toUpperCase()}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            deployment.status === 'success' ? 'bg-green-900 text-green-200' :
                            deployment.status === 'failed' ? 'bg-red-900 text-red-200' :
                            'bg-yellow-900 text-yellow-200'
                          }`}>
                            {deployment.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400 text-sm mb-2">
                          <span className="flex items-center gap-1">
                            <GitBranch size={14} />
                            {deployment.branch}
                          </span>
                          <span className="flex items-center gap-1">
                            <Hash size={14} />
                            {deployment.commitHash}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {deployment.duration}s
                          </span>
                        </div>
                        {deployment.url && (
                          <a 
                            href={deployment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={14} />
                            {deployment.url}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-sm mb-2">
                        {formatRelativeTime(deployment.timestamp)}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRedeploy(deployment);
                        }}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                      >
                        <RefreshCw size={14} />
                        Redeploy
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deployment Timeline Visualization */}
      {filteredDeployments.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Deployment Timeline</h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />
            
            {/* Timeline items */}
            <div className="space-y-6">
              {filteredDeployments.slice(0, 10).map((deployment, index) => {
                const statusDisplay = getStatusDisplay(deployment.status);
                
                return (
                  <div key={deployment.id} className="relative pl-12">
                    {/* Timeline dot */}
                    <div className={`absolute left-2.5 top-2 w-3 h-3 rounded-full ${statusDisplay.bg}`} />
                    
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">
                            {deployment.platform.toUpperCase()}
                          </span>
                          <span className="text-gray-400 text-sm">
                            • {new Date(deployment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          deployment.status === 'success' ? 'bg-green-900 text-green-200' :
                          deployment.status === 'failed' ? 'bg-red-900 text-red-200' :
                          'bg-yellow-900 text-yellow-200'
                        }`}>
                          {deployment.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {deployment.branch} • {deployment.commitHash} • {deployment.duration}s
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Deployment Details Modal */}
      {selectedDeployment && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDeployment(null)}
        >
          <div 
            className="bg-gray-900 rounded-xl border-2 border-purple-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Deployment Details</h2>
                <button
                  onClick={() => setSelectedDeployment(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Deployment Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Platform</div>
                    <div className="text-white font-bold text-lg">
                      {selectedDeployment.platform.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Status</div>
                    <span className={`inline-block px-3 py-1 rounded text-sm font-bold ${
                      selectedDeployment.status === 'success' ? 'bg-green-900 text-green-200' :
                      selectedDeployment.status === 'failed' ? 'bg-red-900 text-red-200' :
                      'bg-yellow-900 text-yellow-200'
                    }`}>
                      {selectedDeployment.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Branch</div>
                    <div className="text-white">{selectedDeployment.branch}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Commit Hash</div>
                    <div className="text-white font-mono">{selectedDeployment.commitHash}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Timestamp</div>
                    <div className="text-white">
                      {new Date(selectedDeployment.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Duration</div>
                    <div className="text-white">{selectedDeployment.duration}s</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Build Time</div>
                    <div className="text-white">{selectedDeployment.buildTime}s</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Deploy Time</div>
                    <div className="text-white">{selectedDeployment.deployTime}s</div>
                  </div>
                </div>
              </div>

              {/* URL */}
              {selectedDeployment.url && (
                <div className="mb-6">
                  <div className="text-gray-400 text-sm mb-2">Deployment URL</div>
                  <a 
                    href={selectedDeployment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <ExternalLink size={16} />
                    {selectedDeployment.url}
                  </a>
                </div>
              )}

              {/* Logs */}
              <div>
                <div className="text-gray-400 text-sm mb-2">Deployment Logs</div>
                <pre className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg max-h-96 overflow-y-auto whitespace-pre-wrap">
                  {selectedDeployment.logs || 'No logs available'}
                </pre>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    handleRedeploy(selectedDeployment);
                    setSelectedDeployment(null);
                  }}
                  className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <RefreshCw size={16} />
                  Redeploy
                </button>
                <button
                  onClick={() => setSelectedDeployment(null)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentPanelTab;
