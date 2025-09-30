'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  text,
  className = ''
}) => {
  const getSizeClasses = () => {
    const sizes = {
      small: 'w-4 h-4',
      medium: 'w-8 h-8',
      large: 'w-12 h-12'
    };
    return sizes[size];
  };

  const getColorClasses = () => {
    const colors = {
      primary: 'text-blue-600',
      secondary: 'text-gray-600',
      white: 'text-white',
      gray: 'text-gray-400'
    };
    return colors[color];
  };

  return (
    <div className={`loading-spinner ${className}`}>
      <div className="spinner-container">
        <div className={`spinner ${getSizeClasses()} ${getColorClasses()}`}>
          <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        
        {text && (
          <div className="spinner-text">
            <p className="text-sm text-gray-600">{text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Full page loading spinner
export const FullPageLoading: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="full-page-loading">
      <div className="loading-content">
        <LoadingSpinner size="large" text={text} />
      </div>
    </div>
  );
};

// Inline loading spinner
export const InlineLoading: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="inline-loading">
      <LoadingSpinner size="small" text={text} />
    </div>
  );
};

// Button loading spinner
export const ButtonLoading: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="button-loading">
      <LoadingSpinner size="small" color="white" />
      {text && <span className="ml-2">{text}</span>}
    </div>
  );
};
