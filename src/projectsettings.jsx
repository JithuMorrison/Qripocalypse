import { useState, useEffect, useCallback } from 'react';
import { 
  Terminal, 
  Download, Play, Copy, 
  Package
} from 'lucide-react';
import ProjectSelector from './components/ProjectSelector';
import CloudPlatformsTab from './components/CloudPlatformsTab';
import DataDogSpiritsTab from './components/DataDogSpiritsTab';
import DeploymentPanelTab from './components/DeploymentPanelTab';
import MonitoringPanelTab from './components/MonitoringPanelTab';
import { 
  loadSelectedProject, 
  saveSelectedProject,
  loadConfigurations,
  saveConfigurations,
  loadDeployments,
  saveDeployments,
  loadMetrics,
  saveMetrics,
  loadAlerts,
  saveAlerts
} from './utils/storageHelpers';
import { 
  generateDeploymentHistory,
  generateAlerts,
  generateMetrics
} from './utils/simulationUtils';
import {
  defaultDockerConfig,
  defaultKubernetesConfig,
  defaultGCPConfig,
  defaultAWSConfig,
  defaultVercelConfig,
  defaultRenderConfig,
  defaultDataDogConfig
} from './models/deploymentModels';
import { useProjects } from './components/projectContext';

const ProjectSettings = () => {
  const { projectsList } = useProjects();
  
  // Main state management
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('docker');
  const [selectedPlatform, setSelectedPlatform] = useState('gcp');
  
  // Configuration state
  const [configurations, setConfigurations] = useState({
    docker: { ...defaultDockerConfig },
    kubernetes: { ...defaultKubernetesConfig },
    gcp: { ...defaultGCPConfig },
    aws: { ...defaultAWSConfig },
    vercel: { ...defaultVercelConfig },
    render: { ...defaultRenderConfig },
    datadog: { ...defaultDataDogConfig }
  });
  
  // Deployment and monitoring state
  const [deployments, setDeployments] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  
  // Logs state
  const [logs, setLogs] = useState({
    docker: '',
    deployment: '',
    datadog: ''
  });
  
  // Simulation state
  const [simulationState, setSimulationState] = useState({
    isBuilding: false,
    isDeploying: false,
    isFetchingMetrics: false
  });

  // Load selected project from localStorage on mount
  useEffect(() => {
    const savedProjectId = loadSelectedProject();
    if (savedProjectId && projectsList.length > 0) {
      const project = projectsList.find(p => p.id === savedProjectId);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [projectsList]);

  // Load project-specific data when project changes
  useEffect(() => {
    if (!selectedProject) return;

    // Load configurations
    const savedConfigs = loadConfigurations(selectedProject.id);
    if (savedConfigs) {
      setConfigurations(savedConfigs);
    } else {
      // Reset to defaults for new project
      setConfigurations({
        docker: { ...defaultDockerConfig },
        kubernetes: { ...defaultKubernetesConfig },
        gcp: { ...defaultGCPConfig },
        aws: { ...defaultAWSConfig },
        vercel: { ...defaultVercelConfig },
        render: { ...defaultRenderConfig },
        datadog: { ...defaultDataDogConfig }
      });
    }

    // Load deployments or generate initial history
    const savedDeployments = loadDeployments(selectedProject.id);
    if (savedDeployments.length > 0) {
      setDeployments(savedDeployments);
    } else {
      // Generate initial deployment history for new project
      const initialDeployments = generateDeploymentHistory(
        selectedProject.id,
        selectedProject.name,
        10
      );
      setDeployments(initialDeployments);
      saveDeployments(selectedProject.id, initialDeployments);
    }

    // Load metrics or generate initial metrics
    const savedMetrics = loadMetrics(selectedProject.id);
    if (savedMetrics) {
      setMetrics(savedMetrics);
    } else {
      const initialMetrics = generateMetrics();
      setMetrics(initialMetrics);
      saveMetrics(selectedProject.id, initialMetrics);
    }

    // Load alerts or generate initial alerts
    const savedAlerts = loadAlerts(selectedProject.id);
    if (savedAlerts.length > 0) {
      setAlerts(savedAlerts);
    } else {
      const initialAlerts = generateAlerts(5);
      setAlerts(initialAlerts);
      saveAlerts(selectedProject.id, initialAlerts);
    }

    // Clear logs when switching projects
    setLogs({
      docker: '',
      deployment: '',
      datadog: ''
    });
  }, [selectedProject]);

  // Auto-save configurations with debounce
  useEffect(() => {
    if (!selectedProject) return;

    const timeoutId = setTimeout(() => {
      saveConfigurations(selectedProject.id, configurations);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [selectedProject, configurations]);

  // Save deployments when they change
  useEffect(() => {
    if (!selectedProject || deployments.length === 0) return;
    saveDeployments(selectedProject.id, deployments);
  }, [selectedProject, deployments]);

  // Save metrics when they change
  useEffect(() => {
    if (!selectedProject || !metrics) return;
    saveMetrics(selectedProject.id, metrics);
  }, [selectedProject, metrics]);

  // Save alerts when they change
  useEffect(() => {
    if (!selectedProject || alerts.length === 0) return;
    saveAlerts(selectedProject.id, alerts);
  }, [selectedProject, alerts]);

  const handleProjectChange = useCallback((project) => {
    setSelectedProject(project);
    saveSelectedProject(project.id);
  }, []);

  const tabs = [
    { id: 'docker', name: 'Docker Ritual', icon: '🐳' },
    { id: 'cloud', name: 'Cloud Platforms', icon: '☁️' },
    { id: 'datadog', name: 'DataDog Spirits', icon: '📊' },
    { id: 'deployment', name: 'Deployment Panel', icon: '🚀' },
    { id: 'monitoring', name: 'Monitoring Panel', icon: '👁️' }
  ];

  const handleDockerConfigChange = useCallback((field, value) => {
    setConfigurations(prev => ({
      ...prev,
      docker: {
        ...prev.docker,
        [field]: value
      }
    }));
  }, []);

  const buildDockerImage = async () => {
    if (!selectedProject) return;
    
    setSimulationState(prev => ({ ...prev, isBuilding: true }));
    setLogs(prev => ({ ...prev, docker: '' }));
    
    try {
      const { simulateDockerBuild } = await import('./utils/simulationUtils');
      
      const result = await simulateDockerBuild(
        configurations.docker,
        (logMessage) => {
          setLogs(prev => ({ ...prev, docker: prev.docker + logMessage }));
        }
      );
      
      if (result.success) {
        // Update docker config with the built image tag
        setConfigurations(prev => ({
          ...prev,
          docker: {
            ...prev.docker,
            tag: result.imageTag.split(':')[1] || 'latest'
          }
        }));
      }
    } catch (error) {
      setLogs(prev => ({ 
        ...prev, 
        docker: prev.docker + `❌ Build failed: ${error.message}\n` 
      }));
    } finally {
      setSimulationState(prev => ({ ...prev, isBuilding: false }));
    }
  };

  const downloadDockerImage = async () => {
    if (!selectedProject || !configurations.docker.imageName) return;
    
    setSimulationState(prev => ({ ...prev, isBuilding: true }));
    
    const imageTag = `${configurations.docker.imageName}:${configurations.docker.tag}`;
    setLogs(prev => ({ ...prev, docker: prev.docker + `\n🔮 Downloading image: ${imageTag}...\n` }));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLogs(prev => ({ ...prev, docker: prev.docker + '📥 Pulling layers...\n' }));
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLogs(prev => ({ ...prev, docker: prev.docker + '  ✓ Layer 1/3 downloaded\n' }));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLogs(prev => ({ ...prev, docker: prev.docker + '  ✓ Layer 2/3 downloaded\n' }));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLogs(prev => ({ ...prev, docker: prev.docker + '  ✓ Layer 3/3 downloaded\n' }));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setLogs(prev => ({ 
      ...prev, 
      docker: prev.docker + `✅ Image downloaded successfully: ${imageTag}\n` 
    }));
    
    setSimulationState(prev => ({ ...prev, isBuilding: false }));
  };

  const pushToRegistry = async () => {
    if (!selectedProject || !configurations.docker.imageName || !configurations.docker.registry) {
      setLogs(prev => ({ 
        ...prev, 
        docker: prev.docker + '\n❌ Error: Image name and registry are required\n' 
      }));
      return;
    }
    
    setSimulationState(prev => ({ ...prev, isBuilding: true }));
    
    const imageTag = `${configurations.docker.imageName}:${configurations.docker.tag}`;
    const registryUrl = `${configurations.docker.registry}/${imageTag}`;
    
    setLogs(prev => ({ ...prev, docker: prev.docker + `\n🔮 Pushing to registry: ${registryUrl}...\n` }));
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setLogs(prev => ({ ...prev, docker: prev.docker + '🔐 Authenticating with registry...\n' }));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLogs(prev => ({ ...prev, docker: prev.docker + '  ✓ Authentication successful\n' }));
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLogs(prev => ({ ...prev, docker: prev.docker + '📤 Pushing layers...\n' }));
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLogs(prev => ({ ...prev, docker: prev.docker + '  ✓ Layer 1/3 pushed\n' }));
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLogs(prev => ({ ...prev, docker: prev.docker + '  ✓ Layer 2/3 pushed\n' }));
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLogs(prev => ({ ...prev, docker: prev.docker + '  ✓ Layer 3/3 pushed\n' }));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setLogs(prev => ({ 
      ...prev, 
      docker: prev.docker + `✅ Image pushed successfully to ${registryUrl}\n` 
    }));
    
    setSimulationState(prev => ({ ...prev, isBuilding: false }));
  };

  const handleKubernetesConfigChange = useCallback((field, value) => {
    setConfigurations(prev => ({
      ...prev,
      kubernetes: {
        ...prev.kubernetes,
        [field]: value
      }
    }));
  }, []);

  const handlePlatformConfigChange = useCallback((platform, field, value) => {
    setConfigurations(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));
  }, []);

  const handleEnvVarChange = useCallback((platform, index, field, value) => {
    setConfigurations(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        environmentVariables: prev[platform].environmentVariables.map((envVar, i) => 
          i === index ? { ...envVar, [field]: value } : envVar
        )
      }
    }));
  }, []);

  const addEnvVar = useCallback((platform) => {
    setConfigurations(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        environmentVariables: [...prev[platform].environmentVariables, { key: '', value: '' }]
      }
    }));
  }, []);

  const removeEnvVar = useCallback((platform, index) => {
    setConfigurations(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        environmentVariables: prev[platform].environmentVariables.filter((_, i) => i !== index)
      }
    }));
  }, []);

  const deployToCloud = async () => {
    if (!selectedProject) return;
    
    setSimulationState(prev => ({ ...prev, isDeploying: true }));
    setLogs(prev => ({ ...prev, deployment: '' }));
    
    try {
      const { simulateCloudDeployment } = await import('./utils/simulationUtils');
      
      const platformConfig = {
        ...configurations[selectedPlatform],
        projectName: selectedProject.name
      };
      
      const result = await simulateCloudDeployment(
        selectedPlatform,
        platformConfig,
        (logMessage) => {
          setLogs(prev => ({ ...prev, deployment: prev.deployment + logMessage }));
        }
      );
      
      if (result.success) {
        // Add deployment to history
        const newDeployment = {
          id: `deploy-${Date.now()}`,
          projectId: selectedProject.id,
          projectName: selectedProject.name,
          platform: selectedPlatform,
          status: 'success',
          commitHash: Math.random().toString(36).substring(2, 9),
          branch: 'main',
          timestamp: new Date(),
          duration: result.duration,
          url: result.url,
          logs: logs.deployment,
          buildTime: result.buildTime,
          deployTime: result.deployTime
        };
        
        setDeployments(prev => [newDeployment, ...prev].slice(0, 50));
      } else {
        // Add failed deployment to history
        const newDeployment = {
          id: `deploy-${Date.now()}`,
          projectId: selectedProject.id,
          projectName: selectedProject.name,
          platform: selectedPlatform,
          status: 'failed',
          commitHash: Math.random().toString(36).substring(2, 9),
          branch: 'main',
          timestamp: new Date(),
          duration: result.duration,
          url: null,
          logs: logs.deployment,
          buildTime: result.buildTime,
          deployTime: result.deployTime
        };
        
        setDeployments(prev => [newDeployment, ...prev].slice(0, 50));
      }
    } catch (error) {
      setLogs(prev => ({ 
        ...prev, 
        deployment: prev.deployment + `❌ Deployment failed: ${error.message}\n` 
      }));
    } finally {
      setSimulationState(prev => ({ ...prev, isDeploying: false }));
    }
  };

  const handleDataDogConfigChange = useCallback((field, value) => {
    setConfigurations(prev => ({
      ...prev,
      datadog: {
        ...prev.datadog,
        [field]: value
      }
    }));
  }, []);

  const fetchDataDogMetrics = async () => {
    if (!selectedProject) return;
    
    setSimulationState(prev => ({ ...prev, isFetchingMetrics: true }));
    setLogs(prev => ({ ...prev, datadog: '' }));
    
    try {
      const { simulateDataDogMetrics } = await import('./utils/simulationUtils');
      
      const newMetrics = await simulateDataDogMetrics(
        configurations.datadog,
        (logMessage) => {
          setLogs(prev => ({ ...prev, datadog: prev.datadog + logMessage }));
        }
      );
      
      setMetrics(newMetrics);
      saveMetrics(selectedProject.id, newMetrics);
    } catch (error) {
      setLogs(prev => ({ 
        ...prev, 
        datadog: prev.datadog + `❌ Failed to fetch metrics: ${error.message}\n` 
      }));
    } finally {
      setSimulationState(prev => ({ ...prev, isFetchingMetrics: false }));
    }
  };

  const refreshMonitoringMetrics = async () => {
    if (!selectedProject) return;
    
    try {
      const { generateMetrics } = await import('./utils/simulationUtils');
      const newMetrics = generateMetrics();
      setMetrics(newMetrics);
      saveMetrics(selectedProject.id, newMetrics);
    } catch (error) {
      console.error('Failed to refresh metrics:', error);
    }
  };

  const renderTabContent = () => {
    // Show message if no project is selected
    if (!selectedProject) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👻</div>
          <h3 className="text-2xl font-bold text-white mb-2">No Project Selected</h3>
          <p className="text-gray-400">Please select a project from the dropdown above to configure deployment settings.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'docker':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Package size={24} />
                  Docker Configuration
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Image Name *</label>
                    <input 
                      type="text" 
                      value={configurations.docker.imageName}
                      onChange={(e) => handleDockerConfigChange('imageName', e.target.value)}
                      placeholder="my-app"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
                      disabled={simulationState.isBuilding}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Dockerfile Path</label>
                    <input 
                      type="text" 
                      value={configurations.docker.dockerfilePath}
                      onChange={(e) => handleDockerConfigChange('dockerfilePath', e.target.value)}
                      placeholder="./Dockerfile"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
                      disabled={simulationState.isBuilding}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Registry URL</label>
                    <input 
                      type="text" 
                      value={configurations.docker.registry}
                      onChange={(e) => handleDockerConfigChange('registry', e.target.value)}
                      placeholder="docker.io/username"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
                      disabled={simulationState.isBuilding}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Tag</label>
                    <input 
                      type="text" 
                      value={configurations.docker.tag}
                      onChange={(e) => handleDockerConfigChange('tag', e.target.value)}
                      placeholder="latest"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
                      disabled={simulationState.isBuilding}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Build Args</label>
                    <textarea 
                      value={configurations.docker.buildArgs}
                      onChange={(e) => handleDockerConfigChange('buildArgs', e.target.value)}
                      placeholder="ARG1=value1&#10;ARG2=value2"
                      rows="3"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none resize-none"
                      disabled={simulationState.isBuilding}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Build Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={buildDockerImage}
                    disabled={simulationState.isBuilding || !configurations.docker.imageName}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {simulationState.isBuilding ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Building...
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Build Docker Image
                      </>
                    )}
                  </button>
                  <button 
                    onClick={downloadDockerImage}
                    disabled={simulationState.isBuilding || !configurations.docker.imageName}
                    className="w-full bg-green-900 hover:bg-green-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download size={16} />
                    Download Image
                  </button>
                  <button 
                    onClick={pushToRegistry}
                    disabled={simulationState.isBuilding || !configurations.docker.imageName || !configurations.docker.registry}
                    className="w-full bg-purple-900 hover:bg-purple-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Copy size={16} />
                    Push to Registry
                  </button>
                </div>
                
                {!configurations.docker.imageName && (
                  <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                    <p className="text-yellow-400 text-sm">⚠️ Image name is required</p>
                  </div>
                )}
                
                {configurations.docker.imageName && !configurations.docker.registry && (
                  <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                    <p className="text-blue-400 text-sm">ℹ️ Add registry URL to enable push</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Terminal size={20} />
                Build Logs
                {simulationState.isBuilding && (
                  <span className="text-sm text-gray-400 font-normal ml-2">
                    (Building...)
                  </span>
                )}
              </h3>
              <pre className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg h-64 overflow-y-auto whitespace-pre-wrap">
                {logs.docker || '🐳 Docker logs will appear here...\n\nConfigure your Docker settings above and click "Build Docker Image" to start.'}
              </pre>
            </div>
          </div>
        );

      case 'cloud':
        return (
          <CloudPlatformsTab
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            configurations={configurations}
            handleKubernetesConfigChange={handleKubernetesConfigChange}
            handlePlatformConfigChange={handlePlatformConfigChange}
            handleEnvVarChange={handleEnvVarChange}
            addEnvVar={addEnvVar}
            removeEnvVar={removeEnvVar}
            deployToCloud={deployToCloud}
            logs={logs}
            simulationState={simulationState}
          />
        );

      case 'datadog':
        return (
          <DataDogSpiritsTab
            configuration={configurations.datadog}
            onConfigChange={handleDataDogConfigChange}
            onFetchMetrics={fetchDataDogMetrics}
            logs={logs.datadog}
            metrics={metrics}
            simulationState={simulationState}
          />
        );

      case 'deployment':
        return (
          <DeploymentPanelTab
            deployments={deployments}
            selectedProject={selectedProject}
            onRedeploy={deployToCloud}
          />
        );

      case 'monitoring':
        return (
          <MonitoringPanelTab
            metrics={metrics}
            alerts={alerts}
            onRefresh={refreshMonitoringMetrics}
            selectedProject={selectedProject}
          />
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔮</div>
            <h3 className="text-2xl font-bold text-white mb-2">Coming Soon</h3>
            <p className="text-gray-400">This feature is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-2" style={{ fontFamily: "'Creepster', cursive" }}>
            DARK OPERATIONS
          </h1>
          <p className="text-xl text-purple-400 italic" style={{ fontFamily: "'Eater', cursive" }}>
            DevOps & Deployment Rituals
          </p>
        </div>

        {/* Project Selector */}
        <ProjectSelector 
          selectedProject={selectedProject}
          onProjectChange={handleProjectChange}
        />

        <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-purple-700 rounded-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-700">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-white bg-purple-900/20'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-bold">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
            <div className="text-4xl mb-3">🐳</div>
            <h3 className="text-white font-bold mb-2">Docker Ready</h3>
            <p className="text-gray-400 text-sm">Build and deploy containers</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
            <div className="text-4xl mb-3">☁️</div>
            <h3 className="text-white font-bold mb-2">GCP Connected</h3>
            <p className="text-gray-400 text-sm">Cloud deployment configured</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-white font-bold mb-2">DataDog Live</h3>
            <p className="text-gray-400 text-sm">Real-time monitoring</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-white font-bold mb-2">Auto-Deploy</h3>
            <p className="text-gray-400 text-sm">CI/CD pipelines active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;