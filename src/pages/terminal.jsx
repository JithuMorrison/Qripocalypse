import React, { useState, useRef, useEffect } from 'react';
import { useProjects } from '../components/projectContext';
import { generateCommitsForProjects } from '../utils/commitGenerator';

const Terminal = () => {
  const { projectsList } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const [commands, setCommands] = useState([
    { input: 'git status', output: 'Your branch lies between life... and death...', type: 'response' }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const terminalRef = useRef(null);
  const [allCommits, setAllCommits] = useState([]);

  // Generate commits on mount
  useEffect(() => {
    if (projectsList && projectsList.length > 0) {
      const commits = generateCommitsForProjects(projectsList);
      setAllCommits(commits);
    }
  }, [projectsList]);

  const getProjectSpecificResponse = (command) => {
    if (!selectedProject) {
      return '⚠️ Select a project to commune with the spirits...';
    }

    const cmd = command.toLowerCase();
    const projectCommits = allCommits.filter(c => c.projectId === selectedProject.id);

    switch (cmd) {
      case 'git status':
        const fileCount = selectedProject.files?.length || 0;
        const modifiedCount = Math.floor(Math.random() * fileCount);
        return `On branch main\nYour branch is up to date with 'origin/main'.\n\n${modifiedCount > 0 ? `Changes not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n\n  modified:   ${selectedProject.files[Math.floor(Math.random() * fileCount)]?.name || 'unknown.js'}\n\n` : 'nothing to commit, working tree clean\n'}The spirits are restless in ${selectedProject.name}...`;

      case 'git log':
        if (projectCommits.length === 0) {
          return `No commits found in ${selectedProject.name}... The history is empty.`;
        }
        const logOutput = projectCommits.slice(0, 5).map(commit => 
          `commit ${commit.hash}\nAuthor: ${commit.author}\nDate:   ${new Date(commit.date).toLocaleString()}\n\n    ${commit.message}\n`
        ).join('\n');
        return `Behold! The ancient history of ${selectedProject.name}...\n\n${logOutput}`;

      case 'git diff':
        if (!selectedProject.files || selectedProject.files.length === 0) {
          return `No files to diff in ${selectedProject.name}...`;
        }
        const randomFile = selectedProject.files[Math.floor(Math.random() * selectedProject.files.length)];
        const additions = Math.floor(Math.random() * 20) + 1;
        const deletions = Math.floor(Math.random() * 10);
        return `diff --git a/${randomFile.path} b/${randomFile.path}\nindex ${generateHash()}..${generateHash()} 100644\n--- a/${randomFile.path}\n+++ b/${randomFile.path}\n@@ -1,${deletions} +1,${additions} @@\n${'+'.repeat(Math.min(additions, 3))} Added haunted features\n${'-'.repeat(Math.min(deletions, 3))} Removed cursed code\n\nI see... changes from beyond the grave in ${selectedProject.name}...`;

      case 'git branch':
        const branches = ['main', 'develop', 'feature/haunted-ui', 'fix/ghost-bug'];
        const branchList = branches.map(b => b === 'main' ? `* ${b}` : `  ${b}`).join('\n');
        return `${branchList}\n\nSo many paths... so many destinies in ${selectedProject.name}...`;

      case 'git commit':
        return `[main ${generateHash()}] Another soul committed to ${selectedProject.name}...\n 1 file changed, ${Math.floor(Math.random() * 50) + 1} insertions(+)`;

      case 'git push':
        return `Pushing your changes to the afterlife...\nEnumerating objects: 5, done.\nCounting objects: 100% (5/5), done.\nWriting objects: 100% (3/3), 300 bytes | 300.00 KiB/s, done.\nTotal 3 (delta 0), reused 0 (delta 0)\nTo github.com:haunted/${selectedProject.name}.git\n   ${generateHash()}..${generateHash()}  main -> main`;

      case 'git pull':
        return `Pulling dark forces from the remote...\nremote: Enumerating objects: 3, done.\nremote: Counting objects: 100% (3/3), done.\nremote: Total 3 (delta 0), reused 0 (delta 0)\nUnpacking objects: 100% (3/3), done.\nFrom github.com:haunted/${selectedProject.name}\n   ${generateHash()}..${generateHash()}  main       -> origin/main\nUpdating ${generateHash()}..${generateHash()}\nFast-forward\n ${selectedProject.files?.[0]?.name || 'file.js'} | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)`;

      case 'git merge':
        return `A dangerous ritual begins in ${selectedProject.name}...\nMerging feature branch into main...\nAuto-merging ${selectedProject.files?.[0]?.name || 'file.js'}\nMerge made by the 'recursive' strategy.\n ${selectedProject.files?.[0]?.name || 'file.js'} | 5 +++++\n 1 file changed, 5 insertions(+)`;

      case 'help':
        return 'Available commands: git status, git log, git diff, git commit, git push, git pull, git branch, git merge, clear';

      case 'clear':
        return 'clear';

      default:
        return `The spirits do not recognize: "${command}". Type "help" for guidance.`;
    }
  };

  const generateHash = () => {
    return Math.random().toString(16).substring(2, 10);
  };

  const handleCommand = (input) => {
    const newCommands = [...commands, { input, output: '', type: 'input' }];
    setCommands(newCommands);
    setCurrentInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getProjectSpecificResponse(input);
      
      if (input.toLowerCase() === 'clear') {
        setCommands([]);
      } else {
        setCommands(prev => [...prev, { input: '', output: response, type: 'response' }]);
      }
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentInput.trim() && !isTyping) {
      handleCommand(currentInput.trim());
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative">
      {/* CRT Screen Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 to-black/50 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:4px_4px] pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4 glitch-text" style={{ fontFamily: "'Creepster', cursive" }}>
            💀 NECROTERMINAL 💀
          </h1>
          <p className="text-xl text-purple-400 italic" style={{ fontFamily: "'Eater', cursive" }}>
            A Possessed Command Line Interface
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Project Selector */}
          <div className="mb-4">
            <label className="block text-green-400 mb-2 text-sm font-mono">
              🔮 Select a Project to Commune With:
            </label>
            <select
              value={selectedProject?.id || ''}
              onChange={(e) => {
                const project = projectsList.find(p => p.id === parseInt(e.target.value));
                setSelectedProject(project || null);
              }}
              className="w-full bg-black/80 border-2 border-green-600 text-green-400 px-4 py-2 rounded-lg font-mono outline-none focus:border-purple-500 transition-colors"
            >
              <option value="">-- Select a haunted project --</option>
              {projectsList.map(project => (
                <option key={project.id} value={project.id}>
                  {project.ghost} {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Terminal Window */}
          <div 
            ref={terminalRef}
            className="bg-black/90 border-2 border-green-700 rounded-lg h-96 overflow-y-auto p-4 mb-4 shadow-2xl shadow-green-900/50"
          >
            <div className="text-green-500 mb-4">
              <div>🧛 Qripocalypse Terminal v1.0.0</div>
              <div>Type "help" for available commands</div>
              {!selectedProject && (
                <div className="mt-2 text-yellow-400 animate-pulse">
                  ⚠️ Please select a project above to begin...
                </div>
              )}
              <div className="mt-4"></div>
            </div>

            {commands.map((cmd, index) => (
              <div key={index} className="mb-2">
                {cmd.input && (
                  <div className="flex items-start">
                    <span className="text-purple-400 mr-2">$</span>
                    <span>{cmd.input}</span>
                  </div>
                )}
                {cmd.output && (
                  <div className={`ml-4 ${cmd.type === 'response' ? 'text-green-300' : 'text-gray-400'}`}>
                    {cmd.output}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center text-yellow-400">
                <div className="animate-pulse">🔮</div>
                <span className="ml-2">The spirits are consulting...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center bg-black/80 border-2 border-green-600 rounded-lg px-4 py-3">
            <span className="text-purple-400 mr-2">
              {selectedProject ? `${selectedProject.name}$` : '$'}
            </span>
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedProject ? "Enter a git command..." : "Select a project first..."}
              className="flex-1 bg-transparent text-green-400 outline-none placeholder-green-800"
              disabled={isTyping}
            />
          </div>

          {/* Quick Commands */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {['git status', 'git log', 'git diff', 'git commit'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => !isTyping && handleCommand(cmd)}
                disabled={isTyping}
                className="bg-green-900/50 hover:bg-green-800/50 text-green-400 py-2 px-3 rounded text-sm font-mono transition-colors disabled:opacity-50"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .glitch-text {
          text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
          color: #00ff00;
        }
      `}</style>
    </div>
  );
};

export default Terminal;