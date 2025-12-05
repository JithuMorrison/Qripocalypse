# QRipocalypse - Haunted Developer Platform 👻

A spooky-themed development platform featuring project management, code editing, and deployment capabilities with a haunted aesthetic.

## Features

- 🧛 **User Authentication** - Register and login with secure password hashing (PBKDF2)
- 👻 **Project Management** - Create, manage, and organize haunted projects with ProjectContext
- 💀 **Code Editor** - In-browser code editor with file management
- 🔮 **Deployment System** - Multi-platform deployment with monitoring (GCP, AWS, Vercel, Render)
- 🧟 **Git Simulation** - NecroTerminal with project-aware Git commands
- 📊 **Code Analysis** - NecroDiff viewer and Poltergeist Alerts for code quality
- 🎨 **Haunted UI** - Dark theme with spooky animations and effects

## Tech Stack

- **Frontend**: React 19.1.1 + Vite 7.x
- **Routing**: React Router DOM v7.9.1
- **Icons**: Lucide React 0.555.0
- **QR Codes**: qrcode 1.5.4, react-qr-reader 3.0.0-beta-1
- **Storage**: LocalStorage (client-side persistence, no backend)
- **Styling**: Tailwind CSS 4.1.17 with custom haunted theme CSS

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── projectContext.jsx    # Global project state (ProjectProvider, useProjects hook)
│   ├── ProjectSelector.jsx   # Project dropdown with localStorage persistence
│   ├── FileSelector.jsx      # File selection modal for project files
│   ├── CloudPlatformsTab.jsx # Multi-platform deployment configuration
│   ├── DeploymentPanelTab.jsx # Deployment history and tracking
│   ├── DataDogSpiritsTab.jsx # Monitoring and logging interface
│   ├── MonitoringPanelTab.jsx # Metrics visualization
│   ├── PersonaSelector.jsx   # Character persona selector
│   ├── PremiumDialog.jsx     # Premium feature modal
│   └── ghostpopup.jsx, WatchingGhost.jsx, spellcircle.jsx, tombstone.jsx
├── models/             # Data models and type definitions
│   └── deploymentModels.jsx  # Deployment system data models
├── pages/              # Page-level components (routes)
│   ├── landing.jsx           # Main landing page after login
│   ├── graveyard.jsx         # Project graveyard/archive
│   ├── necrodiff.jsx         # Code diff viewer with file selection
│   ├── ritual.jsx            # Merge conflict resolution
│   ├── terminal.jsx          # Git command simulator (NecroTerminal)
│   ├── qrportal.jsx          # QR code generation and scanning
│   ├── alerts.jsx            # AI-powered code analysis (Poltergeist Alerts)
│   ├── characters.jsx        # Haunted character personas
│   ├── themes.jsx            # Theme management
│   └── settings.jsx, about.jsx
├── services/           # Business logic and API services
│   ├── authService.jsx       # Registration, login, password hashing, tokens
│   ├── storageService.jsx    # localStorage CRUD for users
│   └── qrStorageService.jsx  # QR code data persistence
├── utils/              # Utility functions and helpers
│   ├── commitGenerator.jsx   # Generate simulated commit history
│   ├── simulationUtils.jsx   # Simulate Docker builds, deployments, metrics
│   ├── storageHelpers.jsx    # Deployment configs, metrics, alerts persistence
│   ├── alertGenerator.jsx    # Code analysis and alert generation
│   ├── diffEngine.jsx        # LCS-based diff algorithm
│   └── qrHandler.jsx, ghostAI.jsx, deploymentUtils.jsx
├── styles/             # Global CSS files
│   └── haunted.css           # Spooky theme styles
├── App.jsx             # Main app with routing and authentication
├── main.jsx            # React entry point
├── dashboard.jsx       # Project dashboard
├── codeeditor.jsx      # In-browser code editor
├── projectsettings.jsx # Project configuration page
├── login.jsx           # Login page
└── register.jsx        # Registration page
```

## Application Architecture

### Routing & Authentication

The application uses React Router v7 with protected routes. All routes except `/login` and `/register` require authentication:

**Public Routes:**

- `/login` - User login page
- `/register` - User registration page

**Protected Routes:**

- `/` - Landing page (main dashboard)
- `/projects` - Project dashboard
- `/project/:id/code` - Code editor for specific project
- `/project/:id/settings` - Project settings and deployment configuration
- `/necrodiff` - Code diff viewer
- `/graveyard` - Project archive
- `/ritual` - Merge conflict resolution
- `/terminal` - NecroTerminal (Git command simulator)
- `/qr` - QR code portal
- `/alerts` - Poltergeist Alerts (code analysis)
- `/characters` - Haunted character personas
- `/themes` - Theme management
- `/settings` - User settings
- `/about` - About page

### State Management

The app uses React Context API for global state:

- **ProjectProvider**: Wraps the entire application, providing `projectsList` and `setProjectsList` to all components via the `useProjects()` hook
- **useAuth**: Custom hook for authentication state management (login, logout, token validation)
- **localStorage**: Automatic persistence for projects, users, configurations, deployments, and metrics

### Authentication Flow

1. User registers/logs in via `authService.jsx`
2. Password hashed using Web Crypto API (PBKDF2)
3. Session token generated and stored in localStorage
4. `useAuth` hook validates token on app load
5. `ProtectedRoute` component guards authenticated routes
6. Token stored as `qripocalypse_token` in localStorage

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

### QR Storage Service

Service for managing QR code data and recent summons history (`src/services/qrStorageService.jsx`):

**Core Functions:**

- `saveQRData(type, data)` - Save QR data to localStorage with unique ID
- `retrieveQRData(id)` - Retrieve QR data by ID
- `getRecentSummons(limit)` - Get recent summons history (default 20)
- `addToRecentSummons(qr)` - Add entry to recent summons
- `deleteQRData(id)` - Delete specific QR data
- `clearAllQRData()` - Clear all QR data from storage
- `generateUniqueId()` - Generate 24-character hex ID (ObjectId-like)
- `encodeToObjectId(text)` - Encode text to ObjectId-like hex string

**Supported QR Types:**

- `theme` - Theme switching QR codes (🎨)
- `diff` - Code diff QR codes (🔀)
- `commit` - Commit history QR codes (⚰️)
- `projectFile` - Project file QR codes (📄)
- `deployment` - Deployment configuration QR codes (🚀)

**Features:**

- Automatic storage quota management
- Recent summons history (last 20 entries)
- Type-specific icon mapping
- Timestamp tracking for all QR codes
- Safe JSON parsing with error handling

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

### FileSelector Component

A reusable modal component for selecting files from projects (`src/components/FileSelector.jsx`):

**Features:**

- Modal overlay with backdrop click-to-close functionality
- Displays all projects from ProjectContext with expandable/collapsible project sections
- Shows file count and project type for each project
- Lists all files within each project with file path and language indicators
- Hover effects and visual feedback for better UX
- Empty state handling for projects with no files
- Haunted theme styling consistent with the application
- Keyboard-accessible close button

**Props:**

```javascript
{
  isOpen: boolean,                        // Controls modal visibility
  onClose: () => void,                    // Callback when modal is closed
  onSelectFile: (fileData) => void,       // Callback when file is selected
  title: string                           // Optional modal title (default: "Select a File from the Spirit Realm")
}
```

**FileData Object Structure:**

When a file is selected, the component passes an enhanced file object to the `onSelectFile` callback:

```javascript
{
  id: number,              // File ID
  name: string,            // File name
  content: string,         // File content
  type: 'file',           // File type
  language: string,        // Programming language
  path: string,           // File path
  projectName: string,    // Project name (added by FileSelector)
  projectId: number       // Project ID (added by FileSelector)
}
```

**Usage:**

```javascript
import FileSelector from "./components/FileSelector";

