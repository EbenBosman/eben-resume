import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
    return (
        <span
            className={`inline-block px-2 py-1 mr-1 mb-1 text-xs font-medium text-white bg-sidebar rounded ${className}`}
        >
            {children}
        </span>
    );
};
