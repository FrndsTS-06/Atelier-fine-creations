import { request } from './apiClient';
import { Product, ProductFilterState } from '../types/product';
import { PaginatedResult } from '../types/api';

export const productService = {
  /**
   * Retrieves paginated products matching search, category, and sorting filters.
   * Directly queries the live backend API. Does NOT silently mask API failures
   * with synthetic demo data.
   */
  async getProducts(
    filters?: Partial<ProductFilterState>,
    signal?: AbortSignal
  ): Promise<PaginatedResult<Product>> {
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
    return request<PaginatedResult<Product>>(`/products${qs}`, { signal });
  },

  /**
   * Retrieves single product by unique ID or slug.
   */
  async getProduct(idOrSlug: string, signal?: AbortSignal): Promise<Product | null> {
    try {
      return await request<Product>(`/products/${idOrSlug}`, { signal });
    } catch (err: any) {
      if (err.status === 404 || err.code === 'PRODUCT_NOT_FOUND') {
        return null;
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
