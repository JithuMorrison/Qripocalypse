# QRipocalypse - Haunted Developer Platform 👻

A spooky-themed development platform featuring project management, code editing, and deployment capabilities with a haunted aesthetic.

## Features

- 🧛 **User Authentication** - Register and login with secure password hashing
- 👻 **Project Management** - Create, manage, and organize haunted projects
- 💀 **Code Editor** - In-browser code editor with file management
- 🔮 **Deployment System** - Multi-platform deployment with monitoring (in development)
- 🧟 **Haunted UI** - Dark theme with spooky animations and effects

## Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Storage**: LocalStorage (client-side persistence)
- **Styling**: CSS with custom haunted theme

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── projectContext.jsx    # Project state management
│   ├── ProjectSelector.jsx   # Project dropdown selector with persistence
│   ├── ghostpopup.jsx        # Ghost notification component
│   ├── WatchingGhost.jsx     # Animated ghost component
│   └── ...
├── models/             # Data models and type definitions
│   └── deploymentModels.jsx  # Deployment system data models
├── pages/              # Page components
│   ├── landing.jsx           # Landing page
│   ├── graveyard.jsx         # Project graveyard
│   ├── necrodiff.jsx         # Diff viewer
│   └── ...
├── services/           # Business logic and API services
│   ├── authService.jsx       # Authentication logic
│   └── storageService.jsx    # LocalStorage operations
├── utils/              # Utility functions
│   ├── deploymentUtils.jsx   # Deployment helpers
│   ├── simulationUtils.jsx   # Simulation logic
│   ├── storageHelpers.jsx    # localStorage helpers for deployment configs
│   └── ...
├── styles/             # Global styles
│   └── haunted.css           # Haunted theme styles
├── App.jsx             # Main app component
├── dashboard.jsx       # Project dashboard
├── codeeditor.jsx      # In-browser code editor
└── main.jsx            # App entry point
```

## Key Components

### DeploymentPanelTab Component

A comprehensive deployment history and tracking interface component (`src/components/DeploymentPanelTab.jsx`) that provides deployment visualization and management:

**Features:**

- Quick stats dashboard showing total deployments, success/failure counts, success rate, and average duration
- Advanced filtering system by status (success/failed/pending), platform (GCP/AWS/Vercel/Render), and date range (today/week/month/all time)
- Deployment history list showing last 10 deployments with:
  - Status icons and color-coded badges
  - Platform, branch, commit hash, and duration information
  - Deployment URLs for successful deployments
  - Relative timestamps (e.g., "2 hours ago")
  - One-click redeploy functionality
- Visual deployment timeline with chronological ordering and status indicators
- Detailed deployment modal with:
  - Complete deployment information (platform, status, branch, commit hash)
  - Timestamp and duration breakdown (build time vs deploy time)
  - Full deployment logs display
  - Deployment URL with external link
  - Redeploy action button
- Empty state handling for no deployments or filtered results
- Responsive grid layouts for stats and filters

**Props:**

```javascript
{
  deployments: Deployment[],              // Array of deployment objects
  selectedProject: Project | null,        // Currently selected project
  onRedeploy: (deployment) => void        // Redeploy trigger callback
}
```

**Deployment Object Structure:**

```javascript
{
  id: string,
  projectId: number,
  projectName: string,
  platform: 'gcp' | 'aws' | 'vercel' | 'render',
  status: 'success' | 'failed' | 'pending' | 'building' | 'deploying',
  commitHash: string,
  branch: string,
  timestamp: Date,
  duration: number,
  url: string | null,
  logs: string,
  buildTime: number,
  deployTime: number
}
```

**Usage:**

```javascript
import DeploymentPanelTab from "./components/DeploymentPanelTab";

<DeploymentPanelTab
  deployments={deployments}
  selectedProject={selectedProject}
  onRedeploy={deployToCloud}
