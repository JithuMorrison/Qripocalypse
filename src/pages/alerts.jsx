import React, { useState, useEffect } from 'react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  const mockAlerts = [
    {
      id: 1,
      type: 'curse',
      file: 'ancientSpell.js',
      message: 'Cursed loop detected - this could summon unwanted entities',
      severity: 'high',
      ghost: '👻',
      suggestion: 'Break the loop with a protective incantation'
    },
    {
      id: 2,
      type: 'dead',
      file: 'ritual.ts',
      message: 'Dead variable wandering in the code',
      severity: 'medium',
      ghost: '💀',
      suggestion: 'Lay the variable to rest or put it to work'
    },
    {
      id: 3,
      type: 'suspicious',
      file: 'darkMagic.py',
      message: 'Suspicious logic that might anger the code gods',
      severity: 'low',
      ghost: '🔮',
      suggestion: 'Add protective comments and error handling'
    }
  ];

  const scanForCurses = () => {
    setIsScanning(true);
    setTimeout(() => {
      setAlerts(mockAlerts);
      setIsScanning(false);
    }, 2000);
  };

  useEffect(() => {
    scanForCurses();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-purple-900"></div>
      
      {/* Floating Ghost */}
      {alerts.length > 0 && (
        <div className="fixed top-10 right-10 text-6xl z-20 animate-bounce">
          👻
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "'Creepster', cursive" }}>
            👻 POLTERGEIST ALERTS 👻
          </h1>
          <p className="text-xl text-purple-400 italic" style={{ fontFamily: "'Eater', cursive" }}>
            AI-Powered Code Spirit Detection
          </p>
        </header>

        {/* Scan Button */}
        <div className="text-center mb-8">
          <button
            onClick={scanForCurses}
            disabled={isScanning}
            className="bg-gradient-to-r from-purple-900 to-red-900 hover:from-purple-800 hover:to-red-800 text-white px-8 py-4 rounded-lg font-bold text-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 border-2 border-purple-700"
            style={{ fontFamily: "'Creepster', cursive" }}
          >
            {isScanning ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">🔮</span>
                SCANNING FOR CURSES...
              </span>
            ) : (
              'SCAN FOR POLTERGEISTS'
            )}
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-gray-900/80 backdrop-blur-sm border-2 border-${getSeverityColor(alert.severity)}-700 rounded-xl p-6 transform hover:scale-105 transition-all duration-300`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{alert.ghost}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-bold text-white">{alert.file}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${getSeverityColor(alert.severity)}-900 text-${getSeverityColor(alert.severity)}-300`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{alert.message}</p>
                  <div className="bg-black/50 rounded-lg p-3">
                    <p className="text-green-400 text-sm">
                      <strong>Suggestion:</strong> {alert.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {alerts.length === 0 && !isScanning && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😴</div>
            <p className="text-xl text-gray-400">The spirits are quiet... for now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;