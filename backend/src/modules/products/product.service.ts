import { productRepository } from './product.repository.js';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatProductResponse(item: any) {
  if (!item) return null;

  // Extract image URLs from product_images relation or legacyImages fallback
  let imageList: string[] = [];
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    imageList = item.images.map((img: any) => img.imageUrl);
  } else if (item.legacyImages) {
    try {
      imageList = typeof item.legacyImages === 'string' ? JSON.parse(item.legacyImages) : item.legacyImages;
    } catch {
      imageList = [];
    }
  }

  // Ensure numeric price serialization
  const numericPrice = item.price !== null && item.price !== undefined
    ? Number(item.price)
    : item.estimatedPrice || 0;

  return {
    ...item,
    price: numericPrice,
    images: imageList,
    productImages: item.images || [],
  };
}

export class ProductService {
  async getProducts(queryParams: any) {
    const page = Math.max(1, parseInt(queryParams.page || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit || '12', 10) || 12));
    const skip = (page - 1) * limit;

    const { total, items } = await productRepository.findMany({
      categorySlug: queryParams.category,
      purity: queryParams.purity,
      minPrice: queryParams.minPrice ? parseFloat(queryParams.minPrice) : undefined,
      maxPrice: queryParams.maxPrice ? parseFloat(queryParams.maxPrice) : undefined,
      search: queryParams.search,
      status: queryParams.status,
      isFeatured: queryParams.isFeatured !== undefined
        ? queryParams.isFeatured === 'true' || queryParams.isFeatured === true
        : undefined,
      sortBy: queryParams.sortBy,
      skip,
      take: limit,
    });

    const parsedItems = items.map(formatProductResponse);

    return {
      items: parsedItems,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getProductById(idOrSlug: string) {
    const product = await productRepository.findByIdOrSlug(idOrSlug);
    if (!product) return null;
    return formatProductResponse(product);
  }

  async createProduct(payload: any, userId?: string) {
    const baseSlug = slugify(payload.name);
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // Normalize image list
    const normalizedImages: Array<{ imageUrl: string; altText?: string; sortOrder?: number }> = [];
    if (Array.isArray(payload.images)) {
      payload.images.forEach((img: any, idx: number) => {
        if (typeof img === 'string') {
          normalizedImages.push({ imageUrl: img, altText: payload.name, sortOrder: idx });
        } else if (img && img.imageUrl) {
          normalizedImages.push({
            imageUrl: img.imageUrl,
            altText: img.altText || payload.name,
            sortOrder: img.sortOrder ?? idx,
          });
        }
      });
    }

    const price = payload.price !== undefined ? payload.price : payload.estimatedPrice;

    const productData: any = {
      name: payload.name,
      slug,
      description: payload.description,
      categoryId: payload.categoryId,
      price: price !== undefined ? price : null,
      currency: payload.currency || 'USD',
      purchaseUrl: payload.purchaseUrl || null,
      status: payload.status || 'published',
      isFeatured: payload.isFeatured ?? false,
      purity: payload.purity || '22K',
      grossWeight: payload.grossWeight || null,
      netWeight: payload.netWeight || null,
      stoneWeight: payload.stoneWeight ?? 0,
      makingCharges: payload.makingCharges ?? 0,
      estimatedPrice: payload.estimatedPrice || (price ? Number(price) : null),
      hallmarkCertified: payload.hallmarkCertified ?? true,
      inStock: payload.inStock ?? true,
      createdById: userId || null,
    };

    const product = await productRepository.create(productData, normalizedImages);
    return formatProductResponse(product);
  }

  async updateProduct(id: string, payload: any) {
    let normalizedImages: Array<{ imageUrl: string; altText?: string; sortOrder?: number }> | undefined = undefined;
    if (payload.images && Array.isArray(payload.images)) {
      normalizedImages = payload.images.map((img: any, idx: number) => {
        if (typeof img === 'string') {
          return { imageUrl: img, altText: payload.name, sortOrder: idx };
        }
        return {
          imageUrl: img.imageUrl,
          altText: img.altText || payload.name,
          sortOrder: img.sortOrder ?? idx,
        };
      });
    }

    const updateData: any = { ...payload };
    delete updateData.images;
    if (payload.price !== undefined) {
      updateData.price = payload.price;
    }

    const product = await productRepository.update(id, updateData, normalizedImages);
    return formatProductResponse(product);
  }

  async deleteProduct(id: string) {
    return productRepository.delete(id);
  }
}

export const productService = new ProductService();
