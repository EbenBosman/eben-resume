import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-surface border rounded-lg shadow-sm p-6 h-full transition-transform hover:-translate-y-1 duration-200 ${className}`}
    >
      {children}
    </div>
  );
};
