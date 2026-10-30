import React from 'react';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  id?: string;
  theme?: 'light' | 'dark';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  centered = true,
  className = '',
  id,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';

  return (
    <header
      id={id}
      className={`section-heading-wrap ${className}`}
      style={{
        textAlign: centered ? 'center' : 'left',
        marginBottom: '3.5rem',
        maxWidth: centered ? '780px' : '100%',
        marginLeft: centered ? 'auto' : undefined,
        marginRight: centered ? 'auto' : undefined,
      }}
    >
      {eyebrow && (
        <span
          className="eyebrow-badge"
          style={{
            display: 'inline-block',
            marginBottom: '0.85rem',
            color: isLight ? '#8C6729' : 'var(--color-champagne)',
          }}
        >
          {eyebrow}
        </span>
      )}
      <h2
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.1rem, 4vw, 3.25rem)',
          lineHeight: 1.15,
          marginBottom: '1rem',
          fontWeight: 600,
          color: isLight ? 'var(--color-obsidian)' : 'var(--color-ivory)',
        }}
      >
        {isLight ? (
          <span style={{ color: 'var(--color-obsidian)' }}>{title}</span>
        ) : (
          <span className="text-gold-gradient">{title}</span>
        )}
      </h2>
      {subtitle && (
        <p
          className="text-subtle-serif"
          style={{
            margin: '0 auto',
            maxWidth: '680px',
            fontSize: '1.15rem',
            lineHeight: 1.7,
            color: isLight ? '#5C5248' : 'var(--color-ivory-muted)',
          }}
        >
          {subtitle}
        </p>
      )}
      <div
        style={{
          width: '50px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #C49A5A, transparent)',
          margin: centered ? '1.75rem auto 0' : '1.75rem 0 0',
          opacity: 0.85,
        }}
        aria-hidden="true"
      />
    </header>
  );
};
