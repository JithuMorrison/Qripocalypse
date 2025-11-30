import React, { useState } from 'react';
import Tombstone from '../components/tombstone';
import GhostPopup from '../components/ghostpopup';

const Graveyard = () => {
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const mockCommits = [
    {
      hash: 'a1b2c3d4',
      message: 'Fixed the ancient curse in main.js',
      author: 'Dr. Frankenstein',
      date: '2024-10-31',
      changes: '+12 -4',
      ghost: '🧟',
      epitaph: 'Here lies a brave attempt to tame the monster'
    },
    {
      hash: 'e5f6g7h8',
      message: 'Summoned dark entities in ritual.ts',
      author: 'Count Dracula',
      date: '2024-10-30',
      changes: '+45 -12',
      ghost: '🧛',
      epitaph: 'His code now drinks the blood of bugs'
    },
    {
      hash: 'i9j0k1l2',
      message: 'Cleansed haunted variables',
      author: 'Witch of Mutations',
      date: '2024-10-29',
      changes: '+8 -23',
      ghost: '🧙‍♀️',
      epitaph: 'She turned bugs into features with a spell'
    }
  ];

  const filteredCommits = mockCommits.filter(commit =>
    commit.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commit.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 relative">
      {/* Cemetery Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-900 to-black"></div>
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1506197603050-40fe985193e8?ixlib=rb-4.0.3')] bg-cover"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "'Creepster', cursive" }}>
            ⚰️ TIME CEMETERY ⚰️
          </h1>
          <p className="text-xl text-purple-400 italic" style={{ fontFamily: "'Eater', cursive" }}>
            Where Commits Rest in Peace... Or Do They?
          </p>
        </header>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search through the graves..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none backdrop-blur-sm"
          />
        </div>

        {/* Tombstone Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommits.map((commit, index) => (
            <Tombstone
              key={commit.hash}
              commit={commit}
              onClick={() => setSelectedCommit(commit)}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredCommits.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💀</div>
            <p className="text-xl text-gray-400">No spirits found in these graves...</p>
          </div>
        )}
      </div>

      {/* Ghost Popup */}
      {selectedCommit && (
        <GhostPopup
          commit={selectedCommit}
          onClose={() => setSelectedCommit(null)}
        />
      )}
    </div>
  );
};

export default Graveyard;