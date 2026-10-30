import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, ProductFilterState } from '../../types/product';
import { ProductFilters } from './ProductFilters';
import { ProductSearch } from './ProductSearch';
import { ProductSort } from './ProductSort';
import { ProductGrid } from './ProductGrid';
import { ProductLightbox } from './ProductLightbox';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { useProducts } from '../../hooks/useProducts';

interface ProductGalleryProps {
  initialCategory?: string;
  onInquire: (product: Product) => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ initialCategory, onInquire }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategoryParam = searchParams.get('category') || initialCategory || 'all';

  const { products, loading, error, filters, setFilters, refetch } = useProducts({
    category: currentCategoryParam,
    limit: 100,
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Keep filters.category in sync when URL query param changes
  useEffect(() => {
    if (currentCategoryParam && currentCategoryParam !== filters.category) {
      setFilters((prev) => ({ ...prev, category: currentCategoryParam }));
    }
  }, [currentCategoryParam, setFilters, filters.category]);

  const handleSelectCategory = (catSlug: string) => {
    setFilters((prev) => ({ ...prev, category: catSlug }));
    if (catSlug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catSlug);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const handleReset = () => {
    setFilters({
      category: 'all',
      purity: 'all',
      search: '',
      sortBy: 'featured',
    });
    searchParams.delete('category');
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div>
      {/* Top Filter & Search Controls Suite */}
      <RevealOnScroll>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '1.75rem',
          }}
        >
          <ProductSearch
            value={filters.search || ''}
            onChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
          />

          <ProductSort
            value={(filters.sortBy as ProductFilterState['sortBy']) || 'featured'}
            onChange={(val) => setFilters((prev) => ({ ...prev, sortBy: val }))}
          />
        </div>
      </RevealOnScroll>

      {/* Category Tabs & Karat Purity Filters */}
      <RevealOnScroll delay={80}>
        <div style={{ marginBottom: '3.5rem' }}>
          <ProductFilters
            selectedCategory={filters.category || 'all'}
            selectedPurity={filters.purity || 'all'}
            onSelectCategory={handleSelectCategory}
            onSelectPurity={(pur) => setFilters((prev) => ({ ...prev, purity: pur }))}
            onReset={handleReset}
          />
        </div>
      </RevealOnScroll>

      {/* Grid, Loading, or Error States */}
      {loading ? (
        <LoadingState message="Curating Haute Joaillerie & Horology Pieces..." />
      ) : error ? (
        <ErrorState
          title="Atelier Inventory Synchronization"
          message={error}
          onRetry={refetch}
        />
      ) : (
        <ProductGrid
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onInquire={onInquire}
          onResetFilters={handleReset}
          pageSize={6}
        />
      )}

      {/* Detailed Modal Lightbox */}
      {selectedProduct && (
        <ProductLightbox
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onInquire={onInquire}
        />
      )}
    </div>
  );
};
