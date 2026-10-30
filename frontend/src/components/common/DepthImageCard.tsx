import React, { useRef, useState, useEffect } from 'react';
import { prefersReducedMotion } from '../../utils/gsapConfig';
import { GlassOverlay } from './GlassOverlay';

export interface DepthImageCardProps {
  imageSrc: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  description?: string;
  badge?: string;
  href?: string;
  aspectRatio?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * DepthImageCard
 * Provides a 2.5D/3D physical depth card with pointer perspective tilt,
 * independent floating glass metadata panel, and ambient golden sheen.
 */
export const DepthImageCard: React.FC<DepthImageCardProps> = ({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
  badge,
  aspectRatio = '4/3',
  width = 480,
  height = 360,
  className = '',
  style = {},
  children,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const isTouchRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      isTouchRef.current =
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(hover: none)').matches;
    }

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handlePointerEnter = () => {
    setIsHovered(true);
    if (isTouchRef.current || prefersReducedMotion()) return;
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease';
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTouchRef.current || prefersReducedMotion() || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotX = ((y / rect.height - 0.5) * -8).toFixed(2);
    const rotY = ((x / rect.width - 0.5) * 8).toFixed(2);
    const pctX = ((x / rect.width) * 100).toFixed(1);
    const pctY = ((y / rect.height) * 100).toFixed(1);

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;

      // Floating elements shift slightly faster (Z depth offset)
      if (badgeRef.current) {
        const bx = (x / rect.width - 0.5) * -12;
        const by = (y / rect.height - 0.5) * -12;
        badgeRef.current.style.transform = `translate3d(${bx.toFixed(1)}px, ${by.toFixed(1)}px, 25px)`;
      }

      if (contentRef.current) {
        const cx = (x / rect.width - 0.5) * -8;
        const cy = (y / rect.height - 0.5) * -8;
        contentRef.current.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 20px)`;
      }

      if (sheenRef.current) {
        sheenRef.current.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255, 230, 180, 0.2) 0%, transparent 60%)`;
        sheenRef.current.style.opacity = '1';
      }
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (isTouchRef.current || prefersReducedMotion()) return;

    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    }

    if (badgeRef.current) {
      badgeRef.current.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      badgeRef.current.style.transform = 'translate3d(0, 0, 0)';
    }

    if (contentRef.current) {
      contentRef.current.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      contentRef.current.style.transform = 'translate3d(0, 0, 0)';
    }

    if (sheenRef.current) {
      sheenRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`depth-image-card ${className}`}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        backgroundColor: 'rgba(22, 20, 16, 0.82)',
        border: '1px solid rgba(196, 154, 90, 0.25)',
        boxShadow: isHovered
          ? '0 20px 48px rgba(0, 0, 0, 0.8), 0 0 28px rgba(196, 154, 90, 0.2)'
          : '0 12px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.4s ease-out, box-shadow 0.3s ease',
        ...style,
      }}
    >
      {/* Background Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio,
          overflow: 'hidden',
          backgroundColor: '#0c0b09',
        }}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          width={width}
          height={height}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
          }}
        />

        {/* Ambient Dark Scrim */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(12, 11, 9, 0.05) 0%, rgba(12, 11, 9, 0.82) 100%)',
          }}
        />

        {/* Floating Glass Badge (Top Right) */}
        {badge && (
          <div
            ref={badgeRef}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 3,
              transformStyle: 'preserve-3d',
              transition: isHovered ? 'none' : 'transform 0.6s ease',
            }}
          >
            <GlassOverlay
              variant="badge"
              style={{
                padding: '0.35rem 0.85rem',
                fontSize: '0.68rem',
                letterSpacing: '0.14em',
                color: 'var(--color-champagne-light)',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              {badge}
            </GlassOverlay>
          </div>
        )}
      </div>

      {/* Floating Glass Content Footer */}
      <div
        ref={contentRef}
        style={{
          padding: '1.5rem',
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'none' : 'transform 0.6s ease',
        }}
      >
        {eyebrow && (
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.72rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--color-champagne)',
              marginBottom: '0.35rem',
            }}
          >
            {eyebrow}
          </span>
        )}

        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.45rem',
            color: 'var(--color-ivory)',
            fontWeight: 600,
            marginBottom: description ? '0.5rem' : '0',
          }}
        >
          {title}
        </h3>

        {description && (
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-ivory-dim)',
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        )}

        {children}
      </div>

      {/* Specular Interactive Sheen */}
      <div
        ref={sheenRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          transition: 'opacity 0.25s ease',
          zIndex: 10,
        }}
      />
    </div>
  );
};
