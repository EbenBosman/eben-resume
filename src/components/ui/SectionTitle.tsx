import React from 'react';

interface SectionTitleProps {
  title: string;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, className = '' }) => {
  return (
    <div className="flex flex-wrap mb-4">
      <div className="w-full">
        <h3 className={`text-2xl font-light text-foreground ${className}`}>{title}</h3>
      </div>
    </div>
  );
};
