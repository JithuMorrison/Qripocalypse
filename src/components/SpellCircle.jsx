import React from 'react';

const SpellCircle = ({ isActive, onComplete }) => {
  return (
    <div className="relative">
      <div className={`w-48 h-48 border-4 border-purple-600 rounded-full flex items-center justify-center ${
        isActive ? 'animate-spin' : ''
      }`}>
        <div className="text-center">
          <div className="text-4xl mb-2">🔮</div>
          <button
            onClick={onComplete}
            disabled={isActive}
            className="bg-purple-900 hover:bg-purple-800 text-white px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {isActive ? 'MERGING...' : 'BEGIN RITUAL'}
          </button>
        </div>
      </div>
      
      {/* Rune decorations */}
      <div className="absolute top-2 left-2 text-2xl">⚡</div>
      <div className="absolute top-2 right-2 text-2xl">🔥</div>
      <div className="absolute bottom-2 left-2 text-2xl">💧</div>
      <div className="absolute bottom-2 right-2 text-2xl">🌪️</div>
    </div>
  );
};

export default SpellCircle;