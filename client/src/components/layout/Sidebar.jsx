import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Zap, 
  Plus, 
  Lightbulb, 
  Settings, 
  Users,
  BarChart3
} from 'lucide-react';

const Sidebar = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Energy Usage',
      href: '/energy',
      icon: Zap,
    },
    {
      name: 'Add Energy Data',
      href: '/energy/add',
      icon: Plus,
    },
    {
      name: 'Recommendations',
      href: '/recommendations',
      icon: Lightbulb,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const adminNavigation = [
    {
      name: 'Manage Users',
      href: '/admin/users',
      icon: Users,
    },
  ];

  const isActivePath = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="flex flex-col h-full pt-16">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.href);
                
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive ? 'text-blue-600' : 'text-gray-400'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                );
              })}
              
              {isAdmin && (
                <>
                  <div className="pt-6">
                    <div className="px-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Administration
                      </h3>
                    </div>
                    <div className="mt-2 space-y-1">
                      {adminNavigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = isActivePath(item.href);
                        
                        return (
                          <NavLink
                            key={item.name}
                            to={item.href}
                            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                              isActive
                                ? 'bg-blue-100 text-blue-900'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <Icon
                              className={`mr-3 flex-shrink-0 h-6 w-6 ${
                                isActive ? 'text-blue-600' : 'text-gray-400'
                              }`}
                              aria-hidden="true"
                            />
                            {item.name}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
