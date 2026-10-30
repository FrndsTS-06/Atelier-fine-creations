import { prisma } from '../../config/database.js';

export class ProductRepository {
  async findMany(filters: {
    categorySlug?: string;
    categoryId?: string;
    purity?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    status?: string;
    isFeatured?: boolean;
    sortBy?: string;
    skip?: number;
    take?: number;
  }) {
    const where: any = {};

    if (filters.categorySlug) {
      where.category = { slug: filters.categorySlug };
    } else if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.status && filters.status !== 'all') {
      where.status = filters.status;
    }

    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    if (filters.purity) {
      where.purity = filters.purity;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.OR = [
        {
          price: {
            ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
          },
        },
        {
          estimatedPrice: {
            ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
          },
        },
      ];
    }

    if (filters.search) {
      const term = filters.search.trim();
      where.OR = [
        { name: { contains: term } },
        { description: { contains: term } },
        { sku: { contains: term } },
      ];
    }

    let orderBy: any = [{ createdAt: 'desc' }];
    if (filters.sortBy === 'featured') {
      orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
    } else if (filters.sortBy === 'price_asc') {
      orderBy = [{ price: 'asc' }];
    } else if (filters.sortBy === 'price_desc') {
      orderBy = [{ price: 'desc' }];
    } else if (filters.sortBy === 'name_asc') {
      orderBy = [{ name: 'asc' }];
    } else if (filters.sortBy === 'name_desc') {
      orderBy = [{ name: 'desc' }];
    } else if (filters.sortBy === 'weight_desc') {
      orderBy = [{ grossWeight: 'desc' }];
    } else if (filters.sortBy === 'newest') {
      orderBy = [{ createdAt: 'desc' }];
    }

    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy,
        skip: filters.skip,
        take: filters.take,
      }),
    ]);

    return { total, items };
  }

  async findByIdOrSlug(identifier: string) {
    return prisma.product.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async create(data: any, images?: Array<{ imageUrl: string; altText?: string; sortOrder?: number }>) {
    return prisma.product.create({
      data: {
        ...data,
        images: images && images.length > 0 ? {
          create: images.map((img, idx) => ({
            imageUrl: img.imageUrl,
            altText: img.altText || data.name,
            sortOrder: img.sortOrder ?? idx,
          })),
        } : undefined,
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async update(id: string, data: any, images?: Array<{ imageUrl: string; altText?: string; sortOrder?: number }>) {
    if (images) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
    }

    return prisma.product.update({
      where: { id },
      data: {
        ...data,
        images: images ? {
          create: images.map((img, idx) => ({
            imageUrl: img.imageUrl,
            altText: img.altText || data.name,
            sortOrder: img.sortOrder ?? idx,
          })),
        } : undefined,
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}

export const productRepository = new ProductRepository();
