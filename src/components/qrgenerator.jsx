import React, { useState, useRef, useEffect } from 'react';

const QRGenerator = () => {
  const [qrType, setQrType] = useState('character');
  const [qrContent, setQrContent] = useState('');
  const [generatedObjectId, setGeneratedObjectId] = useState('');
  const [qrPreviewUrl, setQrPreviewUrl] = useState('');
  const [generatedGrid, setGeneratedGrid] = useState([]);
  const [batchNumber] = useState(Date.now());
  
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const colors = {
    primary: '#8b5cf6',
    dark: '#1f2937',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)'
  };

  // Encode text to ObjectId-like hex string
  const encodeToObjectId = (text) => {
    // Convert text to hex representation
    let hex = '';
    for (let i = 0; i < text.length; i++) {
      hex += text.charCodeAt(i).toString(16);
    }
    // Pad to 24 characters (ObjectId length)
    while (hex.length < 24) {
      hex += Math.floor(Math.random() * 16).toString(16);
    }
    hex = hex.substring(0, 24);
    return hex;
  };

  // Grid encoding logic (from provided code)
  const encodeObjectId = (oid) => {
    const REDUNDANCY = 3, SIZE = 18;
    const bits = [...oid.match(/.{1,2}/g).map(b => parseInt(b,16))]
      .flatMap(byte => byte.toString(2).padStart(8,'0').split('').map(Number))
      .flatMap(bit => Array(REDUNDANCY).fill(bit));
    const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill('/'));
    grid[0][0]=grid[0][SIZE-1]=grid[SIZE-1][0]=grid[SIZE-1][SIZE-1]='\\';
    let idx=0;
    for(let i=0;i<SIZE;i++)for(let j=0;j<SIZE;j++){
      if((i===0||i===SIZE-1)&&(j===0||j===SIZE-1))continue;
      if(idx<bits.length)grid[i][j]=bits[idx++]?'\\':'/';
    }
    return {grid};
  };

  const drawGridToCanvas = (canvas, grid) => {
    if(!canvas) return;
    const ctx=canvas.getContext('2d'), cell=20, pad=20, N=grid.length;
    canvas.width=N*cell+pad*2; canvas.height=N*cell+pad*2;
    ctx.fillStyle='white'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle='#000'; ctx.lineWidth=2;
    for(let i=0;i<N;i++)for(let j=0;j<N;j++){
      const x=pad+j*cell, y=pad+i*cell, m=2;
      ctx.beginPath();
      if(grid[i][j]==='\\'){ctx.moveTo(x+m,y+m);ctx.lineTo(x+cell-m,y+cell-m);}
      else {ctx.moveTo(x+cell-m,y+m);ctx.lineTo(x+m,y+cell-m);}
      ctx.stroke();
    }
  };

  const generateQR = () => {
    if (!qrContent.trim()) {
      alert('Please enter summoning details');
      return;
    }

    // Generate ObjectId from content
    const objectId = encodeToObjectId(`${qrType}:${qrContent}`);
    setGeneratedObjectId(objectId);

    // Encode to grid
    const { grid } = encodeObjectId(objectId);
    setGeneratedGrid(grid);

    // Draw to canvas for preview
    if (previewCanvasRef.current) {
      drawGridToCanvas(previewCanvasRef.current, grid);
      setQrPreviewUrl(previewCanvasRef.current.toDataURL('image/png'));
    }
  };

  const downloadQR = () => {
    if (!previewCanvasRef.current) return;
    
    const url = previewCanvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url; 
    a.download = `qripocalypse-${qrType}-${batchNumber}.png`; 
    a.click();
  };

  const downloadGridText = () => {
    if (generatedGrid.length === 0) return;

    const gridText = generatedGrid.map(row => row.join('')).join('\n');
    const blob = new Blob([gridText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qripocalypse-${qrType}-grid.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Update preview when content changes
  useEffect(() => {
    if (qrContent.trim() && previewCanvasRef.current) {
      const objectId = encodeToObjectId(`${qrType}:${qrContent}`);
      const { grid } = encodeObjectId(objectId);
      drawGridToCanvas(previewCanvasRef.current, grid);
      setQrPreviewUrl(previewCanvasRef.current.toDataURL('image/png'));
    }
  }, [qrContent, qrType]);

  const summonOptions = {
    character: {
      placeholder: 'Dracula, Frankenstein, Witch, Ghost, Reaper...',
      examples: ['Dracula', 'Frankenstein', 'Witch of Merges']
    },
    theme: {
      placeholder: 'Dracula Mode, Possession Flicker, Frankenstein Lab...',
      examples: ['Dracula Mode', 'Possession Flicker', 'Frankenstein Lab']
    },
    diff: {
      placeholder: 'NecroDiff summary or ID...',
      examples: ['Added dark magic function', 'Fixed cursed loop']
    },
    commit: {
      placeholder: 'Commit hash or message...',
      examples: ['a1b2c3d4', 'Fixed ancient curse']
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Generate Summoning QR</h3>
      
      <div className="space-y-4">
        {/* QR Type Selection */}
        <div>
          <label className="block text-purple-300 text-sm font-bold mb-2">
            SPIRIT CATEGORY
          </label>
          <select
            value={qrType}
            onChange={(e) => setQrType(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 focus:outline-none transition-colors"
          >
            <option value="character">👻 Summon Character</option>
            <option value="theme">🎨 Activate Theme</option>
            <option value="diff">🔀 Share Diff</option>
            <option value="commit">⚰️ Grave QR</option>
          </select>
        </div>

        {/* Content Input */}
        <div>
          <label className="block text-purple-300 text-sm font-bold mb-2">
            SUMMONING DETAILS
          </label>
          <input
            type="text"
            value={qrContent}
            onChange={(e) => setQrContent(e.target.value)}
            placeholder={summonOptions[qrType]?.placeholder || 'Enter details...'}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none transition-colors"
          />
          <p className="text-gray-400 text-xs mt-2">
            Example: {summonOptions[qrType]?.examples?.[0] || 'Enter summoning text'}
          </p>
        </div>

        {/* QR Preview */}
        <div className="bg-gray-900 border-2 border-purple-700 rounded-lg p-4">
          <h4 className="text-white font-bold mb-3 text-center">🔮 GRID QR PREVIEW</h4>
          
          <div className="flex flex-col items-center justify-center">
            <canvas 
              ref={previewCanvasRef} 
              width={400} 
              height={400}
              className="w-48 h-48 bg-white rounded-lg border-2 border-purple-500"
            />
            
            {generatedObjectId && (
              <div className="mt-4 text-center">
                <p className="text-purple-300 text-sm mb-1">ObjectId:</p>
                <p className="text-green-400 font-mono text-xs break-all">
                  {generatedObjectId}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Generated ObjectId Display */}
        {generatedObjectId && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
            <h4 className="text-green-400 font-bold mb-2">✅ QR Generated!</h4>
            <p className="text-green-300 text-sm">
              Encoded as {qrType}: {qrContent}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={generateQR}
            className="w-full bg-gradient-to-r from-purple-900 to-blue-900 hover:from-purple-800 hover:to-blue-800 text-white py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span className="text-xl">🔮</span>
            Generate Grid QR
          </button>

          {generatedObjectId && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={downloadQR}
                  className="bg-gradient-to-r from-green-900 to-emerald-900 hover:from-green-800 hover:to-emerald-800 text-white py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span className="text-lg">🖼️</span>
                  Download PNG
                </button>
                
                <button 
                  onClick={downloadGridText}
                  className="bg-gradient-to-r from-blue-900 to-cyan-900 hover:from-blue-800 hover:to-cyan-800 text-white py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span className="text-lg">📄</span>
                  Download TXT
                </button>
              </div>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedObjectId);
                  alert('ObjectId copied to clipboard!');
                }}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-lg">📋</span>
                Copy ObjectId
              </button>
            </>
          )}
        </div>

        {/* QR Info */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-bold mb-2 flex items-center gap-2">
            <span>💡</span>
            About Grid QR
          </h4>
          <p className="text-gray-400 text-sm">
            This QR uses a 18×18 diagonal grid pattern encoding. 
            Each diagonal represents binary data that can be decoded back to the original ObjectId.
            The pattern is resistant to rotation and minor distortions.
          </p>
        </div>
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default QRGenerator;