/>;
```

**Integration:** The DeploymentPanelTab is integrated into the ProjectSettings page as the "Deployment Panel" tab, providing users with complete visibility into their deployment history and the ability to redeploy previous configurations.

### DataDogSpiritsTab Component

A comprehensive monitoring and logging interface component (`src/components/DataDogSpiritsTab.jsx`) that provides DataDog-style metrics visualization and log management:

**Features:**

- DataDog configuration form with API key, app key, site, log level, and tags
- Tag management with add/remove functionality and visual badges
- Metrics fetching with simulated DataDog API integration
- Enhanced logs display with color-coded log levels (ERROR, WARN, INFO, DEBUG)
- Log filtering by level with dropdown selector
- Quick metrics preview panel (uptime, request rate, response time, error rate)
- Detailed metrics dashboard with 9 metric cards:
  - CPU and Memory usage with color-coded gauges
  - Request rate and throughput
  - Error count and error rate
  - Response time with threshold indicators
  - Active connections
  - Uptime percentage
- Action buttons for Fetch Metrics, Configure Alerts, and Live Tail Logs
- Validation and loading states
- Auto-save configuration changes

**Props:**

```javascript
{
  configuration: DataDogConfig,           // DataDog configuration object
  onConfigChange: (field, value) => void, // Configuration change handler (2 params: field, value)
  onFetchMetrics: () => void,            // Metrics fetch trigger
  logs: string,                          // DataDog logs string
  metrics: MonitoringMetrics | null,     // Current metrics object
  simulationState: { isFetchingMetrics: boolean }
}
```

**Note:** The `onConfigChange` callback expects exactly 2 parameters (field, value). The component internally handles the 'datadog' configuration namespace.

**Usage:**

```javascript
import DataDogSpiritsTab from "./components/DataDogSpiritsTab";

<DataDogSpiritsTab
  configuration={configurations.datadog}
  onConfigChange={handleDataDogConfigChange}
  onFetchMetrics={fetchDataDogMetrics}
  logs={logs.datadog}
  metrics={metrics}
  simulationState={simulationState}
/>;
```

### CloudPlatformsTab Component

A comprehensive cloud deployment interface component (`src/components/CloudPlatformsTab.jsx`) that provides multi-platform deployment capabilities:

**Features:**

- Platform selection UI for GCP, AWS, Vercel, and Render
- Conditional Kubernetes configuration for GCP and AWS platforms
- Platform-specific configuration forms with validation
- Environment variables management for Vercel and Render
- Real-time deployment logs with terminal-style display
- Deployment action buttons with loading states
- Platform information and feature descriptions

**Props:**

```javascript
{
  selectedPlatform: string,              // Currently selected platform
  setSelectedPlatform: (platform) => void, // Platform selection handler
  configurations: object,                 // All platform configurations
  handleKubernetesConfigChange: (field, value) => void,
  handlePlatformConfigChange: (platform, field, value) => void,
  handleEnvVarChange: (platform, index, field, value) => void,
  addEnvVar: (platform) => void,
  removeEnvVar: (platform, index) => void,
  deployToCloud: () => void,             // Deployment trigger
  logs: { deployment: string },          // Deployment logs
  simulationState: { isDeploying: boolean }
}
```

**Platform Configurations:**

- **GCP**: Project ID, cluster name, region, node count, machine type
- **AWS**: Region, cluster name, service type (EKS/ECS/Lambda), instance type, VPC ID
- **Vercel**: Project name, framework, build command, output directory, environment variables
- **Render**: Service type (web/worker/cron), instance type, build/start commands, region, environment variables

**Kubernetes Configuration** (GCP & AWS only):

- Cluster name, namespace, replicas
- CPU and memory limits
- Auto-scaling with min/max replicas

**Usage:**

```javascript
import CloudPlatformsTab from "./components/CloudPlatformsTab";

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
/>;
```

### ProjectSelector Component

A reusable dropdown component for selecting projects with localStorage persistence (`src/components/ProjectSelector.jsx`):

**Features:**

- Displays all available projects from ProjectContext
- Persists selected project across page refreshes
- Shows project details (name, description, type, status)
- Haunted theme styling with ghost emoji indicators
- Callback-based architecture for parent component integration

**Usage:**

```javascript
import ProjectSelector from "./components/ProjectSelector";

