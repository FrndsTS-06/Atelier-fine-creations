import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Atelier Notice',
  message = 'Unable to establish link with atelier inventory vault. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`atelier-card ${className}`}
      style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        maxWidth: '560px',
        margin: '3rem auto',
        backgroundColor: 'var(--color-obsidian-card)',
        borderColor: 'rgba(185, 74, 72, 0.45)',
      }}
    >
      <div
        style={{
          color: 'var(--color-champagne)',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <AlertCircle size={36} strokeWidth={1.5} />
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.5rem',
          color: 'var(--color-ivory)',
          marginBottom: '0.75rem',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: 'var(--color-ivory-muted)',
          marginBottom: '2rem',
          fontSize: '0.95rem',
          lineHeight: 1.6,
        }}
      >
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          icon={<RefreshCw size={14} />}
        >
          Reattempt Synchronization
        </Button>
      )}
    </div>
  );
};
