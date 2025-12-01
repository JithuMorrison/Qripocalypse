import React, { useState } from 'react';

const QRGenerator = () => {
  const [qrType, setQrType] = useState('character');
  const [qrContent, setQrContent] = useState('');

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Generate Summoning QR</h3>
      
      <div className="space-y-4">
        <select
          value={qrType}
          onChange={(e) => setQrType(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none"
        >
          <option value="character">Summon Character</option>
          <option value="theme">Activate Theme</option>
          <option value="diff">Share Diff</option>
          <option value="commit">Grave QR</option>
        </select>

        <input
          type="text"
          value={qrContent}
          onChange={(e) => setQrContent(e.target.value)}
          placeholder="Enter summoning details..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none"
        />

        <div className="bg-white p-4 rounded-lg flex items-center justify-center">
          <div className="w-48 h-48 bg-gray-300 flex items-center justify-center text-gray-600">
            QR Code Preview
          </div>
        </div>

        <button className="w-full bg-purple-900 hover:bg-purple-800 text-white py-3 rounded-lg font-bold transition-colors">
          Generate QR Code
        </button>
      </div>
    </div>
  );
};

export default QRGenerator;