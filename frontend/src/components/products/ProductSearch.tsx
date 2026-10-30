import React from 'react';
import { Search, X } from 'lucide-react';

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ value, onChange }) => {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
      <div
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#8C6729',
          display: 'flex',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <Search size={18} />
      </div>

      <input
        type="search"
        aria-label="Search creations by name or description"
        placeholder="Search rings, chronometers, leather straps..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '0.85rem 2.5rem 0.85rem 2.85rem',
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(196, 154, 90, 0.35)',
          borderRadius: 'var(--radius-xs)',
          color: 'var(--color-obsidian)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem',
          outline: 'none',
          boxShadow: '0 2px 8px rgba(53, 35, 24, 0.04)',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#C49A5A';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(196, 154, 90, 0.2)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(196, 154, 90, 0.35)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(53, 35, 24, 0.04)';
        }}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search query"
          style={{
            position: 'absolute',
            right: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: '#7A6E62',
            cursor: 'pointer',
            padding: '0.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
