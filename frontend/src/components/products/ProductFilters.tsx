import React from 'react';
import { useCategories } from '../../hooks/useCategories';

interface ProductFiltersProps {
  selectedCategory: string;
  selectedPurity: string;
  onSelectCategory: (cat: string) => void;
  onSelectPurity: (purity: string) => void;
  onReset: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedCategory,
  selectedPurity,
  onSelectCategory,
  onSelectPurity,
  onReset,
}) => {
  const { categories } = useCategories();
  const purities = ['all', '24K', '22K', '18K'];

  // Primary category tabs requested
  const primaryTabs = [
    { label: 'All Creations', slug: 'all' },
    { label: 'Necklaces & Chokers', slug: 'necklaces' },
    { label: 'Bespoke Rings', slug: 'rings' },
    { label: 'Bangles & Bracelets', slug: 'bangles' },
    { label: 'Bridal & Royal Sets', slug: 'bridal-sets' },
    { label: 'Bespoke Watches', slug: 'watches' },
    { label: 'Leather Straps', slug: 'straps' },
  ];

  // Also include any other categories if in catalog
  const extraTabs = categories.filter(
    (c) => !primaryTabs.some((t) => t.slug === c.slug)
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        padding: '1.25rem 1.5rem',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid rgba(196, 154, 90, 0.28)',
        boxShadow: '0 2px 12px rgba(53, 35, 24, 0.04)',
      }}
    >
      {/* Category Tabs Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.65rem',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            color: '#8C6729',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginRight: '0.5rem',
          }}
        >
          Discipline:
        </span>

        {primaryTabs.map((tab) => {
          const isActive = selectedCategory === tab.slug;
          return (
            <button
              key={tab.slug}
              type="button"
              onClick={() => onSelectCategory(tab.slug)}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid',
                borderColor: isActive ? '#C49A5A' : 'rgba(196, 154, 90, 0.3)',
                backgroundColor: isActive ? '#C49A5A' : '#FAF8F4',
                color: isActive ? '#FFFFFF' : '#37312B',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                fontWeight: isActive ? 600 : 500,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#C49A5A';
                  e.currentTarget.style.backgroundColor = '#F5EFE4';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'rgba(196, 154, 90, 0.3)';
                  e.currentTarget.style.backgroundColor = '#FAF8F4';
                }
              }}
            >
              {tab.label}
            </button>
          );
        })}

        {extraTabs.map((cat) => {
          const isActive = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid',
                borderColor: isActive ? '#C49A5A' : 'rgba(196, 154, 90, 0.3)',
                backgroundColor: isActive ? '#C49A5A' : '#FAF8F4',
                color: isActive ? '#FFFFFF' : '#37312B',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                fontWeight: isActive ? 600 : 500,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Purity & Reset Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid rgba(196, 154, 90, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.72rem',
              color: '#7A6E62',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
            }}
          >
            Purity Filter:
          </span>
          {purities.map((p) => {
            const isActive = selectedPurity === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onSelectPurity(p)}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid',
                  borderColor: isActive ? '#8C6729' : 'rgba(196, 154, 90, 0.25)',
                  backgroundColor: isActive ? 'rgba(196, 154, 90, 0.16)' : 'transparent',
                  color: isActive ? '#8C6729' : '#5C5248',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {p === 'all' ? 'All Karats' : p}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onReset}
          style={{
            background: 'none',
            border: 'none',
            color: '#8C6729',
            fontSize: '0.78rem',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            fontWeight: 500,
          }}
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};
