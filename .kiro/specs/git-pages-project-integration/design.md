# Design Document

## Overview

This design enhances four existing Git-themed pages (NecroDiff, Graveyard, Ritual, and Terminal) by integrating project selection and file handling capabilities. The implementation uses simulated data from the existing project context without any external Git or GitHub integration. The existing UI designs remain unchanged - we only add new interactive elements that blend seamlessly with the current spooky aesthetic.

## Architecture

### Component Structure

```
Pages (Enhanced)
├── NecroDiff
│   ├── FileSelector Modal (new)
│   ├── File Selection Buttons (new)
│   └── Existing diff display
├── Graveyard
│   ├── Commit Generator (new)
│   └── Existing tombstone display
├── Ritual
│   ├── FileSelector Modal (new)
│   ├── File Selection Buttons (new)
│   └── Existing merge display
└── Terminal
    ├── Project Selector (new)
    └── Existing terminal display

Shared Components (New)
├── FileSelector
│   ├── Project List
│   └── File List
└── Commit Generator Utility
```

### Data Flow

1. **Project Context** → Provides project list with files
2. **Commit Generator** → Creates simulated commits for projects
3. **FileSelector** → Displays projects/files, returns selected file
4. **Pages** → Consume selected files and display in existing UI

## Components and Interfaces

### 1. FileSelector Component

A reusable modal component for selecting files from projects.

**Props:**

```javascript
{
  isOpen: boolean,
  onClose: () => void,
  onSelectFile: (file: FileData) => void,
  title: string
}
```

**FileData Interface:**

```javascript
{
  id: number,
  name: string,
  content: string,
  type: 'file',
  language: string,
  path: string,
  projectName: string,
  projectId: number
}
```

**Behavior:**

- Fetches projects from `useProjects()` hook
- Displays projects in a list with spooky styling
- Shows files for each project
- Calls `onSelectFile` with complete file data when user clicks a file
- Maintains dark, haunted theme with existing color scheme

### 2. Commit Generator Utility

A utility function that generates simulated commit data for projects.

**Function Signature:**

```javascript
generateCommitsForProjects(projects: Project[]): Commit[]
```

**Commit Interface:**

```javascript
{
  hash: string,           // 8-character hex
  message: string,        // Descriptive commit message
  author: string,         // Author name
  date: string,          // ISO date string
  changes: string,       // e.g., "+12 -4"
  ghost: string,         // Emoji character
  epitaph: string,       // Spooky message
  projectId: number,     // Associated project
  projectName: string,   // Project name
  isDuplicate: boolean   // True if hash appears in multiple projects
}
```

**Generation Logic:**

- Creates 2-5 commits per project
- Generates realistic commit messages based on file types
- Assigns random authors from a spooky name pool
- Creates dates within the last 30 days
- Randomly generates additions/deletions counts
- Assigns haunted characters based on change magnitude
- Identifies duplicate hashes across projects (10% chance)

### 3. Enhanced NecroDiff Page

**New State:**

```javascript
const [selectedOldFile, setSelectedOldFile] = useState(null);
const [selectedNewFile, setSelectedNewFile] = useState(null);
const [showOldFileSelector, setShowOldFileSelector] = useState(false);
const [showNewFileSelector, setShowNewFileSelector] = useState(false);
```

**New UI Elements:**

- "Select File" button above each textarea (styled to match existing theme)
- File path display when file is selected (subtle, above textarea)
- FileSelector modal for each side

**Integration:**

- When file selected, populate textarea with file content
- Allow manual editing after file selection
- Preserve existing compare functionality

### 4. Enhanced Graveyard Page

**New State:**

```javascript
const [allCommits, setAllCommits] = useState([]);
const [selectedProject, setSelectedProject] = useState(null); // null means "All Projects"
const [filteredCommits, setFilteredCommits] = useState([]);
```

**New UI Elements:**

- Project selector dropdown above search bar (includes "All Projects" option)
- Project name badge on each tombstone

**New Logic:**

- On mount, generate commits for all projects using commit generator
- When project selected, filter commits to show only that project's commits
- When "All Projects" selected, show all commits
- Add project name badge to each tombstone
- Apply different border color for duplicate commits (e.g., gold border)
- Update search to work within the currently selected project filter
- Search filters by message, author, or project name

**UI Changes:**

- Add project selector dropdown (styled to match existing theme)
- Add project name badge to tombstone (top-right corner)
- Duplicate commits get special styling (golden glow effect)
- No other visual changes to existing tombstone design

### 5. Enhanced Ritual Page

**New State:**

```javascript
const [selectedLeftFile, setSelectedLeftFile] = useState(null);
const [selectedRightFile, setSelectedRightFile] = useState(null);
const [showLeftFileSelector, setShowLeftFileSelector] = useState(false);
const [showRightFileSelector, setShowRightFileSelector] = useState(false);
```

**New UI Elements:**

- "Select File" button above each code block
- File path display when file is selected
- FileSelector modal for each side

**Integration:**

- When file selected, populate code textarea with file content
- Allow manual editing after file selection
- Preserve existing merge functionality

### 6. Enhanced Terminal Page

**New State:**

```javascript
const [selectedProject, setSelectedProject] = useState(null);
```

**New UI Elements:**

- Project selector dropdown above terminal window
- Updated prompt to show project name when selected

**Command Simulation:**

- `git status`: Show simulated status based on project files
- `git log`: Show generated commits for selected project
- `git diff`: Show simulated diff for random file
- `git branch`: Show simulated branches
- Other commands: Context-aware responses mentioning project name

## Data Models

### Project (Existing)

