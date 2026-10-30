import React from 'react';
import { Outlet } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

export const MainLayout: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--color-obsidian)',
        color: 'var(--color-ivory)',
      }}
    >
      {/* Accessible skip link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only"
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 9999,
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--color-champagne)',
          color: 'var(--color-obsidian)',
          fontWeight: 600,
          borderRadius: 'var(--radius-xs)',
          boxShadow: 'var(--shadow-gold)',
          textDecoration: 'none',
        }}
      >
        Skip to main content
      </a>

      {/* Main Luxury Header */}
      <SiteHeader />

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} style={{ flex: 1, outline: 'none' }}>
        <Outlet />
      </main>

      {/* Main Luxury Footer */}
      <SiteFooter />
    </div>
  );
};
