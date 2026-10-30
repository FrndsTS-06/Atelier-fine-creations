import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
import { useProducts } from '../../hooks/useProducts';
import { inquiryService } from '../../services/inquiryService';
import { Inquiry } from '../../types/inquiry';
import { DiamondIcon, SparklesIcon, MailIcon, ScaleIcon, ArrowRightIcon } from '../../assets/icons';

export const AdminDashboardPage: React.FC = () => {
  const { products, total } = useProducts();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    inquiryService
      .getInquiries()
      .then((res) => {
        setInquiries(res);
      })
      .catch(() => {
        setInquiries([]);
      });
  }, []);

  const pendingCount = inquiries.filter((i) => i.status === 'PENDING').length;

  const stats = [
    {
      label: 'Active Jewels in Vault',
      value: total,
      icon: <DiamondIcon width="24" height="24" />,
      link: ROUTES.ADMIN.PRODUCTS,
    },
    {
      label: 'Pending Client Inquiries',
      value: pendingCount,
      icon: <MailIcon width="24" height="24" />,
      link: ROUTES.ADMIN.INQUIRIES,
      alert: pendingCount > 0,
    },
    {
      label: 'Curated Highlights',
      value: products.filter((p) => p.isFeatured).length,
      icon: <SparklesIcon width="24" height="24" />,
      link: ROUTES.ADMIN.PRODUCTS,
    },
    {
      label: 'Published Masterpieces',
      value: products.filter((p) => (p.status || 'published') === 'published').length,
      icon: <ScaleIcon width="24" height="24" />,
      link: ROUTES.ADMIN.PRODUCTS,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Atelier Executive Suite</h1>
        <p style={{ color: 'var(--color-champagne-muted)', fontSize: '0.9rem' }}>
          Real-time catalog oversight, VIP consultation logs, and assay certification logs.
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.75rem',
          marginBottom: '3rem',
        }}
      >
        {stats.map((stat, idx) => (
          <Link
            key={idx}
            to={stat.link}
            className="atelier-card"
            style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#0c0d12',
              transition: 'all var(--transition-fast)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ color: stat.alert ? '#f59e0b' : 'var(--color-gold-primary)' }}>
                {stat.icon}
              </div>
              <ArrowRightIcon width="16" height="16" style={{ color: 'var(--color-champagne-muted)' }} />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-champagne-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {stat.label}
            </p>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--color-gold-light)', marginTop: '0.25rem' }}>
              {stat.value}
            </h3>
          </Link>
        ))}
      </div>

      {/* Quick Showcase Table */}
      <div className="atelier-card" style={{ padding: '2rem', backgroundColor: '#0c0d12' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Recently Registered Masterpieces</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-champagne-muted)', margin: '0.2rem 0 0 0' }}>
              Real-time synchronization with active PostgreSQL/SQLite catalog.
            </p>
          </div>
          <Link to={ROUTES.ADMIN.PRODUCT_NEW} style={{ color: 'var(--color-gold-primary)', fontSize: '0.85rem' }}>
            + Register New Piece
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-obsidian-border)', color: 'var(--color-champagne-muted)' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Piece Title</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Purity</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Valuation</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Availability</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600, color: 'var(--color-champagne)' }}>
                    {p.name}
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-champagne-muted)' }}>
                      {p.category?.name || 'High Jewelry'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span
                      style={{
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        backgroundColor: (p.status || 'published') === 'published' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: (p.status || 'published') === 'published' ? '#34d399' : '#fbbf24',
                      }}
                    >
                      {p.status || 'published'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--color-gold-primary)' }}>{p.purity || '22K'}</td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>
                    ${(p.price || p.estimatedPrice || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span style={{ color: p.inStock ? '#34d399' : '#f87171' }}>
                      {p.inStock ? 'In Showroom' : 'Custom Order'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                    <Link
                      to={ROUTES.ADMIN.PRODUCT_EDIT(p.id)}
                      style={{
                        color: 'var(--color-gold-primary)',
                        fontSize: '0.75rem',
                        textDecoration: 'none',
                        border: '1px solid var(--color-obsidian-border)',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                      }}
                    >
                      Edit Dossier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