function MyComponent() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <ProjectSelector
      selectedProject={selectedProject}
      onProjectChange={setSelectedProject}
    />
  );
}
```

**Integration:** The ProjectSelector component is now integrated into the ProjectSettings page, enabling users to select which project they want to configure for deployment. The selected project persists across page refreshes using localStorage.

### Storage Helpers

Utility functions for managing deployment configurations and project data (`src/utils/storageHelpers.jsx`):

**Core Functions:**

- `saveSelectedProject(projectId)` - Persist selected project ID
- `loadSelectedProject()` - Retrieve saved project ID
- `saveConfigurations(projectId, configs)` - Save deployment configs per project
- `loadConfigurations(projectId)` - Load deployment configs
- `saveDeployments(projectId, deployments)` - Save deployment history (max 50 per project)
- `loadDeployments(projectId)` - Load deployment history with Date object conversion
- `addDeployment(projectId, deployment)` - Add new deployment to history
- `saveMetrics(projectId, metrics)` - Save monitoring metrics
- `loadMetrics(projectId)` - Load monitoring metrics with Date object conversion
- `saveAlerts(projectId, alerts)` - Save system alerts
- `loadAlerts(projectId)` - Load system alerts with Date object conversion

**Utility Functions:**

- `clearProjectData(projectId)` - Remove all data for a specific project
- `getStorageInfo()` - Get localStorage usage statistics

**Features:**

- Automatic quota management with fallback strategies
- Safe JSON parsing with error handling
- Date object serialization/deserialization
- Storage availability detection
- Automatic cleanup of old deployments when quota exceeded

### Simulation Utilities

Realistic simulation functions for DevOps operations (`src/utils/simulationUtils.jsx`):

**Simulation Functions:**

- `simulateDockerBuild(config, onLog)` - Simulates Docker build with realistic logs (3-5 seconds)
- `simulateCloudDeployment(platform, config, onLog)` - Simulates cloud deployment with platform-specific logs (5-8 seconds, 10% failure rate)
- `simulateDataDogMetrics(config, onLog)` - Simulates DataDog metrics fetching with enhanced logs
- `generateMetrics()` - Generates realistic monitoring metrics (CPU, memory, requests, errors, uptime)
- `generateDeploymentHistory(projectId, projectName, count)` - Creates initial deployment history for new projects
- `generateAlerts(count)` - Generates random system alerts with severity levels

**Features:**

- Realistic timing with random variations (±20%)
- Platform-specific deployment logs (GCP, AWS, Vercel, Render)
- Simulated failures for testing (10% failure rate)
- Commit hash generation
- Deployment URL generation per platform
- Log level filtering (DEBUG, INFO, WARN, ERROR)
- Metrics within realistic ranges (CPU: 15-85%, Memory: 30-75%, etc.)

### Deployment Models

Comprehensive data models for the Enhanced Project Deployment system (`src/models/deploymentModels.jsx`):

**Data Models:**

- **DockerConfig** - Docker image configuration and build settings
- **KubernetesConfig** - Kubernetes cluster and scaling configuration
- **GCPConfig** - Google Cloud Platform deployment settings
- **AWSConfig** - Amazon Web Services deployment settings
- **VercelConfig** - Vercel deployment configuration
- **RenderConfig** - Render.com deployment settings
- **DataDogConfig** - DataDog monitoring configuration
- **Deployment** - Deployment history and status tracking
- **MonitoringMetrics** - Application performance metrics
- **Alert** - System alerts and notifications

**Default Configurations:**

```javascript
import {
  defaultDockerConfig,
  defaultKubernetesConfig,
  defaultGCPConfig,
} from "./models/deploymentModels";

// Initialize deployment configuration
const config = {
  docker: { ...defaultDockerConfig, imageName: "my-haunted-app" },
  kubernetes: { ...defaultKubernetesConfig, replicas: 5 },
  gcp: { ...defaultGCPConfig, projectId: "my-gcp-project" },
};
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## Authentication

The app uses client-side authentication with:

- Password hashing via Web Crypto API (PBKDF2)
- JWT-like session tokens
- LocalStorage persistence

## Project Context & State Management

Projects are managed through React Context (`ProjectProvider`) and persisted to LocalStorage. All project data, including files and configurations, are stored client-side.

**ProjectContext Features:**

- Centralized project state management
- Automatic localStorage synchronization
- Shared across all components via `useProjects()` hook
- Supports project CRUD operations
- Maintains project files, collaborators, and metadata

**Usage:**

```javascript
import { useProjects } from "./components/projectContext";

function MyComponent() {
  const { projectsList, setProjectsList } = useProjects();

  // Access all projects
  const projects = projectsList;

  // Update projects
  setProjectsList([...projectsList, newProject]);
}
```

## Recent Updates

### Docker Ritual Tab Implementation (Latest)

The Docker Ritual tab has been fully implemented with complete Docker image build and management capabilities:

**Features:**

