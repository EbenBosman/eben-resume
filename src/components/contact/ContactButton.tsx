'use client';

import React from 'react';

import { HudButton } from '../hud/HudButton';
import { useContact } from './ContactProvider';

interface ContactButtonProps {
  variant?: 'primary' | 'outline';
  size?: 'md' | 'sm';
  className?: string;
  label?: string;
  onOpen?: () => void;
}

/** HUD button that opens the contact modal. */
export const ContactButton: React.FC<ContactButtonProps> = ({
  variant = 'outline',
  size = 'md',
  className,
  label = '$ contact',
  onOpen,
}) => {
  const { openContact } = useContact();
  return (
    <HudButton
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        onOpen?.();
        openContact();
      }}
    >
      <span>{label}</span>
      <span aria-hidden="true">&rarr;</span>
    </HudButton>
  );
};

/** Text-style (» contact) trigger for the contact modal, matching the other » links. */
export const ContactLink: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { openContact } = useContact();
  return (
    <button type="button" className={`hud-link ${className}`} onClick={openContact}>
      &raquo; contact
    </button>
  );
};
