import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routePaths';
import { useAuth } from '../context/AuthContext';
import { DiamondIcon, SparklesIcon, FilterIcon, MailIcon, LogOutIcon, ArrowRightIcon } from '../assets/icons';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.ADMIN.LOGIN);
  };

  const navLinks = [
    { label: 'Overview & Metrics', path: ROUTES.ADMIN.DASHBOARD, icon: <SparklesIcon width="18" height="18" /> },
    { label: 'Masterpiece Inventory', path: ROUTES.ADMIN.PRODUCTS, icon: <DiamondIcon width="18" height="18" /> },
    { label: 'Signature Collections', path: ROUTES.ADMIN.CATEGORIES, icon: <FilterIcon width="18" height="18" /> },
    { label: 'Client Inquiries', path: ROUTES.ADMIN.INQUIRIES, icon: <MailIcon width="18" height="18" /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-obsidian)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '280px',
          backgroundColor: '#07080a',
          borderRight: '1px solid var(--color-obsidian-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem 1.5rem',
        }}
      >
        <div style={{ marginBottom: '2.5rem' }}>
          <img src="/images/logo.svg" alt="AURÉLIEN" style={{ height: '36px', marginBottom: '0.5rem' }} />
          <span className="eyebrow-badge" style={{ fontSize: '0.65rem', color: 'var(--color-gold-antique)' }}>
            ATELIER SUITE • ADMIN
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === ROUTES.ADMIN.DASHBOARD}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isActive ? 'var(--color-obsidian)' : 'var(--color-champagne-muted)',
                backgroundColor: isActive ? 'var(--color-gold-primary)' : 'transparent',
                transition: 'all var(--transition-fast)',
              })}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--color-obsidian-border)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-champagne)', fontWeight: 600 }}>
              {user?.fullName || 'Atelier Staff'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-champagne-muted)' }}>
              {user?.email}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <NavLink
              to={ROUTES.HOME}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: 'var(--color-gold-primary)',
              }}
            >
              Flagship Boutique <ArrowRightIcon width="14" height="14" />
            </NavLink>

            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.8rem',
                cursor: 'pointer',
                padding: '0.5rem 0',
              }}
            >
              <LogOutIcon width="16" height="16" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Workspace */}
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};
