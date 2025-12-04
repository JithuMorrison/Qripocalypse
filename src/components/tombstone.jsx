import React from 'react';

const Tombstone = ({ commit, onClick, delay }) => {
  // Apply golden border/glow styling for duplicate commits
  const duplicateStyles = commit.isDuplicate 
    ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]' 
    : 'border-gray-700';

  return (
    <div 
      className={`bg-gray-800 border-2 ${duplicateStyles} rounded-lg p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-sm relative`}
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Project name badge in top-right corner */}
      {commit.projectName && (
        <div className="absolute top-2 right-2 bg-purple-900/80 text-purple-200 text-xs px-2 py-1 rounded-full border border-purple-600">
          {commit.projectName}
        </div>
      )}
      
      <div className="text-4xl mb-4 text-center">{commit.ghost}</div>
      <div className="text-center mb-4">
        <div className="font-mono text-sm text-gray-400 mb-2">{commit.hash}</div>
        <h3 className="text-white font-bold text-lg mb-2">{commit.message}</h3>
        <p className="text-gray-500 text-sm">{commit.author}</p>
        <p className="text-gray-600 text-xs">{commit.date}</p>
      </div>
      <div className="text-center text-xs text-gray-500 border-t border-gray-700 pt-3">
        {commit.epitaph}
      </div>
    </div>
  );
};

export default Tombstone;