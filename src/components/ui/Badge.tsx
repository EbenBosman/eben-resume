import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
    return (
        <span
            className={`inline-block px-3 py-1 mr-1 mb-2 text-xs font-medium text-white border border-white/30 rounded-full ${className}`}
        >
            {children}
        </span>
    );
};
