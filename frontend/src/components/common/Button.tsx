import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  icon,
  isLoading = false,
  className = '',
  disabled,
  style,
  ...props
}) => {
  let baseClass = 'btn-gold';
  if (variant === 'outline') baseClass = 'btn-outline-gold';
  if (variant === 'ghost') baseClass = 'btn-ghost';

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '0.55rem 1.15rem', fontSize: '0.75rem', letterSpacing: '0.1em' },
    md: { padding: '0.85rem 1.85rem', fontSize: '0.85rem', letterSpacing: '0.12em' },
    lg: { padding: '1.1rem 2.4rem', fontSize: '0.95rem', letterSpacing: '0.14em' },
  };

  const disabledStyles: React.CSSProperties = (disabled || isLoading)
    ? { opacity: 0.6, cursor: 'not-allowed', pointerEvents: 'none' }
    : {};

  return (
    <button
      className={`${baseClass} ${className}`}
      disabled={disabled || isLoading}
      style={{
        ...sizeStyles[size],
        ...disabledStyles,
        ...style,
      }}
      {...props}
    >
      {isLoading ? (
        <span
          style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.75s linear infinite',
            marginRight: '0.5rem',
          }}
        />
      ) : (
        icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>
      )}
      {children}
    </button>
  );
};