function MyComponent() {
  const [showFileSelector, setShowFileSelector] = useState(false);

  const handleFileSelect = (fileData) => {
    console.log(`Selected ${fileData.name} from ${fileData.projectName}`);
    // Use fileData.content, fileData.projectId, etc.
  };

  return (
    <>
      <button onClick={() => setShowFileSelector(true)}>Select File</button>

      <FileSelector
        isOpen={showFileSelector}
        onClose={() => setShowFileSelector(false)}
        onSelectFile={handleFileSelect}
        title="Choose a haunted file"
      />
    </>
  );
}
```

**Integration:**

The FileSelector component is integrated across multiple pages in the Git Pages Project Integration feature:

- **NecroDiff Page** (`src/pages/necrodiff.jsx`) - Select files for old/new code comparison panels
- **Ritual Page** (`src/pages/ritual.jsx`) - Select files for HEAD/FEATURE merge conflict resolution
- **Terminal Page** (`src/pages/terminal.jsx`) - Select project context for Git command execution

The component automatically closes after file selection and provides complete file metadata including project context for proper file handling.

### PremiumDialog Component

A reusable modal component for displaying premium/locked feature notifications (`src/components/PremiumDialog.jsx`):

**Features:**

- Spooky modal overlay with haunted theme styling
- Backdrop click-to-close functionality
- Animated ghost and skull decorations
- Customizable feature name display
- Accessible with ARIA attributes (role, aria-modal, aria-labelledby)
- Gradient background with glowing border effects
- Multiple action buttons (primary and secondary)

**Props:**

```javascript
{
  isOpen: boolean,                        // Controls modal visibility
  onClose: () => void,                    // Callback when modal is closed
  featureName: string                     // Name of the locked feature (default: "Premium Feature")
}
```

**Usage:**

```javascript
import PremiumDialog from "./components/PremiumDialog";

