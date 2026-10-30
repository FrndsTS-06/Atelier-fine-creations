import { categoryRepository } from './category.repository.js';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export class CategoryService {
  async getAllCategories() {
    return categoryRepository.findAll();
  }

  async getCategoryBySlug(slug: string) {
    return categoryRepository.findBySlug(slug);
  }

  async createCategory(data: { name: string; description?: string; bannerUrl?: string; displayOrder?: number }) {
    const slug = slugify(data.name);
    return categoryRepository.create({
      name: data.name,
      slug,
      description: data.description,
      bannerUrl: data.bannerUrl,
      displayOrder: data.displayOrder ?? 0,
    });
  }

  async updateCategory(id: string, data: Partial<{ name: string; description?: string; bannerUrl?: string; displayOrder?: number }>) {
    const updateData: any = { ...data };
    if (data.name) {
      updateData.slug = slugify(data.name);
    }
    return categoryRepository.update(id, updateData);
  }

  async deleteCategory(id: string) {
    return categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
