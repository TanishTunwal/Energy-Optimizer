import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  actionTo, 
  onAction 
}) => {
  const ActionButton = ({ children, ...props }) => {
    if (actionTo) {
      return (
        <Link
          to={actionTo}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          {...props}
        >
          {children}
        </button>
      );
    }
    
    return null;
  };

  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-gray-100 rounded-full">
          <Icon className="h-12 w-12 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {(actionText && (actionTo || onAction)) && (
        <ActionButton>
          <Plus className="h-4 w-4 mr-2" />
          {actionText}
        </ActionButton>
      )}
    </div>
  );
};

export default EmptyState;
