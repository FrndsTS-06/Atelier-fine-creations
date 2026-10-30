import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { ProductCard } from '../products/ProductCard';
import { ProductLightbox } from '../products/ProductLightbox';
import { useProducts } from '../../hooks/useProducts';
import { Button } from '../common/Button';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { Product } from '../../types/product';
import { ArrowRight, Info, Sparkles } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const { products, loading, error, isOffline, refetch } = useProducts({
    sortBy: 'featured',
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  const handleInquire = (product: Product) => {
    navigate(`${ROUTES.CONTACT}?product=${product.id}&name=${encodeURIComponent(product.name)}`);
  };

  const featured = products.slice(0, 4);

  return (
    <section
      aria-label="Curated Pieces Showcase"
      style={{
        padding: '7rem 0',
        backgroundColor: 'var(--color-obsidian)',
      }}
    >
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="CURATED PIECES"
            title="Featured Creations"
            subtitle="A spotlight on distinctive signet rings, bespoke chronometers, hand-stitched straps, and hand-forged jewelry."
            centered
          />
        </RevealOnScroll>

        {/* Loading State */}
        {loading && (
          <LoadingState message="Illuminating Curated Masterpieces..." />
        )}

        {/* Error / Offline State */}
        {!loading && error && (
          <div style={{ maxWidth: '640px', margin: '0 auto 4rem' }}>
            <ErrorState
              title={isOffline ? 'Atelier Offline' : 'Vault Inventory Synchronization'}
              message={error}
              onRetry={refetch}
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && featured.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              maxWidth: '560px',
              margin: '0 auto 3rem',
              backgroundColor: 'var(--color-obsidian-card)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-obsidian-border)',
            }}
          >
            <Sparkles size={32} style={{ color: 'var(--color-champagne)', margin: '0 auto 1rem' }} />
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-ivory)', marginBottom: '0.5rem' }}>
              No Featured Masterpieces Currently Available
            </h4>
            <p style={{ color: 'var(--color-ivory-dim)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Our master artisans are currently forging bespoke commissions. Explore our complete gallery repertoire.
            </p>
          </div>
        )}

        {/* Active Product Grid */}
        {!loading && !error && featured.length > 0 && (
          <>
            {/* Optional Dev Disclosure if item is marked demo */}
            {featured.some((p) => p.isFeatured && import.meta.env.DEV && (p as any).isDemo) && (
              <div
                role="note"
                aria-label="Demo catalog disclosure"
                style={{
                  maxWidth: '680px',
                  margin: '-1.5rem auto 3rem',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: 'var(--color-obsidian-card)',
                  border: '1px solid rgba(196, 154, 90, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  fontSize: '0.8rem',
                  color: 'var(--color-warm-beige)',
                  textAlign: 'center',
                }}
              >
                <Info size={16} style={{ color: 'var(--color-champagne)', flexShrink: 0 }} />
                <span>
                  <strong>Atelier Catalog Notice:</strong> Featured demonstration pieces displayed in development preview.
                </span>
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '2.5rem',
                marginBottom: '4rem',
              }}
            >
              {featured.map((p, idx) => (
                <RevealOnScroll key={p.id} delay={idx * 100} style={{ display: 'flex' }}>
                  <ProductCard
                    product={p}
                    onSelect={(prod) => setSelectedProduct(prod)}
                    onInquire={handleInquire}
                    isDemo={Boolean((p as any).isDemo)}
                  />
                </RevealOnScroll>
              ))}
            </div>
          </>
        )}

        <div style={{ textAlign: 'center' }}>
          <Link to={ROUTES.GALLERY}>
            <Button variant="outline" size="lg" icon={<ArrowRight size={18} />}>
              Explore Full Collection Gallery
            </Button>
          </Link>
        </div>

        {selectedProduct && (
          <ProductLightbox
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onInquire={handleInquire}
          />
        )}
      </Container>
    </section>
  );
};
