import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../../types/product';
import { Button } from '../common/Button';
import { ShieldCheck, Eye, ExternalLink, Sparkles, Gem, CheckCircle2 } from 'lucide-react';
import { openExternalCheckout, isValidCheckoutUrl } from '../../utils/checkoutUrl';

export interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
  onInquire?: (product: Product) => void;
  isDemo?: boolean;
  theme?: 'ivory' | 'dark';
}

/**
 * Normalizes image paths to point to realistic local photograph assets
 * under /images/products/, replacing legacy illustrated SVGs if present.
 */
function resolveProductPhoto(rawUrl?: string): string {
  if (!rawUrl || rawUrl.trim() === '') {
    return '/images/products/imperial-ring.jpg';
  }
  // Convert any legacy .svg reference to the corresponding high-resolution .jpg photograph
  if (rawUrl.endsWith('.svg')) {
    return rawUrl.replace(/\.svg$/i, '.jpg');
  }
  return rawUrl;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onInquire,
  isDemo = false,
  theme = 'ivory',
}) => {
  const isDark = theme === 'dark';
  const displayPrice = product.price ?? product.estimatedPrice;
  const currency = product.currency || 'USD';
  const altText = product.imageAlts?.[0] || `${product.name} - Atelier Fine Creations ${product.purity} Gold`;

  const initialPhoto = resolveProductPhoto(product.images?.[0]);
  const [photoSrc, setPhotoSrc] = useState<string>(initialPhoto);
  const [photoError, setPhotoError] = useState<boolean>(false);
  const [photoLoaded, setPhotoLoaded] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // 3D Tilt interactive refs (high performance: zero React re-renders during mouse movement)
  const cardRef = useRef<HTMLElement | null>(null);
  const sheenRef = useRef<HTMLDivElement | null>(null);
  const rafId = useRef<number | null>(null);
  const isCoarseOrTouch = useRef<boolean>(false);
  const prefersReducedMotion = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      isCoarseOrTouch.current =
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(hover: none)').matches ||
        'ontouchstart' in window;
      prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  useEffect(() => {
    setPhotoSrc(resolveProductPhoto(product.images?.[0]));
    setPhotoError(false);
  }, [product.id, product.images]);

  const handlePointerEnter = () => {
    setIsHovered(true);
    if (isCoarseOrTouch.current || prefersReducedMotion.current) return;
    const card = cardRef.current;
    if (card) {
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.2s ease-out, border-color 0.25s ease';
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (isCoarseOrTouch.current || prefersReducedMotion.current) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Restrain max tilt strictly to 4-5 degrees
    const tiltX = (y / rect.height - 0.5) * -9; // ~ -4.5deg to +4.5deg
    const tiltY = (x / rect.width - 0.5) * 9;   // ~ -4.5deg to +4.5deg

    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      card.style.transform = `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-6px) translateZ(6px)`;
      card.style.boxShadow = isDark
        ? '0 20px 48px rgba(0, 0, 0, 0.8), 0 0 28px rgba(196, 154, 90, 0.22)'
        : '0 18px 38px -4px rgba(53, 35, 24, 0.14), 0 6px 20px rgba(196, 154, 90, 0.2)';

      if (sheenRef.current) {
        sheenRef.current.style.opacity = '1';
        sheenRef.current.style.background = `radial-gradient(circle 300px at ${pctX.toFixed(1)}% ${pctY.toFixed(1)}%, rgba(222, 192, 142, 0.18) 0%, rgba(196, 154, 90, 0.06) 50%, transparent 75%)`;
      }

      // Independent image parallax inside card frame
      const imgEl = card.querySelector<HTMLElement>('.atelier-product-image');
      if (imgEl) {
        const imgShiftX = (x / rect.width - 0.5) * -10;
        const imgShiftY = (y / rect.height - 0.5) * -10;
        imgEl.style.transform = `scale(1.06) translate3d(${imgShiftX.toFixed(1)}px, ${imgShiftY.toFixed(1)}px, 0)`;
      }
    });
  };

  const handlePointerLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    const card = cardRef.current;
    if (card) {
      card.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.65s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease';
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0px)';
      card.style.boxShadow = isDark
        ? 'var(--shadow-md)'
        : '0 4px 20px -2px rgba(53, 35, 24, 0.05), 0 1px 3px rgba(0, 0, 0, 0.04)';

      const imgEl = card.querySelector<HTMLElement>('.atelier-product-image');
      if (imgEl) {
        imgEl.style.transform = 'scale(1) translate3d(0, 0, 0)';
      }
    }
    if (sheenRef.current) {
      sheenRef.current.style.transition = 'opacity 0.4s ease';
      sheenRef.current.style.opacity = '0';
    }
    setIsHovered(false);
  };

  const handleImageError = () => {
    // If the primary image failed, attempt fallback to guaranteed local photograph
    if (photoSrc !== '/images/products/imperial-ring.jpg') {
      setPhotoSrc('/images/products/imperial-ring.jpg');
    } else {
      // Both primary and default photograph failed; show accessible luxury placeholder
      setPhotoError(true);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.purchaseUrl && isValidCheckoutUrl(product.purchaseUrl)) {
      openExternalCheckout(product.purchaseUrl);
    } else if (onInquire) {
      onInquire(product);
    }
  };

  return (
    <div
      className="perspective-container"
      style={{
        perspective: '1200px',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <article
        ref={cardRef}
        className="atelier-card atelier-product-card preserve-3d"
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backgroundColor: isDark ? 'var(--color-obsidian-card)' : '#FFFFFF',
          borderRadius: 'var(--radius-sm)',
          border: isDark
            ? isHovered
              ? '1px solid var(--color-champagne)'
              : '1px solid var(--color-obsidian-border)'
            : isHovered
              ? '1px solid rgba(196, 154, 90, 0.65)'
              : '1px solid rgba(196, 154, 90, 0.24)',
          boxShadow: isDark
            ? 'var(--shadow-md)'
            : '0 4px 20px -2px rgba(53, 35, 24, 0.05), 0 1px 3px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.65s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease',
        }}
      >
        {/* Dynamic Specular Glare Overlay */}
        <div
          ref={sheenRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            zIndex: 15,
            opacity: 0,
            transition: 'opacity 0.35s ease',
            mixBlendMode: 'screen',
          }}
        />

        {/* Top Badges Bar */}
        <div
          style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
            right: '0.85rem',
            zIndex: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pointerEvents: 'none',
            transform: 'translateZ(15px)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {/* Karat Purity Badge */}
            <span
              style={{
                padding: '0.28rem 0.65rem',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'rgba(12, 11, 9, 0.82)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(196, 154, 90, 0.45)',
                color: 'var(--color-champagne-light)',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
              }}
            >
              {product.purity} Gold
            </span>

            {/* Assay Certified Hallmark Badge */}
            {product.hallmarkCertified && (
              <span
                style={{
                  padding: '0.28rem 0.6rem',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'rgba(12, 11, 9, 0.82)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(46, 125, 91, 0.5)',
                  color: '#4ade80',
                  fontSize: '0.68rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                }}
              >
                <ShieldCheck size={12} strokeWidth={2.2} /> Assay Certified
              </span>
            )}
          </div>

          {/* Demo Indicator (if catalog item is demonstration piece) */}
          {isDemo && (
            <span
              style={{
                padding: '0.25rem 0.55rem',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'rgba(53, 35, 24, 0.85)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                border: '1px solid rgba(196, 154, 90, 0.4)',
                color: 'var(--color-warm-beige)',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
              title="Curated demonstration catalog piece"
            >
              <Sparkles size={10} style={{ color: 'var(--color-champagne)' }} /> Demo
            </span>
          )}
        </div>

        {/* Realistic Product Photography Showcase (1:1 Aspect Ratio) */}
        <div
          role="button"
          tabIndex={0}
          aria-label={`View details for ${product.name}`}
          className="atelier-product-image-container"
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1/1',
            backgroundColor: '#0A0908',
            cursor: 'pointer',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            outline: 'none',
          }}
          onClick={() => onSelect?.(product)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect?.(product);
            }
          }}
        >
          {photoError ? (
            /* Accessible Luxury Fallback for Missing Assets */
            <div
              role="img"
              aria-label={`${product.name} - Atelier Fine Creations Piece`}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at center, #1E1914 0%, #0A0908 100%)',
                padding: '2rem',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '1.5px solid var(--color-champagne)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-champagne)',
                  marginBottom: '1rem',
                  backgroundColor: 'rgba(196, 154, 90, 0.08)',
                }}
              >
                <Gem size={28} strokeWidth={1.5} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  color: 'var(--color-ivory)',
                  letterSpacing: '0.04em',
                  marginBottom: '0.25rem',
                }}
              >
                {product.name}
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--color-champagne)',
                }}
              >
                Atelier Vault Archive
              </span>
            </div>
          ) : (
            <>
              {/* Shimmer loading background while image buffers */}
              {!photoLoaded && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, #191612 0%, #0A0908 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      border: '2px solid rgba(196, 154, 90, 0.25)',
                      borderTopColor: 'var(--color-champagne)',
                      animation: 'spin 1.2s linear infinite',
                    }}
                  />
                </div>
              )}

              <img
                src={photoSrc}
                alt={altText}
                className="atelier-product-image"
                loading="lazy"
                decoding="async"
                width="400"
                height="400"
                onLoad={() => setPhotoLoaded(true)}
                onError={handleImageError}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                  opacity: photoLoaded ? 1 : 0,
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
                }}
              />

              {/* Dark photography vignette overlay for editorial studio depth */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background:
                    'linear-gradient(180deg, rgba(12, 11, 9, 0.02) 60%, rgba(12, 11, 9, 0.45) 100%)',
                }}
              />
            </>
          )}
        </div>

        {/* Ivory / Alabaster Product Details Glass Panel */}
        <div
          className="glass-panel"
          style={{
            padding: '1.65rem',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            backgroundColor: isDark ? 'rgba(20, 19, 16, 0.88)' : 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: isDark ? '1px solid rgba(196, 154, 90, 0.16)' : '1px solid rgba(196, 154, 90, 0.12)',
            transition: 'background-color var(--transition-normal)',
            transform: 'translateZ(10px)',
          }}
        >
          {/* Category Eyebrow */}
          <p
            style={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: isDark ? 'var(--color-champagne)' : '#8C6729',
              marginBottom: '0.35rem',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
            }}
          >
            {product.category?.name || 'Haute Joaillerie'}
          </p>

          {/* Masterpiece Title with Serif Typography */}
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              color: isDark ? 'var(--color-ivory)' : '#161311',
              marginBottom: '0.65rem',
              cursor: 'pointer',
              lineHeight: 1.3,
              fontWeight: 600,
              letterSpacing: '0.01em',
              transition: 'color var(--transition-fast)',
            }}
            onClick={() => onSelect?.(product)}
          >
            {product.name}
          </h3>

          {/* Narrative Description */}
          <p
            style={{
              color: isDark ? 'var(--color-ivory-dim)' : '#5A5147',
              fontSize: '0.84rem',
              lineHeight: 1.6,
              marginBottom: '1.25rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description}
          </p>

          {/* Weight & Craftsmanship Specifications Glass Grid */}
          <div
            className="glass-badge"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              padding: '0.8rem 0.95rem',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(250, 247, 242, 0.85)',
              border: isDark
                ? '1px solid rgba(196, 154, 90, 0.22)'
                : '1px solid rgba(196, 154, 90, 0.22)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
              fontSize: '0.74rem',
              color: isDark ? 'var(--color-ivory-dim)' : '#5A5147',
              marginBottom: '1.4rem',
            }}
          >
            <div>
              <span style={{ color: isDark ? 'var(--color-ivory-dim)' : '#7C7063' }}>Gross Weight:</span>{' '}
              <strong style={{ color: isDark ? 'var(--color-ivory)' : '#161311', fontWeight: 600 }}>
                {product.grossWeight}g
              </strong>
            </div>
            <div>
              <span style={{ color: isDark ? 'var(--color-ivory-dim)' : '#7C7063' }}>Net Metal:</span>{' '}
              <strong style={{ color: isDark ? 'var(--color-champagne)' : '#8C6729', fontWeight: 600 }}>
                {product.netWeight}g
              </strong>
            </div>
            <div>
              <span style={{ color: isDark ? 'var(--color-ivory-dim)' : '#7C7063' }}>Purity:</span>{' '}
              <strong style={{ color: isDark ? 'var(--color-ivory)' : '#161311', fontWeight: 600 }}>
                {product.purity} Gold
              </strong>
            </div>
            <div>
              <span style={{ color: isDark ? 'var(--color-ivory-dim)' : '#7C7063' }}>Salon Status:</span>{' '}
              <strong
                style={{
                  color: product.inStock ? '#15803d' : isDark ? 'var(--color-warm-beige)' : '#8C6729',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                {product.inStock ? (
                  <>
                    <CheckCircle2 size={11} strokeWidth={2.5} /> Ready
                  </>
                ) : (
                  'Bespoke'
                )}
              </strong>
            </div>
          </div>

          {/* Acquisition Value & Action CTAs */}
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1.15rem',
              borderTop: isDark
                ? '1px solid rgba(196, 154, 90, 0.15)'
                : '1px solid rgba(196, 154, 90, 0.22)',
              gap: '0.75rem',
              flexWrap: 'wrap',
              transform: 'translateZ(14px)',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.64rem',
                  color: isDark ? 'var(--color-ivory-dim)' : '#7C7063',
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 500,
                }}
              >
                Acquisition Value
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.38rem',
                  fontWeight: 600,
                  color: isDark ? 'var(--color-champagne-light)' : '#8C6729',
                  letterSpacing: '0.01em',
                }}
              >
                ${displayPrice.toLocaleString()}{' '}
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: isDark ? 'var(--color-ivory-dim)' : '#7C7063',
                  }}
                >
                  {currency}
                </span>
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelect?.(product)}
                title="Inspect piece details"
                aria-label={`Inspect ${product.name} details`}
                icon={<Eye size={14} />}
                style={
                  !isDark
                    ? {
                        borderColor: 'rgba(196, 154, 90, 0.35)',
                        color: '#6B4F23',
                        backgroundColor: 'transparent',
                      }
                    : undefined
                }
              >
                Details
              </Button>

              <Button
                variant="gold"
                size="sm"
                onClick={handleBuyNow}
                aria-label={`Buy ${product.name} now`}
                icon={<ExternalLink size={13} />}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
