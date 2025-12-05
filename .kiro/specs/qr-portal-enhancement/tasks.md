# Implementation Plan

- [x] 1. Create core utilities and components

  - Create qrStorageService.jsx with save/retrieve functions using existing encodeToObjectId
  - Add recent summons management (add, get, limit to 20) with localStorage
  - Create PremiumDialog.jsx with spooky modal (dark overlay, "Pay to Unlock", Creepster font, ghost emojis)
  - Create PersonaSelector.jsx dropdown with localStorage persistence
  - Create AlertGenerator.jsx utility to detect code issues (cursed loops, dead variables, suspicious logic, missing error handling, security issues)
  - _Requirements: 1.2, 3.1, 3.2, 3.3, 6.1, 6.2, 9.1-9.5, 10.4, 10.5_

- [x] 2. Enhance QR Portal with multiple summon types

  - Update qrportal.jsx to REMOVE character summon - keep ONLY: theme, diff summary, commit, project file, deployment info
  - Enhance QRGenerator.jsx with type-specific inputs (project selector for projectFile/deployment, FileSelector integration)
  - Integrate ProjectContext to load projects and files
  - Store QR data with ID in localStorage for each summon type
  - Enhance QRScanner (qscan.jsx) to extract ID, retrieve data from localStorage, and display based on type
  - Add recent summons history with resummon functionality
  - Add syntax highlighting for project file display
  - _Requirements: 1.1-1.5, 2.1-2.5, 7.1-7.5, 8.1-8.5, 10.1-10.3_

- [x] 3. Update Characters page

  - Add PersonaSelector dropdown at top to choose active persona
  - REMOVE "Go to QR Portal" button completely
  - Update "Learn Summoning Spells" button to show PremiumDialog
  - Add localStorage integration for persona persistence
  - _Requirements: 3.1-3.5_

- [x] 4. Update Themes page

  - Replace "QR Code" placeholder in white preview box with active theme icon
  - Display Dracula icon (🧛) for dracula theme, flickering ghost (👻 animated) for possession theme
  - Update icons when theme changes
  - Make "Generate New QR" button show PremiumDialog
  - _Requirements: 4.1-4.5_

- [x] 5. Update Alerts page with project-based alerts

  - Load actual projects from ProjectContext (useProjects hook)
  - Use AlertGenerator to analyze project files and generate 8-10 alerts
  - Display alerts with ACTUAL project names and file paths from created projects
  - Show at least 5 alert types (curse, dead, suspicious, security, deprecated)
  - Add empty state when no projects exist
  - _Requirements: 5.1-5.5_