function MyComponent() {
  const [showPremium, setShowPremium] = useState(false);

  const handleLockedFeature = () => {
    setShowPremium(true);
  };

  return (
    <>
      <button onClick={handleLockedFeature}>Try Premium Feature</button>

      <PremiumDialog
        isOpen={showPremium}
        onClose={() => setShowPremium(false)}
        featureName="Advanced Code Analysis"
      />
    </>
  );
}
```

**Styling:**

- Purple and black gradient background with glowing border
- Creepster font for headings
- Animated ghost (👻), skull (💀), spider (🕷️), bat (🦇), and web (🕸️) emojis
- Pulse and bounce animations for decorative elements
- Responsive design with max-width constraint

**Integration:**

The PremiumDialog component is integrated into multiple pages:

- **Characters Page** (`src/pages/characters.jsx`) - Locks "Summoning Spells" feature
- **Themes Page** (`src/pages/themes.jsx`) - Locks "QR Theme Generation" feature

### PersonaSelector Component

A reusable dropdown component for selecting haunted character personas (`src/components/PersonaSelector.jsx`):

**Features:**

- Dropdown selector for character personas
- Displays character emoji and name
- Haunted theme styling with purple accents
- Integrates with Characters page for persona selection

**Props:**

```javascript
{
  characters: Character[],                // Array of character objects
  selectedPersona: string,                // Currently selected persona ID
  onSelect: (personaId: string) => void   // Callback when persona is selected
}
```

**Character Object Structure:**

```javascript
{
  id: string,              // Unique identifier (e.g., 'dracula', 'witch')
  name: string,            // Display name
  emoji: string,           // Character emoji
  role: string,            // Character role/specialty
  description: string,     // Character description
  personality: string,     // Personality traits
  abilities: string[],     // List of abilities
  quote: string           // Signature quote
}
```

**Usage:**

```javascript
import PersonaSelector from "./components/PersonaSelector";

