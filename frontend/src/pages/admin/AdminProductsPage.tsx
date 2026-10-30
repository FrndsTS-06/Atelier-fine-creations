import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
import { useProducts } from '../../hooks/useProducts';
import { productService } from '../../services/productService';
import { Product, ProductStatus } from '../../types/product';
import { Button } from '../../components/common/Button';
import { LoadingState } from '../../components/common/LoadingState';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  ShieldCheckIcon,
  SearchIcon,
  ExternalLinkIcon,
  ArchiveIcon,
  CheckCircleIcon,
} from '../../assets/icons';

export const AdminProductsPage: React.FC = () => {
  const { products, loading, refetch } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProductStatus>('all');

  // Confirmation modal state
  const [actionTarget, setActionTarget] = useState<{
    product: Product;
    type: 'delete' | 'archive' | 'publish';
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filter products by search and status
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchTerm.trim() ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const currentStatus = p.status || 'published';
    const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    const { product, type } = actionTarget;
    setActionLoading(true);

    try {
      if (type === 'delete') {
        await productService.deleteProduct(product.id);
      } else if (type === 'archive') {
        await productService.updateProduct(product.id, { status: 'archived' });
      } else if (type === 'publish') {
        await productService.updateProduct(product.id, { status: 'published' });
      }
      await refetch();
      setActionTarget(null);
    } catch (err: any) {
      alert(`Action error: ${err.message || 'Operation failed'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status?: ProductStatus) => {
    const st = status || 'published';
    if (st === 'published') {
      return (
        <span
          style={{
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.7rem',
            fontWeight: 600,
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            color: '#34d399',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34d399' }} />
          Published
        </span>
      );
    }
    if (st === 'draft') {
      return (
        <span
          style={{
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.7rem',
            fontWeight: 600,
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fbbf24' }} />
          Draft
        </span>
      );
    }
    return (
      <span
        style={{
          padding: '0.2rem 0.6rem',
          borderRadius: 'var(--radius-pill)',
          fontSize: '0.7rem',
          fontWeight: 600,
          backgroundColor: 'rgba(156, 163, 175, 0.15)',
          color: '#9ca3af',
          border: '1px solid rgba(156, 163, 175, 0.3)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9ca3af' }} />
        Archived
      </span>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Masterpiece Inventory</h1>
          <p style={{ color: 'var(--color-champagne-muted)', fontSize: '0.85rem' }}>
            Curate luxury catalog pieces, external purchase URLs, pricing, and publication statuses.
          </p>
        </div>

        <Link to={ROUTES.ADMIN.PRODUCT_NEW}>
          <Button icon={<PlusIcon width="16" height="16" />}>+ Add Masterpiece</Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <SearchIcon
            width="16"
            height="16"
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-champagne-muted)',
            }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search piece name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['all', 'published', 'draft', 'archived'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid',
                borderColor: statusFilter === st ? 'var(--color-gold-primary)' : 'var(--color-obsidian-border)',
                backgroundColor: statusFilter === st ? 'var(--color-gold-glow)' : 'transparent',
                color: statusFilter === st ? 'var(--color-gold-light)' : 'var(--color-champagne-muted)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all var(--transition-fast)',
              }}
            >
              {st === 'all' ? 'All Catalog' : st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading Vault Inventory..." />
      ) : filteredProducts.length === 0 ? (
        <div className="atelier-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', backgroundColor: '#0c0d12' }}>
          <p style={{ color: 'var(--color-champagne-muted)', fontSize: '0.95rem' }}>
            No jewelry masterpieces match the search or status filter.
          </p>
        </div>
      ) : (
        <div className="atelier-card" style={{ padding: '1.5rem', backgroundColor: '#0c0d12' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-obsidian-border)', color: 'var(--color-champagne-muted)' }}>
                  <th style={{ padding: '0.85rem 0.5rem' }}>Preview</th>
                  <th style={{ padding: '0.85rem 0.5rem' }}>Jewel Name</th>
                  <th style={{ padding: '0.85rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 0.5rem' }}>Purity</th>
                  <th style={{ padding: '0.85rem 0.5rem' }}>Valuation</th>
                  <th style={{ padding: '0.85rem 0.5rem' }}>Purchase Link</th>
                  <th style={{ padding: '0.85rem 0.5rem' }}>Hallmark</th>
                  <th style={{ padding: '0.85rem 0.5rem' }}>Stock</th>
                  <th style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const currentStatus = p.status || 'published';
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <img
                          src={p.images[0] || '/images/products/royal-choker.jpg'}
                          alt={p.name}
                          style={{
                            width: '44px',
                            height: '44px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            backgroundColor: '#050608',
                            border: '1px solid var(--color-obsidian-border)',
                          }}
                        />
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600, color: 'var(--color-champagne)' }}>
                        {p.name}
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-champagne-muted)' }}>
                          {p.category?.name || 'High Jewelry'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>{getStatusBadge(p.status)}</td>
                      <td style={{ padding: '0.85rem 0.5rem', color: 'var(--color-gold-primary)', fontWeight: 600 }}>
                        {p.purity || '22K'}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: 'var(--color-gold-light)' }}>
                        ${(p.price || p.estimatedPrice || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        {p.purchaseUrl ? (
                          <a
                            href={p.purchaseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: 'var(--color-gold-primary)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.75rem',
                            }}
                            title={p.purchaseUrl}
                          >
                            <ExternalLinkIcon width="13" height="13" /> Store Link
                          </a>
                        ) : (
                          <span style={{ color: 'var(--color-champagne-muted)', fontSize: '0.75rem' }}>Boutique Only</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        {p.hallmarkCertified ? (
                          <span style={{ color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <ShieldCheckIcon width="14" height="14" /> 916
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-champagne-muted)' }}>Pending</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <span
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '0.7rem',
                            backgroundColor: p.inStock ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: p.inStock ? '#34d399' : '#f87171',
                          }}
                        >
                          {p.inStock ? 'In Showroom' : 'Bespoke Order'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                          {/* Publish / Archive Quick Action */}
                          {currentStatus === 'published' ? (
                            <button
                              onClick={() => setActionTarget({ product: p, type: 'archive' })}
                              style={{
                                background: 'none',
                                border: '1px solid var(--color-obsidian-border)',
                                borderRadius: '4px',
                                padding: '0.4rem',
                                color: 'var(--color-champagne-muted)',
                                cursor: 'pointer',
                              }}
                              title="Archive Piece"
                            >
                              <ArchiveIcon width="14" height="14" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setActionTarget({ product: p, type: 'publish' })}
                              style={{
                                background: 'none',
                                border: '1px solid var(--color-obsidian-border)',
                                borderRadius: '4px',
                                padding: '0.4rem',
                                color: '#34d399',
                                cursor: 'pointer',
                              }}
                              title="Publish to Gallery"
                            >
                              <CheckCircleIcon width="14" height="14" />
                            </button>
                          )}

                          {/* Edit Piece */}
                          <Link to={ROUTES.ADMIN.PRODUCT_EDIT(p.id)}>
                            <button
                              style={{
                                background: 'none',
                                border: '1px solid var(--color-obsidian-border)',
                                borderRadius: '4px',
                                padding: '0.4rem',
                                color: 'var(--color-gold-primary)',
                                cursor: 'pointer',
                              }}
                              title="Edit Piece Specifications"
                            >
                              <EditIcon width="14" height="14" />
                            </button>
                          </Link>

                          {/* Delete Piece */}
                          <button
                            onClick={() => setActionTarget({ product: p, type: 'delete' })}
                            style={{
                              background: 'none',
                              border: '1px solid var(--color-obsidian-border)',
                              borderRadius: '4px',
                              padding: '0.4rem',
                              color: '#ef4444',
                              cursor: 'pointer',
                            }}
                            title="Decommission Piece"
                          >
                            <TrashIcon width="14" height="14" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reusable Confirmation Dialog for Destructive / State Altering Actions */}
      {actionTarget && (
        <ConfirmationModal
          isOpen={true}
          isDestructive={actionTarget.type === 'delete'}
          loading={actionLoading}
          title={
            actionTarget.type === 'delete'
              ? 'Decommission Jewelry Masterpiece'
              : actionTarget.type === 'archive'
              ? 'Archive Catalog Piece'
              : 'Publish Piece to Gallery'
          }
          message={
            actionTarget.type === 'delete'
              ? `Are you certain you wish to permanently remove "${actionTarget.product.name}" from the vault catalog? This action is irreversible.`
              : actionTarget.type === 'archive'
              ? `Archive "${actionTarget.product.name}"? It will no longer appear on public gallery storefronts while maintaining internal audit history.`
              : `Publish "${actionTarget.product.name}" to the live public gallery storefront?`
          }
          confirmText={
            actionTarget.type === 'delete'
              ? 'Confirm Decommission'
              : actionTarget.type === 'archive'
              ? 'Archive Piece'
              : 'Publish Now'
          }
          onConfirm={handleConfirmAction}
          onCancel={() => setActionTarget(null)}
        />
      )}
    </div>
  );
};
