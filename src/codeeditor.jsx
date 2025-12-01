import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Save, GitBranch, Users, Settings, Zap, 
  Folder, File, Plus, Terminal, Bot, Download 
} from 'lucide-react';

const CodeEditor = () => {
  const [files, setFiles] = useState([
    { id: 1, name: 'main.js', content: 'console.log("Hello, haunted world!");', type: 'file', language: 'javascript' },
    { id: 2, name: 'styles.css', content: 'body { background: #000; color: #fff; }', type: 'file', language: 'css' },
    { id: 3, name: 'src', type: 'folder', children: [
      { id: 4, name: 'components', type: 'folder', children: [] },
      { id: 5, name: 'utils.js', content: 'export function darkMagic() {}', type: 'file', language: 'javascript' }
    ]}
  ]);
  const [activeFile, setActiveFile] = useState(1);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: 'Dracula', avatar: '🧛', online: true },
    { id: 2, name: 'Frankenstein', avatar: '🧟', online: true },
    { id: 3, name: 'Witch', avatar: '🧙‍♀️', online: false }
  ]);

  const fileEditorRef = useRef(null);

  const getFileContent = (fileId, fileList = files) => {
    for (const file of fileList) {
      if (file.id === fileId) return file;
      if (file.children) {
        const found = getFileContent(fileId, file.children);
        if (found) return found;
      }
    }
    return null;
  };

  const activeFileContent = getFileContent(activeFile);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('🔮 The spirits are executing your code...\n\n');
    
    // Simulate code execution
    setTimeout(() => {
      setOutput(prev => prev + '✨ Code executed successfully!\n🎃 Output: Hello, haunted world!\n\n💀 Process finished with exit code 0');
      setIsRunning(false);
    }, 2000);
  };

  const saveFile = () => {
    // Simulate file save
    setFiles(prev => [...prev]); // Trigger re-render
  };

  const handleAiRequest = async () => {
    if (!aiPrompt.trim()) return;
    
    // Simulate AI response
    setOutput(prev => prev + `\n🔮 AI Spirit: ${aiPrompt}\n💡 Suggestion: Let me help you with that dark magic...\n`);
    setAiPrompt('');
  };

  const renderFileTree = (fileList, depth = 0) => {
    return fileList.map(file => (
      <div key={file.id} className="select-none">
        <div
          className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-gray-800 ${
            activeFile === file.id ? 'bg-purple-900/50' : ''
          }`}
          onClick={() => file.type === 'file' && setActiveFile(file.id)}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {file.type === 'folder' ? <Folder size={16} /> : <File size={16} />}
          <span className="text-sm">{file.name}</span>
        </div>
        {file.children && renderFileTree(file.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="h-screen bg-black text-gray-300 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">Ancient-Spells</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <GitBranch size={16} />
            <span>main</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Collaborators */}
          <div className="flex items-center gap-2">
            {collaborators.map(collab => (
              <div
                key={collab.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  collab.online ? 'bg-green-900/50' : 'bg-gray-700'
                }`}
                title={collab.name}
              >
                {collab.avatar}
              </div>
            ))}
            <button className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600">
              <Plus size={16} />
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={runCode}
            disabled={isRunning}
            className="bg-green-900 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Play size={16} />
            {isRunning ? 'Running...' : 'Run'}
          </button>
          
          <button
            onClick={saveFile}
            className="bg-purple-900 hover:bg-purple-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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
          <div className="p-4 border-b border-gray-700">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Folder size={16} />
              SPIRIT FILES
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {renderFileTree(files)}
          </div>
          <div className="p-4 border-t border-gray-700">
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Plus size={16} />
              New File
            </button>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs */}
          <div className="bg-gray-800 border-b border-gray-700 flex items-center">
            {files.filter(f => f.type === 'file').map(file => (
              <button
                key={file.id}
                onClick={() => setActiveFile(file.id)}
                className={`px-4 py-2 border-r border-gray-700 text-sm flex items-center gap-2 ${
                  activeFile === file.id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <File size={14} />
                {file.name}
              </button>
            ))}
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex">
            <div className="flex-1 flex flex-col">
              <textarea
                ref={fileEditorRef}
                value={activeFileContent?.content || ''}
                onChange={(e) => {
                  const updatedFiles = updateFileContent(files, activeFile, e.target.value);
                  setFiles(updatedFiles);
                }}
                className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-4 resize-none focus:outline-none"
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

            {/* Terminal Output */}
            <div className="w-96 border-l border-gray-700 flex flex-col">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Terminal size={16} />
                  SPIRIT TERMINAL
                </h3>
                <button
                  onClick={() => setOutput('')}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Clear
                </button>
              </div>
              <pre className="flex-1 bg-black text-green-400 font-mono text-sm p-4 overflow-y-auto">
                {output || '🔮 The spirits await your command...'}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <footer className="bg-gray-900 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-4">
          <span>Line: 1, Column: 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>{activeFileContent?.language || 'Text'}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>👻 3 spirits online</span>
          <button className="flex items-center gap-1 hover:text-white transition-colors">
            <Download size={14} />
            Commit Changes
          </button>
        </div>
      </footer>
    </div>
  );
};

// Helper function to update file content
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

export default CodeEditor;