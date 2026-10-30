import { request } from './apiClient';
import { Category } from '../types/category';
import { DEMO_CATEGORIES } from '../data/demoProducts';
import { CLIENT_ENV } from '../config/env';

export const categoryService = {
  /**
   * Retrieves all boutique categories directly from the backend API,
   * falling back to curated categories if offline/unreachable.
   */
  async getCategories(signal?: AbortSignal): Promise<Category[]> {
    try {
      return await request<Category[]>('/categories', { signal });
    } catch (err: any) {
      if (err.name === 'AbortError') throw err;
      if (CLIENT_ENV.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        return DEMO_CATEGORIES;
      }
      throw err;
    }
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    return request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    return request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(id: string): Promise<void> {
    return request<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};
