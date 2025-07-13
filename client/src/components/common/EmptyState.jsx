import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  actionTo, 
  onAction,
  loading = false
}) => {
  const ActionButton = ({ children, ...props }) => {
    if (actionTo) {
      return (
        <Link
          to={actionTo}
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
          {...props}
        >
          {children}
        </Link>
      );
    }
    
    if (onAction) {
      return (
        <button
          onClick={onAction}
          disabled={loading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:transform-none"
          {...props}
        >
          {children}
        </button>
      );
    }
    
    return null;
  };

  return (
    <div className="text-center py-16">
      <div className="flex justify-center mb-6">
        <div className="p-6 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full">
          <Icon className="h-16 w-16 text-gray-400" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg leading-relaxed">{description}</p>
      {(actionText && (actionTo || onAction)) && (
        <ActionButton>
          {loading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {actionText}
        </ActionButton>
      )}
    </div>
  );
};

export default EmptyState;
