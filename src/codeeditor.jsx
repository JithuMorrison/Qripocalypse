// CodeEditor.jsx - Updated with proper collaborators handling

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Save, GitBranch, Users, Settings, Zap, 
  Folder, File, Plus, Terminal, Bot, Download,
  Github, RefreshCw, Trash2, Edit2, X, Check,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjects } from './components/projectContext';

// Sample GitHub data for different users/projects
const SAMPLE_GITHUB_PROJECTS = {
  'dracula/haunted-castle': {
    files: [
      { id: 1, name: 'README.md', content: '# Haunted Castle\n\nA spooky React application built with dark magic.', type: 'file', language: 'markdown', path: 'README.md' },
      { id: 2, name: 'main.js', content: 'console.log("Welcome to the haunted castle!");\n\nfunction summonSpirits() {\n  console.log("Spirits summoned!");\n}', type: 'file', language: 'javascript', path: 'src/main.js' },
      { id: 3, name: 'styles.css', content: 'body {\n  background: #0a0a0a;\n  color: #8b5cf6;\n  font-family: "Cursed Font", monospace;\n}', type: 'file', language: 'css', path: 'src/styles.css' },
      { id: 4, name: 'src', type: 'folder', children: [
        { id: 5, name: 'components', type: 'folder', children: [
          { id: 6, name: 'Ghost.js', content: 'export default function Ghost() {\n  return <div className="ghost">👻</div>;\n}', type: 'file', language: 'javascript', path: 'src/components/Ghost.js' },
          { id: 7, name: 'Potion.js', content: 'export default function Potion() {\n  return <div className="potion">🧪</div>;\n}', type: 'file', language: 'javascript', path: 'src/components/Potion.js' }
        ]},
        { id: 8, name: 'utils.js', content: 'export function castSpell(spell) {\n  return `🔮 ${spell}!`;\n}\n\nexport function brewPotion() {\n  return "🧪 Magic potion ready!";\n}', type: 'file', language: 'javascript', path: 'src/utils.js' }
      ]}
    ],
    collaborators: [
      { id: 1, name: 'Dracula', avatar: '🧛', online: true },
      { id: 2, name: 'Frankenstein', avatar: '🧟', online: true }
    ]
  },
  'witch/spellbook': {
    files: [
      { id: 9, name: 'package.json', content: '{\n  "name": "ancient-spellbook",\n  "version": "1.0.0",\n  "description": "A collection of magical incantations"\n}', type: 'file', language: 'json', path: 'package.json' },
      { id: 10, name: 'spells.js', content: 'const spells = {\n  levitation: "Wingardium Leviosa",\n  fire: "Incendio",\n  protection: "Protego"\n};\n\nexport default spells;', type: 'file', language: 'javascript', path: 'src/spells.js' },
      { id: 11, name: 'ingredients.md', content: '# Magical Ingredients\n\n- Eye of newt\n- Bat wing\n- Wolfsbane\n- Dragon scale', type: 'file', language: 'markdown', path: 'docs/ingredients.md' }
    ],
    collaborators: [
      { id: 1, name: 'Witch', avatar: '🧙‍♀️', online: true },
      { id: 3, name: 'Wizard', avatar: '🧙', online: false }
    ]
  },
  'frankenstein/lab': {
    files: [
      { id: 12, name: 'experiment.js', content: 'class Monster {\n  constructor() {\n    this.parts = ["brain", "heart", "limbs"];\n  }\n  \n  animate() {\n    console.log("It\'s alive!");\n  }\n}', type: 'file', language: 'javascript', path: 'lab/experiment.js' },
      { id: 13, name: 'notes.txt', content: 'Day 1: Successfully reanimated frog.\nDay 2: Human heart transplant in progress.\nDay 3: Need more lightning.', type: 'file', language: 'text', path: 'docs/notes.txt' }
    ],
    collaborators: [
      { id: 2, name: 'Frankenstein', avatar: '🧟', online: true },
      { id: 4, name: 'Igor', avatar: '👨‍🔬', online: true }
    ]
  }
};

const CodeEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Get projects from context
  const { projectsList, setProjectsList } = useProjects();
  
  // State for project selection (when not using params)
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [repoInput, setRepoInput] = useState('');
  const [currentRepo, setCurrentRepo] = useState('');
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [githubToken, setGithubToken] = useState(localStorage.getItem("github_token"));
  
  // Modified files tracking - fixed key to include project id
  const [modifiedFiles, setModifiedFiles] = useState(() => {
    const projectKey = id ? `modifiedFiles_${id}` : 'modifiedFiles_github';
    const saved = localStorage.getItem(projectKey);
    if (!saved) return new Map();
    try {
      return new Map(Object.entries(JSON.parse(saved)));
    } catch {
      return new Map();
    }
  });
  
  const [isCommitting, setIsCommitting] = useState(false);
  const [fileAction, setFileAction] = useState({ type: null, parentId: null });
  const [newFileName, setNewFileName] = useState('');
  const [editingFileId, setEditingFileId] = useState(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  const fileEditorRef = useRef(null);
  
  // Get current project from URL parameter OR selected project
  const currentProject = id 
    ? projectsList.find(p => p.id === parseInt(id)) 
    : selectedProjectId 
      ? projectsList.find(p => p.id === parseInt(selectedProjectId))
      : null;

  // Save modified files to localStorage whenever they change
  useEffect(() => {
    const projectKey = currentProject ? `modifiedFiles_${currentProject.id}` : 'modifiedFiles_github';
    const obj = Object.fromEntries(modifiedFiles);
    localStorage.setItem(projectKey, JSON.stringify(obj));
  }, [modifiedFiles, currentProject]);

  // Load project files when component mounts or project changes
  useEffect(() => {
    if (currentProject) {
      // Deep clone files and attach originalContent
      const projectFiles = JSON.parse(JSON.stringify(currentProject.files || []));
      attachOriginalContent(projectFiles);
      
      setFiles(projectFiles);
      
      // Initialize collaborators for the project
      setCollaborators([
        { id: 1, name: 'You', avatar: '🧑‍💻', online: true },
        ...(Array.isArray(currentProject.collaborators) ? currentProject.collaborators : [])
      ]);
      
      // Set current repo name
      setCurrentRepo(`${currentProject.name}`);
      
      // Set first file as active
      const firstFile = findFirstFile(projectFiles);
      if (firstFile) setActiveFile(firstFile.id);
      
      // Clear GitHub repo input
      setRepoInput('');
    }
  }, [currentProject]);

  const updateCursorPosition = (content) => {
    if (!content || !fileEditorRef.current) return;
    
    const textarea = fileEditorRef.current;
    const text = content.substring(0, textarea.selectionStart);
    const lines = text.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    setCursorPosition({ line, column });
  };

  // Load a project from projectsList (not just sample ones)
  const loadProject = (projectId) => {
    const project = projectsList.find(p => p.id === parseInt(projectId));
    if (!project) return;

    // Deep clone files and attach originalContent
    const projectFiles = JSON.parse(JSON.stringify(project.files || []));
    attachOriginalContent(projectFiles);
    
    setFiles(projectFiles);
    setSelectedProjectId(projectId);
    const projectKey = `modifiedFiles_${projectId}`;
    const saved = localStorage.getItem(projectKey);

    if (saved) {
      try {
        setModifiedFiles(new Map(Object.entries(JSON.parse(saved))));
      } catch {
        setModifiedFiles(new Map());
      }
    } else {
      setModifiedFiles(new Map());
    }
    setCurrentRepo(project.name);
    
    // Initialize collaborators
    setCollaborators([
      { id: 1, name: 'You', avatar: '🧑‍💻', online: true },
      ...(Array.isArray(project.collaborators) ? project.collaborators : [])
    ]);

    const firstFile = findFirstFile(projectFiles);
    if (firstFile) setActiveFile(firstFile.id);
  };

  // Load GitHub sample project (for GitHub mode)
  const loadGitHubRepo = (repoName) => {
    const normalizedRepoName = repoName.toLowerCase().trim();

    if (SAMPLE_GITHUB_PROJECTS[normalizedRepoName]) {
      const project = SAMPLE_GITHUB_PROJECTS[normalizedRepoName];

      // Deep clone files and attach originalContent
      const clonedFiles = JSON.parse(JSON.stringify(project.files));
      attachOriginalContent(clonedFiles);

      setFiles(clonedFiles);
      setCurrentRepo(repoName);
      setModifiedFiles(new Map(Object.entries(JSON.parse(localStorage.getItem(`modifiedFiles_github`)))))
      setSelectedProjectId(''); // Clear any project selection
      setCollaborators(project.collaborators || []);

      const firstFile = findFirstFile(clonedFiles);
      if (firstFile) setActiveFile(firstFile.id);
    }
  };

  function attachOriginalContent(fileList) {
    for (const file of fileList) {
      if (file.type === "file") {
        // Save original content for modification tracking
        file.originalContent = file.content;
      }
      if (file.children) {
        attachOriginalContent(file.children);
      }
    }
  }

  const findFirstFile = (fileList) => {
    for (const file of fileList) {
      if (file.type === 'file') return file;
      if (file.children) {
        const found = findFirstFile(file.children);
        if (found) return found;
      }
    }
    return null;
  };

  const getFileContent = (fileId, fileList = files) => {
    for (const file of fileList) {
      if (file.id === fileId) {
        // Check if file has been modified
        const modifiedContent = modifiedFiles.get(fileId.toString());
        if (modifiedContent !== undefined) {
          return { ...file, content: modifiedContent };
        }
        return file;
      }
      if (file.children) {
        const found = getFileContent(fileId, file.children);
        if (found) return found;
      }
    }
    return null;
  };

  const activeFileContent = activeFile ? getFileContent(activeFile) : null;

  const runCode = async () => {
    if (!activeFileContent) return;
    
    setIsRunning(true);
    setOutput('🔮 The spirits are executing your code...\n\n');
    
    // Simulate code execution
    setTimeout(() => {
      if (activeFileContent.language === 'javascript') {
        const content = activeFileContent.content || '';
        setOutput(prev => prev + 
          `✨ Executing: ${activeFileContent.name}\n` +
          `📝 Output: ${content.includes('console.log') ? 'Check browser console' : 'No console output'}\n` +
          `💀 Process finished with exit code 0\n`
        );
      } else {
        setOutput(prev => prev + 
          `📁 File: ${activeFileContent.name}\n` +
          `🔤 Language: ${activeFileContent.language}\n` +
          `📊 Size: ${(activeFileContent.content?.length || 0)} characters\n`
        );
      }
      setIsRunning(false);
    }, 1500);
  };

  const saveFile = () => {
    if (!activeFileContent) return;
    
    // Save modifications
    const projectKey = currentProject ? `modifiedFiles_${currentProject.id}` : 'modifiedFiles_github';
    const obj = Object.fromEntries(modifiedFiles);
    localStorage.setItem(projectKey, JSON.stringify(obj));
    
    // Update the project in the main projects list if it's a local project
    if (currentProject && setProjectsList) {
      const updatedProjects = projectsList.map(project => {
        if (project.id === currentProject.id) {
          // Update the specific file content in the project
          const updatedFiles = updateFileInProject(project.files, activeFile, activeFileContent.content);
          return { ...project, files: updatedFiles };
        }
        return project;
      });
      setProjectsList(updatedProjects);
    }
    
    setOutput(prev => prev + `💾 Saved: ${activeFileContent.name}\n`);
  };

  const handleFileChange = (content) => {
    if (!activeFile) return;

    const file = getFileContent(activeFile);
    if (!file) return;

    // Compare with original content (originalContent is set when loading)
    const originalContent = file.originalContent || '';
    const isActuallyModified = content !== originalContent;

    setModifiedFiles(prev => {
      const newMap = new Map(prev);

      if (isActuallyModified) {
        newMap.set(activeFile.toString(), content);
      } else {
        // If user reverts back to original, remove "modified"
        newMap.delete(activeFile.toString());
      }

      return newMap;
    });

    const updatedFiles = updateFileContent(files, activeFile, content);
    setFiles(updatedFiles);
    updateCursorPosition(content);
  };

  const createFile = (parentId = null, type = 'file') => {
    if (!newFileName.trim()) {
      setFileAction({ type: null, parentId: null });
      setNewFileName('');
      return;
    }

    const newId = Date.now();
    const newFile = {
      id: newId,
      name: newFileName,
      type: type,
      content: type === 'file' ? `// New ${type}\n// Created: ${new Date().toLocaleString()}\n` : '',
      language: type === 'file' ? 'javascript' : null,
      path: newFileName,
      originalContent: type === 'file' ? `// New ${type}\n// Created: ${new Date().toLocaleString()}\n` : ''
    };

    const updatedFiles = addFileToTree(files, parentId, newFile);
    setFiles(updatedFiles);
    
    if (type === 'file') {
      setActiveFile(newId);
    }

    // If it's a local project, update the project in context
    if (currentProject && setProjectsList) {
      const updatedProjects = projectsList.map(project => {
        if (project.id === currentProject.id) {
          return { ...project, files: updatedFiles };
        }
        return project;
      });
      setProjectsList(updatedProjects);
    }

    setOutput(prev => prev + `✨ Created new ${type}: ${newFileName}\n`);
    setFileAction({ type: null, parentId: null });
    setNewFileName('');
  };

  const addFileToTree = (files, parentId, newFile, fileList = files) => {
    // If parentId is null, add to root
    if (parentId === null) {
      return [...fileList, newFile];
    }

    // Recursively search for the parent folder
    return fileList.map(file => {
      if (file.id === parentId && file.type === 'folder') {
        return {
          ...file,
          children: [...(file.children || []), newFile]
        };
      }
      
      if (file.children) {
        return {
          ...file,
          children: addFileToTree(files, parentId, newFile, file.children)
        };
      }
      
      return file;
    });
  };

  const deleteFile = (fileId) => {
    const file = getFileContent(fileId);
    if (!file) return;

    const updatedFiles = removeFileFromTree(files, fileId);
    setFiles(updatedFiles);

    // If we deleted the active file, clear it
    if (activeFile === fileId) {
      setActiveFile(null);
    }

    // Remove from modified files if it was there (FIXED)
    setModifiedFiles(prev => {
      const newMap = new Map(prev);
      // When deleting a file, we should NOT mark it as modified
      // Just remove it from the modified files map
      newMap.delete(fileId.toString());
      return newMap;
    });

    // If it's a local project, update the project in context
    if (currentProject && setProjectsList) {
      const updatedProjects = projectsList.map(project => {
        if (project.id === currentProject.id) {
          return { ...project, files: updatedFiles };
        }
        return project;
      });
      setProjectsList(updatedProjects);
    }

    setOutput(prev => prev + `🗑️ Deleted: ${file.name}\n`);
  };

  const renameFile = (fileId, newName) => {
    if (!newName.trim()) return;

    const updatedFiles = renameFileInTree(files, fileId, newName);
    setFiles(updatedFiles);
    
    // If it's a local project, update the project in context
    if (currentProject && setProjectsList) {
      const updatedProjects = projectsList.map(project => {
        if (project.id === currentProject.id) {
          return { ...project, files: updatedFiles };
        }
        return project;
      });
      setProjectsList(updatedProjects);
    }
    
    setOutput(prev => prev + `✏️ Renamed to: ${newName}\n`);
    setEditingFileId(null);
    setEditNameValue('');
  };

  const startEditName = (fileId, currentName) => {
    setEditingFileId(fileId);
    setEditNameValue(currentName);
  };

  const commitChanges = async () => {
    if (modifiedFiles.size === 0) {
      setOutput('⚠️ No changes to commit. Make some modifications first!');
      return;
    }

    setIsCommitting(true);
    setOutput('🔮 Committing changes...\n\n');

    const changes = [];
    modifiedFiles.forEach((content, fileId) => {
      const file = getFileContent(parseInt(fileId));
      if (file) {
        changes.push({
          path: file.path || file.name,
          content
        });
      }
    });

    // Helper: fallback local commit (simulated)
    const simulateCommit = () => {
      setTimeout(() => {
        let commitMessage = `✨ Committed ${modifiedFiles.size} file(s):\n`;

        modifiedFiles.forEach((content, fileId) => {
          const file = getFileContent(parseInt(fileId));
          if (file) commitMessage += `   - ${file.path || file.name}\n`;
        });

        if (currentProject) {
          commitMessage += `\n🚀 Successfully saved to project!\n`;
          commitMessage += `📌 Project: ${currentProject.name}\n`;

          const updatedFiles = files.map(file => {
            if (modifiedFiles.has(file.id.toString())) {
              return { ...file, originalContent: modifiedFiles.get(file.id.toString()) };
            }
            return file;
          });
          setFiles(updatedFiles);

          if (setProjectsList) {
            const updatedProjects = projectsList.map(project => {
              if (project.id === currentProject.id) {
                return { ...project, files: updatedFiles };
              }
              return project;
            });
            setProjectsList(updatedProjects);
          }
        } else {
          commitMessage += `\n🚀 Successfully pushed to GitHub${simulateCommit.simulated ? ' (simulated)' : ''}!\n`;
          commitMessage += `📌 Repository: ${currentRepo}\n`;

          const updatedFiles = files.map(file => {
            if (modifiedFiles.has(file.id.toString())) {
              return { ...file, originalContent: modifiedFiles.get(file.id.toString()) };
            }
            return file;
          });
          setFiles(updatedFiles);
        }

        commitMessage += `👥 Collaborators notified: ${collaborators.filter(c => c.online).length} online\n`;

        setOutput(prev => prev + commitMessage);

        // Clear modified files
        setModifiedFiles(new Map());
        const projectKey = currentProject ? `modifiedFiles_${currentProject.id}` : 'modifiedFiles_github';
        localStorage.removeItem(projectKey);
        setIsCommitting(false);
      }, 1000);
    };

    // // Helper: push changes to GitHub backend
    // const pushToGitHub = async (token) => {
    //   try {
    //     for (const change of changes) {
    //       await fetch('http://localhost:5000/api/push', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'Authorization': `Bearer ${token}`
    //         },
    //         body: JSON.stringify({
    //           owner: currentRepoOwner,
    //           repo: currentRepo,
    //           path: change.path,
    //           content: change.content
    //         })
    //       });
    //     }

    //     setOutput(prev => prev + `🚀 Successfully pushed ${changes.length} file(s) to GitHub!\n`);

    //     // Update original content
    //     const updatedFiles = files.map(file => {
    //       if (modifiedFiles.has(file.id.toString())) {
    //         return {
    //           ...file,
    //           originalContent: modifiedFiles.get(file.id.toString())
    //         };
    //       }
    //       return file;
    //     });
    //     setFiles(updatedFiles);

    //     // Clear modified files
    //     setModifiedFiles(new Map());
    //     const projectKey = currentProject ? `modifiedFiles_${currentProject.id}` : 'modifiedFiles_github';
    //     localStorage.removeItem(projectKey);

    //   } catch (err) {
    //     setOutput(prev => prev + `❌ GitHub push failed: ${err.message}\n🔄 Falling back to local commit...\n`);
    //     simulateCommit();
    //   } finally {
    //     setIsCommitting(false);
    //   }
    // };

    // const token = localStorage.getItem('github_token');
    // if (!token) {
    //   setOutput(prev => prev + '🔑 Redirecting to GitHub login...\n');
    //   window.sessionStorage.setItem('resume_commit', 'true');
    //   window.location.href = 'http://localhost:5000/api/auth/login';
    //   return;
    // }
    
    // await pushToGitHub(token);
    simulateCommit();
  };

  useEffect(() => {
    const shouldResume = window.sessionStorage.getItem("resume_commit") === "true";
    if (shouldResume && githubToken) {
      commitChanges();
      window.sessionStorage.removeItem("resume_commit");
    }
  }, [githubToken]);

  const handleAiRequest = async () => {
    if (!aiPrompt.trim()) return;
    
    setOutput(prev => prev + `\n🧠 You: ${aiPrompt}\n`);
    setAiPrompt('');
    
    // Simulate AI thinking
    setTimeout(() => {
      const responses = [
        `🔮 AI Spirit: Based on your code, I suggest adding error handling for the "${activeFileContent?.name}" file.`,
        `💡 AI Spirit: Consider using async/await for better performance in your ${activeFileContent?.language} code.`,
        `✨ AI Spirit: I detect a potential bug on line 3. Check your variable declarations.`,
        `🎭 AI Spirit: For a spooky theme, add more CSS animations and dark mode transitions.`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setOutput(prev => prev + randomResponse + '\n');
    }, 1000);
  };

  const renderFileTree = (fileList, depth = 0) => {
    return fileList.map(file => {
      const isModified = modifiedFiles.has(file.id.toString());
      const isEditing = editingFileId === file.id;
      
      return (
        <div key={file.id} className="select-none">
          <div
            className={`flex items-center justify-between gap-2 py-1 px-2 rounded cursor-pointer hover:bg-gray-800 group ${
              activeFile === file.id ? 'bg-purple-900/50' : ''
            }`}
            onClick={() => file.type === 'file' && setActiveFile(file.id)}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {file.type === 'folder' ? <Folder size={16} /> : <File size={16} />}
              
              {isEditing ? (
                <div className="flex items-center gap-1 flex-1">
                  <input
                    type="text"
                    value={editNameValue}
                    onChange={(e) => setEditNameValue(e.target.value)}
                    className="bg-gray-700 text-white text-sm px-1 py-0.5 rounded flex-1 min-w-0"
                    onKeyPress={(e) => e.key === 'Enter' && renameFile(file.id, editNameValue)}
                    autoFocus
                  />
                  <button
                    onClick={() => renameFile(file.id, editNameValue)}
                    className="text-green-400 hover:text-green-300"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingFileId(null);
                      setEditNameValue('');
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-sm truncate">{file.name}</span>
                  {isModified && (
                    <span className="text-xs text-yellow-400 bg-yellow-900/30 px-1 rounded">modified</span>
                  )}
                </>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {isModified && !isEditing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Revert changes - restore original content
                    const file = getFileContent(file.id);
                    if (file && file.originalContent) {
                      setModifiedFiles(prev => {
                        const newMap = new Map(prev);
                        newMap.delete(file.id.toString());
                        return newMap;
                      });
                      const updatedFiles = updateFileContent(files, file.id, file.originalContent);
                      setFiles(updatedFiles);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400"
                  title="Revert changes"
                >
                  <RefreshCw size={12} />
                </button>
              )}
              
              {!isEditing && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditName(file.id, file.name);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-400"
                    title="Rename"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete ${file.type} "${file.name}"?`)) {
                        deleteFile(file.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFileAction({ type: 'file', parentId: file.type === 'folder' ? file.id : null });
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-green-400"
                    title="New File"
                  >
                    <Plus size={12} />
                  </button>
                  {file.type === 'folder' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFileAction({ type: 'folder', parentId: file.id });
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-green-400"
                      title="New Folder"
                    >
                      <Folder size={12} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          
          {fileAction.parentId === file.id && (
            <div className="ml-2 px-2 py-1" style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder={`New ${fileAction.type} name`}
                  className="bg-gray-800 text-white text-sm px-2 py-1 rounded flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && createFile(file.id, fileAction.type)}
                  autoFocus
                />
                <button
                  onClick={() => createFile(file.id, fileAction.type)}
                  className="text-green-400 hover:text-green-300"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => {
                    setFileAction({ type: null, parentId: null });
                    setNewFileName('');
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
          
          {file.children && renderFileTree(file.children, depth + 1)}
        </div>
      );
    });
  };

  return (
    <div className="h-screen bg-black text-gray-300 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Back button for projects when accessed via URL params */}
          {id && (
            <button
              onClick={() => navigate('/projects')}
              className="text-gray-400 hover:text-white flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              <span>Back to Projects</span>
            </button>
          )}
          
          {/* Project/GitHub selection (when not using URL params) */}
          {!id && (
            <div className="flex items-center gap-4">
              {/* Project selector dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedProjectId}
                  onChange={(e) => loadProject(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-white w-48 focus:border-purple-600 focus:outline-none"
                >
                  <option value="">Select a project...</option>
                  {projectsList.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* OR GitHub repo input */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400">OR</span>
                <Github size={20} className="text-white" />
                <input
                  type="text"
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  placeholder="owner/repo (sample)"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-white w-48 focus:border-purple-600 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && loadGitHubRepo(repoInput)}
                />
                <button
                  onClick={() => loadGitHubRepo(repoInput)}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  Load
                </button>
              </div>
            </div>
          )}
          
          {/* Current project/repo info */}
          {currentRepo && (
            <div className="flex items-center gap-2 text-sm">
              <GitBranch size={16} />
              <span className="text-white">{currentProject ? currentProject.name : currentRepo}</span>
              <span className="text-gray-400">• main</span>
              {modifiedFiles.size > 0 && (
                <span className="text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded text-xs">
                  {modifiedFiles.size} modified
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Collaborators */}
          {collaborators.length > 0 && (
            <div className="flex items-center gap-2">
              {collaborators.map(collab => (
                <div
                  key={collab.id}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    collab.online ? 'bg-green-900/50' : 'bg-gray-700'
                  }`}
                  title={`${collab.name} (${collab.online ? 'online' : 'offline'})`}
                >
                  {collab.avatar}
                </div>
              ))}
              <button className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600">
                <Plus size={16} />
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <button
            onClick={runCode}
            disabled={isRunning || !activeFile}
            className="bg-green-900 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Play size={16} />
            {isRunning ? 'Running...' : 'Run'}
          </button>
          
          <button
            onClick={saveFile}
            disabled={!activeFile}
            className="bg-purple-900 hover:bg-purple-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            Save
          </button>

          <button
            onClick={() => setShowAiPanel(!showAiPanel)}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Bot size={16} />
            AI Spirit
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - File Explorer */}
        <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Folder size={16} />
              {currentProject ? 'PROJECT FILES' : currentRepo ? 'GITHUB FILES' : 'FILES'}
            </h2>
            <div className="flex gap-1">
              <button
                onClick={() => setFileAction({ type: 'file', parentId: null })}
                className="text-gray-400 hover:text-white p-1"
                title="New File"
              >
                <File size={14} />
              </button>
              <button
                onClick={() => setFileAction({ type: 'folder', parentId: null })}
                className="text-gray-400 hover:text-white p-1"
                title="New Folder"
              >
                <Folder size={14} />
              </button>
            </div>
          </div>
          
          {fileAction.parentId === null && fileAction.type != null && (
            <div className="px-2 py-1 border-b border-gray-700">
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder={`New ${fileAction.type} name`}
                  className="bg-gray-800 text-white text-sm px-2 py-1 rounded flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && createFile(null, fileAction.type)}
                  autoFocus
                />
                <button
                  onClick={() => createFile(null, fileAction.type)}
                  className="text-green-400 hover:text-green-300"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => {
                    setFileAction({ type: null, parentId: null });
                    setNewFileName('');
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto p-2">
            {files.length > 0 ? (
              renderFileTree(files)
            ) : (
              <div className="p-4 text-center text-gray-500">
                <Folder size={48} className="mx-auto mb-3 opacity-50" />
                {!id && !selectedProjectId ? (
                  <>
                    <p>Select a project or enter a GitHub repo</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <p>Available Projects:</p>
                      {projectsList.map(project => (
                        <button
                          key={project.id}
                          onClick={() => loadProject(project.id)}
                          className="block w-full bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded"
                        >
                          {project.name}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm mt-4">GitHub Samples:</p>
                    <p className="text-xs mt-1">dracula/haunted-castle</p>
                    <p className="text-xs">witch/spellbook</p>
                  </>
                ) : (
                  <p>No files found</p>
                )}
              </div>
            )}
          </div>
          {files.length > 0 && (
            <div className="p-4 border-t border-gray-700 space-y-2">
              <div className="text-xs text-gray-400">
                Modified files are saved locally
              </div>
              <button
                onClick={commitChanges}
                disabled={isCommitting || modifiedFiles.size === 0}
                className="w-full bg-green-900 hover:bg-green-800 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Download size={16} />
                {isCommitting ? 'Committing...' : 'Commit Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs */}
          {files.length > 0 && (
            <div className="bg-gray-800 border-b border-gray-700 flex items-center overflow-x-auto">
              {getAllFiles(files).map(file => {
                const isModified = modifiedFiles.has(file.id.toString());
                return (
                  <button
                    key={file.id}
                    onClick={() => setActiveFile(file.id)}
                    className={`px-4 py-2 border-r border-gray-700 text-sm flex items-center gap-2 flex-shrink-0 group ${
                      activeFile === file.id
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <File size={14} />
                    {file.name}

                    {isModified && (
                      <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    )}

                    {/* FIXED: span instead of nested button */}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.id);
                      }}
                      className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <X size={12} />
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Code Editor or Welcome Screen */}
          <div className="flex-1 flex">
            {activeFileContent ? (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
                  <div className="text-sm text-gray-400">
                    {activeFileContent.path || activeFileContent.name}
                    {modifiedFiles.has(activeFile.toString()) && (
                      <span className="ml-2 text-yellow-400 text-xs">● Modified</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {activeFileContent.language?.toUpperCase()}
                  </div>
                </div>
                
                <textarea
                  ref={fileEditorRef}
                  value={activeFileContent?.content || ''}
                  onChange={(e) => handleFileChange(e.target.value)}
                  onSelect={() => updateCursorPosition(activeFileContent?.content || '')}
                  onClick={() => updateCursorPosition(activeFileContent?.content || '')}
                  onKeyUp={() => updateCursorPosition(activeFileContent?.content || '')}
                  className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
                  spellCheck="false"
                />
                
                {/* AI Panel */}
                {showAiPanel && (
                  <div className="border-t border-gray-700 p-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Ask the AI spirit for help..."
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none"
                        onKeyPress={(e) => e.key === 'Enter' && handleAiRequest()}
                      />
                      <button
                        onClick={handleAiRequest}
                        className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Zap size={16} />
                        Ask
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-900">
                <div className="text-center text-gray-500">
                  <Folder size={64} className="mx-auto mb-6 opacity-50" />
                  <h3 className="text-xl mb-2">
                    {currentProject 
                      ? `Welcome to ${currentProject.name}!` 
                      : 'No Project Loaded'}
                  </h3>
                  <p className="mb-6">
                    {currentProject 
                      ? 'Select a file from the sidebar to start editing' 
                      : 'Select a project from the dropdown or enter a GitHub repository'}
                  </p>
                  {!currentProject && !id && (
                    <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
                      {projectsList.slice(0, 3).map(project => (
                        <button
                          key={project.id}
                          onClick={() => loadProject(project.id)}
                          className="bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg text-left"
                        >
                          <div className="font-bold">{project.name}</div>
                          <div className="text-sm text-gray-400">{project.description || 'No description'}</div>
                        </button>
                      ))}
                      <button
                        onClick={() => loadGitHubRepo('dracula/haunted-castle')}
                        className="bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg text-left"
                      >
                        <div className="font-bold">dracula/haunted-castle</div>
                        <div className="text-sm text-gray-400">A spooky React application</div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Terminal Output */}
            <div className="w-96 border-l border-gray-700 flex flex-col">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Terminal size={16} />
                  SPIRIT TERMINAL
                </h3>
                <div className="flex items-center gap-2">
                  {modifiedFiles.size > 0 && (
                    <span className="text-xs text-yellow-400">
                      {modifiedFiles.size} unsaved change(s)
                    </span>
                  )}
                  <button
                    onClick={() => setOutput('')}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <pre className="flex-1 bg-black text-green-400 font-mono text-sm p-4 overflow-y-auto whitespace-pre-wrap">
                {output || '🔮 Welcome to the code editor! Select a file to begin...'}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <footer className="bg-gray-900 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-4">
          {activeFileContent && (
            <>
              <span>File: {activeFileContent.name}</span>
              <span>Language: {activeFileContent.language}</span>
              <span>Size: {(activeFileContent.content?.length || 0)} chars</span>
              <span>Line: {cursorPosition.line}, Column: {cursorPosition.column}</span>
              <span>Encoding: UTF-8</span>
              {modifiedFiles.has(activeFile?.toString()) && (
                <span className="text-yellow-400">● Modified</span>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {currentRepo && (
            <>
              <span>{collaborators.filter(c => c.online).length} spirits online</span>
              <span>{currentProject ? 'Project' : 'Repo'}: {currentProject ? currentProject.name : currentRepo}</span>
            </>
          )}
        </div>
      </footer>
    </div>
  );
};

// Helper functions
const getAllFiles = (fileList, result = []) => {
  for (const file of fileList) {
    if (file.type === 'file') {
      result.push(file);
    }
    if (file.children) {
      getAllFiles(file.children, result);
    }
  }
  return result;
};

const updateFileContent = (files, fileId, newContent, fileList = files) => {
  return fileList.map(file => {
    if (file.id === fileId) {
      return { ...file, content: newContent };
    }
    if (file.children) {
      return {
        ...file,
        children: updateFileContent(files, fileId, newContent, file.children)
      };
    }
    return file;
  });
};

const updateFileInProject = (fileList, fileId, newContent) => {
  return fileList.map(file => {
    if (file.id === fileId) {
      return { ...file, content: newContent };
    }
    if (file.children) {
      return {
        ...file,
        children: updateFileInProject(file.children, fileId, newContent)
      };
    }
    return file;
  });
};

const removeFileFromTree = (files, fileId, fileList = files) => {
  return fileList.filter(file => {
    if (file.id === fileId) {
      return false;
    }
    if (file.children) {
      file.children = removeFileFromTree(file.children, fileId, file.children);
    }
    return true;
  });
};

const renameFileInTree = (files, fileId, newName, fileList = files) => {
  return fileList.map(file => {
    if (file.id === fileId) {
      return { ...file, name: newName };
    }
    if (file.children) {
      return {
        ...file,
        children: renameFileInTree(file.children, fileId, newName, file.children)
      };
    }
    return file;
  });
};

export default CodeEditor;