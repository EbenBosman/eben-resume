import React, { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    id: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
    label,
    error,
    id,
    className = '',
    ...props
}) => {
    return (
        <div className="mb-4">
            <label
                htmlFor={id}
                className={`block mb-2 text-sm font-medium ${error ? 'text-red-500' : 'text-foreground'}`}
            >
                {label}
            </label>
            <textarea
                id={id}
                className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-foreground ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};
