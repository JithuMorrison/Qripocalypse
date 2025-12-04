/**
 * @fileoverview Simulation utilities for Docker builds, cloud deployments, and metrics generation
 * All operations are simulated without actual external connections
 */

/**
 * Generates a random delay with variation
 * @param {number} baseMs - Base delay in milliseconds
 * @param {number} variation - Variation percentage (0-1)
 * @returns {number} Randomized delay
 */
const randomDelay = (baseMs, variation = 0.2) => {
  const variance = baseMs * variation;
  return baseMs + (Math.random() * variance * 2 - variance);
};

/**
 * Generates a random commit hash
 * @returns {string} 7-character commit hash
 */
const generateCommitHash = () => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Simulates Docker build process with realistic logs
 * @param {Object} config - Docker configuration
 * @param {Function} onLog - Callback for log updates
 * @returns {Promise<{success: boolean, imageTag: string, duration: number}>}
 */
export const simulateDockerBuild = async (config, onLog) => {
  const startTime = Date.now();
  const { imageName, tag } = config;
  const imageTag = `${imageName}:${tag}`;
  
  onLog('🔮 Starting Docker build...\n');
  await new Promise(resolve => setTimeout(resolve, randomDelay(1000)));
  
  onLog(`📦 Building image: ${imageTag}\n`);
  await new Promise(resolve => setTimeout(resolve, randomDelay(1000)));
  
  onLog('🐳 Pulling base image...\n');
  onLog('  ✓ Using cached layer\n');
  await new Promise(resolve => setTimeout(resolve, randomDelay(1000)));
  
  onLog('📥 Installing dependencies...\n');
  onLog('  ✓ npm install completed\n');
  await new Promise(resolve => setTimeout(resolve, randomDelay(1500)));
  
  onLog('🔨 Building application...\n');
  onLog('  ✓ Build artifacts generated\n');
  await new Promise(resolve => setTimeout(resolve, randomDelay(1000)));
  
  onLog(`🏷️  Tagging image: ${imageTag}\n`);
  await new Promise(resolve => setTimeout(resolve, randomDelay(500)));
  
  const duration = Math.round((Date.now() - startTime) / 1000);
  onLog(`✅ Docker image built successfully in ${duration}s!\n`);
  onLog(`📦 Image: ${imageTag}\n`);
  
  return {
    success: true,
    imageTag,
    duration
  };
};

/**
 * Simulates cloud deployment with platform-specific logs
 * @param {string} platform - Deployment platform (gcp, aws, vercel, render)
 * @param {Object} config - Platform configuration
 * @param {Function} onLog - Callback for log updates
 * @returns {Promise<{success: boolean, url: string, duration: number, buildTime: number, deployTime: number}>}
 */
export const simulateCloudDeployment = async (platform, config, onLog) => {
  const startTime = Date.now();
  const buildStartTime = Date.now();
  
  // 10% chance of failure for realistic testing
  const willFail = Math.random() < 0.1;
  
  onLog(`🔮 Connecting to ${platform.toUpperCase()}...\n`);
  await new Promise(resolve => setTimeout(resolve, randomDelay(1000)));
  
  onLog('🔐 Authenticating...\n');
  onLog('  ✓ Authentication successful\n');
  await new Promise(resolve => setTimeout(resolve, randomDelay(800)));
  
  onLog('📦 Pushing image to registry...\n');
  onLog('  ✓ Layer 1/3 pushed\n');
  await new Promise(resolve => setTimeout(resolve, randomDelay(1000)));
  onLog('  ✓ Layer 2/3 pushed\n');
  await new Promise(resolve => setTimeout(resolve, randomDelay(1000)));
  onLog('  ✓ Layer 3/3 pushed\n');
  await new Promise(resolve => setTimeout(resolve, randomDelay(1000)));
  
  const buildTime = Math.round((Date.now() - buildStartTime) / 1000);
  const deployStartTime = Date.now();
  
  if (platform === 'gcp' || platform === 'aws') {
    onLog('☸️  Creating/updating Kubernetes resources...\n');
    onLog('  ✓ Deployment created\n');
    await new Promise(resolve => setTimeout(resolve, randomDelay(1500)));
    
    onLog('⏳ Waiting for pods to be ready...\n');
    await new Promise(resolve => setTimeout(resolve, randomDelay(2000)));
    
    if (willFail) {
      onLog('❌ Pod failed to start: ImagePullBackOff\n');
      onLog('  Error: Failed to pull image from registry\n');
      const duration = Math.round((Date.now() - startTime) / 1000);
      return {
        success: false,
        url: null,
        duration,
        buildTime,
        deployTime: Math.round((Date.now() - deployStartTime) / 1000)
      };
    }
    
    onLog('  ✓ 1/3 pods ready\n');
    await new Promise(resolve => setTimeout(resolve, randomDelay(1000)));
    onLog('  ✓ 2/3 pods ready\n');
    await new Promise(resolve => setTimeout(resolve, randomDelay(1000)));
    onLog('  ✓ 3/3 pods ready\n');
    
  } else if (platform === 'vercel') {
    onLog('🔨 Building project...\n');
    await new Promise(resolve => setTimeout(resolve, randomDelay(2000)));
    
    if (willFail) {
      onLog('❌ Build failed: Module not found\n');
      onLog('  Error: Cannot find module \'./missing-file\'\n');
      const duration = Math.round((Date.now() - startTime) / 1000);
      return {
        success: false,
        url: null,
        duration,
        buildTime,
        deployTime: Math.round((Date.now() - deployStartTime) / 1000)
      };
    }
    
    onLog('  ✓ Build completed\n');
    onLog('🚀 Deploying to edge network...\n');
    await new Promise(resolve => setTimeout(resolve, randomDelay(1500)));
    
  } else if (platform === 'render') {
    onLog('🔨 Running build command...\n');
    await new Promise(resolve => setTimeout(resolve, randomDelay(2000)));
    
    if (willFail) {
      onLog('❌ Build failed: Command exited with code 1\n');
      onLog('  Error: npm run build failed\n');
      const duration = Math.round((Date.now() - startTime) / 1000);
      return {
        success: false,
        url: null,
        duration,
        buildTime,
        deployTime: Math.round((Date.now() - deployStartTime) / 1000)
      };
    }
    
    onLog('  ✓ Build completed\n');
    onLog('🚀 Starting service...\n');
    await new Promise(resolve => setTimeout(resolve, randomDelay(1500)));
  }
  
  const deployTime = Math.round((Date.now() - deployStartTime) / 1000);
  const duration = Math.round((Date.now() - startTime) / 1000);
  
  // Generate deployment URL
  const subdomain = `${config.projectName || 'app'}-${generateCommitHash()}`;
  const urls = {
    gcp: `https://${subdomain}.run.app`,
    aws: `https://${subdomain}.execute-api.${config.region || 'us-east-1'}.amazonaws.com`,
    vercel: `https://${subdomain}.vercel.app`,
    render: `https://${subdomain}.onrender.com`
  };
  
  const url = urls[platform] || `https://${subdomain}.example.com`;
  
  onLog(`✅ Successfully deployed to ${platform.toUpperCase()}!\n`);
  onLog(`🌐 Service URL: ${url}\n`);
  onLog(`⏱️  Total time: ${duration}s (build: ${buildTime}s, deploy: ${deployTime}s)\n`);
  
  return {
    success: true,
    url,
    duration,
    buildTime,
    deployTime
  };
};

/**
 * Generates realistic monitoring metrics
 * @returns {Object} Monitoring metrics
 */
export const generateMetrics = () => {
  const cpuUsage = Math.round(15 + Math.random() * 70); // 15-85%
  const memoryUsage = Math.round(30 + Math.random() * 45); // 30-75%
  const requestRate = Math.round(500 + Math.random() * 4500); // 500-5000/min
  const errorCount = Math.floor(Math.random() * 51); // 0-50
  const totalRequests = requestRate;
  const errorRate = totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0;
  const uptime = 95 + Math.random() * 4.99; // 95-99.99%
  const responseTime = Math.round(20 + Math.random() * 180); // 20-200ms
  const activeConnections = Math.round(10 + Math.random() * 490); // 10-500
  const throughput = Math.round(requestRate / 60); // requests per second
  
  return {
    cpuUsage,
    memoryUsage,
    requestRate,
    errorCount,
    errorRate: parseFloat(errorRate.toFixed(2)),
    uptime: parseFloat(uptime.toFixed(2)),
    responseTime,
    activeConnections,
    throughput,
    timestamp: new Date(),
    history: {
      timestamps: [],
      cpu: [],
      memory: [],
      requests: []
    }
  };
};

/**
 * Simulates DataDog metrics fetching with enhanced logs
 * @param {Object} config - DataDog configuration
 * @param {Function} onLog - Callback for log updates
 * @returns {Promise<Object>} Monitoring metrics
 */