function MyComponent() {
  const [selectedPersona, setSelectedPersona] = useState("");

  return (
    <PersonaSelector
      characters={characters}
      selectedPersona={selectedPersona}
      onSelect={setSelectedPersona}
    />
  );
}
```

**Integration:**

The PersonaSelector component is integrated into the Characters page (`src/pages/characters.jsx`) to allow users to select their preferred haunted persona for code interactions.

### Characters Page (Haunted Personas)

A showcase page for the haunted character personas that power QRipocalypse (`src/pages/characters.jsx`):

**Features:**

- **Character Gallery** - Grid display of 6 haunted personas with detailed information
- **PersonaSelector Integration** - Dropdown to select active persona
- **PremiumDialog Integration** - Modal for locked "Summoning Spells" feature
- **Character Details** - Each character card displays:
  - Name, role, and emoji icon
  - Description and personality traits
  - List of special abilities
  - Signature quote
- **Haunted Theming** - Color-coded cards matching each character's theme (red, green, purple, gray, black, orange)

**Character Personas:**

1. **Count Dracula** (🧛) - Deletion Specialist - Removes code and drains bugs
2. **Frankenstein's Monster** (🧟) - Modification Expert - Patches code together
3. **Witch of Mutations** (🧙‍♀️) - Conflict Resolver - Resolves merge conflicts
4. **Ghost of Commit Past** (👻) - History Keeper - Remembers all commits
5. **The Reaper** (💀) - Code Execution - Terminates processes and cleans dead code
6. **Poltergeist Debugger** (🔮) - Error Detection - Finds hidden bugs

**State Management:**

```javascript
{
  selectedPersona: string,           // Currently selected persona ID
  showPremiumDialog: boolean         // Premium dialog visibility
}
```

**Character Data Structure:**

Each character includes:

- `id` - Unique identifier for selection
- `name` - Character display name
- `role` - Specialty/function
- `icon` / `emoji` - Visual representation
- `color` - Theme color for styling
- `description` - Character overview
- `personality` - Personality traits
- `abilities` - Array of special abilities
- `quote` - Signature catchphrase

**Usage:**

The Characters page serves as both an informational showcase and a persona selection interface, allowing users to learn about and choose their preferred haunted coding assistant.

### Ritual Page Enhancement (Latest - Task 7)

The Ritual (Merge Conflict Resolution) page has been enhanced with FileSelector integration:

**Changes:**

- Added FileSelector integration for both HEAD and FEATURE code panels
- Implemented file selection state management for left (HEAD) and right (FEATURE) panels
- Added "Select File" buttons with haunted theme styling for both panels
- File path display shows project name and file path when files are selected
- Selected file content automatically populates the respective code textarea
- Maintains existing SpellCircle animation and merge ritual functionality
- Consistent with NecroDiff and Terminal page file selection patterns

**Status:** Completes Task 7 of the Git Pages Project Integration specification.

### Terminal Page Enhancement (Task 6)

The Terminal (NecroTerminal) page has been enhanced with project selection and commit integration:

**Changes:**

- Added project selection state management with dropdown selector
- Integrated `useProjects()` hook to access all available projects
- Integrated `generateCommitsForProjects()` to create commit history on mount
- Implemented project-aware command simulation for all Git commands
- Added project context to terminal prompt showing selected project name
- Commands now reference actual project files and generated commits
- Added warning message when no project is selected
- All Git command responses are now project-specific and contextual
- Maintains existing CRT screen aesthetic and quick command buttons

**Status:** Completed Task 6 of the Git Pages Project Integration specification.

### Commit Generator Utility

A utility for generating simulated commit data for projects (`src/utils/commitGenerator.jsx`):

**Features:**

- Generates 2-5 commits per project with realistic data
- Creates spooky-themed commit messages and author names
- Assigns haunted characters (👻, 🧛, 💀) based on change magnitude
- Simulates duplicate commit hashes across projects (10% chance)
- Generates random dates within the last 30 days
- Produces realistic additions/deletions counts
- Sorts commits chronologically (newest first)

**Core Functions:**

- `generateCommitsForProjects(projects)` - Generate commits for multiple projects
- `generateCommitsForProject(project)` - Generate commits for a single project

**Commit Object Structure:**

```javascript
{
  hash: string,           // 8-character hex hash
  message: string,        // Spooky commit message
  author: string,         // Random spooky author name
  date: string,          // ISO date string (last 30 days)
  changes: string,       // Format: "+12 -4"
  ghost: string,         // Emoji based on change magnitude
  epitaph: string,       // Spooky epitaph message
  projectId: number,     // Associated project ID
  projectName: string,   // Project name
  isDuplicate: boolean   // True if hash appears in multiple projects
}
```

**Usage:**

```javascript
import { generateCommitsForProjects } from "./utils/commitGenerator";

const commits = generateCommitsForProjects(projectsList);
// Returns array of commits sorted by date (newest first)
```

**Change Magnitude Mapping:**

- Small (1-10 changes): 👻, 🕷️, 🦇
- Medium (11-50 changes): 🧛, 🧟, 🧙‍♀️
- Large (51+ changes): 💀, ☠️, 👹

### Alerts Page (Poltergeist Alerts)

An AI-powered code analysis page (`src/pages/alerts.jsx`) that scans project files for code issues and generates haunted alerts:

**Features:**

- **Project Integration** - Automatically scans all files from projects in ProjectContext
- **Real-time Analysis** - Detects code issues across multiple categories with line-specific reporting
- **Alert Categories:**
  - **Cursed Patterns** (🔮) - Infinite loops, unbounded iterations (High severity)
  - **Dead Variables** (💀) - Unused variable declarations (Medium severity)
  - **Suspicious Logic** (👁️) - Magic numbers, complex conditionals, loose equality (Low-Medium severity)
  - **Security Issues** (🚨) - eval() usage, innerHTML XSS risks, hardcoded credentials (High severity)
  - **Deprecated Patterns** (⚠️) - var usage, deprecated React lifecycle methods, obsolete APIs (Low severity)
- **Detailed Alert Information** - Shows project name, file path, line number, severity, and actionable suggestions
- **Empty States** - Handles no projects and no alerts scenarios with themed messages
- **Scan Animation** - 2-second scanning ritual with loading state

**State Management:**

```javascript
{
  alerts: Alert[],              // Generated alerts from all projects
  isScanning: boolean,          // Scan in progress
  projectsList: Project[]       // From ProjectContext
}
```

**Alert Object Structure:**

```javascript
{
  id: number,
  type: 'curse' | 'dead' | 'suspicious' | 'security' | 'deprecated',
  file: string,                 // File name
  filePath: string,             // Full file path
  message: string,              // Issue description
  severity: 'high' | 'medium' | 'low',
  ghost: string,                // Emoji icon
  suggestion: string,           // Fix recommendation
  lineNumber: number,           // Line where issue occurs
  projectId: number,
  projectName: string,
  timestamp: string
}
```

**Integration:**

- Uses `useProjects()` hook to access all project files
- Uses `generateAlertsForProjects()` from `src/utils/alertGenerator.jsx` for analysis
- Automatically rescans when project list changes
- Part of the haunted developer platform's code quality features

### Alert Generator Utility

A comprehensive code analysis utility (`src/utils/alertGenerator.jsx`) that detects various code issues:

**Core Functions:**

- `generateAlertsForProjects(projects)` - Analyzes all files in all projects and returns alerts
- `analyzeFile(file, project)` - Analyzes a single file for code issues
- `getSeverityLevel(pattern)` - Returns severity level for a pattern type

**Detection Capabilities:**

1. **Cursed Patterns** - Infinite loops (while(true), for(;;)) without break statements
2. **Dead Variables** - Variables declared but never used in subsequent code
3. **Suspicious Logic** - Magic numbers, complex conditionals (3+ operators), loose equality (==)
4. **Missing Error Handling** - Async functions without try-catch, fetch/axios without .catch()
5. **Security Issues** - eval() usage, innerHTML XSS risks, hardcoded credentials patterns
6. **Deprecated Patterns** - var declarations, deprecated React lifecycle methods, String.substr(), moment.js

**Features:**

- Line-by-line code analysis with pattern matching
- Context-aware detection (checks surrounding code for break statements, error handling)
- Alert limiting to prevent overwhelming output (max 2-3 per category per file)
- Severity classification (high/medium/low) based on issue type
- Actionable suggestions for each detected issue

**Usage:**

```javascript
import { generateAlertsForProjects } from "./utils/alertGenerator";

