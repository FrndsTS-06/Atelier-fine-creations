export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  bannerUrl?: string;
  displayOrder: number;
  _count?: {
    products: number;
  };
  productCount?: number;
}
