import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  theme?: 'light' | 'dark';
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const dimColor = isLight ? '#7A6E62' : 'var(--color-ivory-dim)';
  const activeColor = isLight ? '#8C6729' : 'var(--color-champagne)';
  const hoverColor = isLight ? '#352318' : 'var(--color-champagne-light)';

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className={className}
      style={{
        padding: '1.25rem 0',
        fontSize: '0.8rem',
        letterSpacing: '0.04em',
        color: dimColor,
      }}
    >
      <ol
        style={{
          listStyle: 'none',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.5rem',
          padding: 0,
          margin: 0,
        }}
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li
              key={idx}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  style={{
                    color: dimColor,
                    transition: 'color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = dimColor)}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  style={{
                    color: activeColor,
                    fontWeight: 600,
                  }}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span style={{ opacity: isLight ? 0.45 : 0.35, userSelect: 'none' }} aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
