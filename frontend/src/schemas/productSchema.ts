export interface ProductFormErrors {
  name?: string;
  description?: string;
  grossWeight?: string;
  netWeight?: string;
  estimatedPrice?: string;
  categoryId?: string;
  images?: string;
  purchaseUrl?: string;
  status?: string;
}

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.avif'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateImageUrl(url: string): { isValid: boolean; error?: string } {
  if (!url || !url.trim()) {
    return { isValid: false, error: 'Image URL is required.' };
  }

  const trimmed = url.trim();

  // Allow internal curated boutique paths e.g. /images/...
  if (trimmed.startsWith('/images/')) {
    return { isValid: true };
  }

  // Allow data URIs for client uploaded previews
  if (trimmed.startsWith('data:image/')) {
    const isAllowedType = ALLOWED_MIME_TYPES.some((type) => trimmed.startsWith(`data:${type}`));
    if (!isAllowedType) {
      return { isValid: false, error: 'Image format must be JPEG, PNG, WebP, SVG, or AVIF.' };
    }
    return { isValid: true };
  }

  // Allow valid HTTP/HTTPS URLs
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return { isValid: false, error: 'Image URL must use secure HTTP or HTTPS protocol.' };
    }

    const pathname = parsed.pathname.toLowerCase();
    const hasValidExt = ALLOWED_IMAGE_EXTENSIONS.some((ext) => pathname.endsWith(ext));
    // Also allow cloud image delivery CDNs that use query parameters or pathless transforms
    if (!hasValidExt && !pathname.includes('/image') && !pathname.includes('/photo') && !parsed.search.includes('image')) {
      return { isValid: false, error: 'Image URL must point to a supported format (.jpg, .jpeg, .png, .webp, .svg, .avif).' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format.' };
  }
}

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, WebP, SVG, and AVIF image formats are permitted.' };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { isValid: false, error: 'Image size exceeds maximum permissible limit (5 MB).' };
  }

  return { isValid: true };
}

export function validateProductForm(values: {
  name: string;
  description: string;
  grossWeight: number;
  netWeight: number;
  estimatedPrice: number;
  categoryId: string;
  images: string[];
  purchaseUrl?: string;
  status?: string;
}): ProductFormErrors {
  const errors: ProductFormErrors = {};

  if (!values.name || values.name.trim().length < 3) {
    errors.name = 'Masterpiece title must be at least 3 characters.';
  }

  if (!values.description || values.description.trim().length < 10) {
    errors.description = 'Description narrative must be at least 10 characters.';
  }

  if (values.grossWeight <= 0) {
    errors.grossWeight = 'Gross weight must be greater than 0g.';
  }

  if (values.netWeight <= 0 || values.netWeight > values.grossWeight) {
    errors.netWeight = 'Net gold weight must be positive and cannot exceed gross weight.';
  }

  if (values.estimatedPrice <= 0) {
    errors.estimatedPrice = 'Price must be greater than 0.';
  }

  if (!values.categoryId) {
    errors.categoryId = 'Please select a collection category.';
  }

  if (!values.images || values.images.length === 0 || values.images.every((img) => !img.trim())) {
    errors.images = 'At least one showcase image URL is required.';
  } else {
    for (const img of values.images) {
      if (img.trim()) {
        const check = validateImageUrl(img);
        if (!check.isValid) {
          errors.images = check.error;
          break;
        }
      }
    }
  }

  if (values.purchaseUrl && values.purchaseUrl.trim()) {
    try {
      const url = new URL(values.purchaseUrl.trim());
      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        errors.purchaseUrl = 'External purchase URL must use HTTPS or HTTP protocol.';
      }
    } catch {
      errors.purchaseUrl = 'Please enter a valid external purchase URL (e.g. https://store.atelier.gold/piece).';
    }
  }

  if (values.status && !['published', 'draft', 'archived'].includes(values.status)) {
    errors.status = 'Status must be published, draft, or archived.';
  }

  return errors;
}
