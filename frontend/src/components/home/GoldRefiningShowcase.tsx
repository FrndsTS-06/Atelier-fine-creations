import React, { useRef, useState, useEffect } from 'react';
import { GlassOverlay } from '../common/GlassOverlay';
import { Jewelry3DViewer } from '../3d/Jewelry3DViewer';
import { Flame, RotateCw, ShieldCheck, Sparkles } from 'lucide-react';
import { prefersReducedMotion } from '../../utils/gsapConfig';

export interface GoldRefiningShowcaseProps {
  imageSrc?: string;
  imageAlt?: string;
  fallbackImageSrc?: string;
  title?: string;
  description?: string;
  purityBadge?: string;
  temperature?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * GoldRefiningShowcase
 * Combines the original Haute Horlogerie luxury mechanical watch photograph
 * with the animated 3D background, pointer perspective tilt, gentle floating movement,
 * and the preserved Foundry Crucibles information panel.
 */
export const GoldRefiningShowcase: React.FC<GoldRefiningShowcaseProps> = ({
  imageSrc = '/images/model/model-showcase.jpg',
  imageAlt = 'Atelier Haute Joaillerie Female Model Wearing Gold Jewelry with Floating Ornaments',
  fallbackImageSrc = '/images/model/model-complete-look.jpg',
  title = 'Foundry Crucibles',
  description = 'Raw 24K gold mined from deep subterranean bedrock, heated to 1064°C in stone crucibles, and hand-poured into pure casting ingots.',
  purityBadge = 'Assayed 999.9 Fine Purity',
  temperature: _temperature,
  className = '',
  style = {},
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const isTouchRef = useRef(false);

  const [is3DMode, setIs3DMode] = useState(false);
  const [photoSrc, setPhotoSrc] = useState(imageSrc);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Synchronize when imageSrc prop changes
  useEffect(() => {
    setPhotoSrc(imageSrc);
    setImageLoaded(false);
  }, [imageSrc]);

  // Check touch capability
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      isTouchRef.current = window.matchMedia('(pointer: coarse)').matches;
    }
  }, []);

  // Restrained 3D Perspective Tilt on Desktop Hover
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTouchRef.current || prefersReducedMotion()) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltX = ((y / rect.height) - 0.5) * -12; // Max 6deg
    const tiltY = ((x / rect.width) - 0.5) * 12;

    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`;
      card.style.boxShadow =
        '0 28px 65px rgba(0, 0, 0, 0.85), 0 0 35px rgba(214, 174, 103, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)';

      if (sheenRef.current) {
        sheenRef.current.style.opacity = '1';
        sheenRef.current.style.background = `radial-gradient(circle 320px at ${pctX.toFixed(1)}% ${pctY.toFixed(1)}%, rgba(255, 215, 0, 0.22) 0%, rgba(214, 174, 103, 0.08) 50%, transparent 75%)`;
      }
    });
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    const card = cardRef.current;
    if (card && !isTouchRef.current && !prefersReducedMotion()) {
      card.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease';
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (rafId.current) cancelAnimationFrame(rafId.current);
    const card = cardRef.current;
    if (card) {
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.boxShadow =
        '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 25px rgba(214, 174, 103, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
    }
    if (sheenRef.current) {
      sheenRef.current.style.transition = 'opacity 0.4s ease';
      sheenRef.current.style.opacity = '0';
    }
  };

  const handleImageError = () => {
    if (photoSrc !== fallbackImageSrc) {
      setPhotoSrc(fallbackImageSrc);
    }
  };

  return (
    <div
      className={`gold-refining-showcase-wrapper ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        width: '100%',
        maxWidth: '460px',
        position: 'relative',
        zIndex: 12,
        ...style,
      }}
    >
      {/* 1. Explore in 3D Switcher Button */}
      <div style={{ marginBottom: '1rem', zIndex: 14 }}>
        <button
          type="button"
          onClick={() => setIs3DMode(!is3DMode)}
          aria-label={is3DMode ? 'View photorealistic model jewelry showcase' : 'Explore 3D watch timepiece'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: is3DMode ? '#D6AE67' : 'rgba(14, 12, 9, 0.85)',
            color: is3DMode ? '#0C0B09' : '#F5F0E7',
            border: '1.5px solid #D6AE67',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(214, 174, 103, 0.3)',
            transition: 'all 0.25s ease',
          }}
        >
          {is3DMode ? (
            <>
              <Sparkles size={14} style={{ color: '#0C0B09' }} />
              <span>View Model Image</span>
            </>
          ) : (
            <>
              <RotateCw size={14} className="animate-spin-slow" />
              <span>Explore in 3D</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Interactive Mode: Genuine Three.js 3D Model Viewer */}
      {is3DMode ? (
        <div
          className="atelier-card glass-panel"
          style={{
            width: '100%',
            aspectRatio: '1/1',
            minHeight: '380px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1.5px solid rgba(214, 174, 103, 0.5)',
            backgroundColor: 'rgba(14, 12, 9, 0.94)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(214, 174, 103, 0.3)',
            position: 'relative',
            zIndex: 13,
          }}
        >
          <Jewelry3DViewer
            pieceType="watch"
            fallbackImageUrl="/images/hero/hero-cinematic.jpg"
            fallbackAlt="Atelier Fine Creations Haute Horlogerie Watch"
            autoRotateSpeed={0.6}
          />
        </div>
      ) : (
        /* 3. Photorealistic Gold Refining Crucible Image Layer + Info Panel */
        <div
          ref={cardRef}
          className="atelier-card gold-refining-frame"
          onPointerEnter={handlePointerEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{
            width: '100%',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            backgroundColor: 'rgba(16, 14, 11, 0.88)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1.5px solid rgba(214, 174, 103, 0.45)',
            boxShadow:
              '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 25px rgba(214, 174, 103, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease',
            position: 'relative',
            zIndex: 13,
          }}
        >
          {/* Dynamic Gold Light Specular Sheen (Desktop Hover) */}
          <div
            ref={sheenRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: 0,
              zIndex: 10,
              borderRadius: 'var(--radius-md)',
            }}
          />

          {/* Top Visual: Haute Joaillerie Female Fashion Model Wearing Gold Jewelry with Floating Ornaments */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4/3',
              overflow: 'hidden',
              backgroundColor: '#0a0907',
            }}
          >
            <div className="model-image-floating" style={{ width: '100%', height: '100%' }}>
              <img
                src={photoSrc}
                alt={imageAlt}
                loading="eager"
                decoding="async"
                width={480}
                height={360}
                className="gold-refining-image-zoom"
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '50% 30%',
                  display: 'block',
                  filter: 'brightness(1.03) contrast(1.05) saturate(1.04)',
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.25s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isHovered ? 'scale(1.035)' : undefined,
                }}
              />
            </div>

            {/* Subtle Gradient Scrim at bottom of image for seamless panel blend */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(12, 10, 8, 0) 65%, rgba(14, 12, 9, 0.95) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Haute Joaillerie Distinction Badge (Top Right) */}
            <div
              style={{
                position: 'absolute',
                top: '0.85rem',
                right: '0.85rem',
                zIndex: 4,
              }}
            >
              <GlassOverlay
                variant="badge"
                blur={12}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  backgroundColor: 'rgba(12, 10, 8, 0.78)',
                  border: '1px solid rgba(214, 174, 103, 0.35)',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <Sparkles size={11} style={{ color: '#D6AE67' }} />
                <span
                  style={{
                    fontSize: '0.66rem',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    color: '#F5F0E7',
                    textTransform: 'uppercase',
                  }}
                >
                  Haute Joaillerie
                </span>
              </GlassOverlay>
            </div>
          </div>

          {/* Bottom Content: Preserved Foundry Crucibles Information Panel */}
          <div
            style={{
              padding: '1.35rem 1.65rem 1.5rem',
              position: 'relative',
              zIndex: 3,
            }}
          >
            {/* Title with Flame Icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
              <Flame size={18} style={{ color: '#FFB300', flexShrink: 0 }} />
              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  color: '#F5F0E7',
                  letterSpacing: '0.03em',
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {title}
              </h4>
            </div>

            {/* Description Text */}
            <p
              style={{
                fontSize: '0.82rem',
                color: '#D8D0C4',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {description}
            </p>

            {/* Divider and Assayed Purity Label */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                marginTop: '0.9rem',
                paddingTop: '0.8rem',
                borderTop: '1px solid rgba(214, 174, 103, 0.22)',
                fontSize: '0.76rem',
                color: '#D6AE67',
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={15} style={{ color: '#D6AE67', flexShrink: 0 }} />
              <span>{purityBadge}</span>
            </div>

            {/* Direct Link to Haute Joaillerie Model Assembly Experience */}
            <a
              href="#jewelry-assembly"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById('jewelry-assembly');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '0.9rem',
                padding: '0.65rem 0.95rem',
                backgroundColor: 'rgba(214, 174, 103, 0.12)',
                border: '1px solid rgba(214, 174, 103, 0.4)',
                borderRadius: 'var(--radius-sm)',
                color: '#F5F0E7',
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(214, 174, 103, 0.25)';
                e.currentTarget.style.borderColor = '#D6AE67';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(214, 174, 103, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(214, 174, 103, 0.4)';
              }}
              aria-label="Scroll to Haute Joaillerie Model Assembly Experience"
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Sparkles size={13} style={{ color: '#D6AE67' }} />
                <span>Model Jewelry Assembly</span>
              </span>
              <span style={{ color: '#D6AE67', fontSize: '0.85rem' }}>↓</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
