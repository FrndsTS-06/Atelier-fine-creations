export type KaratPurity = '24K' | '22K' | '18K' | '14K';

export type ProductStatus = 'published' | 'draft' | 'archived';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  description: string;
  purity: KaratPurity;
  grossWeight: number; // in grams
  netWeight: number; // pure gold weight in grams
  stoneWeight?: number; // gemstones/diamonds in carats or grams
  makingCharges: number;
  estimatedPrice: number;
  price?: number; // optional price alias
  currency?: string; // e.g. 'USD'
  hallmarkCertified: boolean;
  inStock: boolean;
  isFeatured: boolean;
  images: string[];
  imageAlts?: string[];
  attributes?: Record<string, string | number>;
  purchaseUrl?: string; // external purchase URL
  status?: ProductStatus; // publication status
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt?: string;
}

export interface ProductFilterState {
  category: string;
  purity: string;
  minPrice?: number;
  maxPrice?: number;
  search: string;
  status?: ProductStatus | 'all';
  page?: number;
  limit?: number;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'weight_desc' | 'newest';
}
