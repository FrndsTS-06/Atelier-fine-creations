import React from 'react';
import { Sparkles } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Curating Masterpiece Jewels...',
  className = '',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`atelier-loading-state ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1.5rem',
        color: 'var(--color-champagne)',
        textAlign: 'center',
      }}
    >
      <div
        className="animate-glow"
        style={{
          marginBottom: '1.5rem',
          color: 'var(--color-champagne)',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Sparkles size={36} strokeWidth={1.5} />
      </div>
      <p
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.25rem',
          letterSpacing: '0.08em',
          color: 'var(--color-warm-beige)',
          marginBottom: '0.5rem',
        }}
      >
        {message}
      </p>
      <span
        style={{
          fontSize: '0.75rem',
          fontFamily: 'var(--font-sans)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-ivory-dim)',
        }}
      >
        ATELIER FINE CREATIONS
      </span>
    </div>
  );
};
