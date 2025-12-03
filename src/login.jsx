// pages/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Ghost, Skull } from 'lucide-react';
import { login as authLogin } from './services/authService.jsx';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Call authentication service
      const result = await authLogin(formData.email, formData.password);
      
      if (result.success) {
        // Store token in localStorage
        localStorage.setItem('authToken', result.token);
        
        // Store user data if rememberMe is checked
        if (formData.rememberMe) {
          localStorage.setItem('userData', JSON.stringify(result.user));
        }
        
        // Call onLogin callback with token
        onLogin(result.token);
      } else {
        // Display error message from service response
        setErrorMessage(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-full h-full bg-gradient-to-br from-red-900 via-purple-900 to-black animate-pulse"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 text-4xl opacity-20 animate-bounce">🧛‍♂️</div>
      <div className="absolute top-40 right-20 text-3xl opacity-30 animate-pulse">🔮</div>
      <div className="absolute bottom-32 left-20 text-5xl opacity-15 animate-float">👻</div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "'Creepster', cursive" }}>
              ENTER THE CRYPT
            </h1>
            <p className="text-xl text-purple-400 italic" style={{ fontFamily: "'Eater', cursive" }}>
              Prove Your Worth to the Spirits
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-gray-900/90 backdrop-blur-sm border-2 border-purple-700 rounded-xl p-8 shadow-2xl shadow-purple-900/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-white font-bold mb-2" style={{ fontFamily: "'Creepster', cursive" }}>
                  SPIRIT IDENTIFIER
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ancient.sorcerer@qripocalypse.com"
                  className="w-full bg-black/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-white font-bold mb-2" style={{ fontFamily: "'Creepster', cursive" }}>
                  SECRET INCANTATION
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full bg-black/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none transition-colors pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-gray-400 text-sm">Remember my spirit</span>
                </label>
                <Link to="/forgot-password" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                  Forgotten incantation?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-900 to-red-900 hover:from-purple-800 hover:to-red-800 text-white py-4 rounded-lg font-bold text-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-purple-700"
                style={{ fontFamily: "'Creepster', cursive" }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">🔮</span>
                    CONSULTING THE SPIRITS...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Ghost size={20} />
                    ENTER THE CRYPT
                    <Skull size={20} />
                  </span>
                )}
              </button>
            </form>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="mt-4 bg-red-900/50 border-2 border-red-700 rounded-lg p-4 text-center">
                <p className="text-red-300 font-bold" style={{ fontFamily: "'Creepster', cursive" }}>
                  ⚠️ {errorMessage}
                </p>
              </div>
            )}

            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-gray-400">
                New to the crypt?{' '}
                <Link to="/register" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                  Summon a new spirit
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;