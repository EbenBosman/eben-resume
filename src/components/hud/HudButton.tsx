import React from 'react';

type HudButtonProps = {
  variant?: 'primary' | 'outline';
  size?: 'md' | 'sm';
  className?: string;
  children: React.ReactNode;
} & (
  | ({ href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
);

/**
 * The Cesium HUD call to action (`$ download resume →`): squared, mono, with the swipe fill on
 * hover. Renders an <a> when given an href, otherwise a <button>. Styles live in globals.css.
 */
export const HudButton: React.FC<HudButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) => {
  const classes = [
    'hud-btn',
    variant === 'primary' ? 'hud-btn-primary' : 'hud-btn-outline',
    size === 'sm' ? 'hud-btn-sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};
