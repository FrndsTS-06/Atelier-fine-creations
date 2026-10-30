import React, { useEffect, useRef, useState } from 'react';
import { Product } from '../../types/product';
import { X, ExternalLink, MessageCircle, ShieldCheck, Scale, Info } from 'lucide-react';
import { openExternalCheckout, isValidCheckoutUrl } from '../../utils/checkoutUrl';

interface ProductLightboxProps {
  product: Product;
  onClose: () => void;
  onInquire: (product: Product) => void;
  initialMode?: 'photo' | '3d';
}

export const ProductLightbox: React.FC<ProductLightboxProps> = ({
  product,
  onClose,
  onInquire,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const displayPrice = product.price ?? product.estimatedPrice;
  const currency = product.currency || 'USD';
  const altText = product.imageAlts?.[0] || `${product.name} - Atelier Fine Creations ${product.purity} Gold`;

  const resolvePhoto = (raw?: string) => {
    if (!raw) return '/images/products/imperial-ring.jpg';
    return raw.replace(/\.svg$/i, '.jpg');
  };
  const [photoSrc, setPhotoSrc] = useState<string>(resolvePhoto(product.images?.[0]));
  const [photoError, setPhotoError] = useState<boolean>(false);

  useEffect(() => {
    setPhotoSrc(resolvePhoto(product.images?.[0]));
    setPhotoError(false);
  }, [product]);

  const handleImageError = () => {
    if (photoSrc !== '/images/products/imperial-ring.jpg') {
      setPhotoSrc('/images/products/imperial-ring.jpg');
    } else {
      setPhotoError(true);
    }
  };

  useEffect(() => {
    // Focus close button on mount
    closeButtonRef.current?.focus();

    // Prevent background scrolling
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = origOverflow;
    };
  }, [onClose]);

  const handleBuyNow = () => {
    if (product.purchaseUrl && isValidCheckoutUrl(product.purchaseUrl)) {
      openExternalCheckout(product.purchaseUrl);
    } else {
      onInquire(product);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} details modal`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2500,
        backgroundColor: 'rgba(12, 11, 9, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="atelier-card"
        style={{
          width: '100%',
          maxWidth: '960px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-champagne)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(12, 11, 9, 0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Modal Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 20,
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(196, 154, 90, 0.4)',
            borderRadius: '50%',
            color: 'var(--color-obsidian)',
            cursor: 'pointer',
            width: '38px',
            height: '38px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)',
          }}
          aria-label="Close Preview"
        >
          <X size={20} strokeWidth={1.75} />
        </button>

        {/* Left Side: High-Resolution Product Visual (Pure Photography) */}
        <div
          style={{
            backgroundColor: '#0a0908',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2.5rem 2rem',
            position: 'relative',
            minHeight: '440px',
          }}
        >
          {/* Visual Display */}
          {photoError ? (
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
                padding: '3rem 1rem',
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
                <ShieldCheck size={28} strokeWidth={1.5} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.2rem',
                  color: 'var(--color-ivory)',
                  marginBottom: '0.25rem',
                }}
              >
                {product.name}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--color-champagne)',
                }}
              >
                Atelier Vault Archive
              </span>
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={photoSrc}
                alt={altText}
                onError={handleImageError}
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-xs)',
                  display: 'block',
                  filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.6))',
                }}
              />
            </div>
          )}

          {/* Assay & Demo Badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              display: 'flex',
              gap: '0.4rem',
            }}
          >
            <span
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'rgba(12, 11, 9, 0.85)',
                border: '1px solid var(--color-champagne)',
                color: 'var(--color-champagne)',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {product.purity} Gold
            </span>

            {product.hallmarkCertified && (
              <span
                style={{
                  padding: '0.25rem 0.55rem',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'rgba(12, 11, 9, 0.85)',
                  border: '1px solid #10b981',
                  color: '#34d399',
                  fontSize: '0.72rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <ShieldCheck size={12} /> Assay Certified
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Product Narrative, Attributes & Acquisition Suite */}
        <div
          className="product-details-panel"
          style={{
            padding: 'clamp(1.5rem, 3vw, 2.25rem) clamp(1.25rem, 3vw, 2.25rem)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FAF7F2',
            color: 'var(--color-obsidian)',
            overflowY: 'auto',
            maxHeight: '85vh',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.35rem',
            }}
          >
            <span
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#8C6729',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
              }}
            >
              {product.category?.name || 'Haute Joaillerie'}
            </span>
            {product.sku && (
              <span
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                  color: '#8C6729',
                  fontFamily: 'monospace',
                  backgroundColor: 'rgba(196, 154, 90, 0.12)',
                  padding: '2px 8px',
                  borderRadius: '3px',
                }}
              >
                SKU: {product.sku}
              </span>
            )}
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.75rem',
              color: 'var(--color-obsidian)',
              marginBottom: '0.75rem',
              lineHeight: 1.2,
              fontWeight: 600,
            }}
          >
            {product.name}
          </h2>

          {/* Pricing Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.9rem',
                fontWeight: 600,
                color: '#8C6729',
              }}
            >
              ${displayPrice.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#6A5F54', fontWeight: 500 }}>
              {currency}
            </span>
          </div>

          <p
            style={{
              color: 'var(--color-body)',
              fontSize: '0.92rem',
              lineHeight: 1.7,
              marginBottom: '1.75rem',
            }}
          >
            {product.description}
          </p>

          {/* Specifications Table / Optional Attributes */}
          <div
            style={{
              marginBottom: '2rem',
              padding: '1.15rem',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(196, 154, 90, 0.25)',
            }}
          >
            <h4
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#8C6729',
                marginBottom: '0.85rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Scale size={14} /> Atelier Specifications & Attributes
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '0.75rem',
                fontSize: '0.8rem',
              }}
            >
              <div>
                <span style={{ color: '#7A6E62', display: 'block' }}>Reference SKU</span>
                <strong style={{ color: 'var(--color-obsidian)', letterSpacing: '0.03em' }}>
                  {product.sku || `AFC-${product.id.slice(0, 8).toUpperCase()}`}
                </strong>
              </div>
              <div>
                <span style={{ color: '#7A6E62', display: 'block' }}>Gross Weight</span>
                <strong style={{ color: 'var(--color-obsidian)' }}>{product.grossWeight}g</strong>
              </div>
              <div>
                <span style={{ color: '#7A6E62', display: 'block' }}>Net Gold</span>
                <strong style={{ color: '#8C6729' }}>{product.netWeight}g</strong>
              </div>
              <div>
                <span style={{ color: '#7A6E62', display: 'block' }}>Karat Purity</span>
                <strong style={{ color: 'var(--color-obsidian)' }}>{product.purity} Gold</strong>
              </div>
              <div>
                <span style={{ color: '#7A6E62', display: 'block' }}>Availability</span>
                <strong style={{ color: product.inStock ? '#16a34a' : '#8C6729' }}>
                  {product.inStock ? 'Immediate Delivery' : 'Custom Atelier Order'}
                </strong>
              </div>

              {/* Render custom attributes if present */}
              {product.attributes &&
                Object.entries(product.attributes).map(([key, val]) => (
                  <div key={key}>
                    <span style={{ color: '#7A6E62', display: 'block' }}>{key}</span>
                    <strong style={{ color: 'var(--color-obsidian)' }}>{String(val)}</strong>
                  </div>
                ))}
            </div>
          </div>

          {/* Acquisition Actions: Buy Now & Inquire */}
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div className="product-action-buttons">
              <button
                type="button"
                className="btn-action-primary"
                onClick={handleBuyNow}
                aria-label={`Acquire ${product.name} (Buy Now)`}
              >
                <ExternalLink size={15} style={{ flexShrink: 0 }} />
                <span>Acquire Piece (Buy Now)</span>
              </button>

              <button
                type="button"
                className="btn-action-secondary"
                onClick={() => {
                  onClose();
                  onInquire(product);
                }}
                aria-label={`Bespoke Salon Inquiry for ${product.name}`}
              >
                <MessageCircle size={15} style={{ flexShrink: 0 }} />
                <span>Bespoke Salon Inquiry</span>
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.72rem',
                color: '#7A6E62',
                marginTop: '0.25rem',
              }}
            >
              <Info size={13} style={{ color: '#8C6729' }} />
              <span>
                Protected HTTPS acquisition protocol • Insured international white-glove transport
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
