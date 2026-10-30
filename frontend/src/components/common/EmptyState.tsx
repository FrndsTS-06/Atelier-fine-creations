import React from 'react';
import { Gem } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Masterpieces Found',
  description = 'No jewels match your refined search criteria. Try modifying your karat or collection filters.',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`atelier-empty-state ${className}`}
      style={{
        textAlign: 'center',
        padding: '5rem 1.5rem',
        color: 'var(--color-ivory-muted)',
      }}
    >
      <div
        style={{
          color: 'var(--color-champagne)',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
          opacity: 0.85,
        }}
      >
        <Gem size={44} strokeWidth={1.25} />
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.65rem',
          marginBottom: '0.75rem',
          color: 'var(--color-ivory)',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          maxWidth: '500px',
          margin: '0 auto 1.75rem',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          color: 'var(--color-ivory-dim)',
        }}
      >
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
