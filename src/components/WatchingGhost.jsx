import React, { useState, useEffect } from 'react'; 
 
const WatchingGhost = () => { 
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 }); 
  const [isBlinking, setIsBlinking] = useState(false);
  const [isScared, setIsScared] = useState(false);
  const [rotation, setRotation] = useState(0);
 
  useEffect(() => {
    // Random blinking
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => { 
    const handleMouseMove = (e) => { 
      // Get ghost position (fixed at top-left) 
      const ghostX = 100; 
      const ghostY = 100; 
 
      // Calculate angle between ghost and cursor 
      const deltaX = e.clientX - ghostX; 
      const deltaY = e.clientY - ghostY; 
       
      // Calculate distance and normalize it 
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); 
      const maxMove = 5; // Reduced to keep eyes inside sockets
       
      // Check if cursor is very close
      setIsScared(distance < 200);
      
      // Calculate rotation angle (in degrees)
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      // Limit rotation to ±25 degrees for subtle head turning
      const limitedRotation = Math.max(-25, Math.min(25, angle / 4));
      setRotation(limitedRotation);
      
      // Calculate eye position (limited movement with clamping)
      const moveX = Math.max(-maxMove, Math.min(maxMove, (deltaX / distance) * Math.min(distance / 40, maxMove))); 
      const moveY = Math.max(-maxMove, Math.min(maxMove, (deltaY / distance) * Math.min(distance / 40, maxMove))); 
       
      setEyePosition({ x: moveX, y: moveY }); 
    }; 
 
    window.addEventListener('mousemove', handleMouseMove); 
    return () => window.removeEventListener('mousemove', handleMouseMove); 
  }, []);
 
  return ( 
    <div className="fixed top-8 left-0 z-50 pointer-events-none"> 
      <div 
        className={`relative w-32 h-32 transition-all duration-300 ${isScared ? 'scale-90' : 'scale-100'}`}
        style={{ 
          transform: `scale(${isScared ? 0.9 : 1}) rotate(${rotation}deg)`,
          transformOrigin: 'center center'
        }}
      > 
        {/* Ghost Body */} 
        <svg viewBox="0 0 100 120" className="w-full h-full filter drop-shadow-2xl"> 
          {/* Glow behind ghost */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <radialGradient id="ghostGradient">
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="#f3e8ff" />
            </radialGradient>
            <clipPath id="leftEyeClip">
              <ellipse cx="35" cy="45" rx="9" ry="12" />
            </clipPath>
            <clipPath id="rightEyeClip">
              <ellipse cx="65" cy="45" rx="9" ry="12" />
            </clipPath>
            <radialGradient id="eyeShine">
              <stop offset="0%" stopColor="white" stopOpacity="0.8" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ghost shape with gradient */} 
          <path 
            d="M50 20 C30 20, 20 30, 20 50 L20 100 L25 95 L30 100 L35 95 L40 100 L45 95 L50 100 L55 95 L60 100 L65 95 L70 100 L75 95 L80 100 L80 50 C80 30, 70 20, 50 20 Z" 
            fill="url(#ghostGradient)" 
            stroke="#9333ea" 
            strokeWidth="2.5" 
            filter="url(#glow)"
            className={`transition-all duration-300 ${isScared ? 'opacity-90' : 'opacity-100'}`}
          /> 
           
          {/* Left Eye */} 
          <g> 
            {/* Eye socket - bigger and rounder */} 
            <ellipse 
              cx="35" 
              cy="45" 
              rx="10" 
              ry={isBlinking ? "1" : "13"} 
              fill="#0a0a0a"
              className="transition-all duration-150"
            />
            {/* Soft inner shadow */}
            <ellipse 
              cx="35" 
              cy="45" 
              rx="9.5" 
              ry={isBlinking ? "1" : "12.5"} 
              fill="url(#eyeShine)"
              opacity="0.1"
              className="transition-all duration-150"
            />
            {!isBlinking && (
              <g clipPath="url(#leftEyeClip)">
                {/* White of eye - larger and brighter */}
                <circle 
                  cx={35 + eyePosition.x} 
                  cy={45 + eyePosition.y} 
                  r="8" 
                  fill="white"
                  className="transition-all duration-100" 
                />
                {/* Subtle eye shadow */}
                <ellipse 
                  cx={35 + eyePosition.x} 
                  cy={48 + eyePosition.y} 
                  rx="7" 
                  ry="3" 
                  fill="#e0e0e0"
                  opacity="0.3"
                  className="transition-all duration-100" 
                />
                {/* Iris - beautiful gradient */} 
                <circle 
                  cx={35 + eyePosition.x} 
                  cy={45 + eyePosition.y} 
                  r={isScared ? "5.5" : "5"} 
                  fill="#8b5cf6" 
                  className="transition-all duration-200" 
                />
                {/* Iris detail ring */}
                <circle 
                  cx={35 + eyePosition.x} 
                  cy={45 + eyePosition.y} 
                  r={isScared ? "4.5" : "4"} 
                  fill="#7c3aed" 
                  className="transition-all duration-200" 
                />
                {/* Pupil - glossy black */} 
                <circle 
                  cx={35 + eyePosition.x} 
                  cy={45 + eyePosition.y} 
                  r={isScared ? "3" : "2.5"} 
                  fill="#000000" 
                  className="transition-all duration-200" 
                />
                {/* Primary shine - large and bright */}
                <circle 
                  cx={37 + eyePosition.x * 0.7} 
                  cy={43 + eyePosition.y * 0.7} 
                  r="2.5" 
                  fill="white" 
                  opacity="0.9"
                  className="transition-all duration-100" 
                />
                {/* Secondary shine */}
                <circle 
                  cx={33 + eyePosition.x * 0.5} 
                  cy={46 + eyePosition.y * 0.5} 
                  r="1" 
                  fill="white" 
                  opacity="0.6"
                  className="transition-all duration-100" 
                />
              </g>
            )}
          </g> 
           
          {/* Right Eye */} 
          <g> 
            {/* Eye socket - bigger and rounder */} 
            <ellipse 
              cx="65" 
              cy="45" 
              rx="10" 
              ry={isBlinking ? "1" : "13"} 
              fill="#0a0a0a"
              className="transition-all duration-150"
            />
            {/* Soft inner shadow */}
            <ellipse 
              cx="65" 
              cy="45" 
              rx="9.5" 
              ry={isBlinking ? "1" : "12.5"} 
              fill="url(#eyeShine)"
              opacity="0.1"
              className="transition-all duration-150"
            />
            {!isBlinking && (
              <g clipPath="url(#rightEyeClip)">
                {/* White of eye - larger and brighter */}
                <circle 
                  cx={65 + eyePosition.x} 
                  cy={45 + eyePosition.y} 
                  r="8" 
                  fill="white"
                  className="transition-all duration-100" 
                />
                {/* Subtle eye shadow */}
                <ellipse 
                  cx={65 + eyePosition.x} 
                  cy={48 + eyePosition.y} 
                  rx="7" 
                  ry="3" 
                  fill="#e0e0e0"
                  opacity="0.3"
                  className="transition-all duration-100" 
                />
                {/* Iris - beautiful gradient */} 
                <circle 
                  cx={65 + eyePosition.x} 
                  cy={45 + eyePosition.y} 
                  r={isScared ? "5.5" : "5"} 
                  fill="#8b5cf6" 
                  className="transition-all duration-200" 
                />
                {/* Iris detail ring */}
                <circle 
                  cx={65 + eyePosition.x} 
                  cy={45 + eyePosition.y} 
                  r={isScared ? "4.5" : "4"} 
                  fill="#7c3aed" 
                  className="transition-all duration-200" 
                />
                {/* Pupil - glossy black */} 
                <circle 
                  cx={65 + eyePosition.x} 
                  cy={45 + eyePosition.y} 
                  r={isScared ? "3" : "2.5"} 
                  fill="#000000" 
                  className="transition-all duration-200" 
                />
                {/* Primary shine - large and bright */}
                <circle 
                  cx={67 + eyePosition.x * 0.7} 
                  cy={43 + eyePosition.y * 0.7} 
                  r="2.5" 
                  fill="white" 
                  opacity="0.9"
                  className="transition-all duration-100" 
                />
                {/* Secondary shine */}
                <circle 
                  cx={63 + eyePosition.x * 0.5} 
                  cy={46 + eyePosition.y * 0.5} 
                  r="1" 
                  fill="white" 
                  opacity="0.6"
                  className="transition-all duration-100" 
                />
              </g>
            )}
          </g> 
           
          {/* Mouth - changes based on scared state */} 
          <path 
            d={isScared ? "M 40 68 Q 50 62, 60 68" : "M 40 65 Q 50 70, 60 65"}
            stroke="#1a1a1a" 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="round"
            className="transition-all duration-300"
          /> 

          {/* Blush cheeks when scared */}
          {isScared && (
            <>
              <ellipse cx="28" cy="55" rx="6" ry="4" fill="#ff9999" opacity="0.5" />
              <ellipse cx="72" cy="55" rx="6" ry="4" fill="#ff9999" opacity="0.5" />
            </>
          )}
        </svg> 
         
        {/* Enhanced glow effects */} 
        <div className={`absolute inset-0 bg-purple-500/30 rounded-full blur-2xl transition-opacity duration-300 ${isScared ? 'animate-pulse' : ''}`}></div>
        <div className="absolute inset-0 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '3s'}}></div>
      </div> 
    </div> 
  ); 
}; 
 
export default WatchingGhost;