```javascript
{
  id: number,
  name: string,
  description: string,
  type: string,
  lastUpdated: string,
  collaborators: number,
  branches: number,
  status: string,
  ghost: string,
  files: File[]
}
```

### File (Existing)

```javascript
{
  id: number,
  name: string,
  content: string,
  type: 'file',
  language: string,
  path: string
}
```

### Commit (New)

```javascript
{
  hash: string,
  message: string,
  author: string,
  date: string,
  changes: string,
  ghost: string,
  epitaph: string,
  projectId: number,
  projectName: string,
  isDuplicate: boolean
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property Reflection

After analyzing all acceptance criteria, several properties were identified as redundant or overlapping:

- File selector behaviors (1.2, 3.2) are identical across NecroDiff and Ritual pages
- File selection population (1.3, 3.3) follows the same pattern
- Manual paste acceptance (1.4, 3.4) is the same behavior
- File metadata display (1.5, 3.5) is identical
- Commit display properties (2.2, 6.2) overlap significantly
- Duplicate highlighting (2.3, 6.5) is stated twice

These have been consolidated into comprehensive properties that cover all cases.

### Correctness Properties

**Property 1: File selector modal displays projects and files**
_For any_ page with file selection capability (NecroDiff, Ritual), when a user clicks a file selector button, the FileSelector modal should open and display all projects from the project context with their associated files.
**Validates: Requirements 1.2, 3.2, 5.2**

**Property 2: File selection populates content**
_For any_ file selected from the FileSelector modal, the corresponding code panel or textarea should be populated with that file's content property.
**Validates: Requirements 1.3, 3.3, 5.3**

**Property 3: Manual input is preserved**
_For any_ code panel or textarea, when a user manually types or pastes content, that content should be accepted and preserved for comparison or merge operations.
**Validates: Requirements 1.4, 3.4**

**Property 4: Selected file metadata is displayed**
_For any_ file selected from a project, the file path and project name should be displayed above the corresponding code panel.
**Validates: Requirements 1.5, 3.5**

**Property 5: All projects generate commits**
_For any_ project in the project context, the commit generator should create at least one commit with all required fields (hash, message, author, date, changes, ghost, epitaph, projectId, projectName).
**Validates: Requirements 6.1**

**Property 6: Commits display complete information**
_For any_ generated commit, when displayed as a tombstone, it should show the commit message, author, date, changes count, project name, and haunted character.
**Validates: Requirements 2.5, 6.2**

**Property 7: Duplicate commits are identified**
_For any_ set of commits where two or more share the same hash value, all commits with that hash should be marked with isDuplicate: true.
**Validates: Requirements 2.6, 6.5**

**Property 8: Duplicate commits have distinct styling**
_For any_ commit marked as isDuplicate, the tombstone should render with a distinct visual indicator (e.g., golden border or glow effect).
**Validates: Requirements 2.6, 6.5**

**Property 9: Tombstone click opens popup**
_For any_ tombstone clicked, a ghost popup should appear displaying the complete commit details.
**Validates: Requirements 2.7**

**Property 10: Project filter in Graveyard**
_For any_ project selected in the Graveyard dropdown, the displayed commits should only include commits from that specific project. When "All Projects" is selected, all commits should be displayed.
**Validates: Requirements 2.3, 2.4**

**Property 11: Search filters within project scope**
_For any_ search term entered in Graveyard, the displayed commits should only include those where the term appears in the message, author, or project name fields (case-insensitive) and match the currently selected project filter.
**Validates: Requirements 2.8**

**Property 12: Commits are chronologically ordered**
_For any_ list of displayed commits, they should be sorted by date in descending order (newest first).
**Validates: Requirements 6.3**

**Property 13: Project selection updates terminal prompt**
_For any_ project selected in the Terminal page, the terminal prompt should display that project's name.
**Validates: Requirements 4.3**

**Property 14: Commands execute in project context**
_For any_ Git command executed with a project selected, the simulated response should reference or use data from that specific project.
**Validates: Requirements 4.4, 4.5**

**Property 15: Haunted characters match change magnitude**
_For any_ generated commit, the assigned haunted character should correspond to the magnitude of changes (e.g., large changes get more dramatic characters like Reaper, small changes get Ghost).
**Validates: Requirements 6.4**

## Error Handling

### File Selection Errors

- **No projects available**: Display friendly message "No projects found in the spirit realm..."
- **Empty project (no files)**: Show message "This project's files have vanished..."
- **File content missing**: Use empty string and log warning

### Commit Generation Errors

- **Invalid project data**: Skip project and log warning
- **Date generation fails**: Use current date as fallback
- **Hash collision (unintended)**: Regenerate hash up to 3 times

### Terminal Command Errors

- **No project selected**: Display prompt "Select a project to commune with the spirits..."
- **Unknown command**: Display existing "spirits do not recognize" message
- **Invalid project state**: Show generic error message

### General Error Handling

- All errors should maintain the spooky theme in messaging
- Failed operations should not crash the page
- Console warnings for debugging, user-friendly messages for UI

## Implementation Notes

### Styling Consistency

- Use existing CSS classes and color schemes
- New elements should blend with current spooky aesthetic
- Maintain existing font families (Creepster, Nosifer, Eater)
- Use existing animation patterns (float, pulse, glitch)

### Performance Considerations

- Commit generation should be memoized to avoid recalculation
- File selector should virtualize long file lists if needed
- Search filtering should debounce user input

### Accessibility

- File selector modal should trap focus
- Keyboard navigation for file selection (arrow keys, enter)
- ARIA labels for new interactive elements
- Maintain existing accessibility patterns

### Browser Compatibility

- Target modern browsers (Chrome, Firefox, Safari, Edge)
- Use standard React patterns (no experimental features)
- Test on both desktop and mobile viewports
