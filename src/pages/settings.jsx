import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'dracula',
    sounds: true,
    animations: true,
    ghostDensity: 'medium',
    autoScan: false,
    loreNarration: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "'Creepster', cursive" }}>
            ⚙️ LABORATORY CONTROLS ⚙️
          </h1>
          <p className="text-xl text-purple-400 italic" style={{ fontFamily: "'Eater', cursive" }}>
            Tame the Spirits to Your Liking
          </p>
        </header>

        <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-purple-700 rounded-xl p-8">
          {/* Appearance Settings */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span>🎨</span>
              APPEARANCE
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold">Theme</h3>
                  <p className="text-gray-400 text-sm">Choose your haunted aesthetic</p>
                </div>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
                >
                  <option value="dracula">Dracula Mode</option>
                  <option value="possession">Possession Flicker</option>
                  <option value="frankenstein">Frankenstein Lab</option>
                  <option value="ghost">Ghost Fade</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold">Ghost Density</h3>
                  <p className="text-gray-400 text-sm">How many spirits roam the interface</p>
                </div>
                <select
                  value={settings.ghostDensity}
                  onChange={(e) => handleSettingChange('ghostDensity', e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
                >
                  <option value="low">Few (Quiet)</option>
                  <option value="medium">Medium (Balanced)</option>
                  <option value="high">Many (Haunted)</option>
                  <option value="extreme">Extreme (Poltergeist)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sound & Effects */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span>🔊</span>
              SOUND & EFFECTS
            </h2>
            
            <div className="space-y-6">
              {[
                { key: 'sounds', label: 'Haunted Sounds', description: 'Spirit whispers and eerie ambiance' },
                { key: 'animations', label: 'Dark Animations', description: 'Ghostly movements and transitions' },
                { key: 'loreNarration', label: 'Lore Narration', description: 'Character stories and explanations' },
                { key: 'autoScan', label: 'Auto Spirit Scan', description: 'Automatically detect code spirits' }
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold">{label}</h3>
                    <p className="text-gray-400 text-sm">{description}</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange(key, !settings[key])}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings[key] ? 'bg-purple-600' : 'bg-gray-700'
                    } relative`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      settings[key] ? 'transform translate-x-7' : 'transform translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-3">
              <span>⚡</span>
              DANGER ZONE
            </h2>
            
            <div className="space-y-4">
              <button className="w-full bg-red-900/50 hover:bg-red-800/50 text-red-400 py-3 px-4 rounded-lg border border-red-700 transition-colors text-left">
                <div className="font-bold">Banish All Spirits</div>
                <div className="text-sm text-red-300">Temporarily clear all haunted elements</div>
              </button>
              
              <button className="w-full bg-red-900/50 hover:bg-red-800/50 text-red-400 py-3 px-4 rounded-lg border border-red-700 transition-colors text-left">
                <div className="font-bold">Reset Ancient Configurations</div>
                <div className="text-sm text-red-300">Restore default laboratory settings</div>
              </button>
              
              <button className="w-full bg-red-900/50 hover:bg-red-800/50 text-red-400 py-3 px-4 rounded-lg border border-red-700 transition-colors text-left">
                <div className="font-bold">Seal the Portal</div>
                <div className="text-sm text-red-300">Close all connections to the spirit world</div>
              </button>
            </div>
          </div>

          {/* Save Controls */}
          <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-gray-700">
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-colors">
              Reset Changes
            </button>
            <button className="bg-purple-900 hover:bg-purple-800 text-white px-6 py-3 rounded-lg font-bold transition-colors">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;