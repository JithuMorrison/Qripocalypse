import React, { useState } from 'react';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState('');

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Scan Summoning QR</h3>
      
      <div className="space-y-4">
        <div className="bg-black border-2 border-green-600 rounded-lg p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-gray-400">Camera feed would appear here</p>
          </div>
        </div>

        {scanResult && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <h4 className="text-green-400 font-bold mb-2">Summoning Detected!</h4>
            <p className="text-green-300">{scanResult}</p>
          </div>
        )}

        <button 
          onClick={() => setScanResult('Dracula has been summoned! 🧛')}
          className="w-full bg-green-900 hover:bg-green-800 text-white py-3 rounded-lg font-bold transition-colors"
        >
          Simulate Scan
        </button>
      </div>
    </div>
  );
};

export default QRScanner;