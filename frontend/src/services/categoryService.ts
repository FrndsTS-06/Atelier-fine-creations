import { request } from './apiClient';
import { Category } from '../types/category';

export const categoryService = {
  /**
   * Retrieves all boutique categories directly from the backend API.
   */
  async getCategories(signal?: AbortSignal): Promise<Category[]> {
    return request<Category[]>('/categories', { signal });
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
