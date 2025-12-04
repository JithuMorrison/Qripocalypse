# Project Structure

## Directory Organization

```
src/
├── components/          # Reusable React components
├── models/             # Data models and type definitions
├── pages/              # Page-level components (routes)
├── services/           # Business logic and API services
├── utils/              # Utility functions and helpers
├── styles/             # Global CSS files
└── assets/             # Static assets (images, icons)
```

## Key Directories

### `/src/components/`

Reusable UI components used across multiple pages:

- `projectContext.jsx` - Global project state management (ProjectProvider, useProjects hook)
- `ProjectSelector.jsx` - Project dropdown with localStorage persistence
- `FileSelector.jsx` - Modal for selecting files from projects
- `CloudPlatformsTab.jsx` - Multi-platform deployment configuration UI
- `DeploymentPanelTab.jsx` - Deployment history and tracking interface
- `DataDogSpiritsTab.jsx` - Monitoring and logging interface
- `MonitoringPanelTab.jsx` - Metrics visualization
- `ghostpopup.jsx`, `WatchingGhost.jsx`, `spellcircle.jsx`, `tombstone.jsx` - Themed UI elements

### `/src/pages/`

Full page components mapped to routes:

- `landing.jsx` - Main landing page after login
- `graveyard.jsx` - Project graveyard/archive
- `necrodiff.jsx` - Code diff viewer with file selection
- `ritual.jsx` - Merge conflict resolution interface
- `terminal.jsx` - Git command simulator (NecroTerminal)
- `qrportal.jsx` - QR code generation and scanning
- `alerts.jsx`, `characters.jsx`, `themes.jsx`, `settings.jsx`, `about.jsx` - Additional pages

### `/src/services/`

Business logic layer:

- `authService.jsx` - Registration, login, password hashing, token generation
- `storageService.jsx` - localStorage CRUD operations for users

### `/src/utils/`

Helper functions and utilities:

- `storageHelpers.jsx` - Deployment configs, metrics, alerts persistence
- `commitGenerator.jsx` - Generate simulated commit history for projects
- `simulationUtils.jsx` - Simulate Docker builds, cloud deployments, DataDog metrics
- `deploymentUtils.jsx` - Deployment-related helper functions
- `diffEngine.jsx` - LCS-based diff algorithm
- `ghostAI.jsx` - AI-related utilities
- `qrHandler.jsx` - QR code handling utilities

### `/src/models/`

Data model definitions and default configurations:

- `deploymentModels.jsx` - TypeScript-style JSDoc models for Docker, Kubernetes, GCP, AWS, Vercel, Render, DataDog, Deployment, MonitoringMetrics, Alert

### `/src/styles/`

Global stylesheets:

- `haunted.css` - Spooky theme styles (dark backgrounds, purple/green accents, animations)

## Root Level Files

- `App.jsx` - Main app component with routing and authentication
- `main.jsx` - React entry point
- `dashboard.jsx` - Project dashboard
- `codeeditor.jsx` - In-browser code editor
- `projectsettings.jsx` - Project configuration page
- `login.jsx`, `register.jsx` - Authentication pages
- Various legacy dashboard files (vendordash, depotdash, etc.) - appear to be from previous iteration

## State Management Pattern

- **Global State**: ProjectContext provides `projectsList` and `setProjectsList` to all components via `useProjects()` hook
- **Local State**: Component-level useState for UI state
- **Persistence**: Automatic localStorage sync in ProjectContext, manual saves in utils/storageHelpers

## Routing Pattern

Protected routes require authentication (token in localStorage). All routes wrapped in `<ProtectedRoute>` component except `/login` and `/register`.

## File Naming Conventions

- Components: PascalCase (e.g., `ProjectSelector.jsx`)
- Pages: lowercase (e.g., `landing.jsx`, `necrodiff.jsx`)
- Services/Utils: camelCase (e.g., `authService.jsx`, `storageHelpers.jsx`)
- All React files use `.jsx` extension
