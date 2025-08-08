import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Menu, X, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-sky-500" />
            <span className="text-xl font-bold text-slate-800">OBA TOUR</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
                isActive('/') ? 'text-sky-600' : 'text-slate-600 hover:text-sky-600'
              }`}
            >
              Home
            </Link>
            {/* Show Trips only for non-admin users */}
            {(!user?.isAdmin) && (
              <Link 
                to="/trips" 
                className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActive('/trips') ? 'text-sky-600' : 'text-slate-600 hover:text-sky-600'
                }`}
              >
                Trips
              </Link>
            )}
            {user && (
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActive('/dashboard') ? 'text-sky-600' : 'text-slate-600 hover:text-sky-600'
                }`}
              >
                Dashboard
              </Link>
            )}
            {user?.isAdmin && (
              <Link 
                to="/admin" 
                className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActive('/admin') ? 'text-sky-600' : 'text-slate-600 hover:text-sky-600'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded-lg px-2 py-1"
                >
                  <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-large border border-slate-200 py-1 z-50 animate-slide-down">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn-primary text-sm px-4 py-2"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-600 hover:text-slate-800 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 bg-white animate-slide-down">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg mx-3 ${
                  isActive('/') ? 'text-sky-600' : 'text-slate-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {/* Show Trips only for non-admin users */}
              {(!user?.isAdmin) && (
                <Link 
                  to="/trips" 
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg mx-3 ${
                    isActive('/trips') ? 'text-sky-600' : 'text-slate-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Trips
                </Link>
              )}
              {user && (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg mx-3 ${
                      isActive('/dashboard') ? 'text-sky-600' : 'text-slate-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg mx-3 ${
                      isActive('/profile') ? 'text-sky-600' : 'text-slate-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {user.isAdmin && (
                    <Link 
                      to="/admin" 
                      className={`px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg mx-3 ${
                        isActive('/admin') ? 'text-sky-600' : 'text-slate-600'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm font-medium text-red-600 text-left transition-colors duration-200 rounded-lg mx-3 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              )}
              {!user && (
                <Link
                  to="/auth"
                  className="mx-3 mt-2 btn-primary text-sm px-4 py-2 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}