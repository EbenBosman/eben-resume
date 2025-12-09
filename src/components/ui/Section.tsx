import React from 'react';

interface SectionProps {
    id?: string;
    children: React.ReactNode;
    className?: string;
}

export const Section: React.FC<SectionProps> = ({ id, children, className = '' }) => {
    return (
        <section id={id} className={`py-8 ${className}`}>
            <div className="container mx-auto px-4">{children}</div>
        </section>
    );
};
