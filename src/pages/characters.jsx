import React from 'react';

const Characters = () => {
  const characters = [
    {
      name: 'Count Dracula',
      role: 'Deletion Specialist',
      icon: '🧛',
      color: 'red',
      description: 'Master of removing code and draining the life from bugs',
      personality: 'Elegant, ancient, and precise. He hates messy code.',
      abilities: ['Code Blood Drain', 'Precision Deletion', 'Ancient Wisdom'],
      quote: 'This line... it must be eliminated.'
    },
    {
      name: 'Frankenstein\'s Monster',
      role: 'Modification Expert',
      icon: '🧟',
      color: 'green',
      description: 'Patches together code from different parts to create new features',
      personality: 'Misunderstood but brilliant. Sees beauty in broken things.',
      abilities: ['Code Resurrection', 'Feature Assembly', 'Bug Transformation'],
      quote: 'Friend? Or bug?'
    },
    {
      name: 'Witch of Mutations',
      role: 'Conflict Resolver',
      icon: '🧙‍♀️',
      color: 'purple',
      description: 'Brews powerful spells to resolve merge conflicts and code disputes',
      personality: 'Mysterious and powerful. Speaks in riddles and code.',
      abilities: ['Merge Magic', 'Conflict Resolution', 'Code Alchemy'],
      quote: 'This variable curse will spread...'
    },
    {
      name: 'Ghost of Commit Past',
      role: 'History Keeper',
      icon: '👻',
      color: 'gray',
      description: 'Remembers every commit and can travel through code history',
      personality: 'Nostalgic and wise. Loves telling stories of old code.',
      abilities: ['Time Travel', 'Memory Recall', 'Historical Analysis'],
      quote: 'I remember writing this...'
    },
    {
      name: 'The Reaper',
      role: 'Code Execution',
      icon: '💀',
      color: 'black',
      description: 'Terminates processes and cleans up dead code',
      personality: 'Direct and unforgiving. No patience for inefficiency.',
      abilities: ['Process Termination', 'Memory Cleanup', 'Performance Optimization'],
      quote: 'Something has died here.'
    },
    {
      name: 'Poltergeist Debugger',
      role: 'Error Detection',
      icon: '🔮',
      color: 'orange',
      description: 'Finds and reveals hidden bugs and cursed code patterns',
      personality: 'Playful but dangerous. Loves creating chaos to find truth.',
      abilities: ['Bug Manifestation', 'Error Revelation', 'Code Haunting'],
      quote: 'I sense something wrong in this function...'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-gray-300 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-red-900"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "'Creepster', cursive" }}>
            🧛 HAUNTED PERSONAS 🧛
          </h1>
          <p className="text-xl text-purple-400 italic" style={{ fontFamily: "'Eater', cursive" }}>
            Meet the Spirits That Power Qripocalypse
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {characters.map((character, index) => (
            <div
              key={character.name}
              className={`bg-gradient-to-br from-${character.color}-900 to-${character.color}-700 border-2 border-${character.color}-600 rounded-xl p-6 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm`}
            >
              {/* Character Header */}
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{character.icon}</div>
                <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Creepster', cursive" }}>
                  {character.name}
                </h2>
                <p className={`text-${character.color}-300 font-semibold`}>{character.role}</p>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4 text-center">{character.description}</p>

              {/* Personality */}
              <div className="mb-4">
                <h3 className="text-white font-bold mb-1">Personality</h3>
                <p className="text-gray-400 text-sm">{character.personality}</p>
              </div>

              {/* Abilities */}
              <div className="mb-4">
                <h3 className="text-white font-bold mb-2">Abilities</h3>
                <div className="space-y-1">
                  {character.abilities.map((ability, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-yellow-400">✨</span>
                      <span className="text-gray-300 text-sm">{ability}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className={`border-t border-${character.color}-600 pt-4 mt-4`}>
                <p className="text-gray-400 italic text-sm text-center">"{character.quote}"</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summoning Instructions */}
        <div className="mt-16 bg-gray-900/80 backdrop-blur-sm border-2 border-purple-700 rounded-xl p-8 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-400 mb-4" style={{ fontFamily: "'Creepster', cursive" }}>
            SUMMONING RITUAL
          </h2>
          <p className="text-gray-300 mb-6">
            Visit the QR Portal to generate summoning codes for these characters. 
            They will appear when their specific code patterns are detected in your diffs.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-purple-900 hover:bg-purple-800 text-white px-6 py-3 rounded-lg font-bold transition-colors">
              Go to QR Portal
            </button>
            <button className="bg-red-900 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-bold transition-colors">
              Learn Summoning Spells
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Characters;