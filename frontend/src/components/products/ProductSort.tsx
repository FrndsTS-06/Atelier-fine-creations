import React from 'react';
import { ProductFilterState } from '../../types/product';

interface ProductSortProps {
  value: ProductFilterState['sortBy'];
  onChange: (value: ProductFilterState['sortBy']) => void;
}

export const ProductSort: React.FC<ProductSortProps> = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <label
        htmlFor="gallery-sort-select"
        style={{
          fontSize: '0.78rem',
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          color: '#8C6729',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        Sort By:
      </label>
      <select
        id="gallery-sort-select"
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value as ProductFilterState['sortBy'])}
        style={{
          minWidth: '220px',
          padding: '0.75rem 1.25rem',
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(196, 154, 90, 0.35)',
          borderRadius: 'var(--radius-xs)',
          color: 'var(--color-obsidian)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.85rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(53, 35, 24, 0.04)',
          outline: 'none',
        }}
      >
        <option value="featured">Atelier Curated Featured</option>
        <option value="name_asc">Name: A to Z</option>
        <option value="name_desc">Name: Z to A</option>
        <option value="price_asc">Price: Modest to Opulent</option>
        <option value="price_desc">Price: Opulent to Modest</option>
        <option value="weight_desc">Precious Metal Weight</option>
      </select>
    </div>
  );
};
