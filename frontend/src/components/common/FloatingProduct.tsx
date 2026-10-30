import React, { useState } from 'react';
import { Jewelry3DViewer } from '../3d/Jewelry3DViewer';
import { GlassOverlay } from './GlassOverlay';
import { Sparkles, RotateCw, Image as ImageIcon } from 'lucide-react';
import { prefersReducedMotion } from '../../utils/gsapConfig';

export interface FloatingProductProps {
  imageSrc?: string;
  imageAlt?: string;
  pieceType?: 'ring' | 'watch' | 'pendant';
  modelUrl?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  enable3dSwitch?: boolean;
  initialMode?: 'editorial' | '3d';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * FloatingProduct
 * Cinematic focal object showcase with continuous gentle float animation,
 * dynamic contact shadow, specular gold sheen, and seamless toggle between
 * editorial photograph and genuine interactive 3D Three.js experience.
 */
export const FloatingProduct: React.FC<FloatingProductProps> = ({
  imageSrc = '/images/hero/hero-cinematic.jpg',
  imageAlt = 'Atelier Fine Creations Haute Joaillerie Masterpiece',
  pieceType = 'ring',
  modelUrl,
  badge = 'PIÈCE UNIQUE • PARIS',
  title = 'The Imperial Solitaire',
  subtitle = '22K Noble Gold & Flawless Brilliant Diamond',
  enable3dSwitch = true,
  initialMode = 'editorial',
  className = '',
  style = {},
}) => {
  const [viewMode, setViewMode] = useState<'editorial' | '3d'>(initialMode);
  const isReduced = prefersReducedMotion();

  return (
    <div
      className={`floating-product-wrapper ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style,
      }}
    >
      {/* 3D / Editorial Toggle Button */}
      {enable3dSwitch && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 15,
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'editorial' ? '3d' : 'editorial')}
            aria-label={
              viewMode === 'editorial'
                ? 'Switch to interactive 3D showroom model'
                : 'Switch to editorial master photography'
            }
            className="interactive-mode-toggle"
            style={{
              background: 'rgba(12, 11, 9, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(196, 154, 90, 0.35)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-champagne-light)',
              fontSize: '0.72rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.42rem 0.95rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(196, 154, 90, 0.2)',
              transition: 'all var(--transition-fast)',
            }}
          >
            {viewMode === 'editorial' ? (
              <>
                <RotateCw size={13} className="animate-spin-slow" />
                <span>Explore in 3D</span>
              </>
            ) : (
              <>
                <ImageIcon size={13} />
                <span>Editorial View</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Main Focal Card Container with Soft Glass Frame */}
      <div
        className="atelier-card glass-gold-edge"
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: 'rgba(16, 15, 12, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(196, 154, 90, 0.35)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(196, 154, 90, 0.2)',
          animation: isReduced ? 'none' : 'gentleFloat 1s ease-in-out infinite',
        }}
      >
        {/* View Mode 1: Interactive 3D Model Viewer */}
        {viewMode === '3d' ? (
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', minHeight: '380px' }}>
            <Jewelry3DViewer
              modelUrl={modelUrl}
              pieceType={pieceType}
              fallbackImageUrl={imageSrc}
              fallbackAlt={imageAlt}
              autoRotateSpeed={0.5}
            />
          </div>
        ) : (
          /* View Mode 2: High-Resolution Editorial Photograph */
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1/1',
              minHeight: '380px',
              overflow: 'hidden',
              backgroundColor: '#0a0907',
            }}
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              loading="eager"
              decoding="async"
              width="800"
              height="500"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            {/* Chiaroscuro Gradient Atmosphere */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 50% 40%, rgba(196, 154, 90, 0.08) 0%, rgba(12, 11, 9, 0.5) 70%, rgba(12, 11, 9, 0.95) 100%)',
              }}
            />

            {/* Specular Light Reflection Sweep */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '60%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
                transform: 'skewX(-25deg)',
                animation: isReduced ? 'none' : 'goldShimmer 8s ease-in-out infinite',
              }}
            />
          </div>
        )}

        {/* Floating Glass Metadata Caption Footer */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: 'rgba(12, 11, 9, 0.88)',
            borderTop: '1px solid rgba(196, 154, 90, 0.22)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            {badge && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.18em',
                  color: 'var(--color-champagne)',
                  textTransform: 'uppercase',
                  marginBottom: '0.2rem',
                }}
              >
                <Sparkles size={11} /> {badge}
              </span>
            )}
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--color-ivory)',
                marginBottom: '0.15rem',
              }}
            >
              {title}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-ivory-dim)' }}>
              {subtitle}
            </p>
          </div>

          <GlassOverlay
            variant="badge"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              color: 'var(--color-champagne-light)',
            }}
          >
            24K • BIS 999
          </GlassOverlay>
        </div>
      </div>

      {/* Dynamic Harmonic Contact Shadow (scales inversely with float) */}
      <div
        aria-hidden="true"
        style={{
          width: '75%',
          height: '18px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.85) 0%, transparent 75%)',
          marginTop: '1.25rem',
          filter: 'blur(8px)',
        }}
      />
    </div>
  );
};
