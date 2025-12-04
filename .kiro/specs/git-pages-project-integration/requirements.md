# Requirements Document

## Introduction

This feature enhances the existing Git-themed pages (NecroDiff, Graveyard, Ritual, and Terminal) by integrating project selection and file handling capabilities using simulated data. Users will be able to select projects from the project context, work with project files, and view simulated commit data across all projects. All functionality is simulated without any real GitHub integration. The existing UI design and theme remain unchanged - only new functionality is added.

## Glossary

- **NecroDiff**: A diff viewer page that compares code changes with a Halloween theme
- **Graveyard**: A commit history viewer displaying commits as tombstones
- **Ritual**: A merge conflict resolution interface with mystical theming
- **Terminal**: A command-line interface simulator for Git commands
- **Project Context**: The React context providing access to project data and files
- **File Selector**: A UI component allowing users to browse and select files from projects
- **Commit Data**: Simulated Git commit information including hash, message, author, date, and changes
- **Simulated Data**: Mock data generated within the application without any external Git or GitHub integration

## Requirements

### Requirement 1

**User Story:** As a user, I want to select files from my projects in NecroDiff, so that I can compare actual project files instead of just pasting code.

#### Acceptance Criteria

1. WHEN a user opens NecroDiff THEN the system SHALL display file selector buttons for both the old and new code panels without changing the existing UI design
2. WHEN a user clicks a file selector button THEN the system SHALL display a modal with available projects and their files from the project context
3. WHEN a user selects a file from a project THEN the system SHALL populate the corresponding code panel with that file's simulated content
4. WHEN a user pastes code manually THEN the system SHALL accept the pasted content and allow comparison
5. WHERE a user has selected files from projects THEN the system SHALL display the file path and project name above each code panel

### Requirement 2

**User Story:** As a user, I want to view commits from all my projects in the Graveyard, so that I can see the complete history across my work.

#### Acceptance Criteria

1. WHEN a user opens the Graveyard page THEN the system SHALL display simulated commits from all projects in the project context
2. WHEN a user opens the Graveyard page THEN the system SHALL display a project selector dropdown with an "All Projects" option
3. WHEN a user selects a specific project THEN the system SHALL filter commits to show only that project's commits
4. WHEN a user selects "All Projects" THEN the system SHALL display commits from all projects
5. WHEN displaying commits THEN the system SHALL show each commit as a tombstone with project identification using the existing tombstone design
6. WHERE commits have the same hash across different projects THEN the system SHALL highlight them with a different color to indicate duplication
7. WHEN a user clicks on a tombstone THEN the system SHALL display detailed commit information in a ghost popup using the existing popup design
8. WHEN a user searches for commits THEN the system SHALL filter simulated commits within the selected project scope by message, author, or project name

### Requirement 3

**User Story:** As a user, I want to select files or paste code in the Merge Ritual page, so that I can resolve conflicts using actual project files.

#### Acceptance Criteria

1. WHEN a user opens the Ritual page THEN the system SHALL display file selector buttons for both HEAD and FEATURE panels without changing the existing UI design
2. WHEN a user clicks a file selector button THEN the system SHALL display a modal with available projects and their files from the project context
3. WHEN a user selects a file THEN the system SHALL populate the corresponding panel with the file's simulated content
4. WHEN a user pastes code manually THEN the system SHALL accept the pasted content for merge resolution
5. WHERE files are selected from projects THEN the system SHALL display the file path and project name above each panel

### Requirement 4

**User Story:** As a user, I want to select a project in the Terminal page before running commands, so that I can execute Git commands in the context of a specific project.

#### Acceptance Criteria

1. WHEN a user opens the Terminal page THEN the system SHALL display a project selector dropdown without changing the existing UI design
2. WHEN no project is selected THEN the system SHALL display a message prompting the user to select a project
3. WHEN a user selects a project THEN the system SHALL update the terminal prompt to show the selected project name
4. WHEN a user runs a Git command with a project selected THEN the system SHALL simulate command execution in the context of that project
5. WHERE a project is selected THEN the system SHALL display simulated project-specific responses to Git commands

### Requirement 5

**User Story:** As a developer, I want a reusable file selector component, so that I can maintain consistency across all pages that need file selection.

#### Acceptance Criteria

1. THE system SHALL provide a FileSelector component that displays projects and their simulated files
2. WHEN the FileSelector is rendered THEN the system SHALL fetch projects from the project context
3. WHEN a user selects a file THEN the system SHALL invoke a callback function with the selected file's simulated data
4. THE FileSelector SHALL display files in a simple list structure organized by project
5. THE FileSelector SHALL maintain the spooky theme consistent with other pages without requiring UI redesign

### Requirement 6

**User Story:** As a user, I want to see realistic commit data in the Graveyard, so that I can understand the actual history of my projects.

#### Acceptance Criteria

1. THE system SHALL generate simulated commit data for each project including hash, message, author, date, and file changes
2. WHEN displaying commits THEN the system SHALL show the simulated number of additions and deletions
3. WHERE a project has multiple commits THEN the system SHALL display them in chronological order
4. THE system SHALL assign appropriate haunted characters to commits based on simulated change type
5. WHERE duplicate commit hashes exist across projects THEN the system SHALL use a distinct visual indicator without changing the existing tombstone design
