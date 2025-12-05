import React, { useState, useEffect } from 'react';
import QRGenerator from '../components/QrGenerator';
import QRScanner from '../qscan';
import { getRecentSummons, retrieveQRData } from '../services/qrStorageService';

const REDUNDANCY = 3;
const EXPECTED_GRID_SIZE = 18;

const QRPortal = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [scanning, setScanning] = useState(false);
  const [recentCodes, setRecentCodes] = useState([]);
  const [scannedData, setScannedData] = useState(null);

  // Load recent summons from localStorage
  useEffect(() => {
    const summons = getRecentSummons(20);
    setRecentCodes(summons);
  }, []);

  const summonOptions = [
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
    },
    {
      type: 'projectFile',
      title: 'Summon a Project File',
      description: 'Generate QR codes for specific project files',
      icon: '📄',
      color: 'blue'
    },
    {
      type: 'deployment',
      title: 'Summon Deployment Info',
      description: 'Create QR codes with deployment configurations',
      icon: '🚀',
      color: 'orange'
    }
  ];

  const handleScanResult = async (objectId, data) => {
    try {
      console.log('Scanned Object ID:', objectId);
      setScannedData(data);
      // Refresh recent summons
      const summons = getRecentSummons(20);
      setRecentCodes(summons);
    } catch (error) {
      console.error('Failed to process scan:', error.message);
    }
  };

  const handleQRGenerated = (qrInfo) => {
    // Refresh recent summons when a new QR is generated
    const summons = getRecentSummons(20);
    setRecentCodes(summons);
  };

  const handleResummon = (summonId) => {
    // Retrieve the QR data and switch to generate tab
    const qrData = retrieveQRData(summonId);
    if (qrData) {
      // Could pass this to QRGenerator to pre-fill, but for now just notify
      alert(`Resummon feature: Would regenerate QR for ${qrData.type}`);
    }
  };

  const bitsToText = (bits, length) => {
    const reducedBits = [];
    for (let i = 0; i < bits.length; i += REDUNDANCY) {
      const chunk = bits.slice(i, i + REDUNDANCY);
      const sum = chunk.reduce((a, b) => a + b, 0);
      reducedBits.push(sum > REDUNDANCY / 2 ? 1 : 0);
    }
    
    const byteStr = reducedBits.join('');
    const truncatedBits = byteStr.slice(0, length * 4);
    
    const bytes = [];
    for (let i = 0; i < truncatedBits.length; i += 8) {
      const byteBits = truncatedBits.slice(i, i + 8);
      if (byteBits.length === 8) {
        bytes.push(parseInt(byteBits, 2));
      }
    }
    
    const hexArray = bytes.map(b => b.toString(16).padStart(2, '0'));
    let result = hexArray.join('');
    
    if (result.length < length) {
      result = result.padEnd(length, '0');
    } else if (result.length > length) {
      result = result.slice(0, length);
    }
    
    return result;
  };

  const decodeGrid = (grid, length) => {
    const bits = [];
    const gridSize = grid.length;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if ((i === 0 && j === 0) || 
            (i === 0 && j === gridSize - 1) || 
            (i === gridSize - 1 && j === 0) || 
            (i === gridSize - 1 && j === gridSize - 1)) {
          continue;
        }
        bits.push(grid[i][j] === '\\' ? 1 : 0);
      }
    }
    
    return bitsToText(bits, length);
  };

  // Process uploaded text file and extract grid pattern
  const processTextFile = (text) => {
    const cleanText = text.trim().replace(/\r\n/g, '\n').replace(/ /g, '');
    const lines = cleanText.split('\n').filter(line => line.length > 0);
    
    if (lines.length === 0) {
      throw new Error('File is empty or contains no valid grid data');
    }
    
    const firstLineLength = lines[0].length;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].length !== firstLineLength) {
        throw new Error('Invalid grid format: lines have different lengths');
      }
    }
    
    if (lines.length !== EXPECTED_GRID_SIZE || firstLineLength !== EXPECTED_GRID_SIZE) {
      throw new Error(`Expected ${EXPECTED_GRID_SIZE}x${EXPECTED_GRID_SIZE} grid, but got ${lines.length}x${firstLineLength}`);
    }
    
    const grid = [];
    for (let i = 0; i < lines.length; i++) {
      const row = [];
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        if (char !== '/' && char !== '\\') {
          throw new Error(`Invalid character '${char}' at position (${i+1},${j+1}). Only '/' and '\\' are allowed.`);
        }
        row.push(char);
      }
      grid.push(row);
    }
    
    return grid;
  };

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
                <QRGenerator onQRGenerated={handleQRGenerated} />
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* QR Scanner */}
              <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-green-700 rounded-xl p-6">
                <QRScanner 
                  scanning={scanning}
                  onScanResult={handleScanResult}
                  onStartScan={() => setScanning(true)}
                  onStopScan={() => setScanning(false)}
                  processTextFile={processTextFile}
                  decodeGrid={decodeGrid}
                  scannedData={scannedData}
                />
              </div>

              {/* Scan Results & History */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Creepster', cursive" }}>
                  Recent Summons
                </h2>
                
                {recentCodes.length === 0 ? (
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 text-center">
                    <p className="text-gray-400">No recent summons yet. Generate your first QR code!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentCodes.map((code, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{code.icon}</span>
                            <div>
                              <h4 className="text-white font-bold">{code.name}</h4>
                              <p className="text-gray-400 text-sm capitalize">{code.type} • {code.date}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleResummon(code.id)}
                            className="text-purple-400 hover:text-purple-300 text-sm font-bold transition-colors"
                          >
                            RESUMMON
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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