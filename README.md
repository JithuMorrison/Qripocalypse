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

**Functions:**

- `saveSelectedProject(projectId)` - Persist selected project ID
- `loadSelectedProject()` - Retrieve saved project ID
- `saveConfigurations(projectId, configs)` - Save deployment configs per project
- `loadConfigurations(projectId)` - Load deployment configs
- `saveDeployments(projectId, deployments)` - Save deployment history
- `loadDeployments(projectId)` - Load deployment history
- `saveMetrics(projectId, metrics)` - Save monitoring metrics
- `loadMetrics(projectId)` - Load monitoring metrics

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

## Current Features

### ProjectSettings Component

The ProjectSettings component (`src/projectsettings.jsx`) provides a DevOps configuration interface with project selection and the following tabs:

- **Docker Ritual** - Docker image configuration and build simulation
- **Google Cloud** - GCP/GKE deployment configuration and simulation
- **DataDog Spirits** - DataDog monitoring configuration and metrics simulation
- **Deployment** - Deployment management (placeholder)
- **Monitoring** - Application monitoring dashboard (placeholder)

**Features:**

- **Project Selection** - Integrated ProjectSelector component allows users to choose which project to configure
- **Persistent Selection** - Selected project is saved to localStorage and restored on page load
- **Context Integration** - Uses ProjectContext to access all available projects
- **Simulated Operations** - Provides simulated DevOps operations without actual external connections

**Current Status:** The component now supports project-specific context with persistent selection. Deployment configurations will be saved per-project in future updates.

## Development Roadmap

See `.kiro/specs/enhanced-project-deployment/` for detailed specifications on the deployment system currently in development:

- `requirements.md` - Feature requirements and acceptance criteria
- `design.md` - System architecture and component design
- `tasks.md` - Implementation tasks and progress

**Planned Enhancements:**

- Integration of ProjectSelector for per-project deployment configurations
- Multi-platform deployment support (GCP, AWS, Vercel, Render)
- Kubernetes configuration management
- Real deployment history tracking
- Live monitoring metrics with DataDog integration
- Persistent deployment configurations per project

## Vite Configuration

This project uses [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) with Babel for Fast Refresh.

## License

MIT
