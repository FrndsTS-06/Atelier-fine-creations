import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
import { X, Phone, Mail, ArrowRight } from 'lucide-react';

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const publicNavItems = [
    { label: 'HOME', path: ROUTES.HOME, description: 'Atelier entrance & curated spotlight' },
    { label: 'GALLERY', path: ROUTES.GALLERY, description: '22K & 24K gold necklaces, bangles & solitaires' },
    { label: 'ABOUT US', path: ROUTES.ABOUT, description: 'A century of Parisian mastercraft' },
    { label: 'CONTACT', path: ROUTES.CONTACT, description: 'Private concierge & salon consultation' },
  ];

  // Handle Escape key and focus management
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on open
    closeButtonRef.current?.focus();

    // Prevent body scroll when drawer is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Drawer"
      ref={drawerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backgroundColor: 'rgba(12, 11, 9, 0.94)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Drawer Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--color-obsidian-border)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'var(--color-champagne)',
            }}
          >
            ATELIER FINE CREATIONS
          </span>
          <span style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: 'var(--color-ivory-dim)', textTransform: 'uppercase' }}>
            HAUTE JOAILLERIE • PARIS
          </span>
        </div>

        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close navigation menu"
          style={{
            background: 'var(--color-obsidian-subtle)',
            border: '1px solid var(--color-obsidian-border)',
            borderRadius: '50%',
            color: 'var(--color-champagne)',
            cursor: 'pointer',
            width: '44px',
            height: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)',
          }}
        >
          <X size={22} strokeWidth={1.75} />
        </button>
      </div>

      {/* Nav List with generous touch targets */}
      <nav
        aria-label="Mobile Routes"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '3rem',
        }}
      >
        {publicNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.HOME}
            onClick={onClose}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isActive ? 'var(--color-obsidian-card)' : 'transparent',
              border: isActive ? '1px solid var(--color-champagne)' : '1px solid transparent',
              textDecoration: 'none',
              transition: 'all var(--transition-fast)',
              minHeight: '64px',
            })}
          >
            {({ isActive }) => (
              <>
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.35rem',
                      letterSpacing: '0.04em',
                      color: isActive ? 'var(--color-champagne)' : 'var(--color-ivory)',
                      display: 'block',
                      marginBottom: '0.15rem',
                    }}
                  >
                    {item.label}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-ivory-dim)' }}>
                    {item.description}
                  </span>
                </div>
                <ArrowRight
                  size={18}
                  style={{
                    color: isActive ? 'var(--color-champagne)' : 'var(--color-ivory-dim)',
                    opacity: isActive ? 1 : 0.6,
                  }}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Direct VIP Showroom Assistance */}
      <div
        style={{
          marginTop: 'auto',
          padding: '1.5rem',
          backgroundColor: 'var(--color-obsidian-card)',
          border: '1px solid var(--color-obsidian-border)',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <span
          className="eyebrow-badge"
          style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.7rem' }}
        >
          DIRECT VIP ASSISTANCE
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
          <a
            href="tel:+18005554653"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: 'var(--color-champagne)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
            }}
          >
            <Phone size={16} /> +1 (800) 555-GOLD (Toll-Free)
          </a>
          <a
            href="mailto:concierge@atelierfinecreations.gold"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: 'var(--color-ivory-muted)',
              fontSize: '0.825rem',
            }}
          >
            <Mail size={16} /> concierge@atelierfinecreations.gold
          </a>
        </div>
      </div>
    </div>
  );
};
