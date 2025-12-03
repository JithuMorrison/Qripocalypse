// pages/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost, GitBranch, Zap, Skull, Scan, Folder, Code, Settings, LogOut, User } from 'lucide-react';
import WatchingGhost from '../components/WatchingGhost';

const Landing = ({ onLogout }) => {
  const features = [
    {
      icon: <Folder className="w-8 h-8" />,
      title: "Project Dashboard",
      description: "Manage your haunted code repositories and spirits",
      path: "/projects",
      color: "from-purple-900 to-blue-900"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Spirit Editor",
      description: "Write code with haunted AI assistance",
      path: "/project",
      color: "from-green-900 to-gray-800"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Dark Operations",
      description: "DevOps, Docker, and deployment rituals",
      path: "/project/1/settings",
      color: "from-blue-900 to-cyan-900"
    },
    {
      icon: <GitBranch className="w-8 h-8" />,
      title: "NecroDiff",
      description: "Haunted code comparison with spirit commentary",
      path: "/necrodiff",
      color: "from-red-900 to-purple-900"
    },
    {
      icon: <Skull className="w-8 h-8" />,
      title: "Time Cemetery",
      description: "Commit history as haunted gravestones",
      path: "/graveyard",
      color: "from-gray-900 to-gray-700"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Merge Ritual",
      description: "Resolve conflicts through dark magic",
      path: "/ritual",
      color: "from-orange-900 to-amber-700"
    },
    {
      icon: <Ghost className="w-8 h-8" />,
      title: "NecroTerminal",
      description: "Possessed command line interface",
      path: "/terminal",
      color: "from-lime-900 to-green-700"
    },
    {
      icon: <Scan className="w-8 h-8" />,
      title: "QR Summons",
      description: "Summon spirits with ancient symbols",
      path: "/qr",
      color: "from-violet-900 to-purple-700"
    }
  ];

  const user = {
    name: "Ancient Coder",
    email: "sorcerer@qripocalypse.com",
    avatar: "🧙‍♂️"
  };

  const handleLogout = () => {
    onLogout();
  };

  const choose = () => {
    const spooky = [
      { 
        title: "You Have Returned…", 
        subtitle: (name) => `Master ${name}, the shadows have been waiting.` 
      },
      { 
        title: "The Veil Opens Once More…", 
        subtitle: (name) => `Master ${name}, your presence stirs the restless spirits.` 
      },
      { 
        title: "The Darkness Welcomes You Back…", 
        subtitle: (name) => `Master ${name}… we've been dying to see you.` 
      },
      { 
        title: "Welcome Back to the Realm…", 
        subtitle: (name) => `Master ${name}, your throne grows cold without you.` 
      }
    ];

    const randomIndex = Math.floor(Math.random() * spooky.length);

    return spooky[randomIndex];
  };

  const greeting = choose();

  // Load activity data from tracker.json
  const [activityData, setActivityData] = React.useState([]);
  
  React.useEffect(() => {
    fetch('/data/tracker.json')
      .then(res => res.json())
      .then(data => setActivityData(data.activities))
      .catch(err => console.error('Error loading tracker data:', err));
  }, []);

  // Generate calendar data for year 2025
  const generateCalendarData = () => {
    const weeks = [];
    const year = 2025;
    
    // Start from January 1, 2025
    const startDate = new Date(year, 0, 1);
    // End at December 31, 2025
    const endDate = new Date(year, 11, 31);
    
    // Start from the beginning of the week containing Jan 1
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());
    
    // Count activities per date
    const activityCount = {};
    activityData.forEach(activity => {
      const date = activity.date;
      activityCount[date] = (activityCount[date] || 0) + 1;
    });
    
    while (currentDate <= endDate || currentDate.getDay() !== 0) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = activityCount[dateStr] || 0;
        
        // Determine level based on activity count
        let level = 0;
        if (count > 0) level = 1;
        if (count >= 2) level = 2;
        if (count >= 4) level = 3;
        if (count >= 6) level = 4;
        
        week.push({
          date: dateStr,
          level: level,
          count: count
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);
    }
    
    return weeks;
  };

  const calendarWeeks = generateCalendarData();
  
  // Calculate stats
  const totalActiveDays = calendarWeeks.flat().filter(day => day.level > 0).length;
  const calculateMaxStreak = () => {
    let maxStreak = 0;
    let currentStreak = 0;
    calendarWeeks.flat().forEach(day => {
      if (day.level > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    return maxStreak;
  };
  const maxStreak = calculateMaxStreak();
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="min-h-screen bg-black text-gray-300 relative overflow-hidden">
      {/* Watching Ghost */}
      <WatchingGhost />
      
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" 
           style={{ backgroundImage: "url('https://tse1.mm.bing.net/th/id/OIP.HVzCGwV8haVWCouh_1B9GAHaLH?rs=1&pid=ImgDetMain&o=7&rm=3')" }}>
      </div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/50 to-black/80"></div>
      
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 animate-pulse"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 text-4xl opacity-20 animate-bounce">🧛‍♂️</div>
      <div className="absolute top-40 right-20 text-3xl opacity-30 animate-pulse">🔮</div>
      <div className="absolute bottom-32 left-20 text-5xl opacity-15 animate-float">👻</div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with User Info */}
        <header className="flex items-center justify-between mb-12 p-6 bg-gray-900/80 backdrop-blur-sm rounded-xl border-2 border-purple-700">
          <div className="flex items-center gap-4">
            <div className="text-4xl">⚰️</div>
            <div>
              <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Creepster', cursive" }}>
                {greeting.title}
              </h1>
              <p className="text-purple-400 italic" style={{ fontFamily: "'Eater', cursive" }}>
                {greeting.subtitle(user.name)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-4 py-2">
              <div className="text-2xl">{user.avatar}</div>
              <div className="text-right">
                <div className="text-white font-bold">{user.name}</div>
                <div className="text-gray-400 text-sm">{user.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <LogOut size={16} />
              Exit Crypt
            </button>
          </div>
        </header>

        <div className="text-center mb-16">
          <h1 className="text-8xl font-bold mb-6 glitch-text" 
              style={{ fontFamily: "'Creepster', cursive" }}>
            QRIPOCALYPSE
          </h1>
          <p className="text-2xl text-purple-400 mb-8 italic" 
              style={{ fontFamily: "'Eater', cursive" }}>
            Where Repos Rise and Pipelines Perform Forbidden Rituals
          </p>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            A haunted realm where ghost code materializes from the void, cursed diffs wander freely, commits whisper in the dark, afterlife merges twist reality, images mutate, and deployments crawl back… not quite alive, not quite dead.
          </p>
          
          <div className="flex gap-6 justify-center">
            <Link 
              to="/necrodiff"
              className="bg-gradient-to-r from-red-900 to-purple-900 hover:from-red-800 hover:to-purple-800 text-white px-8 py-4 rounded-lg font-bold text-lg transform hover:scale-105 transition-all duration-300 border-2 border-red-700 shadow-lg shadow-red-900/50"
              style={{ fontFamily: "'Creepster', cursive" }}
            >
              Enter the NecroLab
            </Link>
            <Link 
              to="/qr"
              className="bg-gradient-to-r from-purple-900 to-blue-900 hover:from-purple-800 hover:to-blue-800 text-white px-8 py-4 rounded-lg font-bold text-lg transform hover:scale-105 transition-all duration-300 border-2 border-purple-700 shadow-lg shadow-purple-900/50"
              style={{ fontFamily: "'Creepster', cursive" }}
            >
              Summon a Ghost
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-xl p-6 text-center border-2 border-purple-600">
            <div className="text-3xl mb-2">📁</div>
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-purple-300 text-sm">Haunted Projects</div>
          </div>
          <div className="bg-gradient-to-r from-green-900 to-emerald-900 rounded-xl p-6 text-center border-2 border-green-600">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-green-300 text-sm">Active Spirits</div>
          </div>
          <div className="bg-gradient-to-r from-blue-900 to-cyan-900 rounded-xl p-6 text-center border-2 border-blue-600">
            <div className="text-3xl mb-2">🔮</div>
            <div className="text-2xl font-bold text-white">24</div>
            <div className="text-blue-300 text-sm">AI Rituals</div>
          </div>
          <div className="bg-gradient-to-r from-orange-900 to-amber-900 rounded-xl p-6 text-center border-2 border-orange-600">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-white">99.9%</div>
            <div className="text-orange-300 text-sm">Uptime</div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-purple-700 rounded-xl p-6 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Creepster', cursive" }}>
              📅 CALENDAR - 2025
            </h2>
            <div className="text-gray-400 text-sm flex items-center gap-4">
              <span>Total active days: <span className="text-white font-bold">{totalActiveDays}</span></span>
              <span className="relative">
                <span className="blood-drip text-red-500 font-bold" style={{ fontFamily: "'Creepster', cursive" }}>
                  Max streak: {maxStreak}
                </span>
              </span>
            </div>
          </div>
          
          <div className="w-full">
            {/* Month labels */}
            <div className="flex mb-2">
              <div className="w-12"></div>
              <div className="flex-1 flex justify-between px-1">
                {months.map((month, idx) => (
                  <div key={idx} className="text-xs text-gray-500">
                    {month}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Calendar grid */}
            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col justify-between text-xs text-gray-500 w-12 pr-2">
                <div>Mon</div>
                <div>Wed</div>
                <div>Fri</div>
              </div>
              
              {/* Weeks grid - full width */}
              <div className="flex-1 flex gap-[2px]">
                {calendarWeeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-[2px] flex-1">
                    {week.map((day, dayIdx) => {
                      const levelColors = [
                        'bg-gray-800',           // level 0 - no activity
                        'bg-red-900/50',         // level 1 - low activity
                        'bg-red-800/70',         // level 2 - medium activity
                        'bg-red-700/90',         // level 3 - high activity
                        'bg-red-600'             // level 4 - very high activity
                      ];
                      
                      return (
                        <div
                          key={dayIdx}
                          className={`w-full aspect-square rounded-sm ${levelColors[day.level]} hover:ring-1 hover:ring-purple-500 cursor-pointer transition-all flex items-center justify-center relative`}
                          title={`${day.date}: ${day.count} activities`}
                        >
                          {day.level > 0 && (
                            <span className="text-white text-[10px] opacity-90">💀</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
                <div className="w-3 h-3 bg-red-900/50 rounded-sm flex items-center justify-center">
                  <span className="text-[8px]">💀</span>
                </div>
                <div className="w-3 h-3 bg-red-800/70 rounded-sm flex items-center justify-center">
                  <span className="text-[8px]">💀</span>
                </div>
                <div className="w-3 h-3 bg-red-700/90 rounded-sm flex items-center justify-center">
                  <span className="text-[8px]">💀</span>
                </div>
                <div className="w-3 h-3 bg-red-600 rounded-sm flex items-center justify-center">
                  <span className="text-[8px]">💀</span>
                </div>
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-blue-700 rounded-xl p-6 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Zap size={24} />
            RECENT SPIRIT ACTIVITY
          </h2>
          <div className="space-y-3">
            {[
              { spirit: '🧛 Dracula', action: 'reviewed ancient-spells project', time: '2 minutes ago' },
              { spirit: '🧟 Frankenstein', action: 'fixed cursed loop in ritual.ts', time: '15 minutes ago' },
              { spirit: '🧙‍♀️ Witch', action: 'resolved merge conflict in dark-magic branch', time: '1 hour ago' },
              { spirit: '👻 Ghost', action: 'commented on commit #a1b2c3d', time: '3 hours ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 py-2 border-b border-gray-700 last:border-0">
                <div className="text-2xl">{activity.spirit.split(' ')[0]}</div>
                <div className="flex-1">
                  <span className="text-white">{activity.spirit}</span>
                  <span className="text-gray-400"> {activity.action}</span>
                </div>
                <span className="text-gray-500 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-center mb-8 text-white" style={{ fontFamily: "'Creepster', cursive" }}>
            🎃 HAUNTED WORKSPACE 🎃
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.path}
                className={`bg-gradient-to-br ${feature.color} border-2 border-gray-700 rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl backdrop-blur-sm group h-48 flex flex-col justify-between`}
              >
                <div>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white" style={{ fontFamily: "'Creepster', cursive" }}>
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-green-700 rounded-xl p-6 text-center mb-12">
          <h3 className="text-2xl font-bold text-green-400 mb-4" style={{ fontFamily: "'Creepster', cursive" }}>
            NEED IMMEDIATE ASSISTANCE?
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/alerts"
              className="bg-red-900 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
            >
              🔥 Check Cursed Code
            </Link>
            <Link
              to="/characters"
              className="bg-purple-900 hover:bg-purple-800 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
            >
              👻 Summon Spirits
            </Link>
            <Link
              to="/themes"
              className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
            >
              🎨 Change Aesthetic
            </Link>
            <Link
              to="/settings"
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
            >
              ⚙️ Laboratory Controls
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Creepster&family=Eater&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .glitch-text {
          text-shadow: 
            0 0 10px #ff0000,
            0 0 20px #ff0000,
            0 0 30px #ff0000,
            0 0 40px #8b0000;
          color: #ff6b6b;
          animation: glitch-pulse 3s ease-in-out infinite;
        }
        
        @keyframes glitch-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .blood-drip {
          position: relative;
          display: inline-block;
          text-shadow: 
            0 0 10px #dc2626,
            0 0 20px #dc2626,
            0 2px 4px rgba(220, 38, 38, 0.5);
          animation: blood-flow 3s ease-in-out infinite;
        }
        
        .blood-drip::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 8px;
          background: linear-gradient(to bottom, #dc2626, transparent);
          border-radius: 0 0 50% 50%;
          animation: drip 3s ease-in-out infinite;
        }
        
        @keyframes blood-flow {
          0%, 100% { 
            filter: brightness(1);
            text-shadow: 
              0 0 10px #dc2626,
              0 0 20px #dc2626,
              0 2px 4px rgba(220, 38, 38, 0.5);
          }
          50% { 
            filter: brightness(1.3);
            text-shadow: 
              0 0 15px #dc2626,
              0 0 30px #dc2626,
              0 4px 8px rgba(220, 38, 38, 0.8);
          }
        }
        
        @keyframes drip {
          0%, 100% { 
            height: 8px;
            opacity: 0.8;
          }
          50% { 
            height: 12px;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;