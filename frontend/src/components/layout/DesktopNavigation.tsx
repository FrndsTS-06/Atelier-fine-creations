import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';

export interface DesktopNavigationProps {
  className?: string;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ className = '' }) => {
  const publicNavItems = [
    { label: 'HOME', path: ROUTES.HOME },
    { label: 'GALLERY', path: ROUTES.GALLERY },
    { label: 'ABOUT US', path: ROUTES.ABOUT },
    { label: 'CONTACT', path: ROUTES.CONTACT },
  ];

  return (
    <>
      <nav
        aria-label="Primary Desktop Navigation"
        className={`desktop-nav ${className}`}
        style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}
      >
        {publicNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.HOME}
            className={({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              fontFamily: 'var(--font-sans)',
              fontSize: '0.825rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: isActive ? 'var(--color-champagne)' : 'var(--color-ivory-dim)',
              position: 'relative',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              padding: '0.4rem 0 0.25rem 0',
              transition: 'color var(--transition-fast)',
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.color = 'var(--color-ivory)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.color = 'var(--color-ivory-dim)';
              }
            }}
          >
            {({ isActive }) => (
              <>
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  style={{
                    display: 'block',
                    height: '1.5px',
                    backgroundColor: isActive ? 'var(--color-champagne)' : 'transparent',
                    marginTop: '6px',
                    width: '100%',
                    transition: 'background-color var(--transition-fast)',
                  }}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <style>{`
        .desktop-nav-link:focus-visible {
          outline: 2px solid var(--color-champagne);
          outline-offset: 4px;
          border-radius: 2px;
        }
      `}</style>
    </>
  );
};

