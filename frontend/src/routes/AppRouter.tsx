import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './routePaths';
import { MainLayout } from '../components/layout/MainLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/HomePage';
import { GalleryPage } from '../pages/GalleryPage';
import { AboutPage } from '../pages/AboutPage';
import { ContactPage } from '../pages/ContactPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminProductFormPage } from '../pages/admin/AdminProductFormPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminInquiriesPage } from '../pages/admin/AdminInquiriesPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Boutique Storefront */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.GALLERY} element={<GalleryPage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
      </Route>

      {/* Admin Authentication */}
      <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLoginPage />} />

      {/* Protected Admin Suite */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboardPage />} />
          <Route path={ROUTES.ADMIN.PRODUCTS} element={<AdminProductsPage />} />
          <Route path={ROUTES.ADMIN.PRODUCT_NEW} element={<AdminProductFormPage />} />
          <Route path={ROUTES.ADMIN.PRODUCT_EDIT()} element={<AdminProductFormPage />} />
          <Route path="/admin/products/edit/:id" element={<AdminProductFormPage />} />
          <Route path={ROUTES.ADMIN.CATEGORIES} element={<AdminCategoriesPage />} />
          <Route path={ROUTES.ADMIN.INQUIRIES} element={<AdminInquiriesPage />} />
        </Route>
      </Route>

      {/* 404 Catch-All */}
      <Route element={<MainLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
