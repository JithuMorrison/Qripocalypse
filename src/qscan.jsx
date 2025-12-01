import React, { useRef, useState } from 'react';

const QRScanner = ({ scanning, onScanResult, onStartScan, onStopScan, processTextFile, decodeGrid }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [scanResult, setScanResult] = useState('');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setIsCameraOn(true);
      setCapturedImage(null); // Clear any previous capture
      onStartScan();
    } catch (error) {
      alert("Could not access camera: " + error.message);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
    }
    setIsCameraOn(false);
    onStopScan();
  };

  // Capture image from video stream
  const captureImage = () => {
    if (!videoRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to data URL for preview
    const imageDataUrl = canvas.toDataURL('image/png');
    setCapturedImage(imageDataUrl);

    return canvas;
  };

  // Process image to extract grid pattern
  const processImage = (imageSource) => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current || document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width, height;

      if (imageSource instanceof HTMLCanvasElement) {
        // Already a canvas
        width = imageSource.width;
        height = imageSource.height;
        ctx.drawImage(imageSource, 0, 0);
      } else {
        // HTMLImageElement or HTMLVideoElement
        width = imageSource.videoWidth || imageSource.width;
        height = imageSource.videoHeight || imageSource.height;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(imageSource, 0, 0, width, height);
      }

      try {
        const gridSize = 20;
        const cellWidth = width / gridSize;
        const cellHeight = height / gridSize;

        const grid = [];

        // Loop 20x20 grid
        for (let row = 0; row < gridSize; row++) {
          const rowData = [];
          for (let col = 0; col < gridSize; col++) {
            // Skip first/last row and col
            if (row === 0 || row === gridSize - 1 || col === 0 || col === gridSize - 1) {
              continue;
            }

            const x = col * cellWidth;
            const y = row * cellHeight;

            const cellData = ctx.getImageData(x, y, cellWidth, cellHeight);
            const pixels = cellData.data;

            let diag1 = 0; // "\"
            let diag2 = 0; // "/"

            for (let i = 0; i < pixels.length; i += 4) {
              const r = pixels[i];
              const g = pixels[i + 1];
              const b = pixels[i + 2];
              const brightness = (r + g + b) / 3;

              const pixelIndex = i / 4;
              const px = pixelIndex % cellWidth;
              const py = Math.floor(pixelIndex / cellWidth);

              if (px === py) diag1 += brightness;
              if (px === cellWidth - py - 1) diag2 += brightness;
            }

            rowData.push(diag1 > diag2 ? "/" : "\\");
          }
          if (rowData.length > 0) grid.push(rowData);
        }

        // Log grid (18x18)
        console.log("Extracted Grid:");
        grid.forEach(r => console.log(r.join(" ")));

        // Decode into ObjectId
        const decodedOid = decodeGrid(grid, 24);
        resolve(decodedOid);

      } catch (error) {
        reject(new Error("Failed to process image: " + error.message));
      }
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setProcessing(true);
    setCapturedImage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const objectId = await processImage(img);
          const result = `ObjectId: ${objectId}`;
          setScanResult(result);
          onScanResult(objectId);
        } catch (error) {
          setScanResult(`Error: ${error.message}`);
        } finally {
          setProcessing(false);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleTextFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setProcessing(true);
    setCapturedImage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileContent = e.target.result;
        const grid = processTextFile(fileContent);
        const decodedOid = decodeGrid(grid, 24);
        
        if (decodedOid && decodedOid.length === 24) {
          const result = `ObjectId: ${decodedOid}`;
          setScanResult(result);
          onScanResult(decodedOid);
        } else {
          throw new Error('Failed to decode valid ObjectId from grid pattern');
        }
      } catch (error) {
        setScanResult(`Error: ${error.message}`);
      } finally {
        setProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleScan = async () => {
    if (!videoRef.current) return;

    setProcessing(true);
    try {
      // First capture the image
      const capturedCanvas = captureImage();
      
      // Then process it
      const objectId = await processImage(capturedCanvas);
      const result = `ObjectId: ${objectId}`;
      setScanResult(result);
      onScanResult(objectId);
    } catch (error) {
      setScanResult(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const simulateScan = () => {
    const result = 'Dracula has been summoned! 🧛 (Simulated ObjectId: 5f8d0d55b54764421b7156c7)';
    setScanResult(result);
    onScanResult('5f8d0d55b54764421b7156c7');
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Scan Summoning QR</h3>
      
      <div className="space-y-4">
        {/* Camera Preview Area */}
        <div className="bg-black border-2 border-green-600 rounded-lg p-8 flex items-center justify-center">
          <div className="text-center">
            {/* Video Stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full max-w-[600px] h-auto border-2 ${isCameraOn ? 'border-green-500' : 'border-gray-600'} rounded-lg mb-4 ${
                isCameraOn ? 'block' : 'hidden'
              }`}
            />
            
            {/* Camera Off Placeholder */}
            {!isCameraOn && !capturedImage && (
              <div className="w-full max-w-[600px] h-[180px] bg-gradient-to-br from-green-900 to-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="text-6xl">📷</div>
              </div>
            )}

            {/* Captured Image Preview */}
            {capturedImage && (
              <div className="mb-4">
                <h4 className="text-green-400 font-bold mb-2">📸 Captured Image</h4>
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full max-w-[600px] h-auto border-2 border-green-500 rounded-lg"
                />
              </div>
            )}

            <p className="text-gray-400">
              {isCameraOn ? 'Camera is active - Point at QR code' : 'Camera feed would appear here'}
            </p>
          </div>
        </div>

        {/* Scan Result */}
        {scanResult && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <h4 className="text-green-400 font-bold mb-2">Summoning Detected!</h4>
            <p className="text-green-300">{scanResult}</p>
          </div>
        )}

        {/* Upload Status */}
        {uploadedFile && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <h4 className="text-blue-400 font-bold mb-2">📄 Uploaded File</h4>
            <p className="text-blue-300">{uploadedFile.name}</p>
            {processing && (
              <p className="text-yellow-400 text-sm mt-2">⏳ Processing file...</p>
            )}
          </div>
        )}

        {/* Control Buttons */}
        <div className="space-y-3">
          {!scanning ? (
            <button 
              onClick={startCamera}
              disabled={processing}
              className="w-full bg-green-900 hover:bg-green-800 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Processing...
                </>
              ) : (
                <>
                  📹 Start Camera
                </>
              )}
            </button>
          ) : (
            <>
              <button 
                onClick={handleScan} 
                disabled={processing}
                className="w-full bg-purple-900 hover:bg-purple-800 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <span className="animate-spin">🔮</span>
                    Scanning...
                  </>
                ) : (
                  <>
                    📸 Capture & Scan
                  </>
                )}
              </button>
              
              <button 
                onClick={stopCamera}
                className="w-full bg-red-900 hover:bg-red-800 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                🛑 Stop Camera
              </button>
            </>
          )}

          {/* Simulate Scan Button */}
          <button 
            onClick={simulateScan}
            className="w-full bg-orange-900 hover:bg-orange-800 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
          >
            🧪 Simulate Scan
          </button>
        </div>

        {/* Upload Section */}
        <div className="border-2 border-gray-700 rounded-lg p-4">
          <h4 className="text-white font-bold mb-3 text-center">📁 Or Upload Files</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input
                type="file"
                accept=".txt,.text"
                onChange={handleTextFileUpload}
                className="hidden"
                id="text-file-upload"
                disabled={processing}
              />
              <label 
                htmlFor="text-file-upload" 
                className={`w-full bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                📄 Upload Text File
              </label>
            </div>
            
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-file-upload"
                disabled={processing}
              />
              <label 
                htmlFor="image-file-upload" 
                className={`w-full bg-purple-900 hover:bg-purple-800 text-white py-2 px-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                🖼️ Upload Image
              </label>
            </div>
          </div>
        </div>

        {/* Canvas for image processing (hidden) */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default QRScanner;