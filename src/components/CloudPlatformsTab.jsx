import { Cloud, Play, Terminal } from 'lucide-react';

const CloudPlatformsTab = ({
  selectedPlatform,
  setSelectedPlatform,
  configurations,
  handleKubernetesConfigChange,
  handlePlatformConfigChange,
  handleEnvVarChange,
  addEnvVar,
  removeEnvVar,
  deployToCloud,
  logs,
  simulationState
}) => {
  const renderKubernetesConfig = () => {
    // Only show Kubernetes config for GCP and AWS
    if (selectedPlatform !== 'gcp' && selectedPlatform !== 'aws') {
      return null;
    }

    return (
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          ☸️ Kubernetes Configuration
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-2">Cluster Name *</label>
            <input 
              type="text" 
              value={configurations.kubernetes.clusterName}
              onChange={(e) => handleKubernetesConfigChange('clusterName', e.target.value)}
              placeholder="my-cluster"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
              disabled={simulationState.isDeploying}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Namespace</label>
            <input 
              type="text" 
              value={configurations.kubernetes.namespace}
              onChange={(e) => handleKubernetesConfigChange('namespace', e.target.value)}
              placeholder="default"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
              disabled={simulationState.isDeploying}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Replicas</label>
            <input 
              type="number" 
              value={configurations.kubernetes.replicas}
              onChange={(e) => handleKubernetesConfigChange('replicas', parseInt(e.target.value) || 1)}
              min="1"
              max="100"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
              disabled={simulationState.isDeploying}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">CPU Limit</label>
            <input 
              type="text" 
              value={configurations.kubernetes.cpuLimit}
              onChange={(e) => handleKubernetesConfigChange('cpuLimit', e.target.value)}
              placeholder="500m"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
              disabled={simulationState.isDeploying}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Memory Limit</label>
            <input 
              type="text" 
              value={configurations.kubernetes.memoryLimit}
              onChange={(e) => handleKubernetesConfigChange('memoryLimit', e.target.value)}
              placeholder="512Mi"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
              disabled={simulationState.isDeploying}
            />
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="autoScaling"
              checked={configurations.kubernetes.autoScaling}
              onChange={(e) => handleKubernetesConfigChange('autoScaling', e.target.checked)}
              className="w-5 h-5 bg-gray-900 border border-gray-700 rounded focus:ring-purple-600"
              disabled={simulationState.isDeploying}
            />
            <label htmlFor="autoScaling" className="text-gray-400">Enable Auto-Scaling</label>
          </div>
          {configurations.kubernetes.autoScaling && (
            <>
              <div>
                <label className="block text-gray-400 mb-2">Min Replicas</label>
                <input 
                  type="number" 
                  value={configurations.kubernetes.minReplicas}
                  onChange={(e) => handleKubernetesConfigChange('minReplicas', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
                  disabled={simulationState.isDeploying}
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Max Replicas</label>
                <input 
                  type="number" 
                  value={configurations.kubernetes.maxReplicas}
                  onChange={(e) => handleKubernetesConfigChange('maxReplicas', parseInt(e.target.value) || 10)}
                  min="1"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
                  disabled={simulationState.isDeploying}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderGCPConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-400 mb-2">Project ID *</label>
        <input 
          type="text" 
          value={configurations.gcp.projectId}
          onChange={(e) => handlePlatformConfigChange('gcp', 'projectId', e.target.value)}
          placeholder="my-gcp-project"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        />
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Cluster Name *</label>
        <input 
          type="text" 
          value={configurations.gcp.clusterName}
          onChange={(e) => handlePlatformConfigChange('gcp', 'clusterName', e.target.value)}
          placeholder="my-gke-cluster"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        />
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Region</label>
        <select 
          value={configurations.gcp.region}
          onChange={(e) => handlePlatformConfigChange('gcp', 'region', e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        >
          <option value="us-central1">us-central1</option>
          <option value="us-east1">us-east1</option>
          <option value="us-west1">us-west1</option>
          <option value="europe-west1">europe-west1</option>
          <option value="asia-southeast1">asia-southeast1</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Node Count</label>
        <input 
          type="number" 
          value={configurations.gcp.nodeCount}
          onChange={(e) => handlePlatformConfigChange('gcp', 'nodeCount', parseInt(e.target.value) || 3)}
          min="1"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        />
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Machine Type</label>
        <select 
          value={configurations.gcp.machineType}
          onChange={(e) => handlePlatformConfigChange('gcp', 'machineType', e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        >
          <option value="n1-standard-1">n1-standard-1</option>
          <option value="n1-standard-2">n1-standard-2</option>
          <option value="n1-standard-4">n1-standard-4</option>
          <option value="e2-medium">e2-medium</option>
          <option value="e2-standard-2">e2-standard-2</option>
        </select>
      </div>
    </div>
  );

  const renderAWSConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-400 mb-2">Region</label>
        <select 
          value={configurations.aws.region}
          onChange={(e) => handlePlatformConfigChange('aws', 'region', e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        >
          <option value="us-east-1">us-east-1</option>
          <option value="us-west-2">us-west-2</option>
          <option value="eu-west-1">eu-west-1</option>
          <option value="ap-southeast-1">ap-southeast-1</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Cluster Name *</label>
        <input 
          type="text" 
          value={configurations.aws.clusterName}
          onChange={(e) => handlePlatformConfigChange('aws', 'clusterName', e.target.value)}
          placeholder="my-eks-cluster"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        />
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Service Type</label>
        <select 
          value={configurations.aws.serviceType}
          onChange={(e) => handlePlatformConfigChange('aws', 'serviceType', e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        >
          <option value="EKS">EKS (Elastic Kubernetes Service)</option>
          <option value="ECS">ECS (Elastic Container Service)</option>
          <option value="Lambda">Lambda</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Instance Type</label>
        <select 
          value={configurations.aws.instanceType}
          onChange={(e) => handlePlatformConfigChange('aws', 'instanceType', e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        >
          <option value="t3.micro">t3.micro</option>
          <option value="t3.small">t3.small</option>
          <option value="t3.medium">t3.medium</option>
          <option value="t3.large">t3.large</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-400 mb-2">VPC ID</label>
        <input 
          type="text" 
          value={configurations.aws.vpcId}
          onChange={(e) => handlePlatformConfigChange('aws', 'vpcId', e.target.value)}
          placeholder="vpc-xxxxxxxxx"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        />
      </div>
    </div>
  );

  const renderVercelConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-400 mb-2">Project Name *</label>
        <input 
          type="text" 
          value={configurations.vercel.projectName}
          onChange={(e) => handlePlatformConfigChange('vercel', 'projectName', e.target.value)}
          placeholder="my-vercel-project"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        />
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Framework</label>
        <select 
          value={configurations.vercel.framework}
          onChange={(e) => handlePlatformConfigChange('vercel', 'framework', e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        >
          <option value="react">React</option>
          <option value="nextjs">Next.js</option>
          <option value="vue">Vue</option>
          <option value="svelte">Svelte</option>
          <option value="vite">Vite</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Build Command</label>
        <input 
          type="text" 
          value={configurations.vercel.buildCommand}
          onChange={(e) => handlePlatformConfigChange('vercel', 'buildCommand', e.target.value)}
          placeholder="npm run build"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        />
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Output Directory</label>
        <input 
          type="text" 
          value={configurations.vercel.outputDirectory}
          onChange={(e) => handlePlatformConfigChange('vercel', 'outputDirectory', e.target.value)}
          placeholder="dist"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        />
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Environment Variables</label>
        {configurations.vercel.environmentVariables.map((envVar, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input 
              type="text" 
              value={envVar.key}
              onChange={(e) => handleEnvVarChange('vercel', index, 'key', e.target.value)}
              placeholder="KEY"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
              disabled={simulationState.isDeploying}
            />
            <input 
              type="text" 
              value={envVar.value}
              onChange={(e) => handleEnvVarChange('vercel', index, 'value', e.target.value)}
              placeholder="value"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
              disabled={simulationState.isDeploying}
            />
            <button
              onClick={() => removeEnvVar('vercel', index)}
              className="px-3 py-2 bg-red-900 hover:bg-red-800 text-white rounded-lg transition-colors"
              disabled={simulationState.isDeploying}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => addEnvVar('vercel')}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          disabled={simulationState.isDeploying}
        >
          + Add Variable
        </button>
      </div>
    </div>
  );

  const renderRenderConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-400 mb-2">Service Type</label>
        <select 
          value={configurations.render.serviceType}
          onChange={(e) => handlePlatformConfigChange('render', 'serviceType', e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        >
          <option value="web">Web Service</option>
          <option value="worker">Background Worker</option>
          <option value="cron">Cron Job</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Instance Type</label>
        <select 
          value={configurations.render.instanceType}
          onChange={(e) => handlePlatformConfigChange('render', 'instanceType', e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        >
          <option value="starter">Starter (Free)</option>
          <option value="standard">Standard</option>
          <option value="pro">Pro</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Build Command</label>
        <input 
          type="text" 
          value={configurations.render.buildCommand}
          onChange={(e) => handlePlatformConfigChange('render', 'buildCommand', e.target.value)}
          placeholder="npm install && npm run build"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        />
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Start Command</label>
        <input 
          type="text" 
          value={configurations.render.startCommand}
          onChange={(e) => handlePlatformConfigChange('render', 'startCommand', e.target.value)}
          placeholder="npm start"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        />
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Region</label>
        <select 
          value={configurations.render.region}
          onChange={(e) => handlePlatformConfigChange('render', 'region', e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
          disabled={simulationState.isDeploying}
        >
          <option value="oregon">Oregon (US West)</option>
          <option value="ohio">Ohio (US East)</option>
          <option value="frankfurt">Frankfurt (EU)</option>
          <option value="singapore">Singapore (Asia)</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Environment Variables</label>
        {configurations.render.environmentVariables.map((envVar, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input 
              type="text" 
              value={envVar.key}
              onChange={(e) => handleEnvVarChange('render', index, 'key', e.target.value)}
              placeholder="KEY"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
              disabled={simulationState.isDeploying}
            />
            <input 
              type="text" 
              value={envVar.value}
              onChange={(e) => handleEnvVarChange('render', index, 'value', e.target.value)}
              placeholder="value"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
              disabled={simulationState.isDeploying}
            />
            <button
              onClick={() => removeEnvVar('render', index)}
              className="px-3 py-2 bg-red-900 hover:bg-red-800 text-white rounded-lg transition-colors"
              disabled={simulationState.isDeploying}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => addEnvVar('render')}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          disabled={simulationState.isDeploying}
        >
          + Add Variable
        </button>
      </div>
    </div>
  );

  const renderPlatformConfig = () => {
    switch (selectedPlatform) {
      case 'gcp':
        return renderGCPConfig();
      case 'aws':
        return renderAWSConfig();
      case 'vercel':
        return renderVercelConfig();
      case 'render':
        return renderRenderConfig();
      default:
        return null;
    }
  };

  const isDeployDisabled = () => {
    if (simulationState.isDeploying) return true;
    
    switch (selectedPlatform) {
      case 'gcp':
        return !configurations.gcp.projectId || !configurations.gcp.clusterName || !configurations.kubernetes.clusterName;
      case 'aws':
        return !configurations.aws.clusterName || !configurations.kubernetes.clusterName;
      case 'vercel':
        return !configurations.vercel.projectName;
      case 'render':
        return false;
      default:
        return true;
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Selector */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Select Cloud Platform</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['gcp', 'aws', 'vercel', 'render'].map(platform => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              disabled={simulationState.isDeploying}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPlatform === platform
                  ? 'border-purple-500 bg-purple-900/30'
                  : 'border-gray-700 bg-gray-900 hover:border-gray-600'
              } ${simulationState.isDeploying ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-2xl mb-2">
                {platform === 'gcp' && '☁️'}
                {platform === 'aws' && '🔶'}
                {platform === 'vercel' && '▲'}
                {platform === 'render' && '🎨'}
              </div>
              <div className="text-white font-bold uppercase">{platform}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Kubernetes Configuration (for GCP and AWS) */}
      {renderKubernetesConfig()}

      {/* Platform-Specific Configuration and Deployment Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Cloud size={24} />
            {selectedPlatform.toUpperCase()} Configuration
          </h3>
          {renderPlatformConfig()}
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Deployment Actions</h3>
          <div className="space-y-3">
            <button
              onClick={deployToCloud}
              disabled={isDeployDisabled()}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {simulationState.isDeploying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deploying...
                </>
              ) : (
                <>
                  <Play size={16} />
                  Deploy to {selectedPlatform.toUpperCase()}
                </>
              )}
            </button>
            
            {isDeployDisabled() && !simulationState.isDeploying && (
              <div className="p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                <p className="text-yellow-400 text-sm">⚠️ Please fill in required fields</p>
              </div>
            )}
            
            <div className="pt-3 border-t border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Platform Info:</p>
              <div className="space-y-1 text-xs text-gray-500">
                {selectedPlatform === 'gcp' && (
                  <>
                    <p>• Google Kubernetes Engine</p>
                    <p>• Managed Kubernetes service</p>
                    <p>• Auto-scaling & load balancing</p>
                  </>
                )}
                {selectedPlatform === 'aws' && (
                  <>
                    <p>• Amazon Web Services</p>
                    <p>• EKS, ECS, or Lambda</p>
                    <p>• Flexible deployment options</p>
                  </>
                )}
                {selectedPlatform === 'vercel' && (
                  <>
                    <p>• Edge network deployment</p>
                    <p>• Optimized for frontend</p>
                    <p>• Instant rollbacks</p>
                  </>
                )}
                {selectedPlatform === 'render' && (
                  <>
                    <p>• Unified cloud platform</p>
                    <p>• Web services & workers</p>
                    <p>• Free tier available</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Logs */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Terminal size={20} />
          Deployment Logs
          {simulationState.isDeploying && (
            <span className="text-sm text-gray-400 font-normal ml-2">
              (Deploying...)
            </span>
          )}
        </h3>
        <pre className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg h-64 overflow-y-auto whitespace-pre-wrap">
          {logs.deployment || `☁️ Cloud deployment logs will appear here...\n\nConfigure your ${selectedPlatform.toUpperCase()} settings above and click "Deploy" to start.`}
        </pre>
      </div>
    </div>
  );
};

export default CloudPlatformsTab;
