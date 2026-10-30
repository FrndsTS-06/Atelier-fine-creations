import { request } from './apiClient';
import { Product, ProductFilterState } from '../types/product';
import { PaginatedResult } from '../types/api';
import { DEMO_PRODUCTS } from '../data/demoProducts';
import { CLIENT_ENV } from '../config/env';

function getFilteredDemoProducts(filters?: Partial<ProductFilterState>): PaginatedResult<Product> {
  let items = [...DEMO_PRODUCTS];

  if (filters?.category && filters.category !== 'all') {
    items = items.filter(
      (p) =>
        p.category?.slug === filters.category ||
        p.categoryId === filters.category ||
        (p.category?.name && p.category.name.toLowerCase() === filters.category?.toLowerCase())
    );
  }

  if (filters?.purity && filters.purity !== 'all') {
    items = items.filter((p) => p.purity === filters.purity);
  }

  if (filters?.minPrice) {
    items = items.filter((p) => (p.price || 0) >= (filters.minPrice || 0));
  }

  if (filters?.maxPrice) {
    items = items.filter((p) => (p.price || 0) <= (filters.maxPrice || Infinity));
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    items = items.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  if (filters?.status && filters.status !== 'all') {
    items = items.filter((p) => p.status === filters.status);
  }

  if (filters?.sortBy) {
    if (filters.sortBy === 'price_asc') {
      items.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (filters.sortBy === 'price_desc') {
      items.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (filters.sortBy === 'name_asc') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'name_desc') {
      items.sort((a, b) => b.name.localeCompare(a.name));
    }
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 12;
  const total = items.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedItems = items.slice(startIndex, startIndex + limit);

  return {
    items: paginatedItems,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export const productService = {
  /**
   * Retrieves paginated products matching search, category, and sorting filters.
   * Directly queries the live backend API, with fallback to curated demo catalog
   * when offline or when backend connection is unavailable.
   */
  async getProducts(
    filters?: Partial<ProductFilterState>,
    signal?: AbortSignal
  ): Promise<PaginatedResult<Product>> {
    try {
      const params = new URLSearchParams();
      if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters?.purity && filters.purity !== 'all') params.append('purity', filters.purity);
      if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters?.search && filters.search.trim()) params.append('search', filters.search.trim());
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);

      const qs = params.toString() ? `?${params.toString()}` : '';
      return await request<PaginatedResult<Product>>(`/products${qs}`, { signal });
    } catch (err: any) {
      if (err.name === 'AbortError') throw err;
      if (CLIENT_ENV.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        return getFilteredDemoProducts(filters);
      }
      throw err;
    }
  },

  /**
   * Retrieves single product by unique ID or slug.
   */
  async getProduct(idOrSlug: string, signal?: AbortSignal): Promise<Product | null> {
    try {
      return await request<Product>(`/products/${idOrSlug}`, { signal });
    } catch (err: any) {
      if (err.name === 'AbortError') throw err;
      if (err.status === 404 || err.code === 'PRODUCT_NOT_FOUND') {
        return null;
      }
      if (CLIENT_ENV.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        const found = DEMO_PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
        return found || null;
      }
      throw err;
    }
  },

  async createProduct(data: any): Promise<Product> {
    return request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: string, data: any): Promise<Product> {
    return request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: string): Promise<void> {
    return request<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};
