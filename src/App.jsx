// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Home from './Home';
// import Login from './login';
// import Register from './register';
// import VendorDashboard from './vendordash';
// import DepotDashboard from './depotdash';
// import InstallationDashboard from './insdash';
// import InspectorDashboard from './inspdash';
// import Navbar from './navbar';
// import { authService } from './services';
// import './App.css';
// import AnalyticsDashboard from './analyticsdash';
// import RulesManagement from './rulesmanage';
// import MaintenanceDashboard from './maindash';
// import WorkOrderDetail from './workorderdetail';
// import DefectReport from './defectreport';
// import Chatbot from './chatbot';

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
    
//     if (token && userData) {
//       setUser(JSON.parse(userData));
//     }
//     setLoading(false);
//   }, []);

//   const login = (userData, token) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(userData));
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <Router>
//       <div className="App">
//         <Navbar user={user} onLogout={logout} />
//         <Routes>
//           <Route path="/" element={<Home user={user} />} />
//           <Route path="/login" element={!user ? <Login onLogin={login} /> : <Navigate to={`/${user.role}`} />} />
//           <Route path="/register" element={!user ? <Register /> : <Navigate to="/login" />} />
//           <Route path="/analytics/:currentPage" element={<AnalyticsDashboard user={user} />} />
//           <Route path="/work-order/:workOrderId" element={<WorkOrderDetail user={user} />} />
//           <Route path="/defect-report" element={<DefectReport user={user} />} />
//           <Route path="/chatbot" element={<Chatbot user={user} />} />
//           <Route path="/rules" element={<RulesManagement user={user}/>} />
//           <Route 
//             path="/vendor" 
//             element={user?.role === 'vendor' ? <VendorDashboard user={user} /> : <Navigate to="/" />} 
//           />
//           <Route 
//             path="/depot" 
//             element={user?.role === 'depot' ? <DepotDashboard user={user} /> : <Navigate to="/" />} 
//           />
//           <Route 
//             path="/installation" 
//             element={user?.role === 'installation' ? <InstallationDashboard user={user} /> : <Navigate to="/" />} 
//           />
//           <Route 
//             path="/inspector" 
//             element={user?.role === 'inspector' ? <InspectorDashboard user={user} /> : <Navigate to="/" />} 
//           />
//           <Route 
//             path="/maintenance" 
//             element={user?.role === 'maintenance' ? <MaintenanceDashboard user={user} /> : <Navigate to="/" />} 
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from './components/projectContext';
import Landing from './pages/landing';
import NecroDiff from './pages/necrodiff';
import Graveyard from './pages/graveyard';
import Ritual from './pages/ritual';
import Alerts from './pages/alerts';
import Terminal from './pages/terminal';
import Characters from './pages/characters';
import Themes from './pages/themes';
import QRPortal from './pages/qrportal';
import Settings from './pages/settings';
import About from './pages/about';
import './styles/haunted.css';
import './App.css';
import Login from './login';
import Register from './register';
import ProjectDashboard from './dashboard';
import CodeEditor from './codeeditor';
import ProjectSettings from './projectsettings';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('qripocalypse_token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('qripocalypse_token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('qripocalypse_token');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout, loading };
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🔮</div>
          <p className="text-purple-400 text-xl" style={{ fontFamily: "'Creepster', cursive" }}>
            Consulting the Spirits...
          </p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <ProjectProvider> {/* Wrap entire app with ProjectProvider */}
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login onLogin={login} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <Register onLogin={login} /> : <Navigate to="/" />} 
            />
            
            {/* Protected Routes - Only accessible after login */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Landing onLogout={logout} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/projects" 
              element={
                <ProtectedRoute>
                  <ProjectDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/project/:id/code" 
              element={
                <ProtectedRoute>
                  <CodeEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/project" 
              element={
                <ProtectedRoute>
                  <CodeEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/project/:id/settings" 
              element={
                <ProtectedRoute>
                  <ProjectSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/necrodiff" 
              element={
                <ProtectedRoute>
                  <NecroDiff />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/graveyard" 
              element={
                <ProtectedRoute>
                  <Graveyard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ritual" 
              element={
                <ProtectedRoute>
                  <Ritual />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/terminal" 
              element={
                <ProtectedRoute>
                  <Terminal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/qr" 
              element={
                <ProtectedRoute>
                  <QRPortal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/alerts" 
              element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/characters" 
              element={
                <ProtectedRoute>
                  <Characters />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/themes" 
              element={
                <ProtectedRoute>
                  <Themes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/about" 
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              } 
            />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </ProjectProvider>
  );
}

export default App;