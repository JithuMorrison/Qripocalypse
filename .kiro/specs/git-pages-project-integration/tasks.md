# Implementation Plan

- [ ] 1. Create commit generator utility

  - Create `src/utils/commitGenerator.jsx` with function to generate simulated commits for projects
  - Generate 2-5 commits per project with realistic data (hash, message, author, date, changes)
  - Implement duplicate hash detection (10% chance of duplicates across projects)
  - Assign haunted characters based on change magnitude
  - _Requirements: 6.1, 6.4_

- [ ] 2. Create FileSelector component

  - Create `src/components/FileSelector.jsx` as a reusable modal component
  - Fetch projects from `useProjects()` hook
  - Display projects in a list with spooky styling matching existing theme
  - Show files for each project in a simple list structure
  - Call `onSelectFile` callback with complete file data when user clicks a file
  - Include close button and backdrop click to close modal
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 3. Enhance NecroDiff page with file selection

  - Add state for selected files and file selector modals (old and new sides)
  - Add "Select File" buttons above each textarea (styled to match existing theme)
  - Integrate FileSelector modal for both old and new code panels
  - When file selected, populate textarea with file content
  - Display file path and project name above textarea when file is selected
  - Preserve existing compare functionality and manual paste capability
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 4. Enhance Graveyard page with project filtering and commits

  - Add state for all commits, selected project, and filtered commits
  - Add project selector dropdown above search bar with "All Projects" option
  - On mount, generate commits for all projects using commit generator
  - Implement project filtering logic (filter by selected project or show all)
  - Add project name badge to each tombstone (top-right corner)
  - Apply golden border/glow styling for duplicate commits
  - Update search to work within selected project scope
  - Ensure search filters by message, author, or project name
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [ ] 5. Enhance Ritual page with file selection

  - Add state for selected files and file selector modals (left and right sides)
  - Add "Select File" buttons above each code block (styled to match existing theme)
  - Integrate FileSelector modal for both HEAD and FEATURE panels
  - When file selected, populate textarea with file content
  - Display file path and project name above each panel when file is selected
  - Preserve existing merge functionality and manual paste capability
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 6. Enhance Terminal page with project selection

  - Add state for selected project
  - Add project selector dropdown above terminal window (styled to match existing theme)
  - Update terminal prompt to show selected project name when project is selected
  - Display message prompting user to select project when none is selected
  - Implement project-specific command simulation for git commands
  - Update `git status` to show simulated status based on project files
  - Update `git log` to show generated commits for selected project
  - Update `git diff` to show simulated diff for random file from project
  - Update `git branch` to show simulated branches
  - Update other commands to include project-aware responses
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 7. Final checkpoint - Verify all functionality
  - Ensure all tests pass, ask the user if questions arise
  - Test file selection in NecroDiff and Ritual pages
  - Test project filtering and commit display in Graveyard
  - Test project selection and commands in Terminal
  - Verify all styling matches existing spooky theme
  - Verify no UI design changes, only new functionality added
