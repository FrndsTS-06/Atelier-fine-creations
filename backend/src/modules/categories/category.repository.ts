import { prisma } from '../../config/database.js';

export class CategoryRepository {
  async findAll() {
    return prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          take: 12,
          include: {
            images: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    bannerUrl?: string;
    displayOrder?: number;
  }) {
    return prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        bannerUrl: data.bannerUrl,
        displayOrder: data.displayOrder ?? 0,
      },
    });
  }

  async update(id: string, data: any) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }
}

export const categoryRepository = new CategoryRepository();
