/**
 * @fileoverview Data models for the Enhanced Project Deployment system
 * Defines all data structures used across the deployment features
 */

/**
 * @typedef {Object} Project
 * @property {number} id - Unique project identifier
 * @property {string} name - Project name
 * @property {string} description - Project description
 * @property {string} type - Project type
 * @property {'active' | 'inactive'} status - Project status
 * @property {string} ghost - Associated ghost/theme
 */

/**
 * @typedef {Object} DockerConfig
 * @property {string} imageName - Docker image name
 * @property {string} dockerfilePath - Path to Dockerfile
 * @property {string} buildArgs - Build arguments
 * @property {string} registry - Docker registry URL
 * @property {string} tag - Image tag
 */

/**
 * @typedef {Object} KubernetesConfig
 * @property {string} clusterName - Kubernetes cluster name
 * @property {string} namespace - Kubernetes namespace
 * @property {number} replicas - Number of replicas
 * @property {string} cpuLimit - CPU limit (e.g., "500m")
 * @property {string} memoryLimit - Memory limit (e.g., "512Mi")
 * @property {boolean} autoScaling - Enable auto-scaling
 * @property {number} minReplicas - Minimum replicas for auto-scaling
 * @property {number} maxReplicas - Maximum replicas for auto-scaling
 */

/**
 * @typedef {Object} GCPConfig
 * @property {string} projectId - GCP project ID
 * @property {string} clusterName - GKE cluster name
 * @property {string} region - GCP region
 * @property {number} nodeCount - Number of nodes
 * @property {string} machineType - Machine type (e.g., "n1-standard-1")
 */

/**
 * @typedef {Object} AWSConfig
 * @property {string} region - AWS region
 * @property {string} clusterName - EKS cluster name
 * @property {'ECS' | 'EKS' | 'Lambda'} serviceType - AWS service type
 * @property {string} instanceType - EC2 instance type
 * @property {string} vpcId - VPC ID
 */

/**
 * @typedef {Object} VercelConfig
 * @property {string} projectName - Vercel project name
 * @property {string} framework - Framework preset
 * @property {string} buildCommand - Build command
 * @property {string} outputDirectory - Output directory
 * @property {Array<{key: string, value: string}>} environmentVariables - Environment variables
 */

/**
 * @typedef {Object} RenderConfig
 * @property {'web' | 'worker' | 'cron'} serviceType - Render service type
 * @property {string} instanceType - Instance type
 * @property {string} buildCommand - Build command
 * @property {string} startCommand - Start command
 * @property {string} region - Render region
 * @property {Array<{key: string, value: string}>} environmentVariables - Environment variables
 */

/**
 * @typedef {Object} DataDogConfig
 * @property {string} apiKey - DataDog API key
 * @property {string} appKey - DataDog application key
 * @property {string} site - DataDog site (e.g., "datadoghq.com")
 * @property {'DEBUG' | 'INFO' | 'WARN' | 'ERROR'} logLevel - Log level
 * @property {string[]} tags - Tags for filtering
 */

/**
 * @typedef {Object} Deployment
 * @property {string} id - Unique deployment identifier
 * @property {number} projectId - Associated project ID
 * @property {string} projectName - Project name
 * @property {string} platform - Deployment platform
 * @property {'pending' | 'building' | 'deploying' | 'success' | 'failed'} status - Deployment status
 * @property {string} commitHash - Git commit hash
 * @property {string} branch - Git branch name
 * @property {Date} timestamp - Deployment timestamp
 * @property {number} duration - Total duration in seconds
 * @property {string | null} url - Deployed application URL
 * @property {string} logs - Deployment logs
 * @property {number} buildTime - Build time in seconds
 * @property {number} deployTime - Deploy time in seconds
 */

/**
 * @typedef {Object} MonitoringMetrics
 * @property {number} cpuUsage - CPU usage percentage (0-100)
 * @property {number} memoryUsage - Memory usage percentage (0-100)
 * @property {number} requestRate - Requests per minute
 * @property {number} errorCount - Total error count
 * @property {number} errorRate - Error rate percentage (0-100)
 * @property {number} uptime - Uptime percentage (0-100)
 * @property {number} responseTime - Average response time in milliseconds
 * @property {number} activeConnections - Number of active connections
 * @property {number} throughput - Throughput in requests per second
 * @property {Date} timestamp - Metrics timestamp
 * @property {MetricsHistory} history - Historical metrics data
 */

/**
 * @typedef {Object} MetricsHistory
 * @property {Date[]} timestamps - Array of timestamps
 * @property {number[]} cpu - CPU usage history
 * @property {number[]} memory - Memory usage history
 * @property {number[]} requests - Request rate history
 */

/**
 * @typedef {Object} Alert
 * @property {string} id - Unique alert identifier
 * @property {'error' | 'warning' | 'info'} type - Alert type
 * @property {string} message - Alert message
 * @property {Date} timestamp - Alert timestamp
 * @property {boolean} resolved - Whether alert is resolved
 * @property {'critical' | 'high' | 'medium' | 'low'} severity - Alert severity
 */

/**
 * @typedef {Object} DeploymentConfigurations
 * @property {DockerConfig} docker - Docker configuration
 * @property {KubernetesConfig} kubernetes - Kubernetes configuration
 * @property {GCPConfig} gcp - GCP configuration
 * @property {AWSConfig} aws - AWS configuration
 * @property {VercelConfig} vercel - Vercel configuration
 * @property {RenderConfig} render - Render configuration
 * @property {DataDogConfig} datadog - DataDog configuration
 */

// Default configurations
export const defaultDockerConfig = {
  imageName: '',
  dockerfilePath: './Dockerfile',
  buildArgs: '',
  registry: '',
  tag: 'latest'
};

export const defaultKubernetesConfig = {
  clusterName: '',
  namespace: 'default',
  replicas: 3,
  cpuLimit: '500m',
  memoryLimit: '512Mi',
  autoScaling: false,
  minReplicas: 2,
  maxReplicas: 10
};

export const defaultGCPConfig = {
  projectId: '',
  clusterName: '',
  region: 'us-central1',
  nodeCount: 3,
  machineType: 'n1-standard-1'
};

export const defaultAWSConfig = {
  region: 'us-east-1',
  clusterName: '',
  serviceType: 'EKS',
  instanceType: 't3.medium',
  vpcId: ''
};

export const defaultVercelConfig = {
  projectName: '',
  framework: 'react',
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  environmentVariables: []
};

export const defaultRenderConfig = {
  serviceType: 'web',
  instanceType: 'starter',
  buildCommand: 'npm install && npm run build',
  startCommand: 'npm start',
  region: 'oregon',
  environmentVariables: []
};

export const defaultDataDogConfig = {
  apiKey: '',
  appKey: '',
  site: 'datadoghq.com',
  logLevel: 'INFO',
  tags: []
};