- **Build Docker Image** - Simulates complete Docker build process with realistic logs including base image pull, dependency installation, application build, and image tagging
- **Download Image** - Simulates pulling Docker images from registry with layer-by-layer progress
- **Push to Registry** - Simulates pushing images to configured registry with authentication and layer upload progress
- **Configuration Management** - Form inputs for image name, Dockerfile path, registry URL, tag, and build arguments with auto-save
- **Validation & Error Handling** - Disables actions when required fields are missing, shows helpful error messages
- **Loading States** - Visual feedback with spinners during operations
- **Real-time Logs** - Terminal-style log display with color-coded output showing build progress

**Implementation Details:**

- Uses `simulateDockerBuild` from `simulationUtils.jsx` for realistic 3-5 second build simulation
- Implements `handleDockerConfigChange` callback for efficient configuration updates
- Integrates with project-specific state management for configuration persistence
- Updates docker tag automatically after successful build
- All operations check for selected project before executing

### ProjectSettings State Management

The ProjectSettings component has been significantly enhanced with comprehensive state management:

**New Capabilities:**

- **Full Configuration Persistence** - All deployment configurations (Docker, Kubernetes, GCP, AWS, Vercel, Render, DataDog) are now saved per-project with auto-save
- **Deployment History Tracking** - Automatically generates and persists deployment history with up to 50 deployments per project
- **Metrics & Alerts** - Real-time metrics and alert tracking with localStorage persistence
- **Project-Specific Data Loading** - When switching projects, all configurations, deployments, metrics, and alerts are automatically loaded
- **Auto-Initialization** - New projects automatically receive initial deployment history, metrics, and alerts on first load
- **Debounced Auto-Save** - Configuration changes are automatically saved after 500ms of inactivity to reduce localStorage writes

**Implementation Details:**

The component now uses multiple `useEffect` hooks to:

1. Load selected project from localStorage on mount
2. Load/initialize project-specific data when project changes
3. Auto-save configurations with debounce
4. Persist deployments, metrics, and alerts when they change

This update completes Tasks 1-3 of the Enhanced Project Deployment specification.

## Current Features

### ProjectSettings Component

The ProjectSettings component (`src/projectsettings.jsx`) provides a comprehensive DevOps configuration interface with full project-specific state management and persistence:

**Tabs:**

- **Docker Ritual** - Docker image configuration and build simulation
- **Cloud Platforms** - Multi-platform deployment (GCP, AWS, Vercel, Render) with Kubernetes configuration
- **DataDog Spirits** - DataDog monitoring configuration and metrics simulation
- **Deployment Panel** - Deployment history tracking with statistics and timeline
- **Monitoring Panel** - Real-time application metrics, alerts, and health monitoring

**Features:**

- **Project Selection** - Integrated ProjectSelector component allows users to choose which project to configure
- **Persistent Configuration** - All deployment configurations are saved per-project to localStorage with auto-save (500ms debounce)
- **Deployment History** - Tracks up to 50 deployments per project with timestamps, status, and logs
- **Metrics Tracking** - Monitors CPU, memory, request rate, error rate, response time, and uptime
- **Alert Management** - Tracks and displays system alerts with severity levels
- **Context Integration** - Uses ProjectContext to access all available projects
- **Simulated Operations** - Provides realistic DevOps simulations without actual external connections
- **Data Initialization** - Automatically generates initial deployment history, metrics, and alerts for new projects

**State Management:**

The component now implements comprehensive state management with:

- Configuration state for all platforms (Docker, Kubernetes, GCP, AWS, Vercel, Render, DataDog)
- Deployment history with automatic persistence (up to 50 deployments per project)
- Real-time metrics with localStorage caching
- Alert tracking with resolution status
- Separate logs for Docker, deployment, and DataDog operations
- Simulation state tracking (building, deploying, fetching metrics)

**Configuration Handlers:**

The component provides callback-based configuration handlers for efficient state updates:

- `handleDockerConfigChange(field, value)` - Updates Docker configuration fields
- `handleKubernetesConfigChange(field, value)` - Updates Kubernetes configuration fields
- `handlePlatformConfigChange(platform, field, value)` - Updates platform-specific configuration fields
- `handleEnvVarChange(platform, index, field, value)` - Updates environment variables for Vercel/Render
- `addEnvVar(platform)` - Adds new environment variable to platform configuration
- `removeEnvVar(platform, index)` - Removes environment variable from platform configuration

