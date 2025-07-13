import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Sparkles, ExternalLink } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 shadow-lg border-b border-gray-200 fixed w-full top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">
                Renewable Energy Optimizer
              </h1>
            </div>
            
            {/* Demo Link - Opens in new tab */}
            <a 
              href="/demo" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Live Demo</span>
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="p-1 bg-white/20 rounded-full">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white">
                {user?.name}
              </span>
              {user?.role === 'admin' && (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-400 text-yellow-900 rounded-full">
                  Admin
                </span>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