export const simulateDataDogMetrics = async (config, onLog) => {
  const { logLevel } = config;
  const timestamp = new Date().toISOString();
  
  onLog('🔮 Summoning DataDog spirits...\n');
  await new Promise(resolve => setTimeout(resolve, randomDelay(800)));
  
  onLog(`[${timestamp}] [INFO] Connecting to DataDog API...\n`);
  await new Promise(resolve => setTimeout(resolve, randomDelay(1000)));
  
  onLog(`[${timestamp}] [INFO] Fetching application metrics...\n`);
  await new Promise(resolve => setTimeout(resolve, randomDelay(1200)));
  
  const metrics = generateMetrics();
  
  // Generate enhanced logs based on log level
  const logLevels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
  const levelIndex = logLevels.indexOf(logLevel);
  
  if (levelIndex <= 0) {
    onLog(`[${timestamp}] [DEBUG] Query: avg:system.cpu.user{*}\n`);
    onLog(`[${timestamp}] [DEBUG] Query: avg:system.mem.used{*}\n`);
  }
  
  onLog(`[${timestamp}] [INFO] 📈 CPU Usage: ${metrics.cpuUsage}%\n`);
  onLog(`[${timestamp}] [INFO] 💾 Memory: ${metrics.memoryUsage}%\n`);
  onLog(`[${timestamp}] [INFO] 🔥 Requests: ${metrics.requestRate}/min\n`);
  
  if (metrics.errorCount > 20 && levelIndex <= 2) {
    onLog(`[${timestamp}] [WARN] ⚠️  High error count detected: ${metrics.errorCount}\n`);
  }
  
  if (metrics.errorRate > 3 && levelIndex <= 3) {
    onLog(`[${timestamp}] [ERROR] ❌ Error rate above threshold: ${metrics.errorRate}%\n`);
  }
  
  onLog(`[${timestamp}] [INFO] 👻 Errors: ${metrics.errorCount}\n`);
  onLog(`[${timestamp}] [INFO] ✅ Uptime: ${metrics.uptime}%\n`);
  onLog(`[${timestamp}] [INFO] ⚡ Response Time: ${metrics.responseTime}ms\n`);
  onLog(`[${timestamp}] [INFO] 🔗 Active Connections: ${metrics.activeConnections}\n`);
  
  onLog('\n✅ Metrics fetched successfully!\n');
  
  return metrics;
};

/**
 * Generates initial deployment history
 * @param {number} projectId - Project ID
 * @param {string} projectName - Project name
 * @param {number} count - Number of deployments to generate
 * @returns {Array} Array of deployment objects
 */
export const generateDeploymentHistory = (projectId, projectName, count = 10) => {
  const platforms = ['gcp', 'aws', 'vercel', 'render'];
  const branches = ['main', 'develop', 'staging', 'feature/new-ui'];
  const deployments = [];
  
  const now = Date.now();
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
  
  for (let i = 0; i < count; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const success = Math.random() > 0.2; // 80% success rate
    const buildTime = Math.round(30 + Math.random() * 90); // 30-120s
    const deployTime = Math.round(20 + Math.random() * 60); // 20-80s
    const duration = buildTime + deployTime;
    
    // Generate timestamp within last 7 days
    const timestamp = new Date(sevenDaysAgo + Math.random() * (now - sevenDaysAgo));
    
    const deployment = {
      id: `deploy-${Date.now()}-${i}`,
      projectId,
      projectName,
      platform,
      status: success ? 'success' : 'failed',
      commitHash: generateCommitHash(),
      branch,
      timestamp,
      duration,
      url: success ? `https://${projectName}-${generateCommitHash()}.${platform}.app` : null,
      logs: success 
        ? `✅ Deployment successful\n🌐 URL: https://${projectName}.${platform}.app`
        : `❌ Deployment failed\nError: ${['Build failed', 'Connection timeout', 'Resource limit exceeded'][Math.floor(Math.random() * 3)]}`,
      buildTime,
      deployTime
    };
    
    deployments.push(deployment);
  }
  
  // Sort by timestamp descending (most recent first)
  return deployments.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

/**
 * Generates random alerts
 * @param {number} count - Number of alerts to generate
 * @returns {Array} Array of alert objects
 */
export const generateAlerts = (count = 5) => {
  const alertTypes = ['error', 'warning', 'info'];
  const severities = ['critical', 'high', 'medium', 'low'];
  const messages = [
    'High CPU usage detected',
    'Memory usage above 80%',
    'Error rate spike detected',
    'Slow response time',
    'Database connection pool exhausted',
    'API rate limit approaching',
    'Disk space running low',
    'SSL certificate expiring soon'
  ];
  
  const alerts = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    const resolved = Math.random() > 0.4; // 60% resolved
    
    // Generate timestamp within last 24 hours
    const timestamp = new Date(now - Math.random() * (24 * 60 * 60 * 1000));
    
    alerts.push({
      id: `alert-${Date.now()}-${i}`,
      type,
      message,
      timestamp,
      resolved,
      severity
    });
  }
  
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};
