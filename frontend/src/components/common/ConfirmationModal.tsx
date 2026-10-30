import React, { useEffect, useRef } from 'react';
import { Button } from './Button';

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onCancel();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 6, 8, 0.82)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        zIndex: 1000,
        animation: 'fadeIn var(--transition-fast)',
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
        className="atelier-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '2.25rem',
          backgroundColor: '#0c0d12',
          border: isDestructive ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--color-gold-primary)',
          boxShadow: isDestructive
            ? '0 20px 45px rgba(239, 68, 68, 0.15)'
            : 'var(--shadow-gold)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
          {isDestructive && (
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '1.2rem',
                fontWeight: 700,
              }}
            >
              ⚠
            </div>
          )}
          <div>
            <h2
              id="confirm-modal-title"
              style={{
                fontSize: '1.35rem',
                fontFamily: 'var(--font-heading)',
                color: isDestructive ? '#fca5a5' : 'var(--color-champagne)',
                marginBottom: '0.4rem',
              }}
            >
              {title}
            </h2>
            <p
              id="confirm-modal-description"
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-champagne-muted)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {message}
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--color-obsidian-border)',
          }}
        >
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '0.65rem 1.4rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.85rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              border: isDestructive ? '1px solid #ef4444' : '1px solid var(--color-gold-primary)',
              backgroundColor: isDestructive ? '#dc2626' : 'var(--color-gold-primary)',
              color: isDestructive ? '#ffffff' : '#0a0a0c',
              boxShadow: isDestructive
                ? '0 4px 12px rgba(220, 38, 38, 0.3)'
                : '0 4px 12px rgba(196, 154, 90, 0.25)',
              transition: 'all var(--transition-fast)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