**Deployment Operations:**

- `buildDockerImage()` - Simulates Docker build process with real-time logs
- `downloadDockerImage()` - Simulates pulling Docker image from registry
- `pushToRegistry()` - Simulates pushing Docker image to configured registry
- `deployToCloud()` - Simulates cloud deployment to selected platform with automatic history tracking

**Current Status:** The component is fully integrated with the Enhanced Project Deployment system. Docker Ritual, Cloud Platforms, DataDog Spirits, and Deployment Panel tabs are complete with full simulation capabilities. All configurations, deployments, metrics, and alerts are persisted per-project and automatically loaded when switching between projects.

**Docker Ritual Tab (Completed):**

The Docker Ritual tab provides a complete Docker image build and management interface with:

- **Configuration Form** - Input fields for image name, Dockerfile path, registry URL, tag, and build arguments
- **Build Actions** - Three primary operations:
  - Build Docker Image - Simulates Docker build with realistic logs (3-5 seconds)
  - Download Image - Simulates pulling image layers from registry
  - Push to Registry - Simulates pushing image to configured registry with authentication
- **Real-time Build Logs** - Terminal-style log display showing build progress and status
- **Validation** - Disables actions when required fields are missing with helpful error messages
- **Loading States** - Visual feedback during build operations with spinner animations
- **Auto-save** - Configuration changes are automatically saved with 500ms debounce
- **Integration** - Uses `simulateDockerBuild` from `simulationUtils.jsx` for realistic build simulation

All Docker operations are fully simulated without requiring actual Docker installation, making it perfect for development and testing.

**Cloud Platforms Tab (Completed):**

The Cloud Platforms tab provides multi-platform deployment capabilities with:

- **Platform Selection** - Support for GCP, AWS, Vercel, and Render with platform-specific configurations
- **Kubernetes Configuration** - Shared Kubernetes settings across GCP and AWS platforms including:
  - Cluster name, namespace, and replica count
  - CPU and memory limits
  - Auto-scaling configuration with min/max replicas
- **Platform-Specific Forms** - Dynamic configuration forms that adapt based on selected platform:
  - **GCP**: Project ID, cluster name, region, node count, machine type
  - **AWS**: Region, cluster name, service type (ECS/EKS/Lambda), instance type, VPC ID
  - **Vercel**: Project name, framework preset, build command, output directory, environment variables
  - **Render**: Service type (web/worker/cron), instance type, build/start commands, region, environment variables
- **Environment Variables Management** - Add, edit, and remove environment variables for Vercel and Render platforms
- **Deployment Actions** - Deploy to selected platform with real-time deployment logs
- **Deployment Simulation** - Uses `simulateCloudDeployment` from `simulationUtils.jsx` with:
  - Platform-specific deployment logs (5-8 seconds)
  - 10% simulated failure rate for realistic testing
  - Automatic deployment history tracking
  - Generated deployment URLs per platform
- **Deployment History Integration** - Successful and failed deployments are automatically added to deployment history with:
  - Commit hash, branch, timestamp, and duration
  - Build time and deploy time breakdown
  - Full deployment logs
  - Deployment URL (for successful deployments)
- **Loading States** - Visual feedback during deployment operations
- **Auto-save** - All configuration changes are automatically saved with 500ms debounce

The Cloud Platforms tab is fully integrated with the deployment history system and provides a complete multi-cloud deployment experience.

**DataDog Spirits Tab (Completed):**

The DataDog Spirits tab provides comprehensive monitoring and logging capabilities with:

- **DataDog Configuration Form** - Input fields for API key, app key, site selection, log level, and tags
- **Tag Management** - Add, edit, and remove tags with visual tag badges
- **Metrics Fetching** - Fetch real-time application metrics with simulated DataDog API calls
- **Enhanced Logs Display** - Terminal-style log display with color-coded log levels:
  - ERROR (red), WARN (yellow), INFO (blue), DEBUG (gray)
  - Log filtering by level (ALL, DEBUG, INFO, WARN, ERROR)
  - Real-time log streaming simulation
- **Quick Metrics Dashboard** - Preview panel showing uptime, request rate, response time, and error rate
- **Detailed Metrics Dashboard** - Comprehensive metrics visualization with:
  - CPU and Memory usage gauges with color-coded thresholds
  - Request rate and throughput metrics
  - Error count and error rate tracking
  - Response time monitoring
  - Active connections count
  - Uptime percentage with SLA indicator
