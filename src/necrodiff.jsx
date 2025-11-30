import React, { useState, useEffect } from 'react';
import { Ghost, Skull, Flame, Zap, AlertTriangle, FileCode } from 'lucide-react';

const NecroDiff = () => {
  const [oldCode, setOldCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [comparing, setComparing] = useState(false);
  const [diffs, setDiffs] = useState([]);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [titleGlitch, setTitleGlitch] = useState(false);

  const hauntedCharacters = [
    { name: 'Dracula', type: 'deletion', icon: '🧛', color: 'text-red-600', message: 'This line... drained of life.' },
    { name: 'Frankenstein', type: 'modified', icon: '🧟', color: 'text-green-500', message: 'Friend? Or bug?' },
    { name: 'Witch', type: 'warning', icon: '🧙‍♀️', color: 'text-purple-500', message: 'This variable curse will spread...' },
    { name: 'Ghost', type: 'unchanged', icon: '👻', color: 'text-gray-400', message: 'I remember writing this...' },
    { name: 'Reaper', type: 'major', icon: '💀', color: 'text-black', message: 'Something has died here.' }
  ];

  // Random title glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setTitleGlitch(true);
      setTimeout(() => setTitleGlitch(false), 150);
    }, 3000 + Math.random() * 2000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  const compareCode = () => {
    setComparing(true);
    setGlitchEffect(true);
    
    setTimeout(() => {
      const oldLines = oldCode.split('\n');
      const newLines = newCode.split('\n');
      
      // Simple LCS-based diff algorithm
      const lcs = computeLCS(oldLines, newLines);
      const diffResult = generateDiff(oldLines, newLines, lcs);

      setDiffs(diffResult);
      setComparing(false);
      setGlitchEffect(false);
    }, 1500);
  };

  // Compute Longest Common Subsequence
  const computeLCS = (arr1, arr2) => {
    const m = arr1.length;
    const n = arr2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (arr1[i - 1] === arr2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack to find LCS
    const lcs = [];
    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (arr1[i - 1] === arr2[j - 1]) {
        lcs.unshift({ oldIdx: i - 1, newIdx: j - 1 });
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
    return lcs;
  };

  // Generate diff from LCS with context
  const generateDiff = (oldLines, newLines, lcs) => {
    const result = [];
    let oldIdx = 0;
    let newIdx = 0;
    let lcsIdx = 0;
    const CONTEXT_LINES = 2; // Number of unchanged lines to show before/after changes

    // First pass: mark all lines
    const allLines = [];
    while (oldIdx < oldLines.length || newIdx < newLines.length) {
      if (lcsIdx < lcs.length && oldIdx === lcs[lcsIdx].oldIdx && newIdx === lcs[lcsIdx].newIdx) {
        allLines.push({
          type: 'unchanged',
          oldLineNum: oldIdx + 1,
          newLineNum: newIdx + 1,
          content: oldLines[oldIdx],
          character: hauntedCharacters[3]
        });
        oldIdx++;
        newIdx++;
        lcsIdx++;
      } else if (lcsIdx < lcs.length && oldIdx === lcs[lcsIdx].oldIdx) {
        allLines.push({
          type: 'addition',
          oldLineNum: null,
          newLineNum: newIdx + 1,
          content: newLines[newIdx],
          character: hauntedCharacters[1]
        });
        newIdx++;
      } else if (lcsIdx < lcs.length && newIdx === lcs[lcsIdx].newIdx) {
        allLines.push({
          type: 'deletion',
          oldLineNum: oldIdx + 1,
          newLineNum: null,
          content: oldLines[oldIdx],
          character: hauntedCharacters[0]
        });
        oldIdx++;
      } else if (oldIdx < oldLines.length && newIdx < newLines.length) {
        allLines.push({
          type: 'deletion',
          oldLineNum: oldIdx + 1,
          newLineNum: null,
          content: oldLines[oldIdx],
          character: hauntedCharacters[0]
        });
        allLines.push({
          type: 'addition',
          oldLineNum: null,
          newLineNum: newIdx + 1,
          content: newLines[newIdx],
          character: hauntedCharacters[1]
        });
        oldIdx++;
        newIdx++;
      } else if (oldIdx < oldLines.length) {
        allLines.push({
          type: 'deletion',
          oldLineNum: oldIdx + 1,
          newLineNum: null,
          content: oldLines[oldIdx],
          character: hauntedCharacters[0]
        });
        oldIdx++;
      } else {
        allLines.push({
          type: 'addition',
          oldLineNum: null,
          newLineNum: newIdx + 1,
          content: newLines[newIdx],
          character: hauntedCharacters[1]
        });
        newIdx++;
      }
    }

    // Second pass: filter to show only changes with context
    const changeIndices = allLines
      .map((line, idx) => line.type !== 'unchanged' ? idx : -1)
      .filter(idx => idx !== -1);

    if (changeIndices.length === 0) {
      // No changes, show all lines
      return allLines;
    }

    const includedIndices = new Set();
    changeIndices.forEach(changeIdx => {
      // Include the change itself
      includedIndices.add(changeIdx);
      // Include context lines before
      for (let i = Math.max(0, changeIdx - CONTEXT_LINES); i < changeIdx; i++) {
        includedIndices.add(i);
      }
      // Include context lines after
      for (let i = changeIdx + 1; i <= Math.min(allLines.length - 1, changeIdx + CONTEXT_LINES); i++) {
        includedIndices.add(i);
      }
    });

    // Convert to sorted array and add separators
    const sortedIndices = Array.from(includedIndices).sort((a, b) => a - b);
    
    for (let i = 0; i < sortedIndices.length; i++) {
      const idx = sortedIndices[i];
      
      // Check if there's a gap from previous line
      if (i > 0 && sortedIndices[i - 1] < idx - 1) {
        result.push({
          type: 'separator',
          content: '...',
          character: hauntedCharacters[3]
        });
      }
      
      result.push(allLines[idx]);
    }

    return result;
  };

  useEffect(() => {
    if (glitchEffect) {
      const interval = setInterval(() => {
        setGlitchEffect(prev => !prev);
      }, 100);
      setTimeout(() => clearInterval(interval), 1000);
      return () => clearInterval(interval);
    }
  }, [comparing]);

  const FloatingGhost = ({ delay, side }) => (
    <div 
      className="fixed text-5xl opacity-20 pointer-events-none z-0"
      style={{
        animation: `float${side} ${4 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        [side]: '2%',
        top: `${20 + Math.random() * 60}%`
      }}
    >
      👻
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-gray-300 relative overflow-hidden">
      {/* Spooky Background Image */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://www.pixelstalk.net/wp-content/uploads/image10/Free-Download-Halloween-Desktop-Background-4K.jpg')",
            filter: 'grayscale(20%) contrast(1.2)'
          }}
        ></div>
      </div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-full h-full bg-gradient-to-br from-red-900 via-purple-900 to-black animate-pulse"></div>
      </div>

      <img
        src="https://static.vecteezy.com/system/resources/previews/047/829/120/non_2x/halloween-ghost-horror-on-transparent-background-png.png"
        className="absolute w-64 h-64 top-4 left-4 opacity-30 animate-pulse"
        alt="ghost"
      />

      {/* Glitch overlay */}
      {glitchEffect && (
        <div className="absolute inset-0 bg-red-500 opacity-10 z-20 animate-pulse"></div>
      )}
      
      {/* Floating ghosts on sides */}
      {[0, 1, 2].map(i => <FloatingGhost key={`left-${i}`} delay={i * 1.2} side="left" />)}
      {[0, 1, 2].map(i => <FloatingGhost key={`right-${i}`} delay={i * 1.5} side="right" />)}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Haunted Header */}
        <div className="text-center mb-8 relative">
          <h1 className={`text-7xl font-bold mb-4 transition-all duration-100 ${titleGlitch ? 'glitch' : ''}`}
              style={{
                fontFamily: "'Creepster', 'Nosifer', cursive",
                textShadow: titleGlitch 
                  ? '0 0 10px #ff0000, 5px 0 10px #00ff00, -5px 0 10px #0000ff' 
                  : '0 0 20px #ff0000, 0 0 40px #ff0000, 0 0 60px #ff0000',
                color: titleGlitch ? '#fff' : '#8b0000',
                letterSpacing: '0.1em',
                transform: titleGlitch ? 'skew(-2deg) translateX(3px)' : 'none'
              }}>
            ⚰️ NECRODIFF ⚰️
          </h1>
          <p className="text-xl text-purple-400 italic mb-2" style={{ fontFamily: "'Eater', cursive" }}>
            Where Code Meets the Afterlife
          </p>
        </div>

        {/* Code Input Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Old Code - Left Cemetery */}
          <div className="bg-gray-900/90 backdrop-blur-sm border-4 border-red-900 rounded-lg p-6 relative shadow-2xl shadow-red-900/50 hover:shadow-red-900/70 transition-shadow duration-300">
            <div className="absolute -top-4 left-4 bg-red-900 px-4 py-2 rounded text-white font-bold flex items-center gap-2 shadow-lg"
                 style={{ fontFamily: "'Creepster', cursive" }}>
              <Skull size={20} />
              <span>THE PAST</span>
            </div>
            <textarea
              value={oldCode}
              onChange={(e) => setOldCode(e.target.value)}
              placeholder="Paste your cursed old code here..."
              className="w-full h-64 bg-black/80 text-green-400 font-mono text-sm p-4 rounded border-2 border-red-800 focus:border-red-600 focus:outline-none resize-none backdrop-blur-sm"
              style={{ textShadow: '0 0 5px rgba(0,255,0,0.5)' }}
            />
          </div>

          {/* New Code - Right Crypt */}
          <div className="bg-gray-900/90 backdrop-blur-sm border-4 border-purple-900 rounded-lg p-6 relative shadow-2xl shadow-purple-900/50 hover:shadow-purple-900/70 transition-shadow duration-300">
            <div className="absolute -top-4 left-4 bg-purple-900 px-4 py-2 rounded text-white font-bold flex items-center gap-2 shadow-lg"
                 style={{ fontFamily: "'Creepster', cursive" }}>
              <Zap size={20} />
              <span>THE PRESENT</span>
            </div>
            <textarea
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="Paste your reanimated new code here..."
              className="w-full h-64 bg-black/80 text-purple-400 font-mono text-sm p-4 rounded border-2 border-purple-800 focus:border-purple-600 focus:outline-none resize-none backdrop-blur-sm"
              style={{ textShadow: '0 0 5px rgba(147,51,234,0.5)' }}
            />
          </div>
        </div>

        {/* Summon Button */}
        <div className="text-center mb-8">
          <button
            onClick={compareCode}
            disabled={comparing || !oldCode || !newCode}
            className="bg-gradient-to-r from-red-900 to-purple-900 hover:from-red-800 hover:to-purple-800 text-white px-12 py-4 rounded-lg font-bold text-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-700 shadow-lg shadow-red-900/50 hover:shadow-red-900/70"
            style={{ 
              textShadow: '0 0 10px rgba(255,0,0,0.8)',
              fontFamily: "'Creepster', cursive"
            }}
          >
            {comparing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">🔮</span>
                SUMMONING SPIRITS...
                <span className="animate-spin">🔮</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Flame size={24} />
                INVOKE THE NECRODIFF
                <Flame size={24} />
              </span>
            )}
          </button>
        </div>

        {/* Diff Results - GitHub Style Unified View */}
        {diffs.length > 0 && (
          <div className="bg-gray-900/90 backdrop-blur-sm border-4 border-orange-900 rounded-lg p-6 shadow-2xl shadow-orange-900/50">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-orange-500 mb-2" 
                  style={{ fontFamily: "'Nosifer', 'Creepster', cursive" }}>
                💀 THE SPIRITS SPEAK 💀
              </h2>
              <p className="text-gray-400 italic" style={{ fontFamily: "'Eater', cursive" }}>
                Hover over the haunted for their dark wisdom...
              </p>
            </div>

            {/* Unified Diff View - GitHub Style */}
            <div className="max-h-96 overflow-y-auto bg-black/40 rounded border-2 border-gray-700">
              {diffs.map((diff, index) => {
                if (diff.type === 'separator') {
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-center py-2 bg-gray-800/30 border-y border-gray-700"
                    >
                      <span className="text-gray-500 text-sm font-mono">⚰️ ⚰️ ⚰️</span>
                    </div>
                  );
                }
                
                return (
                  <div
                    key={index}
                    className={`flex items-start font-mono text-sm border-b border-gray-800 last:border-b-0 transition-all duration-300 hover:brightness-110 group relative ${
                      diff.type === 'deletion' ? 'bg-red-950/60' :
                      diff.type === 'addition' ? 'bg-green-950/60' :
                      'bg-transparent'
                    }`}
                  >
                    {/* Character Icon */}
                    <div className="flex-shrink-0 w-10 flex items-center justify-center py-2 text-xl cursor-pointer hover:scale-125 transition-transform">
                      {diff.character.icon}
                    </div>

                    {/* Line Numbers */}
                    <div className="flex-shrink-0 flex gap-1 py-2 px-2 bg-black/30 border-r border-gray-700">
                      <div className={`w-10 text-center text-xs ${
                        diff.type === 'deletion' ? 'text-red-400' : 
                        diff.type === 'addition' ? 'text-transparent' : 
                        'text-gray-500'
                      }`}>
                        {diff.oldLineNum || ''}
                      </div>
                      <div className={`w-10 text-center text-xs ${
                        diff.type === 'addition' ? 'text-green-400' : 
                        diff.type === 'deletion' ? 'text-transparent' : 
                        'text-gray-500'
                      }`}>
                        {diff.newLineNum || ''}
                      </div>
                    </div>

                    {/* Diff Marker */}
                    <div className="flex-shrink-0 w-8 py-2 text-center font-bold">
                      {diff.type === 'deletion' && <span className="text-red-500">-</span>}
                      {diff.type === 'addition' && <span className="text-green-500">+</span>}
                      {diff.type === 'unchanged' && <span className="text-gray-600"> </span>}
                    </div>

                    {/* Code Content */}
                    <div className={`flex-1 py-2 px-3 overflow-x-auto ${
                      diff.type === 'deletion' ? 'text-red-300' :
                      diff.type === 'addition' ? 'text-green-300' :
                      'text-gray-400'
                    }`}>
                      <pre className="whitespace-pre-wrap break-all">{diff.content}</pre>
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute hidden group-hover:block left-1/2 -translate-x-1/2 -top-16 bg-black/95 border-2 border-red-700 p-3 rounded-lg z-30 text-red-300 whitespace-nowrap animate-pulse shadow-xl backdrop-blur-sm pointer-events-none">
                      <p className="text-xs italic" style={{ fontFamily: "'Eater', cursive" }}>
                        "{diff.character.message}"
                      </p>
                      <p className="text-xs mt-1 text-gray-400">- {diff.character.name}</p>
                    </div>

                    {/* Blood drip effect for deletions */}
                    {diff.type === 'deletion' && (
                      <div
                        className="absolute bottom-0 left-1/4 w-1 h-4 bg-red-600 opacity-50 pointer-events-none"
                        style={{ animation: 'drip 2s ease-in-out infinite' }}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="mt-4 flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">+{diffs.filter(d => d.type === 'addition').length}</span>
                <span className="text-gray-400">additions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-400 font-bold">-{diffs.filter(d => d.type === 'deletion').length}</span>
                <span className="text-gray-400">deletions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-bold">{diffs.filter(d => d.type === 'unchanged').length}</span>
                <span className="text-gray-400">unchanged</span>
              </div>
            </div>
          </div>
        )}

        {/* Cemetery Footer */}
        <div className="text-center mt-12 text-gray-600 italic">
          <p className="text-sm" style={{ fontFamily: "'Eater', cursive" }}>
            ⚰️ Built with dark magic and forbidden knowledge ⚰️
          </p>
          <p className="text-xs mt-2">May your code rest in peace... or rise again stronger</p>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Creepster&family=Nosifer&family=Eater&display=swap');
        
        @keyframes floatleft {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
            opacity: 0.15;
          }
          50% { 
            transform: translateY(-40px) translateX(15px) rotate(10deg); 
            opacity: 0.25;
          }
        }
        
        @keyframes floatright {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
            opacity: 0.15;
          }
          50% { 
            transform: translateY(-40px) translateX(-15px) rotate(-10deg); 
            opacity: 0.25;
          }
        }
        
        @keyframes drip {
          0% { height: 0; opacity: 0; }
          50% { height: 16px; opacity: 0.5; }
          100% { height: 24px; opacity: 0; }
        }
        
        .glitch {
          animation: glitch-anim 0.3s linear;
        }
        
        @keyframes glitch-anim {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </div>
  );
};

export default NecroDiff;