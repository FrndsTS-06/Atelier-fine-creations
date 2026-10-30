import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileNavigation } from './MobileNavigation';
import { Menu, Sparkles, Lock } from 'lucide-react';

export const SiteHeader: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Gold Bullion Ticker & Atelier Status Bar */}
      <aside
        aria-label="Live Bullion Index & Verification"
        className="header-top-bar"
        style={{
          backgroundColor: '#080706',
          borderBottom: '1px solid rgba(196, 154, 90, 0.16)',
          padding: '0.45rem 1rem',
          fontSize: '0.75rem',
          color: 'var(--color-ivory-dim)',
          letterSpacing: '0.04em',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '1360px',
            margin: '0 auto',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-champagne)',
                  boxShadow: '0 0 6px var(--color-champagne)',
                }}
                aria-hidden="true"
              />
              <strong style={{ color: 'var(--color-champagne-light)', letterSpacing: '0.08em' }}>
                LIVE GOLD INDEX:
              </strong>{' '}
              24K: $74.20/g &nbsp;|&nbsp; 22K: $68.10/g
            </span>
            <span className="ticker-badge" style={{ display: 'none', color: '#34d399', fontSize: '0.7rem' }}>
              ▲ +0.4% TODAY
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span className="ticker-hallmark" style={{ display: 'none' }}>
              BIS 916 & 999 ASSAY CERTIFIED
            </span>
            <Link
              to={ROUTES.ADMIN.DASHBOARD}
              className="staff-portal-btn"
              aria-label="Staff Portal - Atelier Authorized Personnel"
            >
              <Lock size={15} strokeWidth={1.8} aria-hidden="true" />
              <span>STAFF PORTAL</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Haute Joaillerie Navigation Bar with Glass Transition */}
      <header
        className={isScrolled ? 'glass-panel-elevated' : 'glass-panel'}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: isScrolled ? 'rgba(12, 11, 9, 0.88)' : 'rgba(12, 11, 9, 0.55)',
          backdropFilter: isScrolled ? 'blur(24px)' : 'blur(16px)',
          WebkitBackdropFilter: isScrolled ? 'blur(24px)' : 'blur(16px)',
          borderBottom: isScrolled
            ? '1px solid rgba(196, 154, 90, 0.28)'
            : '1px solid rgba(196, 154, 90, 0.12)',
          boxShadow: isScrolled
            ? '0 12px 36px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : 'none',
          transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '84px',
            gap: '1.5rem',
          }}
        >
          {/* Brand Logo & Monogram */}
          <Link
            to={ROUTES.HOME}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.85rem',
              textDecoration: 'none',
            }}
            aria-label="Atelier Fine Creations Home"
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1.5px solid var(--color-champagne)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(196, 154, 90, 0.08)',
                color: 'var(--color-champagne)',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <Sparkles size={20} strokeWidth={1.5} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.25rem, 2.2vw, 1.6rem)',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: 'var(--color-ivory)',
                  lineHeight: 1.1,
                }}
              >
                ATELIER <span style={{ color: 'var(--color-champagne)' }}>FINE CREATIONS</span>
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.22em',
                  color: 'var(--color-warm-beige)',
                  textTransform: 'uppercase',
                }}
              >
                HAUTE JOAILLERIE • PARIS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Connecting 4 Public Routes in One Horizontal Row) */}
          <div className="header-desktop-nav">
            <DesktopNavigation />
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-label="Open mobile navigation"
            className="header-mobile-toggle"
            style={{
              background: 'var(--color-obsidian-subtle)',
              border: '1px solid var(--color-obsidian-border)',
              borderRadius: 'var(--radius-xs)',
              color: 'var(--color-champagne)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
            }}
          >
            <Menu size={22} strokeWidth={1.75} />
          </button>
        </div>
      </header>

      {/* Responsive Breakpoints Rules */}
      <style>{`
        .header-desktop-nav { display: none; }
        .header-mobile-toggle { display: inline-flex; }

        .staff-portal-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          background-color: #0C0B09;
          border: 1px solid rgba(196, 154, 90, 0.45);
          border-radius: var(--radius-xs);
          color: var(--color-warm-beige);
          font-family: var(--font-sans);
          font-size: 13.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          padding: 11px 22px;
          text-decoration: none;
          line-height: 1;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          transition: border-color 0.25s ease, color 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
        }
        .staff-portal-btn:hover {
          color: var(--color-champagne-light);
          border-color: var(--color-champagne);
          background-color: #191814;
          box-shadow: 0 0 16px rgba(196, 154, 90, 0.35), 0 2px 8px rgba(0, 0, 0, 0.6);
        }
        .staff-portal-btn:focus-visible {
          outline: 2px solid var(--color-champagne);
          outline-offset: 2px;
        }

        @media (max-width: 640px) {
          .staff-portal-btn {
            padding: 9px 16px;
            font-size: 12.5px;
            letter-spacing: 0.11em;
            gap: 0.45rem;
          }
        }
        @media (min-width: 640px) {
          .ticker-badge { display: inline !important; }
          .ticker-hallmark { display: inline !important; }
        }
        @media (min-width: 960px) {
          .header-desktop-nav { display: flex !important; align-items: center; }
          .header-mobile-toggle { display: none !important; }
        }
      `}</style>

      {/* Accessible Mobile Drawer */}
      <MobileNavigation isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};