- **Action Buttons** - Fetch Metrics, Configure Alerts, and Live Tail Logs
- **Validation** - Disables actions when required API keys are missing
- **Loading States** - Visual feedback during metrics fetching operations
- **Auto-save** - All configuration changes are automatically saved with 500ms debounce

The DataDog Spirits tab uses `simulateDataDogMetrics` from `simulationUtils.jsx` to generate realistic monitoring data and logs without requiring actual DataDog API credentials.

**Deployment Panel Tab (Completed):**

The Deployment Panel tab provides comprehensive deployment history tracking and management with:

- **Quick Stats Dashboard** - Five key metrics displayed in a grid:
  - Total deployments count
  - Successful deployments count
  - Failed deployments count
  - Success rate percentage
  - Average deployment duration
- **Advanced Filtering** - Three-dimensional filtering system:
  - Status filter (all/success/failed/pending)
  - Platform filter (all/GCP/AWS/Vercel/Render) - dynamically populated from deployment history
  - Date range filter (all time/today/last 7 days/last 30 days)
- **Deployment History List** - Displays last 10 filtered deployments with:
  - Color-coded status icons (green checkmark for success, red X for failed, yellow clock for pending)
  - Platform name, status badge, branch, commit hash, and duration
  - Clickable deployment URLs for successful deployments
  - Relative timestamps (e.g., "2 hours ago", "3 days ago")
  - Redeploy button for quick redeployment
  - Click to view full deployment details
- **Visual Timeline** - Chronological deployment timeline with:
  - Vertical timeline line with colored status dots
  - Deployment cards showing platform, timestamp, status, branch, commit hash, and duration
  - Limited to last 10 deployments for readability
- **Deployment Details Modal** - Full-screen modal displaying:
  - Complete deployment metadata (platform, status, branch, commit hash, timestamps)
  - Duration breakdown (total, build time, deploy time)
  - Deployment URL with external link icon
  - Full deployment logs in terminal-style display
  - Redeploy and close action buttons
- **Empty State Handling** - Friendly messages when:
  - No deployments exist yet
  - No deployments match the selected filters
- **Responsive Design** - Grid layouts adapt to screen size with mobile-friendly breakpoints

The Deployment Panel tab integrates seamlessly with the deployment history system, automatically displaying deployments as they are created through the Cloud Platforms tab.

## Development Roadmap

See `.kiro/specs/enhanced-project-deployment/` for detailed specifications on the deployment system:

- `requirements.md` - Feature requirements and acceptance criteria
- `design.md` - System architecture and component design
- `tasks.md` - Implementation tasks and progress

**Completed (Tasks 1-7):**

- ✅ Data models and simulation utilities
- ✅ ProjectSelector component with persistence
- ✅ Main ProjectSettings component structure with full state management
- ✅ Project-specific configuration loading and saving
- ✅ Deployment history generation and tracking
- ✅ Metrics and alerts initialization
- ✅ Auto-save with debounce for configurations
- ✅ Docker Ritual tab with build, download, and push operations
- ✅ Real-time build logs with terminal-style display
- ✅ Docker configuration form with validation
- ✅ Cloud Platforms tab with multi-platform support (GCP, AWS, Vercel, Render)
- ✅ Kubernetes configuration shared across GCP and AWS
- ✅ Platform-specific configuration forms with environment variables
- ✅ Cloud deployment simulation with realistic logs and failure scenarios
- ✅ Automatic deployment history tracking with success/failure status
- ✅ Platform-specific deployment URL generation
- ✅ DataDog Spirits tab with enhanced logging and metrics visualization
- ✅ Deployment Panel tab with history visualization, filtering, timeline, and details modal
- ✅ Quick stats dashboard (total, successful, failed, success rate, average duration)
- ✅ Advanced filtering by status, platform, and date range
- ✅ Deployment history list with last 10 deployments
- ✅ Visual timeline with chronological ordering
- ✅ Detailed deployment modal with full logs and redeploy functionality

**In Progress:**

- Monitoring Panel with real-time metrics (Task 8)

**Upcoming:**

- Property-based testing for configuration persistence
- Integration testing for all simulation flows
- UI polish and smooth transitions
- Toast notifications for operations

## Vite Configuration

This project uses [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) with Babel for Fast Refresh.

## License

MIT
