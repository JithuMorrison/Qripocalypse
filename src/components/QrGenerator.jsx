import React, { useState, useRef, useEffect } from 'react';
import { useProjects } from './projectContext';
import FileSelector from './FileSelector';
import { saveQRData, addToRecentSummons } from '../services/qrStorageService';
import { loadConfigurations } from '../utils/storageHelpers';

const QRGenerator = ({ onQRGenerated }) => {
  const { projectsList } = useProjects();
  const [qrType, setQrType] = useState('theme');
  const [qrContent, setQrContent] = useState('');
  const [generatedObjectId, setGeneratedObjectId] = useState('');
  const [qrPreviewUrl, setQrPreviewUrl] = useState('');
  const [generatedGrid, setGeneratedGrid] = useState([]);
  const [batchNumber] = useState(Date.now());
  
  // Project-specific state
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileSelectorOpen, setIsFileSelectorOpen] = useState(false);
  
  // Type-specific content
  const [themeData, setThemeData] = useState({ themeId: 'dracula', themeName: 'Dracula Mode' });
  const [diffData, setDiffData] = useState({ summary: '', filesChanged: 0, additions: 0, deletions: 0 });
  const [commitData, setCommitData] = useState({ hash: '', message: '', author: '' });
  
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const colors = {
    primary: '#8b5cf6',
    dark: '#1f2937',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)'
  };

  // Encode text to ObjectId-like hex string
  const encodeToObjectId = (text) => {
    // Convert text to hex representation
    let hex = '';
    for (let i = 0; i < text.length; i++) {
      hex += text.charCodeAt(i).toString(16);
    }
    // Pad to 24 characters (ObjectId length)
    while (hex.length < 24) {
      hex += Math.floor(Math.random() * 16).toString(16);
    }
    hex = hex.substring(0, 24);
    return hex;
  };

  // Grid encoding logic (from provided code)
  const encodeObjectId = (oid) => {
    const REDUNDANCY = 3, SIZE = 18;
    const bits = [...oid.match(/.{1,2}/g).map(b => parseInt(b,16))]
      .flatMap(byte => byte.toString(2).padStart(8,'0').split('').map(Number))
      .flatMap(bit => Array(REDUNDANCY).fill(bit));
    const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill('/'));
    grid[0][0]=grid[0][SIZE-1]=grid[SIZE-1][0]=grid[SIZE-1][SIZE-1]='\\';
    let idx=0;
    for(let i=0;i<SIZE;i++)for(let j=0;j<SIZE;j++){
      if((i===0||i===SIZE-1)&&(j===0||j===SIZE-1))continue;
      if(idx<bits.length)grid[i][j]=bits[idx++]?'\\':'/';
    }
    return {grid};
  };

  const drawGridToCanvas = (canvas, grid) => {
    if(!canvas) return;
    const ctx=canvas.getContext('2d'), cell=20, pad=20, N=grid.length;
    canvas.width=N*cell+pad*2; canvas.height=N*cell+pad*2;
    ctx.fillStyle='white'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle='#000'; ctx.lineWidth=2;
    for(let i=0;i<N;i++)for(let j=0;j<N;j++){
      const x=pad+j*cell, y=pad+i*cell, m=2;
      ctx.beginPath();
      if(grid[i][j]==='\\'){ctx.moveTo(x+m,y+m);ctx.lineTo(x+cell-m,y+cell-m);}
      else {ctx.moveTo(x+cell-m,y+m);ctx.lineTo(x+m,y+cell-m);}
      ctx.stroke();
    }
  };

  const generateQR = () => {
    // Validate based on type
    let qrData = null;
    let displayName = '';
    
    switch (qrType) {
      case 'theme':
        if (!themeData.themeId) {
          alert('Please select a theme');
          return;
        }
        qrData = {
          themeId: themeData.themeId,
          themeName: themeData.themeName,
          icon: getThemeIcon(themeData.themeId),
          colors: getThemeColors(themeData.themeId)
        };
        displayName = themeData.themeName;
        break;
        
      case 'diff':
        if (!diffData.summary.trim()) {
          alert('Please enter diff summary');
          return;
        }
        if (!selectedProject) {
          alert('Please select a project');
          return;
        }
        qrData = {
          summary: diffData.summary,
          projectId: selectedProject.id,
          projectName: selectedProject.name,
          filesChanged: diffData.filesChanged,
          additions: diffData.additions,
          deletions: diffData.deletions
        };
        displayName = `${selectedProject.name} - ${diffData.summary.substring(0, 30)}`;
        break;
        
      case 'commit':
        if (!commitData.message.trim()) {
          alert('Please enter commit message');
          return;
        }
        if (!selectedProject) {
          alert('Please select a project');
          return;
        }
        qrData = {
          commitHash: commitData.hash || generateCommitHash(),
          message: commitData.message,
          author: commitData.author || 'Unknown',
          projectId: selectedProject.id,
          projectName: selectedProject.name,
          timestamp: new Date().toISOString()
        };
        displayName = `${selectedProject.name} - ${commitData.message.substring(0, 30)}`;
        break;
        
      case 'projectFile':
        if (!selectedFile) {
          alert('Please select a file');
          return;
        }
        qrData = {
          projectId: selectedFile.projectId,
          projectName: selectedFile.projectName,
          fileName: selectedFile.name,
          filePath: selectedFile.path,
          content: selectedFile.content,
          language: selectedFile.language
        };
        displayName = `${selectedFile.projectName} - ${selectedFile.name}`;
        break;
        
      case 'deployment':
        if (!selectedProject) {
          alert('Please select a project');
          return;
        }
        const deploymentConfig = loadConfigurations(selectedProject.id);
        if (!deploymentConfig) {
          alert('No deployment configuration found for this project');
          return;
        }
        qrData = {
          projectId: selectedProject.id,
          projectName: selectedProject.name,
          platform: deploymentConfig.platform || 'unknown',
          status: deploymentConfig.status || 'inactive',
          configuration: deploymentConfig,
          lastDeployed: new Date().toISOString()
        };
        displayName = `${selectedProject.name} - ${deploymentConfig.platform || 'Deployment'}`;
        break;
        
      default:
        alert('Invalid summon type');
        return;
    }

    // Save QR data to localStorage
    const result = saveQRData(qrType, qrData);
    if (!result) {
      alert('Failed to save QR data');
      return;
    }

    const { id, timestamp } = result;
    
    // Generate ObjectId (use the saved ID)
    setGeneratedObjectId(id);

    // Encode to grid
    const { grid } = encodeObjectId(id);
    setGeneratedGrid(grid);

    // Draw to canvas for preview
    if (previewCanvasRef.current) {
      drawGridToCanvas(previewCanvasRef.current, grid);
      setQrPreviewUrl(previewCanvasRef.current.toDataURL('image/png'));
    }
    
    // Add to recent summons
    addToRecentSummons({
      id,
      type: qrType,
      name: displayName,
      timestamp
    });
    
    // Notify parent component
    if (onQRGenerated) {
      onQRGenerated({ id, type: qrType, name: displayName, timestamp });
    }
  };
  
  const generateCommitHash = () => {
    return Math.random().toString(16).substring(2, 10);
  };
  
  const getThemeIcon = (themeId) => {
    const icons = {
      dracula: '🧛',
      possession: '👻',
      frankenstein: '🧟',
      ghost: '💀'
    };
    return icons[themeId] || '🎨';
  };
  
  const getThemeColors = (themeId) => {
    const colors = {
      dracula: { primary: '#8b5cf6', secondary: '#6366f1' },
      possession: { primary: '#10b981', secondary: '#059669' },
      frankenstein: { primary: '#84cc16', secondary: '#65a30d' },
      ghost: { primary: '#6b7280', secondary: '#4b5563' }
    };
    return colors[themeId] || { primary: '#8b5cf6', secondary: '#6366f1' };
  };

  const downloadQR = () => {
    if (!previewCanvasRef.current) return;
    
    const url = previewCanvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url; 
    a.download = `qripocalypse-${qrType}-${batchNumber}.png`; 
    a.click();
  };

  const downloadGridText = () => {
    if (generatedGrid.length === 0) return;

    const gridText = generatedGrid.map(row => row.join('')).join('\n');
    const blob = new Blob([gridText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qripocalypse-${qrType}-grid.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Update preview when content changes
  useEffect(() => {
    if (qrContent.trim() && previewCanvasRef.current) {
      const objectId = encodeToObjectId(`${qrType}:${qrContent}`);
      const { grid } = encodeObjectId(objectId);
      drawGridToCanvas(previewCanvasRef.current, grid);
      setQrPreviewUrl(previewCanvasRef.current.toDataURL('image/png'));
    }
  }, [qrContent, qrType]);

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Generate Summoning QR</h3>
      
      <div className="space-y-4">
        {/* QR Type Selection */}
        <div>
          <label className="block text-purple-300 text-sm font-bold mb-2">
            SPIRIT CATEGORY
          </label>
          <select
            value={qrType}
            onChange={(e) => {
              setQrType(e.target.value);
              setSelectedProject(null);
              setSelectedFile(null);
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none transition-colors"
          >
            <option value="theme">🎨 Activate Theme</option>
            <option value="diff">🔀 Share Diff</option>
            <option value="commit">⚰️ Grave QR</option>
            <option value="projectFile">📄 Project File</option>
            <option value="deployment">🚀 Deployment Info</option>
          </select>
        </div>

        {/* Type-specific inputs */}
        {qrType === 'theme' && (
          <div>
            <label className="block text-purple-300 text-sm font-bold mb-2">
              SELECT THEME
            </label>
            <select
              value={themeData.themeId}
              onChange={(e) => {
                const themeId = e.target.value;
                const themeNames = {
                  dracula: 'Dracula Mode',
                  possession: 'Possession Flicker',
                  frankenstein: 'Frankenstein Lab',
                  ghost: 'Ghost Realm'
                };
                setThemeData({ themeId, themeName: themeNames[themeId] });
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-600 focus:outline-none transition-colors"
            >
              <option value="dracula">🧛 Dracula Mode</option>
              <option value="possession">👻 Possession Flicker</option>
              <option value="frankenstein">🧟 Frankenstein Lab</option>
              <option value="ghost">💀 Ghost Realm</option>
            </select>
          </div>
        )}

        {qrType === 'diff' && (
          <>
            <div>
              <label className="block text-purple-300 text-sm font-bold mb-2">
                SELECT PROJECT
              </label>
              <select
                value={selectedProject?.id || ''}
                onChange={(e) => {
                  const project = projectsList.find(p => p.id === parseInt(e.target.value));
                  setSelectedProject(project);
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-600 focus:outline-none transition-colors"
              >
                <option value="">-- Choose a project --</option>
                {projectsList.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.ghost} {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-purple-300 text-sm font-bold mb-2">
                DIFF SUMMARY
              </label>
              <input
                type="text"
                value={diffData.summary}
                onChange={(e) => setDiffData({ ...diffData, summary: e.target.value })}
                placeholder="e.g., Added dark magic function"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none transition-colors"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-purple-300 text-xs font-bold mb-2">
                  FILES CHANGED
                </label>
                <input
                  type="number"
                  value={diffData.filesChanged}
                  onChange={(e) => setDiffData({ ...diffData, filesChanged: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-600 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-purple-300 text-xs font-bold mb-2">
                  ADDITIONS
                </label>
                <input
                  type="number"
                  value={diffData.additions}
                  onChange={(e) => setDiffData({ ...diffData, additions: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-600 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-purple-300 text-xs font-bold mb-2">
                  DELETIONS
                </label>
                <input
                  type="number"
                  value={diffData.deletions}
                  onChange={(e) => setDiffData({ ...diffData, deletions: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </>
        )}

        {qrType === 'commit' && (
          <>
            <div>
              <label className="block text-purple-300 text-sm font-bold mb-2">
                SELECT PROJECT
              </label>
              <select
                value={selectedProject?.id || ''}
                onChange={(e) => {
                  const project = projectsList.find(p => p.id === parseInt(e.target.value));
                  setSelectedProject(project);
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-600 focus:outline-none transition-colors"
              >
                <option value="">-- Choose a project --</option>
                {projectsList.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.ghost} {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-purple-300 text-sm font-bold mb-2">
                COMMIT MESSAGE
              </label>
              <input
                type="text"
                value={commitData.message}
                onChange={(e) => setCommitData({ ...commitData, message: e.target.value })}
                placeholder="e.g., Fixed ancient curse"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-purple-300 text-sm font-bold mb-2">
                AUTHOR (Optional)
              </label>
              <input
                type="text"
                value={commitData.author}
                onChange={(e) => setCommitData({ ...commitData, author: e.target.value })}
                placeholder="e.g., Necromancer"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none transition-colors"
              />
            </div>
          </>
        )}

        {qrType === 'projectFile' && (
          <>
            <div>
              <label className="block text-purple-300 text-sm font-bold mb-2">
                SELECT FILE
              </label>
              <button
                onClick={() => setIsFileSelectorOpen(true)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-left text-white hover:border-purple-600 focus:border-purple-600 focus:outline-none transition-colors"
              >
                {selectedFile ? (
                  <div>
                    <div className="font-bold">{selectedFile.projectName} - {selectedFile.name}</div>
                    <div className="text-gray-400 text-sm">{selectedFile.path}</div>
                  </div>
                ) : (
                  <span className="text-gray-500">Click to select a file...</span>
                )}
              </button>
            </div>
          </>
        )}

        {qrType === 'deployment' && (
          <>
            <div>
              <label className="block text-purple-300 text-sm font-bold mb-2">
                SELECT PROJECT
              </label>
              <select
                value={selectedProject?.id || ''}
                onChange={(e) => {
                  const project = projectsList.find(p => p.id === parseInt(e.target.value));
                  setSelectedProject(project);
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-600 focus:outline-none transition-colors"
              >
                <option value="">-- Choose a project --</option>
                {projectsList.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.ghost} {project.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedProject && (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">
                  Deployment configuration will be loaded from localStorage for this project.
                </p>
              </div>
            )}
          </>
        )}

        {/* QR Preview */}
        <div className="bg-gray-900 border-2 border-purple-700 rounded-lg p-4">
          <h4 className="text-white font-bold mb-3 text-center">🔮 GRID QR PREVIEW</h4>
          
          <div className="flex flex-col items-center justify-center">
            <canvas 
              ref={previewCanvasRef} 
              width={400} 
              height={400}
              className="w-48 h-48 bg-white rounded-lg border-2 border-purple-500"
            />
            
            {generatedObjectId && (
              <div className="mt-4 text-center">
                <p className="text-purple-300 text-sm mb-1">ObjectId:</p>
                <p className="text-green-400 font-mono text-xs break-all">
                  {generatedObjectId}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Generated ObjectId Display */}
        {generatedObjectId && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
            <h4 className="text-green-400 font-bold mb-2">✅ QR Generated!</h4>
            <p className="text-green-300 text-sm">
              Encoded as {qrType}: {qrContent}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={generateQR}
            className="w-full bg-gradient-to-r from-purple-900 to-blue-900 hover:from-purple-800 hover:to-blue-800 text-white py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span className="text-xl">🔮</span>
            Generate Grid QR
          </button>

          {generatedObjectId && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={downloadQR}
                  className="bg-gradient-to-r from-green-900 to-emerald-900 hover:from-green-800 hover:to-emerald-800 text-white py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span className="text-lg">🖼️</span>
                  Download PNG
                </button>
                
                <button 
                  onClick={downloadGridText}
                  className="bg-gradient-to-r from-blue-900 to-cyan-900 hover:from-blue-800 hover:to-cyan-800 text-white py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span className="text-lg">📄</span>
                  Download TXT
                </button>
              </div>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedObjectId);
                  alert('ObjectId copied to clipboard!');
                }}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-lg">📋</span>
                Copy ObjectId
              </button>
            </>
          )}
        </div>

        {/* QR Info */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-bold mb-2 flex items-center gap-2">
            <span>💡</span>
            About Grid QR
          </h4>
          <p className="text-gray-400 text-sm">
            This QR uses a 18×18 diagonal grid pattern encoding. 
            Each diagonal represents binary data that can be decoded back to the original ObjectId.
            The pattern is resistant to rotation and minor distortions.
          </p>
        </div>
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* File Selector Modal */}
      <FileSelector
        isOpen={isFileSelectorOpen}
        onClose={() => setIsFileSelectorOpen(false)}
        onSelectFile={(file) => setSelectedFile(file)}
        title="Select a File to Summon"
      />
    </div>
  );
};

export default QRGenerator;