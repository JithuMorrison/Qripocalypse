import { useState, useEffect } from 'react';
import { 
  Settings, Cloud, Database, Terminal, 
  Download, Play, Copy, 
  Package
} from 'lucide-react';
import ProjectSelector from './components/ProjectSelector';
import { loadSelectedProject } from './utils/storageHelpers';
import { useProjects } from './components/projectContext';

const ProjectSettings = () => {
  const { projectsList } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('docker');
  const [dockerLogs, setDockerLogs] = useState('');
  const [gcpLogs, setGcpLogs] = useState('');
  const [datadogLogs, setDatadogLogs] = useState('');

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

  const handleProjectChange = (project) => {
    setSelectedProject(project);
  };

  const tabs = [
    { id: 'docker', name: 'Docker Ritual', icon: '🐳' },
    { id: 'gcp', name: 'Google Cloud', icon: '☁️' },
    { id: 'datadog', name: 'DataDog Spirits', icon: '📊' },
    { id: 'deployment', name: 'Deployment', icon: '🚀' },
    { id: 'monitoring', name: 'Monitoring', icon: '👁️' }
  ];

  const buildDockerImage = () => {
    setDockerLogs('🔮 Starting Docker image build...\n');
    setTimeout(() => {
      setDockerLogs(prev => prev + '🐳 Building haunted image...\n');
      setTimeout(() => {
        setDockerLogs(prev => prev + '✅ Docker image built successfully!\n');
        setTimeout(() => {
          setDockerLogs(prev => prev + '📦 Image tagged: ancient-spells:latest\n');
        }, 1000);
      }, 2000);
    }, 1000);
  };

  const deployToGCP = () => {
    setGcpLogs('🔮 Connecting to Google Cloud...\n');
    setTimeout(() => {
      setGcpLogs(prev => prev + '☁️ Deploying to Google Kubernetes Engine...\n');
      setTimeout(() => {
        setGcpLogs(prev => prev + '✅ Successfully deployed to GKE!\n');
        setTimeout(() => {
          setGcpLogs(prev => prev + '🌐 Service URL: https://ancient-spells-gha7d3gcp.app\n');
        }, 1000);
      }, 2000);
    }, 1000);
  };

  const fetchDatadogLogs = () => {
    setDatadogLogs('🔮 Summoning DataDog spirits...\n');
    setTimeout(() => {
      setDatadogLogs(prev => prev + '📊 Fetching application metrics...\n');
      setTimeout(() => {
        setDatadogLogs(prev => prev + 
          '📈 CPU Usage: 23%\n' +
          '💾 Memory: 45%\n' +
          '🔥 Requests: 1,234/min\n' +
          '👻 Errors: 2\n' +
          '✅ Uptime: 99.9%\n'
        );
      }, 2000);
    }, 1000);
  };

  const renderTabContent = () => {
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
                    <label className="block text-gray-400 mb-2">Image Name</label>
                    <input 
                      type="text" 
                      defaultValue="ancient-spells"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Dockerfile Path</label>
                    <input 
                      type="text" 
                      defaultValue="./Dockerfile"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Build Args</label>
                    <textarea 
                      placeholder="ARG1=value1\nARG2=value2"
                      rows="3"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-600 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Build Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={buildDockerImage}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Play size={16} />
                    Build Docker Image
                  </button>
                  <button className="w-full bg-green-900 hover:bg-green-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Download size={16} />
                    Download Image
                  </button>
                  <button className="w-full bg-purple-900 hover:bg-purple-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Copy size={16} />
                    Push to Registry
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Build Logs</h3>
              <pre className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg h-48 overflow-y-auto">
                {dockerLogs || '🐳 Docker logs will appear here...'}
              </pre>
            </div>
          </div>
        );

      case 'gcp':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Cloud size={24} />
                  GCP Configuration
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Project ID</label>
                    <input 
                      type="text" 
                      defaultValue="ancient-spells-12345"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Cluster Name</label>
                    <input 
                      type="text" 
                      defaultValue="haunted-cluster"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Region</label>
                    <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-600 focus:outline-none">
                      <option>us-central1</option>
                      <option>europe-west1</option>
                      <option>asia-southeast1</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Deployment</h3>
                <div className="space-y-3">
                  <button
                    onClick={deployToGCP}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Play size={16} />
                    Deploy to GKE
                  </button>
                  <button className="w-full bg-green-900 hover:bg-green-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Cloud size={16} />
                    Configure Auto-Scaling
                  </button>
                  <button className="w-full bg-purple-900 hover:bg-purple-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Settings size={16} />
                    Manage Services
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Deployment Logs</h3>
              <pre className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg h-48 overflow-y-auto">
                {gcpLogs || '☁️ GCP deployment logs will appear here...'}
              </pre>
            </div>
          </div>
        );

      case 'datadog':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Database size={24} />
                  DataDog Configuration
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">API Key</label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">App Key</label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Site</label>
                    <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-600 focus:outline-none">
                      <option>datadoghq.com</option>
                      <option>us3.datadoghq.com</option>
                      <option>us5.datadoghq.com</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Monitoring</h3>
                <div className="space-y-3">
                  <button
                    onClick={fetchDatadogLogs}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Database size={16} />
                    Fetch Metrics
                  </button>
                  <button className="w-full bg-green-900 hover:bg-green-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Settings size={16} />
                    Configure Alerts
                  </button>
                  <button className="w-full bg-purple-900 hover:bg-purple-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Terminal size={16} />
                    Live Tail Logs
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">DataDog Metrics</h3>
              <pre className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg h-48 overflow-y-auto">
                {datadogLogs || '📊 DataDog metrics will appear here...'}
              </pre>
            </div>

            {/* Metrics Dashboard Preview */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl text-green-400 mb-1">99.9%</div>
                <div className="text-gray-400 text-sm">Uptime</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl text-blue-400 mb-1">1.2k</div>
                <div className="text-gray-400 text-sm">Requests/Min</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl text-yellow-400 mb-1">45ms</div>
                <div className="text-gray-400 text-sm">Avg Response</div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a tab to configure settings</div>;
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