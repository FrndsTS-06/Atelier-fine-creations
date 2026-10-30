import React, { useState, useEffect } from 'react';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';
import { RevealOnScroll } from '../common/RevealOnScroll';

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onInquire: (product: Product) => void;
  onResetFilters?: () => void;
  pageSize?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
  onInquire,
  onResetFilters,
  pageSize = 6,
}) => {
  const [visibleCount, setVisibleCount] = useState<number>(pageSize);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [products, pageSize]);

  if (products.length === 0) {
    return (
      <EmptyState
        title="No Masterpieces Match Your Filter"
        description="Try adjusting your discipline tab, purity criteria, or search term to discover available pieces."
        actionText="Reset All Filters"
        onAction={onResetFilters}
      />
    );
  }

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <div>
      {/* Spacious Product Grid with Fine Card Dividers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(1.5rem, 2.5vw, 2.5rem)',
          marginBottom: hasMore ? '3.5rem' : '1rem',
        }}
      >
        {visibleProducts.map((product, index) => (
          <RevealOnScroll
            key={product.id}
            delay={(index % 4) * 85}
            style={{ display: 'flex' }}
          >
            <ProductCard
              product={product}
              onSelect={onSelectProduct}
              onInquire={onInquire}
              theme="ivory"
              isDemo={Boolean((product as any).isDemo)}
            />
          </RevealOnScroll>
        ))}
      </div>

      {/* Load More Pagination Trigger */}
      {hasMore && (
        <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
          <Button
            variant="outline"
            size="md"
            onClick={() => setVisibleCount((prev) => prev + pageSize)}
            style={{
              borderColor: 'rgba(196, 154, 90, 0.4)',
              color: '#8C6729',
              minWidth: '220px',
            }}
          >
            Load More Pieces ({products.length - visibleCount} Remaining)
          </Button>
        </div>
      )}
    </div>
  );
};
