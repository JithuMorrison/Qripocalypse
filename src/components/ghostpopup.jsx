import React from 'react';

const GhostPopup = ({ commit, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-purple-700 rounded-xl p-8 max-w-md mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
        >
          ×
        </button>
        
        <div className="text-6xl text-center mb-4">{commit.ghost}</div>
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Spirit of {commit.author}
        </h2>
        
        <div className="space-y-4 text-gray-300">
          <div>
            <strong>Commit:</strong> {commit.message}
          </div>
          <div>
            <strong>Changes:</strong> {commit.changes}
          </div>
          <div>
            <strong>Whisper:</strong> "{commit.epitaph}"
          </div>
        </div>
        
        <button className="w-full bg-purple-900 hover:bg-purple-800 text-white py-3 rounded-lg mt-6 font-bold transition-colors">
          Summon This Spirit
        </button>
      </div>
    </div>
  );
};

export default GhostPopup;