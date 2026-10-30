import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
import { productService } from '../../services/productService';
import { useCategories } from '../../hooks/useCategories';
import {
  validateProductForm,
  validateImageUrl,
  validateImageFile,
  ProductFormErrors,
} from '../../schemas/productSchema';
import { ProductStatus } from '../../types/product';
import { Button } from '../../components/common/Button';
import { LoadingState } from '../../components/common/LoadingState';
import { PlusIcon, TrashIcon } from '../../assets/icons';

const PRESET_ASSETS = [
  { label: 'Aura Imperial 22K Choker', url: '/images/products/royal-choker.jpg' },
  { label: 'Statement Majestic Knot Ring', url: '/images/products/solitaire-ring.jpg' },
  { label: 'Gold & Diamond Cascade Bangle', url: '/images/products/diamond-bangle.jpg' },
  { label: 'Marquise Aurélia Bracelet', url: '/images/products/emerald-pendant.jpg' },
  { label: 'Haute Horlogerie Chronometer', url: '/images/products/chronometer-watch.jpg' },
  { label: 'Alligator Leather Watch Strap', url: '/images/products/alligator-strap.jpg' },
  { label: 'Atelier Imperial 22K Signet Ring', url: '/images/products/imperial-ring.jpg' },
];

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { categories } = useCategories();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [imageUploadNotice, setImageUploadNotice] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    status: 'published' as ProductStatus,
    purchaseUrl: '',
    currency: 'USD',
    purity: '22K',
    grossWeight: 25.0,
    netWeight: 24.5,
    stoneWeight: 0.5,
    makingCharges: 450,
    estimatedPrice: 12500,
    hallmarkCertified: true,
    inStock: true,
    isFeatured: false,
    images: ['/images/products/royal-choker.jpg'],
  });

  useEffect(() => {
    if (isEdit && id) {
      productService
        .getProduct(id)
        .then((p) => {
          if (p) {
            setFormData({
              name: p.name,
              description: p.description,
              categoryId: p.categoryId,
              status: p.status || 'published',
              purchaseUrl: p.purchaseUrl || '',
              currency: p.currency || 'USD',
              purity: p.purity || '22K',
              grossWeight: p.grossWeight || 25.0,
              netWeight: p.netWeight || 24.5,
              stoneWeight: p.stoneWeight || 0,
              makingCharges: p.makingCharges || 0,
              estimatedPrice: p.price || p.estimatedPrice || 12500,
              hallmarkCertified: p.hallmarkCertified ?? true,
              inStock: p.inStock ?? true,
              isFeatured: p.isFeatured ?? false,
              images: p.images && p.images.length > 0 ? p.images : ['/images/products/royal-choker.jpg'],
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleImageChange = (index: number, value: string) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData({ ...formData, images: updated });
  };

  const handleAddImage = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const handleRemoveImage = (index: number) => {
    if (formData.images.length <= 1) {
      setFormData({ ...formData, images: [''] });
      return;
    }
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updated });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUploadNotice(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setImageUploadNotice(`Upload rejected: ${validation.error}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({
          ...prev,
          images: [reader.result as string, ...prev.images.filter((img) => img.trim())],
        }));
        setImageUploadNotice(`Successfully processed and attached "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImageUploadNotice(null);

    const validationErrors = validateProductForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: formData.estimatedPrice,
        images: formData.images.filter((img) => img.trim()),
      };

      if (isEdit && id) {
        await productService.updateProduct(id, payload);
      } else {
        await productService.createProduct(payload);
      }
      navigate(ROUTES.ADMIN.PRODUCTS);
    } catch (err: any) {
      alert(`Save notice: ${err.message || 'Operation failed'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Retrieving Jewel Dossier..." />;
  }

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to={ROUTES.ADMIN.PRODUCTS}
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-gold-primary)',
            display: 'inline-block',
            marginBottom: '0.5rem',
          }}
        >
          ← Back to Inventory Vault
        </Link>
        <h1 style={{ fontSize: '1.85rem' }}>
          {isEdit ? 'Refine Jewel Dossier' : 'Register New Masterpiece'}
        </h1>
        <p style={{ color: 'var(--color-champagne-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Specify luxury attributes, publication status, verified images, and external checkout links.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="atelier-card" style={{ padding: '2.5rem', backgroundColor: '#0c0d12' }}>
        {/* Name, Category, and Publication Status */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-champagne-muted)', marginBottom: '0.4rem' }}>
              Masterpiece Title *
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Royal Nizam 22K Kundan Choker"
            />
            {errors.name && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.name}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-champagne-muted)', marginBottom: '0.4rem' }}>
              Signature Collection Category *
            </label>
            <select
              className="form-select"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              <option value="">Select Chapter Collection...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.categoryId}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-champagne-muted)', marginBottom: '0.4rem' }}>
              Publication Status *
            </label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
            >
              <option value="published">Published (Visible in Storefront)</option>
              <option value="draft">Draft (Private Atelier Review)</option>
              <option value="archived">Archived (Retired / Historic Record)</option>
            </select>
            {errors.status && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.status}</p>}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-champagne-muted)', marginBottom: '0.4rem' }}>
            Artisan Narrative & Provenance Description *
          </label>
          <textarea
            rows={3}
            className="form-textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed craftsmanship notes, historical inspirations, gold alloy alloy notes..."
          />
          {errors.description && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.description}</p>}
        </div>

        {/* Pricing & External Purchase URL */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-champagne-muted)', marginBottom: '0.4rem' }}>
              Valuation Price ($ USD) *
            </label>
            <input
              type="number"
              className="form-input"
              value={formData.estimatedPrice}
              onChange={(e) => setFormData({ ...formData, estimatedPrice: parseFloat(e.target.value) || 0 })}
            />
            {errors.estimatedPrice && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.estimatedPrice}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-champagne-muted)', marginBottom: '0.4rem' }}>
              External Purchase Checkout URL (Optional)
            </label>
            <input
              type="url"
              className="form-input"
              value={formData.purchaseUrl}
              onChange={(e) => setFormData({ ...formData, purchaseUrl: e.target.value })}
              placeholder="https://checkout.atelier-fine.com/pieces/royal-choker"
            />
            {errors.purchaseUrl && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.purchaseUrl}</p>}
          </div>
        </div>

        {/* Purity & Physical Specifications */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-champagne-muted)', marginBottom: '0.4rem' }}>
              Gold Karatage
            </label>
            <select
              className="form-select"
              value={formData.purity}
              onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
            >
              <option value="24K">24K (99.9% Pure Bullion)</option>
              <option value="22K">22K (91.6% Fine Jewelry)</option>
              <option value="18K">18K (75.0% Diamond Setting)</option>
              <option value="14K">14K (58.5% Contemporary)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-champagne-muted)', marginBottom: '0.4rem' }}>
              Gross Weight (g) *
            </label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              value={formData.grossWeight}
              onChange={(e) => setFormData({ ...formData, grossWeight: parseFloat(e.target.value) || 0 })}
            />
            {errors.grossWeight && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.grossWeight}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-champagne-muted)', marginBottom: '0.4rem' }}>
              Net Pure Gold (g) *
            </label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              value={formData.netWeight}
              onChange={(e) => setFormData({ ...formData, netWeight: parseFloat(e.target.value) || 0 })}
            />
            {errors.netWeight && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.netWeight}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-champagne-muted)', marginBottom: '0.4rem' }}>
              Making Charge ($/g)
            </label>
            <input
              type="number"
              className="form-input"
              value={formData.makingCharges}
              onChange={(e) => setFormData({ ...formData, makingCharges: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        {/* Image Management & Validation Section */}
        <div
          style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: 'var(--color-obsidian-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-obsidian-border)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', color: 'var(--color-champagne)' }}>
                Product Imagery & Showcase Assets *
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-champagne-muted)', marginTop: '0.2rem' }}>
                Valid formats: JPEG, PNG, WebP, SVG, AVIF. Max file size: 5 MB. Enter secure HTTPS URLs or upload asset.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddImage}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                border: '1px solid var(--color-gold-primary)',
                background: 'transparent',
                color: 'var(--color-gold-light)',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              <PlusIcon width="13" height="13" /> Add Image URL
            </button>
          </div>

          {/* Quick Presets */}
          <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-champagne-muted)' }}>Curated Presets:</span>
            {PRESET_ASSETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const updated = [...formData.images];
                  if (!updated[0] || !updated[0].trim()) {
                    updated[0] = preset.url;
                  } else {
                    updated.push(preset.url);
                  }
                  setFormData({ ...formData, images: updated });
                }}
                style={{
                  fontSize: '0.7rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: '#0c0d12',
                  border: '1px solid var(--color-obsidian-border)',
                  color: 'var(--color-gold-primary)',
                  cursor: 'pointer',
                }}
              >
                + {preset.label}
              </button>
            ))}
          </div>

          {/* File Upload Service */}
          <div style={{ marginBottom: '1.25rem', padding: '0.85rem', backgroundColor: '#07080a', borderRadius: '4px', border: '1px dashed var(--color-obsidian-border)' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gold-primary)', marginBottom: '0.4rem', fontWeight: 600 }}>
              Upload Image Asset from Workstation
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml,image/avif"
              onChange={handleFileUpload}
              style={{ fontSize: '0.8rem', color: 'var(--color-champagne-muted)' }}
            />
            {imageUploadNotice && (
              <p
                style={{
                  fontSize: '0.75rem',
                  marginTop: '0.4rem',
                  color: imageUploadNotice.startsWith('Upload rejected') ? '#f87171' : '#34d399',
                }}
              >
                {imageUploadNotice}
              </p>
            )}
          </div>

          {/* Image URLs List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {formData.images.map((url, idx) => {
              const check = url.trim() ? validateImageUrl(url) : { isValid: true };
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '4px',
                      backgroundColor: '#050608',
                      border: '1px solid var(--color-obsidian-border)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {url.trim() ? (
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/products/royal-choker.jpg';
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-champagne-muted)' }}>None</span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      className="form-input"
                      value={url}
                      onChange={(e) => handleImageChange(idx, e.target.value)}
                      placeholder="https://cdn.atelier.gold/products/piece.webp or /images/..."
                      style={{
                        borderColor: !check.isValid ? '#ef4444' : undefined,
                      }}
                    />
                    {!check.isValid && (
                      <span style={{ color: '#f87171', fontSize: '0.7rem' }}>{check.error}</span>
                    )}
                  </div>

                  {idx === 0 && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--color-gold-primary)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--color-gold-glow)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Primary Cover
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    style={{
                      background: 'none',
                      border: '1px solid var(--color-obsidian-border)',
                      borderRadius: '4px',
                      padding: '0.45rem',
                      color: '#ef4444',
                      cursor: 'pointer',
                    }}
                    title="Remove Image"
                  >
                    <TrashIcon width="14" height="14" />
                  </button>
                </div>
              );
            })}
          </div>

          {errors.images && (
            <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.5rem' }}>{errors.images}</p>
          )}
        </div>

        {/* Toggles */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            marginBottom: '2.5rem',
            padding: '1rem',
            backgroundColor: 'var(--color-obsidian-subtle)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.hallmarkCertified}
              onChange={(e) => setFormData({ ...formData, hallmarkCertified: e.target.checked })}
            />
            BIS 916 Hallmark Assay Certified
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
            />
            Showroom Ready In-Stock
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            />
            Spotlight on Homepage Flagship
          </label>
        </div>

        {/* Submission Actions */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? 'Committing to Vault...' : isEdit ? 'Update Piece Record' : 'Enroll Into Catalog'}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate(ROUTES.ADMIN.PRODUCTS)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
