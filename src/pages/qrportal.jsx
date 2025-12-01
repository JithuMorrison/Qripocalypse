import React, { useState } from 'react';
import QRGenerator from '../components/QRGenerator';
import QRScanner from '../components/QRScanner';

const QRPortal = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [recentCodes, setRecentCodes] = useState([
    { type: 'character', name: 'Dracula', date: '2024-10-31' },
    { type: 'theme', name: 'Dracula Mode', date: '2024-10-30' },
    { type: 'diff', name: 'NecroDiff #123', date: '2024-10-29' }
  ]);

  const summonOptions = [
    {
      type: 'character',
      title: 'Summon a Character',
      description: 'Generate QR codes to summon specific haunted personas',
      icon: '🧛',
      color: 'red'
    },
    {
      type: 'theme',
      title: 'Summon a Theme',
      description: 'Create QR codes that instantly switch visual themes',
      icon: '🎨',
      color: 'purple'
    },
    {
      type: 'diff',
      title: 'Summon a Diff',
      description: 'Generate QR codes containing diff summaries',
      icon: '🔀',
      color: 'green'
    },
    {
      type: 'commit',
      title: 'Summon a Commit',
      description: 'Create grave QR codes from commit history',
      icon: '⚰️',
      color: 'gray'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-gray-300 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-red-900"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-64 h-64 bg-white rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-64 h-64 bg-purple-500 rounded-full blur-3xl bottom-10 right-10"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "'Creepster', cursive" }}>
            🔮 QR SUMMONING PORTAL 🔮
          </h1>
          <p className="text-xl text-purple-400 italic" style={{ fontFamily: "'Eater', cursive" }}>
            Ancient Symbols for Modern Magic
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900/80 rounded-lg p-1 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-6 py-3 rounded-md font-bold transition-colors ${
                activeTab === 'generate' 
                  ? 'bg-purple-900 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              style={{ fontFamily: "'Creepster', cursive" }}
            >
              GENERATE QR
            </button>
            <button
              onClick={() => setActiveTab('scan')}
              className={`px-6 py-3 rounded-md font-bold transition-colors ${
                activeTab === 'scan' 
                  ? 'bg-purple-900 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              style={{ fontFamily: "'Creepster', cursive" }}
            >
              SCAN QR
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'generate' ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Summon Options */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Creepster', cursive" }}>
                  Choose Your Summoning
                </h2>
                
                {summonOptions.map((option) => (
                  <div
                    key={option.type}
                    className={`bg-gradient-to-r from-${option.color}-900 to-${option.color}-700 border-2 border-${option.color}-600 rounded-xl p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-sm`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{option.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{option.title}</h3>
                        <p className="text-gray-300 text-sm">{option.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* QR Generator */}
              <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-purple-700 rounded-xl p-6">
                <QRGenerator />
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* QR Scanner */}
              <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-green-700 rounded-xl p-6">
                <QRScanner />
              </div>

              {/* Scan Results & History */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Creepster', cursive" }}>
                  Recent Summons
                </h2>
                
                <div className="space-y-4">
                  {recentCodes.map((code, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-bold">{code.name}</h4>
                          <p className="text-gray-400 text-sm capitalize">{code.type} • {code.date}</p>
                        </div>
                        <button className="text-purple-400 hover:text-purple-300 text-sm font-bold">
                          RESUMMON
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-gray-900/80 backdrop-blur-sm border-2 border-yellow-700 rounded-xl p-6 max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-bold text-yellow-400 mb-4" style={{ fontFamily: "'Creepster', cursive" }}>
            SUMMONING INSTRUCTIONS
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-2xl mb-2">1</div>
              <p className="text-gray-300">Generate or locate a QR code</p>
            </div>
            <div>
              <div className="text-2xl mb-2">2</div>
              <p className="text-gray-300">Scan with any QR reader app</p>
            </div>
            <div>
              <div className="text-2xl mb-2">3</div>
              <p className="text-gray-300">The spirit will appear instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPortal;