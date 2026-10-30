import React, { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types/category';
import { Button } from '../../components/common/Button';
import { LoadingState } from '../../components/common/LoadingState';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { TrashIcon, PlusIcon, EditIcon } from '../../assets/icons';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, loading, refetch } = useCategories();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('/images/collections/bridal.jpg');
  const [submitting, setSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Destructive delete confirmation modal
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, {
          name: name.trim(),
          description: description.trim(),
          bannerUrl: bannerUrl.trim(),
        });
        setEditingCategory(null);
      } else {
        await categoryService.createCategory({
          name: name.trim(),
          description: description.trim(),
          bannerUrl: bannerUrl.trim(),
        });
      }
      setName('');
      setDescription('');
      setBannerUrl('/images/collections/bridal.jpg');
      await refetch();
    } catch (err: any) {
      alert(`Category notice: ${err.message || 'Operation failed'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setBannerUrl(cat.bannerUrl || '/images/collections/bridal.jpg');
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setBannerUrl('/images/collections/bridal.jpg');
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setDeleteLoading(true);
    try {
      await categoryService.deleteCategory(deletingCategory.id);
      await refetch();
      setDeletingCategory(null);
    } catch (err: any) {
      alert(`Deletion notice: ${err.message || 'Could not delete category'}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Signature Collections</h1>
        <p style={{ color: 'var(--color-champagne-muted)', fontSize: '0.85rem' }}>
          Curate signature jewelry chapters (Designer Rings, Bespoke Watches, Leather Straps, High Jewelry).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        {/* Existing categories list */}
        <div className="atelier-card" style={{ padding: '2rem', backgroundColor: '#0c0d12' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Active Signature Categories</h3>
          {loading ? (
            <LoadingState message="Loading Collections..." />
          ) : categories.length === 0 ? (
            <p style={{ color: 'var(--color-champagne-muted)', fontSize: '0.85rem' }}>
              No signature categories found. Create one using the form.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    padding: '1.2rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-obsidian-subtle)',
                    border: '1px solid var(--color-obsidian-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <img
                    src={cat.bannerUrl || '/images/collections/bridal.jpg'}
                    alt={cat.name}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '4px',
                      objectFit: 'cover',
                      border: '1px solid var(--color-obsidian-border)',
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/collections/bridal.jpg';
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '1rem', color: 'var(--color-champagne)', margin: 0 }}>
                        {cat.name}
                      </h4>
                      {(cat._count?.products !== undefined || cat.productCount !== undefined) && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.15rem 0.45rem',
                            borderRadius: 'var(--radius-pill)',
                            backgroundColor: 'var(--color-gold-glow)',
                            color: 'var(--color-gold-light)',
                          }}
                        >
                          {cat._count?.products ?? cat.productCount} pieces
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-champagne-muted)', marginTop: '0.2rem', margin: 0 }}>
                      Slug: <code style={{ color: 'var(--color-gold-primary)' }}>{cat.slug}</code>
                    </p>
                    {cat.description && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-champagne-muted)', marginTop: '0.35rem' }}>
                        {cat.description}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => startEdit(cat)}
                      style={{
                        background: 'none',
                        border: '1px solid var(--color-obsidian-border)',
                        borderRadius: '4px',
                        padding: '0.4rem',
                        color: 'var(--color-gold-primary)',
                        cursor: 'pointer',
                      }}
                      title="Edit Category"
                    >
                      <EditIcon width="14" height="14" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingCategory(cat)}
                      style={{
                        background: 'none',
                        border: '1px solid var(--color-obsidian-border)',
                        borderRadius: '4px',
                        padding: '0.4rem',
                        color: '#ef4444',
                        cursor: 'pointer',
                      }}
                      title="Delete Category"
                    >
                      <TrashIcon width="14" height="14" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create / Edit category form */}
        <form onSubmit={handleSubmit} className="atelier-card" style={{ padding: '2rem', backgroundColor: '#0c0d12' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>
              {editingCategory ? 'Edit Signature Chapter' : '+ Create Signature Chapter'}
            </h3>
            {editingCategory && (
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-champagne-muted)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-champagne-muted)', marginBottom: '0.4rem' }}>
              Collection Title *
            </label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal Temple Jewelry"
              required
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-champagne-muted)', marginBottom: '0.4rem' }}>
              Curatorial Description
            </label>
            <textarea
              rows={3}
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief introduction for this signature chapter..."
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-champagne-muted)', marginBottom: '0.4rem' }}>
              Banner Image Asset URL
            </label>
            <input
              type="text"
              className="form-input"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              type="submit"
              disabled={submitting}
              icon={!editingCategory ? <PlusIcon width="14" height="14" /> : undefined}
              style={{ flex: 1 }}
            >
              {submitting
                ? 'Processing...'
                : editingCategory
                ? 'Update Chapter'
                : 'Add Signature Chapter'}
            </Button>
            {editingCategory && (
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Confirmation Modal for Destructive Category Deletion */}
      {deletingCategory && (
        <ConfirmationModal
          isOpen={true}
          isDestructive={true}
          loading={deleteLoading}
          title="Delete Signature Chapter"
          message={`Are you certain you wish to delete "${deletingCategory.name}"? Products assigned to this category will also be affected.`}
          confirmText="Confirm Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingCategory(null)}
        />
      )}
    </div>
  );
};
