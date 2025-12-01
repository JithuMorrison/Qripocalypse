import React, { useState } from 'react';
import SpellCircle from '../components/SpellCircle';

const Ritual = () => {
  const [leftCode, setLeftCode] = useState('// HEAD - The ancient version\nfunction ancientSpell() {\n  return "I live!";\n}');
  const [rightCode, setRightCode] = useState('// FEATURE - The new creation\nfunction ancientSpell() {\n  return "She lives!";\n}');
  const [mergedCode, setMergedCode] = useState('');
  const [isMerging, setIsMerging] = useState(false);

  const performMerge = () => {
    setIsMerging(true);
    // Simulate ritual merging process
    setTimeout(() => {
      setMergedCode('// THE RESURRECTION\nfunction ancientSpell() {\n  return "WE live!";\n}');
      setIsMerging(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 relative overflow-hidden">
      {/* Ritual Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-blue-600 rounded-full blur-3xl -bottom-48 -right-48"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "'Creepster', cursive" }}>
            🔮 MERGE RITUAL 🔮
          </h1>
          <p className="text-xl text-purple-400 italic" style={{ fontFamily: "'Eater', cursive" }}>
            Resolve Conflicts Through Dark Magic
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left Rune Block - HEAD */}
          <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-red-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <span>🧛</span>
              HEAD (Ancient Version)
            </h3>
            <textarea
              value={leftCode}
              onChange={(e) => setLeftCode(e.target.value)}
              className="w-full h-64 bg-black/50 text-red-300 font-mono text-sm p-4 rounded border border-red-800 focus:border-red-600 focus:outline-none resize-none"
            />
          </div>

          {/* Spell Circle */}
          <div className="flex items-center justify-center">
            <SpellCircle isActive={isMerging} onComplete={performMerge} />
          </div>

          {/* Right Rune Block - FEATURE */}
          <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-blue-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span>🧙‍♀️</span>
              FEATURE (New Creation)
            </h3>
            <textarea
              value={rightCode}
              onChange={(e) => setRightCode(e.target.value)}
              className="w-full h-64 bg-black/50 text-blue-300 font-mono text-sm p-4 rounded border border-blue-800 focus:border-blue-600 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Merge Result */}
        {mergedCode && (
          <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-green-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span>⚡</span>
              THE RESURRECTION
            </h3>
            <pre className="text-green-300 font-mono text-sm p-4 bg-black/50 rounded">
              {mergedCode}
            </pre>
          </div>
        )}

        {/* Witch Narration */}
        <div className="mt-8 bg-purple-900/50 border-2 border-purple-700 rounded-xl p-6 text-center">
          <p className="text-purple-300 italic text-lg" style={{ fontFamily: "'Eater', cursive" }}>
            "The spirits are restless... Choose your path wisely, mortal."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ritual;