const alerts = generateAlertsForProjects(projectsList);
// Returns array of alert objects with file, line, severity, and suggestions
```

### Terminal Page (NecroTerminal)

A possessed command-line interface (`src/pages/terminal.jsx`) that simulates Git commands with project-specific context and spooky responses:

**Features:**

- **Project Selection Integration** - Select any project from ProjectContext to execute commands in that project's context
- **Commit History Integration** - Uses commit generator to display realistic commit logs for selected projects
- **Project-Aware Git Commands** - All Git commands reference the selected project's data (files, commits, branches)
- **Simulated Git Operations** - Realistic responses for git status, log, diff, commit, push, pull, branch, and merge
- **Dynamic File References** - Commands reference actual files from the selected project
- **CRT Screen Effect** - Retro terminal aesthetic with green phosphor glow
- **Quick Command Buttons** - One-click access to common Git commands
- **Command History** - Scrollable terminal output with command history
- **Project Context Prompt** - Terminal prompt displays selected project name

**State Management:**

```javascript
{
  selectedProject: Project | null,     // Currently selected project
  commands: CommandHistory[],          // Array of executed commands and responses
  currentInput: string,                // Current command input
  isTyping: boolean,                   // Command execution in progress
  allCommits: Commit[]                 // Generated commits for all projects
}
```

**Simulated Commands:**

- `git status` - Shows working directory status with project files
- `git log` - Displays commit history from generated commits for the project
- `git diff` - Shows simulated diff for random project file
- `git branch` - Lists simulated branches
- `git commit` - Simulates committing changes
- `git push` - Simulates pushing to remote
- `git pull` - Simulates pulling from remote
- `git merge` - Simulates merge operation
- `help` - Shows available commands
- `clear` - Clears terminal output

**Integration:**

- Uses `useProjects()` hook to access project list from ProjectContext
- Uses `generateCommitsForProjects()` to create commit history on mount
- Filters commits by selected project ID for project-specific responses
- References actual project files in command outputs
- Part of the Git Pages Project Integration feature (Task 6)

### Ritual Page (Merge Ritual)

A mystical merge conflict resolution interface (`src/pages/ritual.jsx`) that helps resolve code conflicts through dark magic with a spooky aesthetic:

**Features:**

- **File Selection Integration** - Select files from any project using the FileSelector component for both HEAD and FEATURE branches
- **Dual Code Panels** - Side-by-side comparison of HEAD (Ancient Version) and FEATURE (New Creation) code
- **File Metadata Display** - Shows project name and file path for selected files with color-coded borders (red for HEAD, blue for FEATURE)
- **Manual Input Support** - Users can paste or type code directly into textareas
- **Spell Circle Animation** - Central animated spell circle for performing the merge ritual
- **Merge Simulation** - Simulates merge process with 2-second ritual animation
- **Resurrection Display** - Shows merged result in a separate panel with green styling
- **Color-Coded UI** - Red theme for HEAD, blue theme for FEATURE, green theme for merged result
- **Haunted Characters** - 🧛 for HEAD (Ancient Version), 🧙‍♀️ for FEATURE (New Creation), ⚡ for THE RESURRECTION
- **Witch Narration** - Mystical guidance messages in purple-themed panel
- **Spooky Background** - Gradient background with purple and blue glowing orbs

**State Management:**

```javascript
{
  leftCode: string,                    // Content of HEAD code panel
  rightCode: string,                   // Content of FEATURE code panel
  mergedCode: string,                  // Result of merge ritual
  isMerging: boolean,                  // Merge ritual in progress
  selectedLeftFile: FileData | null,   // Selected file for HEAD
  selectedRightFile: FileData | null,  // Selected file for FEATURE
  showLeftFileSelector: boolean,       // HEAD file selector modal visibility
  showRightFileSelector: boolean       // FEATURE file selector modal visibility
}
```

**Integration:**

- Uses `FileSelector` component for file selection from projects
- Integrates with `ProjectContext` via `useProjects()` hook (through FileSelector)
- Displays file metadata (project name, file path) when files are selected
- Preserves manual input capability alongside file selection
- Uses `SpellCircle` component for merge animation
- Part of the Git Pages Project Integration feature (Task 5)

### NecroDiff Page

A haunted code comparison tool (`src/pages/necrodiff.jsx`) that visualizes differences between two code versions with a spooky aesthetic:

**Features:**

- **File Selection Integration** - Select files from any project using the FileSelector component
- **Dual Code Panels** - Side-by-side comparison of old (THE PAST) and new (THE PRESENT) code
- **File Metadata Display** - Shows project name and file path for selected files
- **Manual Input Support** - Users can paste or type code directly into textareas
- **LCS-Based Diff Algorithm** - Computes Longest Common Subsequence for accurate line-by-line comparison
- **Context-Aware Display** - Shows 2 lines of context before/after changes
- **Haunted Characters** - Each diff line is annotated with spooky characters (🧛 Dracula for deletions, 🧟 Frankenstein for additions, 👻 Ghost for unchanged)
- **GitHub-Style Unified View** - Familiar diff format with line numbers, +/- markers, and color coding
- **Interactive Tooltips** - Hover over haunted characters to see their dark wisdom
- **Statistics Display** - Shows total additions, deletions, and unchanged lines
- **Spooky Animations** - Floating ghosts, glitch effects, and haunted background

**State Management:**

```javascript
{
  oldCode: string,                    // Content of old code panel
  newCode: string,                    // Content of new code panel
  selectedOldFile: FileData | null,   // Selected file for old code
  selectedNewFile: FileData | null,   // Selected file for new code
  showOldFileSelector: boolean,       // Old file selector modal visibility
  showNewFileSelector: boolean,       // New file selector modal visibility
  comparing: boolean,                 // Comparison in progress
  diffs: DiffLine[],                  // Array of diff results
  glitchEffect: boolean,              // Visual glitch effect state
  titleGlitch: boolean                // Title glitch animation state
}
```

**DiffLine Structure:**

```javascript
{
  type: 'addition' | 'deletion' | 'unchanged' | 'separator',
  oldLineNum: number | null,
  newLineNum: number | null,
  content: string,
  character: HauntedCharacter
}
```

**Integration:**

- Uses `FileSelector` component for file selection from projects
- Integrates with `ProjectContext` via `useProjects()` hook
- Displays file metadata (project name, file path) when files are selected
- Preserves manual input capability alongside file selection
- Part of the Git Pages Project Integration feature (Task 3)

### QR Portal Page

A mystical QR code generation and scanning interface (`src/pages/qrportal.jsx`) for summoning various haunted features:

**Features:**

- **Multiple Summon Types** - Generate QR codes for different purposes:
  - Theme switching (🎨) - Instantly change visual themes
  - Code diffs (🔀) - Share code comparisons
  - Commit history (⚰️) - Create grave QR codes from commits
  - Project files (📄) - Share specific project files
  - Deployment info (🚀) - Share deployment configurations
- **QR Code Generation** - Create QR codes with embedded data using QRGenerator component
- **QR Code Scanning** - Scan QR codes using device camera with QRScanner component
- **Recent Summons History** - View last 20 generated QR codes with timestamps
- **Persistent Storage** - All QR data saved to localStorage via qrStorageService
- **Tab Navigation** - Switch between Generate and Scan modes
- **Haunted Aesthetic** - Spooky UI with purple/green accents and ghost animations

**State Management:**

```javascript
{
  activeTab: 'generate' | 'scan',     // Current tab
  scanning: boolean,                   // Scanning in progress
  recentCodes: array,                  // Recent summons from localStorage
  scannedData: object | null          // Data from scanned QR code
}
```

**Integration:**

- Uses `qrStorageService` for persistent QR data storage
- Integrates with `QRGenerator` component for code generation
- Integrates with `QRScanner` component for code scanning
- Loads recent summons on mount via `useEffect`
- Part of the QR Portal Enhancement feature

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

### QR Portal Enhancement (Latest)

The QR Portal page has been enhanced with localStorage persistence and expanded summon types:

**Changes:**

- Integrated `qrStorageService` for persistent QR data storage
- Added `useEffect` hook to load recent summons from localStorage on mount
- Removed hardcoded mock data in favor of dynamic data from storage
- Added `scannedData` state for handling scanned QR code results
- Removed "Summon a Character" option (character summoning)
- Added two new summon types:
  - **Summon a Project File** (📄) - Generate QR codes for specific project files
  - **Summon Deployment Info** (🚀) - Create QR codes with deployment configurations
- Recent codes now display actual saved QR summons with timestamps
- All QR data persists across page refreshes via localStorage

**Supported Summon Types:**

- Theme switching (🎨)
- Code diffs (🔀)
- Commit history (⚰️)
- Project files (📄)
- Deployment configurations (🚀)

**Status:** Enhances QR Portal with persistent storage and expanded functionality.

### Terminal Page Enhancement (Task 6)

The Terminal (NecroTerminal) page has been enhanced with project selection and commit integration capabilities:

**Changes:**

- Added project selection dropdown to choose which project to work with
- Integrated commit generator to display realistic commit history
- Implemented project-aware Git command simulation
- All commands now reference selected project's files and commits
- Terminal prompt displays selected project name
- Added warning when no project is selected
- Commands like `git log` show actual generated commits for the project
- Commands like `git status` and `git diff` reference real project files
- Maintains existing terminal aesthetic and functionality

**Status:** Completes Task 6 of the Git Pages Project Integration specification.

### Ritual Page Enhancement (Task 5)

The Ritual (Merge Ritual) page has been enhanced with file selection capabilities:

**Changes:**

- Added file selection state management for HEAD and FEATURE code panels
- Integrated FileSelector component with dual modals for left and right sides
- Added "Select File" buttons above each textarea with color-coded styling (red for HEAD, blue for FEATURE)
- Displays selected file metadata (project name and file path) with color-coded borders
- Populates textareas with file content when files are selected
- Maintains existing merge functionality and manual paste capability
- All new UI elements blend seamlessly with the existing spooky aesthetic
- Imported `FileCode` icon from lucide-react for file selection buttons

**Status:** Completes Task 5 of the Git Pages Project Integration specification.

### NecroDiff Page Enhancement (Task 3)

The NecroDiff page has been enhanced with file selection capabilities:

**Changes:**

- Added file selection state management for old and new code panels
- Integrated FileSelector component with dual modals
- Added "Select File" buttons above each textarea with haunted styling
- Displays selected file metadata (project name and file path)
- Populates textareas with file content when files are selected
- Maintains existing compare functionality and manual paste capability
- All new UI elements blend seamlessly with the existing spooky aesthetic

**Status:** Completes Task 3 of the Git Pages Project Integration specification.

### FileSelector Component (Task 2)

Implemented reusable modal component for file selection across multiple pages:

- Created `src/components/FileSelector.jsx` with complete file selection UI
- Modal overlay with backdrop click-to-close and explicit close button
- Expandable/collapsible project sections showing file count and type
- Integrates with ProjectContext to display all available projects
- Returns enhanced file data including projectName and projectId
- Keyboard accessible with proper ARIA labels

**Status:** Completes Task 2 of the Git Pages Project Integration specification.

### Commit Generator Utility (Task 1)

Implemented utility for generating simulated commit data:

- Created `src/utils/commitGenerator.jsx` with complete commit generation logic
- Generates 2-5 commits per project with realistic metadata
- Implements duplicate hash detection (10% chance across projects)
- Assigns haunted characters based on change magnitude
- 12 spooky author names and 20 commit message templates
- Sorts commits chronologically (newest first)

**Status:** Completes Task 1 of the Git Pages Project Integration specification.

### Docker Ritual Tab Implementation

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

### Enhanced Project Deployment

See `.kiro/specs/enhanced-project-deployment/` for detailed specifications on the deployment system:

- `requirements.md` - Feature requirements and acceptance criteria
- `design.md` - System architecture and component design
- `tasks.md` - Implementation tasks and progress

**Completed (Tasks 1-8):**

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
- ✅ Monitoring Panel tab with real-time metrics, health status, and alerts

**Upcoming:**

- Property-based testing for configuration persistence
- Integration testing for all simulation flows
- UI polish and smooth transitions
- Toast notifications for operations

### Git Pages Project Integration

See `.kiro/specs/git-pages-project-integration/` for detailed specifications:

- `requirements.md` - Feature requirements and acceptance criteria
- `design.md` - System architecture and component design
- `tasks.md` - Implementation tasks and progress

**Completed (Task 1):**

- ✅ Commit generator utility (`src/utils/commitGenerator.jsx`)
- ✅ Generates 2-5 commits per project with realistic data
- ✅ Duplicate hash detection (10% chance across projects)
- ✅ Haunted character assignment based on change magnitude
- ✅ Spooky-themed commit messages and author names
- ✅ Chronological sorting (newest first)

**Upcoming:**

- FileSelector component for project/file selection
- NecroDiff page enhancement with file selection
- Graveyard page enhancement with commit display and project filtering
- Ritual page enhancement with file selection
- Terminal page enhancement with project-specific commands

## Git Pages Project Integration

This feature enhances Git-themed pages with project selection and file handling capabilities using simulated data from ProjectContext.

**Completed Components:**

1. **Commit Generator Utility** (`src/utils/commitGenerator.jsx`)

   - Generates realistic commit data for all projects
   - Implements duplicate hash detection
   - Assigns haunted characters based on change magnitude

2. **FileSelector Component** (`src/components/FileSelector.jsx`)

   - Reusable modal for file selection across pages
   - Displays projects with expandable file lists
   - Returns enhanced file data with project context

3. **NecroDiff Page Enhancement** (`src/pages/necrodiff.jsx`)
   - Integrated file selection for both code panels
   - Displays file metadata when files are selected
   - Preserves manual input capability

**In Progress:**

4. Graveyard page enhancement with commit display and project filtering
5. Ritual page enhancement with file selection
6. Terminal page enhancement with project-specific commands

**Design Principles:**

- No external Git/GitHub integration - all data is simulated
- Existing UI designs remain unchanged
- New elements blend with spooky aesthetic
- Shared components for consistency

## Vite Configuration

This project uses [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) with Babel for Fast Refresh during development.

## Development Notes

### LocalStorage Structure

The application uses localStorage for client-side persistence with the following keys:

- `qripocalypse_users_data` - User authentication data
- `authToken` - Current session token
- `hauntedProjects` - Project list with files and metadata
- `deployment_selected_project` - Currently selected project for deployment
- `deployment_configurations_{projectId}` - Per-project deployment configurations
- `deployment_history_{projectId}` - Per-project deployment history (max 50)
- `deployment_metrics_{projectId}` - Per-project monitoring metrics
- `deployment_alerts_{projectId}` - Per-project system alerts

### Browser Compatibility

- Requires modern browser with Web Crypto API support (for password hashing)
- Tested on Chrome, Firefox, Safari, and Edge
- LocalStorage must be enabled
- JavaScript must be enabled

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/haunted-feature`)
3. Commit your changes with spooky commit messages
4. Push to the branch (`git push origin feature/haunted-feature`)
5. Open a Pull Request

## Roadmap

### Upcoming Features

- [ ] Complete Graveyard page with commit history and project filtering
- [ ] Complete Ritual page with merge conflict resolution
- [ ] Complete Terminal page with Git command simulation
- [ ] Real backend integration for authentication
- [ ] Real Git/GitHub integration for version control
- [ ] Collaborative editing with WebSockets
- [ ] Code execution environment
- [ ] Plugin system for extensions
- [ ] Dark/Light theme toggle (currently dark only)
- [ ] Mobile responsive improvements

### Known Issues

- File upload in dashboard is UI-only (not connected to backend)
- OAuth buttons (GitHub, Google) are placeholders
- All deployment operations are simulated
- LocalStorage has size limitations (5-10MB typically)

## Support

For issues, questions, or contributions:

- Open an issue on GitHub
- Check existing documentation
- Review the spooky code comments

## Acknowledgments

- Built with React and Vite
- Icons by Lucide React
- Spooky fonts: Creepster, Nosifer, Eater (Google Fonts)
- Inspired by Halloween and developer tools

## License

MIT

---

**May your code rest in peace... or rise again stronger! 👻**
