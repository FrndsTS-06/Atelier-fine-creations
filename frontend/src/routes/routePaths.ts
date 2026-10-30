export const ROUTES = {
  HOME: '/',
  GALLERY: '/gallery',
  ABOUT: '/about',
  CONTACT: '/contact',
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
    PRODUCT_NEW: '/admin/products/new',
    PRODUCT_EDIT: (id: string = ':id') => `/admin/products/${id}/edit`,
    CATEGORIES: '/admin/categories',
    INQUIRIES: '/admin/inquiries',
  },
};
