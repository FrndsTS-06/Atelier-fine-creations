import React from 'react';

export interface GlassOverlayProps {
  variant?: 'smoked' | 'gold-rim' | 'minimal' | 'elevated' | 'badge';
  blur?: number;
  intensity?: 'subtle' | 'medium' | 'deep';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * Reusable luxury smoked-glass surface with backdrop-filter blur,
 * champagne-gold edge highlights, internal light sheen, and soft layered shadows.
 */
export const GlassOverlay: React.FC<GlassOverlayProps> = ({
  variant = 'smoked',
  blur = 20,
  intensity = 'medium',
  className = '',
  style = {},
  children,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'gold-rim':
        return 'rgba(18, 16, 13, 0.82)';
      case 'elevated':
        return 'rgba(24, 21, 17, 0.88)';
      case 'badge':
        return 'rgba(14, 13, 10, 0.85)';
      case 'minimal':
        return 'rgba(255, 255, 255, 0.04)';
      case 'smoked':
      default:
        return intensity === 'deep'
          ? 'rgba(12, 11, 9, 0.88)'
          : intensity === 'subtle'
            ? 'rgba(16, 15, 12, 0.65)'
            : 'rgba(14, 13, 10, 0.78)';
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'gold-rim':
        return '1px solid rgba(196, 154, 90, 0.38)';
      case 'elevated':
        return '1px solid rgba(196, 154, 90, 0.3)';
      case 'badge':
        return '1px solid rgba(196, 154, 90, 0.25)';
      case 'minimal':
        return '1px solid rgba(255, 255, 255, 0.08)';
      case 'smoked':
      default:
        return '1px solid rgba(196, 154, 90, 0.22)';
    }
  };

  const getBoxShadow = () => {
    switch (variant) {
      case 'gold-rim':
        return '0 16px 40px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 24px rgba(196, 154, 90, 0.18)';
      case 'elevated':
        return '0 24px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 32px rgba(196, 154, 90, 0.14)';
      case 'badge':
        return '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
      case 'minimal':
        return '0 8px 20px rgba(0, 0, 0, 0.4)';
      case 'smoked':
      default:
        return '0 20px 48px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(196, 154, 90, 0.1)';
    }
  };

  return (
    <div
      className={`glass-overlay glass-${variant} ${className}`}
      style={{
        backgroundColor: getBackgroundColor(),
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: getBorderColor(),
        boxShadow: getBoxShadow(),
        borderRadius: variant === 'badge' ? 'var(--radius-full)' : 'var(--radius-sm)',
        position: 'relative',
        transition: 'all var(--transition-normal)',
        ...style,
      }}
    >
      {/* Subtle Internal Specular Light Sheen */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 55%)',
          borderRadius: 'inherit',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
};
