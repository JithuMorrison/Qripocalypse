import React, { useState, useRef, useEffect } from 'react';

const Terminal = () => {
  const [commands, setCommands] = useState([
    { input: 'git status', output: 'Your branch lies between life... and death...', type: 'response' }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const terminalRef = useRef(null);

  const hauntedResponses = {
    'git status': 'The spirits are restless in your working directory...',
    'git log': 'Behold! The ancient history of your code...',
    'git diff': 'I see... changes from beyond the grave...',
    'git commit': 'Another soul committed to the repository...',
    'git push': 'Pushing your changes to the afterlife...',
    'git pull': 'Pulling dark forces from the remote...',
    'git branch': 'So many paths... so many destinies...',
    'git merge': 'A dangerous ritual begins...',
    'help': 'Available commands: git status, git log, git diff, git commit, git push, git pull, git branch, git merge, clear',
    'clear': 'clear'
  };

  const handleCommand = (input) => {
    const newCommands = [...commands, { input, output: '', type: 'input' }];
    setCommands(newCommands);
    setCurrentInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = hauntedResponses[input.toLowerCase()] || 
        `The spirits do not recognize: "${input}". Type "help" for guidance.`;
      
      if (input.toLowerCase() === 'clear') {
        setCommands([]);
      } else {
        setCommands(prev => [...prev, { input: '', output: response, type: 'response' }]);
      }
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
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
          {/* Terminal Window */}
          <div 
            ref={terminalRef}
            className="bg-black/90 border-2 border-green-700 rounded-lg h-96 overflow-y-auto p-4 mb-4 shadow-2xl shadow-green-900/50"
          >
            <div className="text-green-500 mb-4">
              <div>🧛 Qripocalypse Terminal v1.0.0</div>
              <div>Type "help" for available commands</div>
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
            <span className="text-purple-400 mr-2">$</span>
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a git command..."
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