import React, { useState } from 'react';

const Themes = () => {
  const [activeTheme, setActiveTheme] = useState('dracula');

  const themes = [
    {
      id: 'dracula',
      name: 'Dracula Mode',
      icon: '🧛',
      color: 'red',
      description: 'Elegant darkness with blood-red accents',
      preview: 'bg-gradient-to-br from-red-900 to-purple-900',
      features: ['Blood-red highlights', 'Elegant typography', 'Gothic borders']
    },
    {
      id: 'possession',
      name: 'Possession Flicker',
      icon: '👻',
      color: 'purple',
      description: 'Flickering effects and ghostly transitions',
      preview: 'bg-gradient-to-br from-purple-900 to-blue-900 animate-pulse',
      features: ['Flickering animations', 'Ghostly glows', 'Ethereal transitions']
    },
    {
      id: 'frankenstein',
      name: 'Frankenstein Lab',
      icon: '🧟',
      color: 'green',
      description: 'Electric green and laboratory aesthetics',
      preview: 'bg-gradient-to-br from-green-900 to-gray-800',
      features: ['Electric green accents', 'Laboratory styling', 'Bolt animations']
    },
    {
      id: 'ghost',
      name: 'Ghost Fade',
      icon: '💀',
      color: 'gray',
      description: 'Translucent effects and fading animations',
      preview: 'bg-gradient-to-br from-gray-800 to-black',
      features: ['Translucent elements', 'Fade animations', 'Misty overlays']
    }
  ];

  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "'Creepster', cursive" }}>
            🎨 THEME GRAVEYARD 🎨
          </h1>
          <p className="text-xl text-purple-400 italic" style={{ fontFamily: "'Eater', cursive" }}>
            Choose Your Haunted Aesthetic
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`border-2 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                activeTheme === theme.id 
                  ? `border-${theme.color}-500 shadow-2xl shadow-${theme.color}-900/50` 
                  : 'border-gray-700'
              }`}
            >
              {/* Theme Preview */}
              <div className={`h-32 ${theme.preview} relative`}>
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  {theme.icon}
                </div>
              </div>

              {/* Theme Info */}
              <div className="bg-gray-900/90 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Creepster', cursive" }}>
                    {theme.name}
                  </h3>
                  <button
                    onClick={() => setActiveTheme(theme.id)}
                    className={`bg-${theme.color}-900 hover:bg-${theme.color}-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                      activeTheme === theme.id ? 'ring-2 ring-white' : ''
                    }`}
                  >
                    {activeTheme === theme.id ? 'ACTIVE' : 'ACTIVATE'}
                  </button>
                </div>

                <p className="text-gray-400 text-sm mb-4">{theme.description}</p>

                <div>
                  <h4 className="text-white font-bold mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {theme.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="text-green-400">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* QR Activation */}
        <div className="mt-16 bg-gray-900/80 backdrop-blur-sm border-2 border-orange-700 rounded-xl p-8 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-orange-400 mb-4" style={{ fontFamily: "'Creepster', cursive" }}>
            QR THEME SUMMONING
          </h2>
          <p className="text-gray-300 mb-6">
            Generate QR codes to instantly switch themes or share your favorite haunted aesthetic with others.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <div className="w-32 h-32 bg-gray-300 flex items-center justify-center text-gray-600">
                QR Code
              </div>
            </div>
            
            <div className="text-left">
              <h3 className="text-white font-bold mb-2">Current Theme QR</h3>
              <p className="text-gray-400 text-sm mb-4">
                Scan this code to activate <strong>{themes.find(t => t.id === activeTheme)?.name}</strong> on any device
              </p>
              <button className="bg-orange-900 hover:bg-orange-800 text-white px-6 py-3 rounded-lg font-bold transition-colors">
                Generate New QR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Themes;